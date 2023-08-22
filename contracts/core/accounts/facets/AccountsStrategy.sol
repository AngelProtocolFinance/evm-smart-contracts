// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {Validator} from "../../validator.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../../registrar/lib/LocalRegistrarLib.sol";
import {IRouter} from "../../router/IRouter.sol";
import {RouterLib} from "../../router/RouterLib.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {AddressToString, StringToAddress} from "../../../lib/StringAddressUtils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IAccountsStrategy} from "../interfaces/IAccountsStrategy.sol";
import {AxelarExecutableAccounts} from "../lib/AxelarExecutableAccounts.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IGasFwd} from "../../gasFwd/IGasFwd.sol";
import {IterableMappingStrategy} from "../../../lib/IterableMappingStrategy.sol";

/**
 * @title AccountsStrategy
 * @dev This contract manages interacting with Angel Protocol strategy integrations
 */
contract AccountsStrategy is
  IAccountsStrategy,
  AxelarExecutableAccounts,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMappingStrategy
{
  using SafeERC20 for IERC20;

  uint256 constant FIFTY_PERCENT_BIG_NUMBA_RATE =
    (50 * LibAccounts.BIG_NUMBA_BASIS) / LibAccounts.PERCENT_BASIS;

  /**
   * @notice This function that allows users to deposit into a yield strategy using tokens from their locked or liquid account in an endowment.
   * @dev Allows the owner of an endowment to invest tokens into specified yield vaults.
   * @param id The endowment id
   */
  function strategyInvest(
    uint32 id,
    AccountMessages.InvestRequest memory investRequest
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];

    if (investRequest.lockAmt == 0 && investRequest.liquidAmt == 0) {
      revert ZeroAmount();
    }

    // check if the msg sender is either the owner or their delegate address and
    // that they have the power to manage the investments for an account balance
    if (investRequest.lockAmt > 0) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.lockedInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }
    if (investRequest.liquidAmt > 0) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.liquidInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }

    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(investRequest.strategy);
    require(
      stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Strategy is not approved"
    );

    LocalRegistrarLib.NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);

    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(
      investRequest.token
    );

    require(
      state.Balances[id][IVault.VaultType.LOCKED][tokenAddress] >= investRequest.lockAmt,
      "Insufficient Balance"
    );
    require(
      state.Balances[id][IVault.VaultType.LIQUID][tokenAddress] >= investRequest.liquidAmt,
      "Insufficient Balance"
    );

    require(
      IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddress),
      "Token not approved"
    );

    uint256 investAmt = investRequest.lockAmt + investRequest.liquidAmt;

    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    state.Balances[id][IVault.VaultType.LOCKED][tokenAddress] -= investRequest.lockAmt;
    state.Balances[id][IVault.VaultType.LIQUID][tokenAddress] -= investRequest.liquidAmt;
    IterableMappingStrategy.set(state.ActiveStrategies[id], investRequest.strategy, true);
    emit EndowmentInvested(id);

    // Strategy exists on the local network
    if (Validator.compareStrings(state.config.networkName, stratParams.network)) {
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: state.config.networkName,
        strategyId: investRequest.strategy,
        selector: IVault.deposit.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: investRequest.lockAmt,
        liqAmt: investRequest.liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IERC20(tokenAddress).safeTransfer(thisNetwork.router, investAmt);
      IVault.VaultActionData memory response = IRouter(thisNetwork.router).executeWithTokenLocal(
        state.config.networkName,
        AddressToString.toString(address(this)),
        packedPayload,
        investRequest.token,
        investAmt
      );

      if (response.status != IVault.VaultActionStatus.SUCCESS) {
        revert InvestFailed(response.status);
      }
    }
    // Strategy lives on another chain
    else {
      LocalRegistrarLib.NetworkInfo memory network = IRegistrar(state.config.registrarContract)
        .queryNetworkConnection(stratParams.network);
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: stratParams.network,
        strategyId: investRequest.strategy,
        selector: IVault.deposit.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: investRequest.lockAmt,
        liqAmt: investRequest.liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);
      uint256 gasFwdGas = IGasFwd(state.Endowments[id].gasFwd).payForGas(
        tokenAddress,
        investRequest.gasFee
      );
      if (gasFwdGas < investRequest.gasFee) {
        _payForGasWithAccountBalance(
          id,
          tokenAddress,
          (investRequest.liquidAmt * LibAccounts.BIG_NUMBA_BASIS) / investAmt,
          (investRequest.gasFee - gasFwdGas)
        );
      }
      IERC20(tokenAddress).safeApprove(thisNetwork.gasReceiver, investRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCallWithToken(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        investRequest.token,
        investAmt,
        tokenAddress,
        investRequest.gasFee,
        state.Endowments[id].gasFwd
      );
      IERC20(tokenAddress).safeApprove(thisNetwork.axelarGateway, investAmt);
      IAxelarGateway(thisNetwork.axelarGateway).callContractWithToken(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        investRequest.token,
        investAmt
      );
    }
  }

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   */
  function strategyRedeem(
    uint32 id,
    AccountMessages.RedeemRequest memory redeemRequest
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];

    if (redeemRequest.lockAmt == 0 && redeemRequest.liquidAmt == 0) {
      revert ZeroAmount();
    }

    // check if the msg sender is either the owner or their delegate address and
    // that they have the power to manage the investments for an account balance
    if (redeemRequest.lockAmt > 0) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.lockedInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }
    if (redeemRequest.liquidAmt > 0) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.liquidInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(redeemRequest.strategy);
    require(
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED) ||
        (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.WITHDRAW_ONLY),
      "Strategy is not approved"
    );
    LocalRegistrarLib.NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(
      redeemRequest.token
    );
    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    // Strategy exists on the local network
    if (Validator.compareStrings(state.config.networkName, stratParams.network)) {
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: state.config.networkName,
        strategyId: redeemRequest.strategy,
        selector: IVault.redeem.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: redeemRequest.lockAmt,
        liqAmt: redeemRequest.liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);
      IVault.VaultActionData memory response = IRouter(thisNetwork.router).executeLocal(
        state.config.networkName,
        AddressToString.toString(address(this)),
        packedPayload
      );
      if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.Balances[id][IVault.VaultType.LOCKED][tokenAddress] += response.lockAmt;
        state.Balances[id][IVault.VaultType.LIQUID][tokenAddress] += response.liqAmt;
        emit EndowmentRedeemed(id, response.status);
      } else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.Balances[id][IVault.VaultType.LOCKED][tokenAddress] += response.lockAmt;
        state.Balances[id][IVault.VaultType.LIQUID][tokenAddress] += response.liqAmt;
        IterableMappingStrategy.remove(state.ActiveStrategies[id], redeemRequest.strategy);
        emit EndowmentRedeemed(id, response.status);
      } else {
        revert RedeemFailed(response.status);
      }
    }
    // Strategy lives on another chain
    else {
      LocalRegistrarLib.NetworkInfo memory network = IRegistrar(state.config.registrarContract)
        .queryNetworkConnection(stratParams.network);
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: stratParams.network,
        strategyId: redeemRequest.strategy,
        selector: IVault.redeem.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: redeemRequest.lockAmt,
        liqAmt: redeemRequest.liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);
      uint256 gasFwdGas = IGasFwd(state.Endowments[id].gasFwd).payForGas(
        tokenAddress,
        redeemRequest.gasFee
      );
      if (gasFwdGas < redeemRequest.gasFee) {
        uint256 gasRateFromLiq_withPrecision = (redeemRequest.liquidAmt *
          LibAccounts.BIG_NUMBA_BASIS) / (redeemRequest.liquidAmt + redeemRequest.lockAmt);
        _payForGasWithAccountBalance(
          id,
          tokenAddress,
          gasRateFromLiq_withPrecision,
          (redeemRequest.gasFee - gasFwdGas)
        );
      }
      IERC20(tokenAddress).safeApprove(thisNetwork.gasReceiver, redeemRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        redeemRequest.gasFee,
        state.Endowments[id].owner
      );
      IAxelarGateway(thisNetwork.axelarGateway).callContract(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload
      );
    }
  }

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   */
  function strategyRedeemAll(
    uint32 id,
    AccountMessages.RedeemAllRequest memory redeemAllRequest
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];

    if (!redeemAllRequest.redeemLiquid && !redeemAllRequest.redeemLocked) {
      revert ZeroAmount();
    }

    if (redeemAllRequest.redeemLocked) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.lockedInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }
    if (redeemAllRequest.redeemLiquid) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.liquidInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    }

    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(redeemAllRequest.strategy);
    require(
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED) ||
        (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.WITHDRAW_ONLY),
      "Strategy is not approved"
    );

    LocalRegistrarLib.NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(
      redeemAllRequest.token
    );
    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    if (Validator.compareStrings(state.config.networkName, stratParams.network)) {
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: state.config.networkName,
        strategyId: redeemAllRequest.strategy,
        selector: IVault.redeemAll.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: redeemAllRequest.redeemLocked ? 1 : 0,
        liqAmt: redeemAllRequest.redeemLiquid ? 1 : 0,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IVault.VaultActionData memory response = IRouter(thisNetwork.router).executeLocal(
        state.config.networkName,
        AddressToString.toString(address(this)),
        packedPayload
      );

      if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.Balances[id][IVault.VaultType.LOCKED][response.token] += response.lockAmt;
        state.Balances[id][IVault.VaultType.LIQUID][response.token] += response.liqAmt;
        IterableMappingStrategy.remove(state.ActiveStrategies[id], redeemAllRequest.strategy);
        emit EndowmentRedeemed(id, response.status);
      } else {
        revert RedeemAllFailed(response.status);
      }

      // Strategy lives on another chain
    } else {
      LocalRegistrarLib.NetworkInfo memory network = IRegistrar(state.config.registrarContract)
        .queryNetworkConnection(stratParams.network);
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: stratParams.network,
        strategyId: redeemAllRequest.strategy,
        selector: IVault.redeemAll.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: redeemAllRequest.redeemLocked ? 1 : 0,
        liqAmt: redeemAllRequest.redeemLiquid ? 1 : 0,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);
      uint256 gasFwdGas = IGasFwd(state.Endowments[id].gasFwd).payForGas(
        tokenAddress,
        redeemAllRequest.gasFee
      );
      if (gasFwdGas < redeemAllRequest.gasFee) {
        _payForGasWithAccountBalance(
          id,
          tokenAddress,
          FIFTY_PERCENT_BIG_NUMBA_RATE,
          (redeemAllRequest.gasFee - gasFwdGas)
        );
      }
      IERC20(tokenAddress).safeApprove(thisNetwork.gasReceiver, redeemAllRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        redeemAllRequest.gasFee,
        state.Endowments[id].owner
      );
      IAxelarGateway(thisNetwork.axelarGateway).callContract(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload
      );
    }
  }

  function _axelarCallbackWithToken(
    IVault.VaultActionData memory response
  ) internal returns (bool success_) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    uint32 id = response.accountIds[0];

    // Invest Cases
    // FAIL_TOKENS_RETURNED => Refund upon failed invest call
    // ALL ELSE => Unexpected cases; all other responses should not have tokens
    if (
      response.selector == IVault.deposit.selector &&
      response.status == IVault.VaultActionStatus.FAIL_TOKENS_RETURNED
    ) {
      state.Balances[id][IVault.VaultType.LOCKED][response.token] += response.lockAmt;
      state.Balances[id][IVault.VaultType.LIQUID][response.token] += response.liqAmt;
      emit EndowmentRedeemed(id, response.status);
      return true;
    }
    // Redeem/RedeemAll Cases
    // SUCCESS => Tokens returning from successful redemption call
    // POSITION_EXITED => Specified amounts led to a full, successful redemption
    // ALL ELSE => Unexpected; all other responses should not have tokens
    else if (
      (response.selector == IVault.redeem.selector) ||
      (response.selector == IVault.redeemAll.selector)
    ) {
      if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.Balances[id][IVault.VaultType.LOCKED][response.token] += response.lockAmt;
        state.Balances[id][IVault.VaultType.LIQUID][response.token] += response.liqAmt;
        emit EndowmentRedeemed(id, response.status);
        return true;
      } else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.Balances[id][IVault.VaultType.LOCKED][response.token] += response.lockAmt;
        state.Balances[id][IVault.VaultType.LIQUID][response.token] += response.liqAmt;
        IterableMappingStrategy.remove(state.ActiveStrategies[id], response.strategyId);
        emit EndowmentRedeemed(id, response.status);
        return true;
      }
    } else {
      return false;
    }
  }

  function _refundFallback(
    string calldata tokenSymbol,
    uint256 amount,
    IVault.VaultActionData memory response
  ) internal {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    LocalRegistrarLib.NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(tokenSymbol);
    IERC20(tokenAddress).safeTransfer(thisNetwork.refundAddr, amount);
    emit RefundNeeded(response);
  }

  // axelar endpoints
  function _executeWithToken(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) internal override returns (IVault.VaultActionData memory) {
    IVault.VaultActionData memory response = RouterLib.unpackCalldata(payload);
    _validateCall(sourceChain, sourceAddress, response);
    if (!_axelarCallbackWithToken(response)) {
      // Fallback -- we don't expect this. If we get here, we have a bug somewhere.
      // But we also don't ever want tokens in the Accounts contract without an owner assigned
      // Emit the refund needed event and transfer the tokens to the refund address for manual processing
      _refundFallback(tokenSymbol, amount, response);
    }
    return response;
  }

  function _execute(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) internal override returns (IVault.VaultActionData memory) {
    IVault.VaultActionData memory response = RouterLib.unpackCalldata(payload);
    _validateCall(sourceChain, sourceAddress, response);

    // FAIL_TOKENS_FALLBACK => Call failed and tokens could not be returned, manual refund needed
    if (response.status == IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK) {
      emit RefundNeeded(response);
      return response;
    }

    // Fallback
    revert UnexpectedResponse(response);
  }

  function _validateCall(
    string calldata sourceChain,
    string calldata sourceAddress,
    IVault.VaultActionData memory response
  ) internal view {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(response.strategyId);
    if (!Validator.compareStrings(sourceChain, stratParams.network)) {
      revert UnexpectedCaller(response, sourceChain, sourceAddress);
    }
    LocalRegistrarLib.NetworkInfo memory stratNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(stratParams.network);
    if (stratNetwork.router != StringToAddress.toAddress(sourceAddress)) {
      revert UnexpectedCaller(response, sourceChain, sourceAddress);
    }
  }

  /**
   * @notice Pay for gas from the account balance
   * @dev This method pays for gas for endowments by directly accessing their balances.
   * We split the gas payment proprotionally between locked and liquid if possible and
   * use liquid funds for locked gas needs, but not the other way around in the case of a shortage.
   * Revert if the combined balances of the account cannot cover both the investment request and the gas payment.
   * @param id Endowment ID
   * @param token Token address
   * @param gasRateFromLiq_withPrecision Percentage of gas to pay from liquid portion
   * @param gasRemaining Amount of gas to be payed from locked & liquid balances
   */
  function _payForGasWithAccountBalance(
    uint32 id,
    address token,
    uint256 gasRateFromLiq_withPrecision,
    uint256 gasRemaining
  ) internal {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    uint256 lockBal = state.Balances[id][IVault.VaultType.LOCKED][token];
    uint256 liqBal = state.Balances[id][IVault.VaultType.LIQUID][token];

    uint256 liqGas = (gasRemaining * gasRateFromLiq_withPrecision) / LibAccounts.BIG_NUMBA_BASIS;
    uint256 lockGas = gasRemaining - liqGas;

    // Cases:
    // 1) lockBal and liqBal each cover the respective needs
    if ((lockGas <= lockBal) && (liqGas <= liqBal)) {
      state.Balances[id][IVault.VaultType.LOCKED][token] -= lockGas;
      state.Balances[id][IVault.VaultType.LIQUID][token] -= liqGas;
    } else if ((lockGas > lockBal) && (liqGas <= liqBal)) {
      // 2) lockBal does not cover lockGas, check if liqBal can cover deficit in addition to liqGas
      uint256 lockNeedDeficit = lockGas - lockBal;
      if (lockNeedDeficit <= (liqBal - liqGas)) {
        state.Balances[id][IVault.VaultType.LOCKED][token] -= (lockGas - lockNeedDeficit);
        state.Balances[id][IVault.VaultType.LIQUID][token] -= (liqGas + lockNeedDeficit);
      } else {
        // 3) lockBal does not cover lockGas and liqBal cannot cover -> revert
        revert InsufficientFundsForGas(id);
      }
    } else {
      // 4) lockBal covers lockGas, liqBal does not cover liqGas -> revert
      revert InsufficientFundsForGas(id);
    }
  }
}
