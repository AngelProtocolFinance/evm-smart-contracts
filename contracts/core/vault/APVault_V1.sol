// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {IVault} from "./interfaces/IVault.sol";
import {IVaultEmitter} from "./interfaces/IVaultEmitter.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {ERC4626AP} from "./ERC4626AP.sol";
import {IStrategy} from "../strategy/IStrategy.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {FixedPointMathLib} from "../../lib/FixedPointMathLib.sol";

contract APVault_V1 is IVault, ERC4626AP {
  using FixedPointMathLib for uint256;

  address public immutable EMITTER_ADDRESS;

  VaultConfig public vaultConfig;
  mapping(uint32 => Principle) public principleByAccountId;

  constructor(
    VaultConfig memory _config,
    address _emitter
  ) ERC4626AP(IERC20Metadata(_config.yieldToken), _config.apTokenName, _config.apTokenSymbol) {
    EMITTER_ADDRESS = _emitter;
    vaultConfig = _config;
    IVaultEmitter(EMITTER_ADDRESS).vaultCreated(address(this), _config);
  }

  /*//////////////////////////////////////////////////////////////
                                MODIFIERS
  //////////////////////////////////////////////////////////////*/

  modifier onlyAdmin() {
    if (!(_msgSender() == vaultConfig.admin)) {
      revert OnlyAdmin();
    }
    _;
  }

  modifier onlyApprovedRouter() {
    if (!_isApprovedRouter()) {
      revert OnlyRouter();
    }
    _;
  }

  modifier onlyApproved() {
    if (!_isApprovedRouter() && !_isSiblingVault() && !_isOperator(_msgSender())) {
      revert OnlyApproved();
    }
    _;
  }

  modifier onlybaseToken(address _token) {
    if (!_isBaseToken(_token)) {
      revert OnlyBaseToken();
    }
    _;
  }

  modifier notPaused() {
    if (IStrategy(vaultConfig.strategy).paused()) {
      revert OnlyNotPaused();
    }
    _;
  }

  /*//////////////////////////////////////////////////////////////
                                CONFIG
  //////////////////////////////////////////////////////////////*/

  function setVaultConfig(VaultConfig memory _newConfig) external virtual override onlyAdmin {
    vaultConfig = _newConfig;
    IVaultEmitter(EMITTER_ADDRESS).vaultConfigUpdated(address(this), _newConfig);
  }

  function getVaultConfig() external view virtual override returns (VaultConfig memory) {
    return vaultConfig;
  }

  /*//////////////////////////////////////////////////////////////
                              IMPLEMENTATION
  //////////////////////////////////////////////////////////////*/

  function deposit(
    uint32 accountId,
    address token,
    uint256 amt
  ) public payable virtual override onlyApproved notPaused onlybaseToken(token) {
    if (!IERC20Metadata(token).approve(vaultConfig.strategy, amt)) {
      revert ApproveFailed();
    }
    uint256 yieldAmt = IStrategy(vaultConfig.strategy).deposit(amt);

    _updatePrincipleDeposit(accountId, amt, yieldAmt);

    uint256 shares = super.depositERC4626(vaultConfig.strategy, yieldAmt, accountId);

    IVaultEmitter(EMITTER_ADDRESS).deposit(accountId, address(this), amt, shares);
  }

  function redeem(
    uint32 accountId,
    uint256 shares
  ) public payable virtual override notPaused onlyApproved returns (RedemptionResponse memory) {
    // check against requested shares
    if (balanceOf(accountId) <= shares) {
      // redeemAll if less
      return redeemAll(accountId);
    } else if (shares == 0) {
      return
        RedemptionResponse({
          token: vaultConfig.baseToken,
          amount: 0,
          status: VaultActionStatus.UNPROCESSED
        });
    } else {
      // redeem shares for yieldToken -> approve strategy -> strategy withdraw -> base token
      uint256 yieldTokenAmt = super.redeemERC4626(shares, vaultConfig.strategy, accountId);
      uint256 returnAmt = IStrategy(vaultConfig.strategy).withdraw(yieldTokenAmt);
      IVaultEmitter(EMITTER_ADDRESS).redeem(accountId, address(this), shares, returnAmt);

      if (
        !IERC20Metadata(vaultConfig.baseToken).transferFrom(
          vaultConfig.strategy,
          address(this),
          returnAmt
        )
      ) {
        revert TransferFailed();
      }
      // apply tax and deduct from returned shares
      returnAmt -= _taxIfNecessary(accountId, shares, returnAmt);
      // update principles and approve txfer of redeemed tokens
      _updatePrincipleRedemption(accountId, shares);
      if (!IERC20Metadata(vaultConfig.baseToken).approve(_msgSender(), returnAmt)) {
        revert ApproveFailed();
      }
      // generate and return redemption response
      return
        RedemptionResponse({
          token: vaultConfig.baseToken,
          amount: returnAmt,
          status: VaultActionStatus.SUCCESS
        });
    }
  }

  function redeemAll(
    uint32 accountId
  ) public payable virtual override notPaused onlyApproved returns (RedemptionResponse memory) {
    uint256 balance = balanceOf(accountId);

    if (balance == 0) {
      return
        RedemptionResponse({
          token: vaultConfig.baseToken,
          amount: 0,
          status: VaultActionStatus.POSITION_EXITED
        });
    }
    // redeem shares for yieldToken -> approve strategy
    uint256 yieldTokenAmt = super.redeemERC4626(balance, vaultConfig.strategy, accountId);
    // withdraw all baseToken
    uint256 returnAmt = IStrategy(vaultConfig.strategy).withdraw(yieldTokenAmt);

    IVaultEmitter(EMITTER_ADDRESS).redeem(accountId, address(this), returnAmt, balance);

    if (
      !IERC20Metadata(vaultConfig.baseToken).transferFrom(
        vaultConfig.strategy,
        address(this),
        returnAmt
      )
    ) {
      revert TransferFailed();
    }
    // apply tax
    returnAmt -= _taxIfNecessary(accountId, balance, returnAmt);
    // zero out principles
    principleByAccountId[accountId].baseToken = 0;
    principleByAccountId[accountId].costBasis_withPrecision = 0;
    // approve txfer back to sender
    if (!IERC20Metadata(vaultConfig.baseToken).approve(_msgSender(), returnAmt)) {
      revert ApproveFailed();
    }
    // generate redemption response
    RedemptionResponse memory response = RedemptionResponse({
      token: vaultConfig.baseToken,
      amount: returnAmt,
      status: VaultActionStatus.POSITION_EXITED
    });
    return response;
  }

  function harvest(uint32[] calldata accountIds) public virtual override notPaused onlyApproved {
    for (uint32 i; i < accountIds.length; i++) {
      uint32 accountId = accountIds[i];
      uint256 baseTokenValue = IStrategy(vaultConfig.strategy).previewWithdraw(
        _yieldTokenBalance(accountId)
      );
      // no yield, no harvest
      if (baseTokenValue <= principleByAccountId[accountId].baseToken) {
        return;
      }
      // Determine going exchange rate (shares / baseToken)
      uint256 currentExRate_withPrecision = balanceOf(accountId).mulDivDown(
        PRECISION,
        baseTokenValue
      );

      // tokens of yield denominated in base token
      uint256 yieldBaseTokens = baseTokenValue -
        principleByAccountId[accountId].costBasis_withPrecision.mulDivDown(
          balanceOf(accountId),
          PRECISION
        );

      LibAccounts.FeeSetting memory feeSetting = IRegistrar(vaultConfig.registrar)
        .getFeeSettingsByFeeType(LibAccounts.FeeTypes.Harvest);

      // Call appropriate harvest method
      if (vaultConfig.vaultType == VaultType.LIQUID) {
        _harvestLiquid(accountId, yieldBaseTokens, currentExRate_withPrecision, feeSetting);
      } else {
        _harvestLocked(accountId, yieldBaseTokens, currentExRate_withPrecision, feeSetting);
      }
    }
  }

  function _harvestLiquid(
    uint32 accountId,
    uint256 yield,
    uint256 exchageRate,
    LibAccounts.FeeSetting memory feeSetting
  ) internal {
    // Determine tax denominated in shares
    // tax (shares) = yield * exchangeRate * feeRate
    uint256 taxShares = yield.mulDivDown(exchageRate, PRECISION).mulDivDown(
      feeSetting.bps,
      LibAccounts.FEE_BASIS
    );
    // Redeem shares to cover fee
    uint256 dYieldToken = super.redeemERC4626(taxShares, vaultConfig.strategy, accountId);
    uint256 redemption = IStrategy(vaultConfig.strategy).withdraw(dYieldToken);
    IVaultEmitter(EMITTER_ADDRESS).redeem(accountId, address(this), taxShares, redemption);
    if (
      !IERC20Metadata(vaultConfig.baseToken).transferFrom(
        vaultConfig.strategy,
        address(this),
        redemption
      )
    ) {
      revert TransferFailed();
    }
    // Pay tax to tax collector
    if (!IERC20Metadata(vaultConfig.baseToken).transfer(feeSetting.payoutAddress, redemption)) {
      revert TransferFailed();
    }
  }

  function _harvestLocked(
    uint32 accountId,
    uint256 yield,
    uint256 exchageRate,
    LibAccounts.FeeSetting memory feeSetting
  ) internal {
    // Get rebal params
    LocalRegistrarLib.RebalanceParams memory rbParams = IRegistrar(vaultConfig.registrar)
      .getRebalanceParams();

    // Determine rebal + tax denominated in yield token
    uint256 taxShares = yield.mulDivDown(exchageRate, PRECISION).mulDivDown(
      feeSetting.bps,
      LibAccounts.FEE_BASIS
    );
    uint256 rebalShares = yield.mulDivDown(exchageRate, PRECISION).mulDivDown(
      rbParams.lockedRebalanceToLiquid,
      rbParams.basis
    );

    _sendRebalAndTax(accountId, taxShares, rebalShares, feeSetting.payoutAddress);
  }

  /*//////////////////////////////////////////////////////////////
                        ACCOUNTING
  //////////////////////////////////////////////////////////////*/

  /// @notice Determine if a tax can be applied and send if so
  /// @dev Apply the tax and send it to the payee, return the value of the tax
  /// @param sharesRedeemedAmt number of shares redeemed for redemption value
  /// @param baseTokensReturnedAmt number of tokens returned by redemption
  /// @return tax the fee sent to the payee denominated in base tokens
  function _taxIfNecessary(
    uint32 accountId,
    uint256 sharesRedeemedAmt,
    uint256 baseTokensReturnedAmt
  ) internal returns (uint256) {
    uint256 redemptionCostBasis = baseTokensReturnedAmt.mulDivDown(PRECISION, sharesRedeemedAmt);
    // no yield, no tax
    if (redemptionCostBasis <= principleByAccountId[accountId].costBasis_withPrecision) {
      return 0;
    }
    // tokens of yield denominated in base token
    uint256 yieldBaseTokens = baseTokensReturnedAmt -
      principleByAccountId[accountId].costBasis_withPrecision.mulDivDown(
        sharesRedeemedAmt,
        PRECISION
      );

    LibAccounts.FeeSetting memory feeSetting = IRegistrar(vaultConfig.registrar)
      .getFeeSettingsByFeeType(LibAccounts.FeeTypes.Default);
    // tax = taxableAmt * yieldRate * feeRate
    uint256 tax = yieldBaseTokens.mulDivDown(feeSetting.bps, LibAccounts.FEE_BASIS);

    if (!IERC20Metadata(vaultConfig.baseToken).transfer(feeSetting.payoutAddress, tax)) {
      revert TransferFailed();
    }
    return tax;
  }

  function _updatePrincipleDeposit(uint32 accountId, uint256 amt, uint256 shares) internal {
    // new position
    if (principleByAccountId[accountId].baseToken == 0) {
      principleByAccountId[accountId] = Principle({
        baseToken: amt,
        costBasis_withPrecision: amt.mulDivDown(PRECISION, shares)
      });
    }
    // update existing position
    else {
      uint256 currentCostBasis_withPrecision = principleByAccountId[accountId]
        .costBasis_withPrecision;
      uint256 newCostBasis_withPrecision = amt.mulDivDown(PRECISION, shares);
      // The ratio of the new position to the entire position
      uint256 weight_withPrecision = amt.mulDivDown(
        PRECISION,
        (principleByAccountId[accountId].baseToken + amt)
      );
      // Add base token amt to principle
      principleByAccountId[accountId].baseToken += amt;
      // Weighted average, CB = newCB*weight + oldCB*(1-weight)
      principleByAccountId[accountId].costBasis_withPrecision =
        (newCostBasis_withPrecision.mulDivDown(weight_withPrecision, PRECISION)) +
        (currentCostBasis_withPrecision.mulDivDown((PRECISION - weight_withPrecision), PRECISION));
    }
  }

  function _updatePrincipleRedemption(uint32 accountId, uint256 sharesRedeemed) internal {
    uint256 currentPrinciple = principleByAccountId[accountId].baseToken;
    uint256 portionOfPositionRedeemed_withPrecision = sharesRedeemed.mulDivDown(
      PRECISION,
      (sharesRedeemed + balanceOf(accountId))
    );
    // Update principle of base token, cost basis is unaffected
    principleByAccountId[accountId].baseToken -= currentPrinciple.mulDivDown(
      portionOfPositionRedeemed_withPrecision,
      PRECISION
    );
  }

  function _yieldTokenBalance(uint32 accountId) internal view returns (uint256) {
    return convertToAssets(balanceOf(accountId));
  }

  function _sendRebalAndTax(
    uint32 accountId,
    uint256 taxShares,
    uint256 rebalShares,
    address feeRecipient
  ) internal {
    // Shares -> Yield Asset -> Base Asset
    uint256 dYieldToken = super.redeemERC4626(
      (taxShares + rebalShares),
      vaultConfig.strategy,
      accountId
    );
    uint256 redemption = IStrategy(vaultConfig.strategy).withdraw(dYieldToken);
    IVaultEmitter(EMITTER_ADDRESS).redeem(
      accountId,
      address(this),
      taxShares + rebalShares,
      redemption
    );
    if (
      !IERC20Metadata(vaultConfig.baseToken).transferFrom(
        vaultConfig.strategy,
        address(this),
        redemption
      )
    ) {
      revert TransferFailed();
    }
    // Determine proportion owed in tax and send to payee
    uint256 taxProportion_withPrecision = taxShares.mulDivDown(
      PRECISION,
      (taxShares + rebalShares)
    );
    uint256 tax = redemption.mulDivUp(taxProportion_withPrecision, PRECISION);
    if (!IERC20Metadata(vaultConfig.baseToken).transfer(feeRecipient, tax)) {
      revert TransferFailed();
    }
    // Rebalance remainder to liquid
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(vaultConfig.registrar)
      .getStrategyParamsById(vaultConfig.strategyId);
    if (
      !IERC20Metadata(vaultConfig.baseToken).transfer(
        stratParams.liquidVaultAddr,
        (redemption - tax)
      )
    ) {
      revert TransferFailed();
    }
    IVault(stratParams.liquidVaultAddr).deposit(
      accountId,
      vaultConfig.baseToken,
      (redemption - tax)
    );
  }

  /*//////////////////////////////////////////////////////////////
                        ACCESS CONTROL
  //////////////////////////////////////////////////////////////*/

  function _isOperator(address _operator) internal view override returns (bool) {
    return
      IRegistrar(vaultConfig.registrar).getVaultOperatorApproved(_operator) || _isSiblingVault();
  }

  function _isApprovedRouter() internal view override returns (bool) {
    string memory thisChain = IRegistrar(vaultConfig.registrar).thisChain();
    LocalRegistrarLib.NetworkInfo memory network = IRegistrar(vaultConfig.registrar)
      .queryNetworkConnection(thisChain);
    return (_msgSender() == network.router);
  }

  function _isSiblingVault() internal view override returns (bool) {
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(vaultConfig.registrar)
      .getStrategyParamsById(vaultConfig.strategyId);
    return (
      vaultConfig.vaultType == VaultType.LOCKED
        ? (_msgSender() == stratParams.liquidVaultAddr)
        : (_msgSender() == stratParams.lockedVaultAddr)
    );
  }

  function _isBaseToken(address _token) internal view returns (bool) {
    IStrategy.StrategyConfig memory stratConfig = IStrategy(vaultConfig.strategy)
      .getStrategyConfig();
    return (_token == stratConfig.baseToken);
  }
}
