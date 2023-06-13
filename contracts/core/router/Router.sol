// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.8;

import {AngelCoreStruct} from "../struct.sol";
import {IRouter} from "./IRouter.sol";
import {RouterLib} from "./RouterLib.sol";
import {IVault} from "../vault/interfaces/IVault.sol";
import {ILocalRegistrar} from "../registrar/interfaces/ILocalRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";
import {StringToAddress} from "../../lib/StringAddressUtils.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {AxelarExecutable} from "../../axelar/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";

contract Router is IRouter, OwnableUpgradeable, AxelarExecutable {
  string public chain;
  ILocalRegistrar public registrar;
  IAxelarGasService public gasReceiver;

  uint256 constant PRECISION = 10 ** 6;

  /*///////////////////////////////////////////////
                        PROXY INIT
    */ ///////////////////////////////////////////////

  function initialize(
    string calldata _chain,
    address _gateway,
    address _gasReceiver,
    address _registrar
  ) public initializer {
    chain = _chain;
    registrar = ILocalRegistrar(_registrar);
    gasReceiver = IAxelarGasService(_gasReceiver);
    __AxelarExecutable_init_unchained(_gateway);
    __Ownable_init_unchained();
  }

  /*///////////////////////////////////////////////
                    MODIFIERS
    */ ///////////////////////////////////////////////

  modifier onlyOneAccount(IVault.VaultActionData memory _action) {
    require(_action.accountIds.length == 1, "Only one account allowed");
    _;
  }

  modifier onlySelf() {
    require(msg.sender == address(this));
    _;
  }

  modifier validateDeposit(
    IVault.VaultActionData memory action,
    string calldata tokenSymbol,
    uint256 amount
  ) {
    // Only one account accepted for deposit calls
    require(action.accountIds.length == 1, "Only one account allowed");
    // deposit only
    require(action.selector == IVault.deposit.selector, "Only deposit accepts tokens");
    // token fwd is token expected
    address tokenAddress = gateway.tokenAddresses(tokenSymbol);
    require(tokenAddress == action.token, "Token mismatch");
    // amt fwd equal expected amt
    require(amount == (action.liqAmt + action.lockAmt), "Amount mismatch");
    // check that at least one vault is expected to receive a deposit
    require(action.lockAmt > 0 || action.liqAmt > 0, "No vault deposit specified");
    // check that token is accepted by angel protocol
    require(registrar.isTokenAccepted(tokenAddress), "Token not accepted");
    // Get parameters from registrar if approved
    require(
      registrar.getStrategyApprovalState(action.strategyId) ==
        LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Strategy not approved"
    );
    _;
  }

  modifier validateCall(IVault.VaultActionData memory action) {
    require(
      (registrar.getStrategyApprovalState(action.strategyId) ==
        LocalRegistrarLib.StrategyApprovalState.APPROVED) ||
        registrar.getStrategyApprovalState(action.strategyId) ==
        LocalRegistrarLib.StrategyApprovalState.WITHDRAW_ONLY,
      "Strategy not approved"
    );
    _;
  }

  /*///////////////////////////////////////////////
                    ANGEL PROTOCOL ROUTER
    */ ///////////////////////////////////////////////

  function _callSwitch(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal validateCall(_action) returns (IVault.VaultActionData memory) {
    // REDEEM
    if (_action.selector == IVault.redeem.selector) {
      return _redeem(_params, _action);
    }
    // REDEEM ALL
    else if (_action.selector == IVault.redeemAll.selector) {
      return _redeemAll(_params, _action);
    }
    // HARVEST
    else if (_action.selector == IVault.harvest.selector) {
      return _harvest(_params, _action);
    }
    // INVALID SELCTOR
    else {
      revert("Invalid function selector provided");
    }
  }

  // Vault action::Deposit
  /// @notice Deposit into the associated liquid or locked vaults
  /// @dev onlySelf restricted public method to enable try/catch in caller
  function deposit(
    IVault.VaultActionData memory action,
    string calldata tokenSymbol,
    uint256 amount
  ) public onlySelf validateDeposit(action, tokenSymbol, amount) {
    LocalRegistrarLib.StrategyParams memory params = registrar.getStrategyParamsById(
      action.strategyId
    );

    if (action.lockAmt > 0) {
      // Send tokens to locked vault and call deposit
      require(IERC20Metadata(action.token).transfer(params.Locked.vaultAddr, action.lockAmt));
      IVault lockedVault = IVault(params.Locked.vaultAddr);
      lockedVault.deposit(action.accountIds[0], action.token, action.lockAmt);
    }

    if (action.liqAmt > 0) {
      // Send tokens to liquid vault and call deposit
      require(IERC20Metadata(action.token).transfer(params.Liquid.vaultAddr, action.liqAmt));
      IVault liquidVault = IVault(params.Liquid.vaultAddr);
      liquidVault.deposit(action.accountIds[0], action.token, action.liqAmt);
    }
  }

  // Vault action::Redeem
  function _redeem(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal onlyOneAccount(_action) returns (IVault.VaultActionData memory) {
    IVault lockedVault = IVault(_params.Locked.vaultAddr);
    IVault liquidVault = IVault(_params.Liquid.vaultAddr);

    // Redeem tokens from vaults which sends them from the vault to this contract
    IVault.RedemptionResponse memory _redemptionLock = lockedVault.redeem(
      _action.accountIds[0],
      _action.lockAmt
    );
    require(
      IERC20Metadata(_action.token).transferFrom(
        _params.Locked.vaultAddr,
        address(this),
        _redemptionLock.amount
      )
    );

    IVault.RedemptionResponse memory _redemptionLiquid = liquidVault.redeem(
      _action.accountIds[0],
      _action.liqAmt
    );
    require(
      IERC20Metadata(_action.token).transferFrom(
        _params.Liquid.vaultAddr,
        address(this),
        _redemptionLiquid.amount
      )
    );

    // Pack and send the tokens back to Accounts contract
    uint256 _redeemedAmt = _redemptionLock.amount + _redemptionLiquid.amount;
    _action.lockAmt = _redemptionLock.amount;
    _action.liqAmt = _redemptionLiquid.amount;
    _action = _prepareToSendTokens(_action, _redeemedAmt);
    emit Redemption(_action, _redeemedAmt);
    if (
      (_redemptionLock.status == IVault.VaultActionStatus.POSITION_EXITED) &&
      (_redemptionLiquid.status == IVault.VaultActionStatus.POSITION_EXITED)
    ) {
      _action.status = IVault.VaultActionStatus.POSITION_EXITED;
    } else {
      _action.status = IVault.VaultActionStatus.SUCCESS;
    }
    return _action;
  }

  // Vault action::RedeemAll
  function _redeemAll(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal onlyOneAccount(_action) returns (IVault.VaultActionData memory) {
    IVault lockedVault = IVault(_params.Locked.vaultAddr);
    IVault liquidVault = IVault(_params.Liquid.vaultAddr);

    // Redeem tokens from vaults and txfer them to the Router
    IVault.RedemptionResponse memory lockResponse = lockedVault.redeemAll(_action.accountIds[0]);
    if (lockResponse.amount > 0) {
      require(
        IERC20Metadata(_action.token).transferFrom(
          _params.Locked.vaultAddr,
          address(this),
          lockResponse.amount
        )
      );
    }
    _action.lockAmt = lockResponse.amount;

    IVault.RedemptionResponse memory liqResponse = liquidVault.redeemAll(_action.accountIds[0]);
    if (liqResponse.amount > 0) {
      require(
        IERC20Metadata(_action.token).transferFrom(
          _params.Liquid.vaultAddr,
          address(this),
          liqResponse.amount
        )
      );
    }
    _action.liqAmt = liqResponse.amount;

    // Pack and send the tokens back
    uint256 _redeemedAmt = lockResponse.amount + liqResponse.amount;
    _action = _prepareToSendTokens(_action, _redeemedAmt);
    emit Redemption(_action, _redeemedAmt);
    _action.status = IVault.VaultActionStatus.POSITION_EXITED;
    return _action;
  }

  // Vault action::Harvest
  function _harvest(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal returns (IVault.VaultActionData memory) {
    IVault liquidVault = IVault(_params.Liquid.vaultAddr);
    IVault lockedVault = IVault(_params.Locked.vaultAddr);
    liquidVault.harvest(_action.accountIds);
    lockedVault.harvest(_action.accountIds);
    emit Harvest(_action);
    return _action;
  }

  /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */ ////////////////////////////////////////////////

  function executeLocal(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) external override onlyLocalAccountsContract returns (IVault.VaultActionData memory) {
    return _execute(sourceChain, sourceAddress, payload);
  }

  function executeWithTokenLocal(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) external override onlyLocalAccountsContract returns (IVault.VaultActionData memory) {
    return _executeWithToken(sourceChain, sourceAddress, payload, tokenSymbol, amount);
  }

  modifier onlyLocalAccountsContract() {
    string memory accountAddress = registrar.getAccountsContractAddressByChain(chain);
    require(StringToAddress.toAddress(accountAddress) == msg.sender, "Unauthorized local call");
    _;
  }

  modifier onlyAccountsContract(string calldata _sourceChain, string calldata _sourceAddress) {
    string memory accountsContractAddress = registrar.getAccountsContractAddressByChain(
      _sourceChain
    );
    require(
      keccak256(bytes(_sourceAddress)) == keccak256(bytes(accountsContractAddress)),
      "Unauthorized Call"
    );
    _;
  }

  modifier notZeroAddress(string calldata _sourceAddress) {
    require(StringToAddress.toAddress(_sourceAddress) != address(0), "Unauthorized Call");
    _;
  }

  function _prepareToSendTokens(
    IVault.VaultActionData memory _action,
    uint256 _sendAmt
  ) internal returns (IVault.VaultActionData memory) {
    if (keccak256(bytes(_action.destinationChain)) == keccak256(bytes(chain))) {
      return _prepareAndSendTokensLocal(_action, _sendAmt);
    } else {
      return _prepareAndSendTokensGMP(_action, _sendAmt);
    }
  }

  function _prepareAndSendTokensLocal(
    IVault.VaultActionData memory _action,
    uint256 _sendAmt
  ) internal returns (IVault.VaultActionData memory) {
    string memory accountsContractAddress = registrar.getAccountsContractAddressByChain(
      (_action.destinationChain)
    );
    IERC20Metadata(_action.token).transfer(
      StringToAddress.toAddress(accountsContractAddress),
      _sendAmt
    );
    emit TokensSent(_action, _sendAmt);
    return _action;
  }

  function _prepareAndSendTokensGMP(
    IVault.VaultActionData memory _action,
    uint256 _sendAmt
  ) internal returns (IVault.VaultActionData memory) {
    // Pack the tokens and calldata for bridging back out over GMP
    LocalRegistrarLib.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();

    // Prepare gas
    uint256 gasFee = registrar.getGasByToken(_action.token);
    require(_sendAmt > gasFee, "Send amount does not cover gas");
    uint256 amtLessGasFee = _sendAmt - gasFee;

    // Split gas proportionally between liquid and lock amts
    uint256 liqGas = (gasFee * ((_action.liqAmt * PRECISION) / _sendAmt)) / PRECISION;
    uint256 lockGas = gasFee - liqGas;
    _action.liqAmt -= liqGas;
    _action.lockAmt -= lockGas;

    bytes memory payload = RouterLib.packCallData(_action);
    try
      this.sendTokens(
        _action.destinationChain,
        registrar.getAccountsContractAddressByChain(_action.destinationChain),
        payload,
        IERC20Metadata(_action.token).symbol(),
        amtLessGasFee,
        _action.token,
        gasFee
      )
    {
      emit TokensSent(_action, amtLessGasFee);
    } catch Error(string memory reason) {
      emit LogError(_action, reason);
      IERC20Metadata(_action.token).transfer(apParams.refundAddr, _sendAmt);
      emit FallbackRefund(_action, _sendAmt);
      _action.status = IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK;
    } catch (bytes memory data) {
      emit LogErrorBytes(_action, data);
      IERC20Metadata(_action.token).transfer(apParams.refundAddr, _sendAmt);
      emit FallbackRefund(_action, _sendAmt);
      _action.status = IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK;
    }
    return _action;
  }

  function sendTokens(
    string memory destinationChain,
    string memory destinationAddress,
    bytes memory payload,
    string memory symbol,
    uint256 amount,
    address gasToken,
    uint256 gasFeeAmt
  ) public onlySelf {
    address tokenAddress = gateway.tokenAddresses(symbol);
    require(IERC20Metadata(tokenAddress).approve(address(gateway), amount));
    require(IERC20Metadata(gasToken).approve(address(gasReceiver), gasFeeAmt));

    AngelCoreStruct.FeeSetting memory feeSetting = registrar.getFeeSettingsByFeeType(
      AngelCoreStruct.FeeTypes.Default
    );

    gasReceiver.payGasForContractCallWithToken(
      address(this),
      destinationChain,
      destinationAddress,
      payload,
      symbol,
      amount,
      gasToken,
      gasFeeAmt,
      feeSetting.payoutAddress
    );

    gateway.callContractWithToken(destinationChain, destinationAddress, payload, symbol, amount);
  }

  function _executeWithToken(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  )
    internal
    override
    onlyAccountsContract(sourceChain, sourceAddress)
    notZeroAddress(sourceAddress)
    returns (IVault.VaultActionData memory)
  {
    // decode payload
    IVault.VaultActionData memory action = RouterLib.unpackCalldata(payload);

    // Leverage this.call() to enable try/catch logic
    try this.deposit(action, tokenSymbol, amount) {
      emit Deposit(action);
      action.status = IVault.VaultActionStatus.SUCCESS;
      return action;
    } catch Error(string memory reason) {
      emit LogError(action, reason);
      action.status = IVault.VaultActionStatus.FAIL_TOKENS_RETURNED; // Optimistically set to RETURN status, FALLBACK changes if necessary
      return _prepareToSendTokens(action, amount);
    } catch (bytes memory data) {
      emit LogErrorBytes(action, data);
      action.status = IVault.VaultActionStatus.FAIL_TOKENS_RETURNED;
      return _prepareToSendTokens(action, amount);
    }
  }

  function _execute(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  )
    internal
    override
    onlyAccountsContract(sourceChain, sourceAddress)
    notZeroAddress(sourceAddress)
    returns (IVault.VaultActionData memory)
  {
    // decode payload
    IVault.VaultActionData memory action = RouterLib.unpackCalldata(payload);
    LocalRegistrarLib.StrategyParams memory params = registrar.getStrategyParamsById(
      action.strategyId
    );

    // Switch for calling appropriate vault/method
    return _callSwitch(params, action);
  }
}
