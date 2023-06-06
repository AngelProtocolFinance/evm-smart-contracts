// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "./interfaces/IVault.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {ERC4626AP} from "./ERC4626AP.sol";
import {IStrategy} from "../strategy/IStrategy.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";
import {AngelCoreStruct} from "../struct.sol";
import {FixedPointMathLib} from "../../lib/FixedPointMathLib.sol";

contract APVault_V1 is IVault, ERC4626AP {
  using FixedPointMathLib for uint256;

  VaultConfig public vaultConfig;
  mapping(uint32 => Principle) principleByAccountId;

  constructor(
    VaultConfig memory _config
  ) ERC4626AP(IERC20Metadata(_config.yieldToken), _config.apTokenName, _config.apTokenSymbol) {
    vaultConfig = _config;
  }

  /*//////////////////////////////////////////////////////////////
                                MODIFIERS
  //////////////////////////////////////////////////////////////*/

  modifier onlyAdmin() {
    require(_msgSender() == vaultConfig.admin);
    _;
  }

  modifier onlyApprovedRouter() {
    require(_isApprovedRouter(), "Only approved Router");
    _;
  }

  modifier onlyApproved() {
    require(_isApprovedRouter() || _isSiblingVault() || _isOperator(_msgSender()), "Only approved contracts");
    _;
  }

  modifier onlybaseToken(address _token) {
    require(_isFromToken(_token), "Wrong token");
    _;
  }

  modifier notPaused() {
    require(!IStrategy(vaultConfig.strategy).paused(), "Strategy Paused");
    _;
  }

  /*//////////////////////////////////////////////////////////////
                                CONFIG
  //////////////////////////////////////////////////////////////*/

  function setVaultConfig(VaultConfig memory _newConfig) external override virtual onlyAdmin {
    vaultConfig = _newConfig;
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
    require(IERC20Metadata(token).approve(vaultConfig.strategy, amt), "Approve failed");
    uint256 yieldAmt = IStrategy(vaultConfig.strategy).deposit(amt);

    principleByAccountId[accountId].baseToken += amt;
    principleByAccountId[accountId].yieldToken += yieldAmt;

    super.deposit(yieldAmt, accountId);
  }

  function redeem(
    uint32 accountId,
    uint256 amt
  ) public payable override virtual notPaused onlyApproved returns (RedemptionResponse memory) {
    // check against requested amt
    if (balanceOf(accountId) < amt) {
       // redeemAll if less
      return redeemAll(accountId);
    } else {
      // redeem shares for yieldToken -> approve strategy -> strategy withdraw -> base token
      uint256 yieldTokenAmt = super.redeem(amt, vaultConfig.strategy, accountId); 
      uint256 redemptionAmt = IStrategy(vaultConfig.strategy).withdraw(yieldTokenAmt);
      // apply tax
      redemptionAmt -= _taxIfNecessary(accountId, redemptionAmt);
      // update principles and approve txfer of redeemed tokens      
      _updatePrinciples(accountId, redemptionAmt); 
      require(
        IERC20Metadata(vaultConfig.baseToken).approve(_msgSender(), redemptionAmt),
        "Approve failed"
      );
      // generate and return redemption response
      return RedemptionResponse({amount: redemptionAmt, status: VaultActionStatus.SUCCESS});
    }
  }

  function redeemAll(
    uint32 accountId
  ) public payable virtual override notPaused onlyApproved returns (RedemptionResponse memory) {
    if (balanceOf(accountId) == 0) {
      return RedemptionResponse({
        amount: 0,
        status: VaultActionStatus.POSITION_EXITED
      });
    }
    // redeem shares for yieldToken -> approve strategy
    uint256 yieldTokenAmt = super.redeem(balanceOf(accountId), vaultConfig.strategy, accountId);
    // withdraw all baseToken
    uint256 redemptionAmt = IStrategy(vaultConfig.strategy).withdraw(yieldTokenAmt);
    // apply tax
    redemptionAmt -= _taxIfNecessary(accountId, redemptionAmt);
    // zero out principles
    principleByAccountId[accountId].yieldToken = 0;
    principleByAccountId[accountId].baseToken = 0;
    // approve txfer back to sender
    require(
      IERC20Metadata(vaultConfig.baseToken).approve(_msgSender(), redemptionAmt),
      "Approve failed"
    );
    // generate redemption response
    RedemptionResponse memory response = RedemptionResponse({
      amount: redemptionAmt,
      status: VaultActionStatus.POSITION_EXITED
    });
    return response;
  }

  function harvest(uint32[] calldata accountIds) public override virtual notPaused onlyApproved {
    for (uint32 acct; acct < accountIds.length; acct++) {
      uint256 baseTokenValue = IStrategy(vaultConfig.strategy).previewWithdraw(
        _yieldTokenBalance(acct)
      );
      // no yield, no harvest
      if (baseTokenValue < principleByAccountId[acct].baseToken) {
        return;
      }
      // Determine aggregate yield
      // @TODO this is the wrong principle and do we even need the yield princ. tracked? 
      uint256 p = principleByAccountId[acct].yieldToken;
      uint256 yield_withPrecision = (baseTokenValue - p).mulDivDown(AngelCoreStruct.FEE_BASIS, p);
      AngelCoreStruct.FeeSetting memory feeSetting = IRegistrar(vaultConfig.registrar)
        .getFeeSettingsByFeeType(AngelCoreStruct.FeeTypes.Harvest);
      // Call appropriate harvest method
      if (vaultConfig.vaultType == VaultType.LIQUID) {
        _harvestLiquid(acct, yield_withPrecision, feeSetting);
      } else {
        _harvestLocked(acct, yield_withPrecision, feeSetting);
      }
    }
  }

  function _harvestLiquid(
    uint32 accountId,
    uint256 yield_withPrecision,
    AngelCoreStruct.FeeSetting memory _feeSetting
  ) internal {
    // Determine tax denominated in yield token
    uint256 taxYieldToken = _yieldTokenBalance(accountId)
      .mulDivDown(yield_withPrecision, AngelCoreStruct.FEE_BASIS)
      .mulDivDown(_feeSetting.bps, AngelCoreStruct.FEE_BASIS);
    // Shares -> Yield Asset -> Base Asset
    uint256 dYieldToken = super.redeem(
      convertToShares(taxYieldToken),
      vaultConfig.strategy,
      accountId
    );
    uint256 redemption = IStrategy(vaultConfig.strategy).withdraw(dYieldToken);
    // Pay tax to tax collector and rebase principle
    require(IERC20Metadata(vaultConfig.baseToken).transfer(_feeSetting.payoutAddress, redemption));
    principleByAccountId[accountId].yieldToken -= dYieldToken;
  }

  function _harvestLocked(
    uint32 accountId,
    uint256 yield_withPrecision,
    AngelCoreStruct.FeeSetting memory _feeSetting
  ) internal {
    // Get rebal params
    LocalRegistrarLib.RebalanceParams memory rbParams = IRegistrar(vaultConfig.registrar)
      .getRebalanceParams();
    // Determine rebal + tax denominated in yield token
    uint256 taxyieldToken = _yieldTokenBalance(accountId)
      .mulDivDown(yield_withPrecision, AngelCoreStruct.FEE_BASIS)
      .mulDivDown(_feeSetting.bps, AngelCoreStruct.FEE_BASIS);

    uint256 rebalyieldToken = _yieldTokenBalance(accountId)
      .mulDivDown(yield_withPrecision, AngelCoreStruct.FEE_BASIS)
      .mulDivDown(rbParams.lockedRebalanceToLiquid, rbParams.basis);

    _sendRebalAndTax(accountId, taxyieldToken, rebalyieldToken, _feeSetting.payoutAddress);
  }

  /*//////////////////////////////////////////////////////////////
                        ACCOUNTING
  //////////////////////////////////////////////////////////////*/

  // Returns an exchange rate with precision that can be multiplied against `from` to get to `to`
  function _getExchangeRate_withPrecision(
    uint256 from,
    uint256 to
  ) internal pure returns (uint256) {
    return to.mulDivDown(AngelCoreStruct.FEE_BASIS, from);
  }

  /// @notice Determine if a tax can be applied (yield > 0)
  /// @dev Apply the tax and send it to the payee, return the value of the tax
  /// @param taxableAmt value in base token that is being taxed
  function _taxIfNecessary(uint32 accountId, uint256 taxableAmt) internal returns (uint256) {
    uint256 p = principleByAccountId[accountId].baseToken;
    uint256 maxRedemptionAmt = IStrategy(vaultConfig.strategy).previewWithdraw(
      _yieldTokenBalance(accountId)
    ); // determine balance of baseToken if exited

    if (maxRedemptionAmt < p) {
      // no yield, no tax
      return 0;
    }
    uint256 yield_withPrecision = (maxRedemptionAmt - p).mulDivDown(AngelCoreStruct.FEE_BASIS, p);

    AngelCoreStruct.FeeSetting memory feeSetting = IRegistrar(vaultConfig.registrar)
      .getFeeSettingsByFeeType(AngelCoreStruct.FeeTypes.Default);
    // tax = taxableAmt * yieldRate * feeRate 
    uint256 tax = (taxableAmt.mulDivDown(yield_withPrecision, AngelCoreStruct.FEE_BASIS)) // Apply yield rate
      .mulDivDown(feeSetting.bps, AngelCoreStruct.FEE_BASIS); // Apply fee to yield

    require(
      IERC20Metadata(vaultConfig.baseToken).transfer(feeSetting.payoutAddress, tax),
      "Transfer failed"
    );
    return tax;
  }

  function _updatePrinciples(uint32 accountId, uint256 redemption) internal {
    uint256 percentOfPRedeemed_withPrecision = redemption.mulDivDown(
      AngelCoreStruct.FEE_BASIS,
      principleByAccountId[accountId].yieldToken
    );

    uint256 redemptionLessYield = percentOfPRedeemed_withPrecision.mulDivDown(
      principleByAccountId[accountId].baseToken,
      AngelCoreStruct.FEE_BASIS
    );
    // update principles
    principleByAccountId[accountId].yieldToken -= redemption;
    principleByAccountId[accountId].baseToken -= redemptionLessYield;
  }

  function _yieldTokenBalance(uint32 accountId) internal view returns (uint256) {
    return convertToAssets(balanceOf(accountId));
  }

  function _sendRebalAndTax(
    uint32 accountId,
    uint256 taxyieldToken,
    uint256 rebalyieldToken,
    address feeRecipient
  ) internal {
    // Shares -> Yield Asset -> Base Asset
    uint256 dyieldToken = super.redeem(
      convertToShares(taxyieldToken + rebalyieldToken),
      vaultConfig.strategy,
      accountId
    );
    uint256 redemption = IStrategy(vaultConfig.strategy).withdraw(dyieldToken);
    // Determine proportion owed in tax
    uint256 tax = redemption.mulDivDown(
      taxyieldToken * AngelCoreStruct.FEE_BASIS,
      (taxyieldToken + rebalyieldToken)
    ) / AngelCoreStruct.FEE_BASIS;
    require(IERC20Metadata(vaultConfig.baseToken).transfer(feeRecipient, tax), "Transfer failed");
    // Rebalance to liquid
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(vaultConfig.registrar)
      .getStrategyParamsById(vaultConfig.strategySelector);
    require(
      IERC20Metadata(vaultConfig.baseToken).transfer(
        stratParams.Liquid.vaultAddr,
        (redemption - tax)
      )
    );
    IVault(stratParams.Liquid.vaultAddr).deposit(accountId, vaultConfig.baseToken, (redemption - tax));
    principleByAccountId[accountId].yieldToken -= dyieldToken;
  }

  /*//////////////////////////////////////////////////////////////
                        ACCESS CONTROL
  //////////////////////////////////////////////////////////////*/

  function _isOperator(address _operator) internal view override returns (bool) {
    return IRegistrar(vaultConfig.registrar).getVaultOperatorApproved(_operator);
  }

  function _isApprovedRouter() internal view override returns (bool) {
    LocalRegistrarLib.AngelProtocolParams memory apParams = IRegistrar(vaultConfig.registrar)
      .getAngelProtocolParams();
    return (_msgSender() == apParams.routerAddr);
  }

  function _isSiblingVault() internal view override returns (bool) {
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(vaultConfig.registrar)
      .getStrategyParamsById(vaultConfig.strategySelector);

    return (
      vaultConfig.vaultType == VaultType.LOCKED
        ? (_msgSender() == stratParams.Liquid.vaultAddr)
        : (_msgSender() == stratParams.Locked.vaultAddr)
    );
  }

  function _isFromToken(address _token) internal view returns (bool) {
    IStrategy.StrategyConfig memory stratConfig = IStrategy(vaultConfig.strategy)
      .getStrategyConfig();
    return (_token == stratConfig.fromToken);
  }
}
