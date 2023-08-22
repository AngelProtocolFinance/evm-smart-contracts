// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {IRouter} from "./IRouter.sol";
import {RouterLib} from "./RouterLib.sol";
import {IVault} from "../vault/interfaces/IVault.sol";
import {ILocalRegistrar} from "../registrar/interfaces/ILocalRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";
import {StringToAddress} from "../../lib/StringAddressUtils.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AxelarExecutable} from "../../axelar/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Router is IRouter, Initializable, AxelarExecutable {
  using SafeERC20 for IERC20Metadata;
  ILocalRegistrar public registrar;
  uint256 constant PRECISION = 10 ** 6;

  /*///////////////////////////////////////////////
                        PROXY INIT
    */ ///////////////////////////////////////////////

  function initialize(address _registrar) public initializer {
    registrar = ILocalRegistrar(_registrar);
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
    // amt fwd equal expected amt
    require(amount == (action.liqAmt + action.lockAmt), "Amount mismatch");
    // check that at least one vault is expected to receive a deposit
    require(action.lockAmt > 0 || action.liqAmt > 0, "No vault deposit specified");
    // check that token is accepted by angel protocol
    address tokenAddress = _gateway().tokenAddresses(tokenSymbol);
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
      IERC20Metadata(action.token).safeTransfer(params.lockedVaultAddr, action.lockAmt);
      IVault(params.lockedVaultAddr).deposit(action.accountIds[0], action.token, action.lockAmt);
    }

    if (action.liqAmt > 0) {
      // Send tokens to liquid vault and call deposit
      IERC20Metadata(action.token).safeTransfer(params.liquidVaultAddr, action.liqAmt);
      IVault(params.liquidVaultAddr).deposit(action.accountIds[0], action.token, action.liqAmt);
    }
  }

  // Vault action::Redeem
  function _redeem(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal onlyOneAccount(_action) returns (IVault.VaultActionData memory) {
    IVault lockedVault = IVault(_params.lockedVaultAddr);
    IVault liquidVault = IVault(_params.liquidVaultAddr);

    // Redeem tokens from vaults which sends them from the vault to this contract
    IVault.RedemptionResponse memory _redemptionLock = lockedVault.redeem(
      _action.accountIds[0],
      _action.lockAmt
    );
    IERC20Metadata(_redemptionLock.token).safeTransferFrom(
      _params.lockedVaultAddr,
      address(this),
      _redemptionLock.amount
    );

    IVault.RedemptionResponse memory _redemptionLiquid = liquidVault.redeem(
      _action.accountIds[0],
      _action.liqAmt
    );
    IERC20Metadata(_redemptionLiquid.token).safeTransferFrom(
      _params.liquidVaultAddr,
      address(this),
      _redemptionLiquid.amount
    );

    // Update _action with this chain's token address.
    // Liquid token should ALWAYS == Locked token
    _action.token = _redemptionLiquid.token;

    // Pack and send the tokens back to Accounts contract
    uint256 _redeemedAmt = _redemptionLock.amount + _redemptionLiquid.amount;
    _action.lockAmt = _redemptionLock.amount;
    _action.liqAmt = _redemptionLiquid.amount;
    if (
      (_redemptionLock.status == IVault.VaultActionStatus.POSITION_EXITED) &&
      (_redemptionLiquid.status == IVault.VaultActionStatus.POSITION_EXITED)
    ) {
      _action.status = IVault.VaultActionStatus.POSITION_EXITED;
    } else {
      _action.status = IVault.VaultActionStatus.SUCCESS;
    }
    _action = _prepareToSendTokens(_action, _redeemedAmt);
    emit Redeem(_action, _redeemedAmt);
    return _action;
  }

  // Vault action::RedeemAll
  function _redeemAll(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal onlyOneAccount(_action) returns (IVault.VaultActionData memory) {
    IVault lockedVault = IVault(_params.lockedVaultAddr);
    IVault liquidVault = IVault(_params.liquidVaultAddr);

    // Redeem tokens from vaults and txfer them to the Router
    IVault.RedemptionResponse memory lockResponse = lockedVault.redeemAll(_action.accountIds[0]);
    if (lockResponse.amount > 0) {
      IERC20Metadata(_action.token).safeTransferFrom(
        _params.lockedVaultAddr,
        address(this),
        lockResponse.amount
      );
    }
    _action.lockAmt = lockResponse.amount;

    IVault.RedemptionResponse memory liqResponse = liquidVault.redeemAll(_action.accountIds[0]);
    if (liqResponse.amount > 0) {
      IERC20Metadata(_action.token).safeTransferFrom(
        _params.liquidVaultAddr,
        address(this),
        liqResponse.amount
      );
    }
    _action.liqAmt = liqResponse.amount;

    // Pack and send the tokens back
    uint256 _redeemedAmt = lockResponse.amount + liqResponse.amount;
    _action.status = IVault.VaultActionStatus.POSITION_EXITED;
    _action = _prepareToSendTokens(_action, _redeemedAmt);
    emit Redeem(_action, _redeemedAmt);
    return _action;
  }

  // Vault action::Harvest
  function _harvest(
    LocalRegistrarLib.StrategyParams memory _params,
    IVault.VaultActionData memory _action
  ) internal returns (IVault.VaultActionData memory) {
    IVault liquidVault = IVault(_params.liquidVaultAddr);
    IVault lockedVault = IVault(_params.lockedVaultAddr);
    liquidVault.harvest(_action.accountIds);
    lockedVault.harvest(_action.accountIds);
    emit RewardsHarvested(_action);
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
    string memory accountAddress = registrar.getAccountsContractAddressByChain(
      registrar.thisChain()
    );
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
    if (keccak256(bytes(_action.destinationChain)) == keccak256(bytes(registrar.thisChain()))) {
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
    IERC20Metadata(_action.token).safeTransfer(
      StringToAddress.toAddress(accountsContractAddress),
      _sendAmt
    );
    emit Transfer(_action, _sendAmt);
    return _action;
  }

  function _prepareAndSendTokensGMP(
    IVault.VaultActionData memory _action,
    uint256 _sendAmt
  ) internal returns (IVault.VaultActionData memory) {
    // Pack the tokens and calldata for bridging back out over GMP
    LocalRegistrarLib.NetworkInfo memory network = registrar.queryNetworkConnection(
      registrar.thisChain()
    );

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
      emit Transfer(_action, amtLessGasFee);
    } catch Error(string memory reason) {
      emit ErrorLogged(_action, reason);
      IERC20Metadata(_action.token).safeTransfer(network.refundAddr, _sendAmt);
      emit Refund(_action, _sendAmt);
      _action.status = IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK;
    } catch (bytes memory data) {
      emit ErrorBytesLogged(_action, data);
      IERC20Metadata(_action.token).safeTransfer(network.refundAddr, _sendAmt);
      emit Refund(_action, _sendAmt);
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
    address tokenAddress = _gateway().tokenAddresses(symbol);
    IERC20Metadata(tokenAddress).safeApprove(address(_gateway()), amount);
    IERC20Metadata(gasToken).safeApprove(address(_gasReceiver()), gasFeeAmt);

    LibAccounts.FeeSetting memory feeSetting = registrar.getFeeSettingsByFeeType(
      LibAccounts.FeeTypes.Default
    );

    _gasReceiver().payGasForContractCallWithToken(
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

    _gateway().callContractWithToken(destinationChain, destinationAddress, payload, symbol, amount);
  }

  function _executeWithToken(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    // we could remove this amount as it's only used to check if liq + locked amounts
    // passed in inside payload add up to 'amount'
    // and if we need this for 'catch' statements we can just calculate it from said values
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

    // grab tokens sent cross-chain
    address tokenAddress = _gateway().tokenAddresses(tokenSymbol);
    IERC20Metadata(tokenAddress).safeTransfer(address(this), amount);

    // update action.token address to reflect this chain's token address
    action.token = tokenAddress;

    // update action.destinationChain to source chain in case of failure
    action.destinationChain = sourceChain;

    // Leverage this.call() to enable try/catch logic
    try this.deposit(action, tokenSymbol, amount) {
      emit Deposit(action);
      action.status = IVault.VaultActionStatus.SUCCESS;
      return action;
    } catch Error(string memory reason) {
      emit ErrorLogged(action, reason);
      action.status = IVault.VaultActionStatus.FAIL_TOKENS_RETURNED; // Optimistically set to RETURN status, FALLBACK changes if necessary
      return _prepareToSendTokens(action, amount);
    } catch (bytes memory data) {
      emit ErrorBytesLogged(action, data);
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

    // update action.destinationChain to source chain for token redemptions
    action.destinationChain = sourceChain;

    // Switch for calling appropriate vault/method
    return _callSwitch(params, action);
  }

  function _gateway() internal view override returns (IAxelarGateway) {
    LocalRegistrarLib.NetworkInfo memory network = registrar.queryNetworkConnection(
      registrar.thisChain()
    );
    return IAxelarGateway(network.axelarGateway);
  }

  function _gasReceiver() internal view returns (IAxelarGasService) {
    LocalRegistrarLib.NetworkInfo memory network = registrar.queryNetworkConnection(
      registrar.thisChain()
    );
    return IAxelarGasService(network.gasReceiver);
  }
}
