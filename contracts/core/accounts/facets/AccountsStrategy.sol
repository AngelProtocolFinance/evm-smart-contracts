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
import {AxelarExecutable} from "../../../axelar/AxelarExecutable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGasFwd} from "../../gasFwd/IGasFwd.sol";
import "hardhat/console.sol";

/**
 * @title AccountsStrategy
 * @dev This contract manages interacting with Angel Protocol strategy integrations
 */
contract AccountsStrategy is
  IAccountsStrategy,
  AxelarExecutable,
  ReentrancyGuardFacet,
  IAccountsEvents
{
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

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

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);

    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(
      investRequest.token
    );

    require(
      state.STATES[id].balances.locked[tokenAddress] >= investRequest.lockAmt,
      "Insufficient Balance"
    );
    require(
      state.STATES[id].balances.liquid[tokenAddress] >= investRequest.liquidAmt,
      "Insufficient Balance"
    );

    require(
      IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddress),
      "Token not approved"
    );

    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

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

      IERC20(tokenAddress).transfer(
        thisNetwork.router,
        (investRequest.lockAmt + investRequest.liquidAmt)
      );
      IVault.VaultActionData memory response = IRouter(thisNetwork.router).executeWithTokenLocal(
        state.config.networkName,
        AddressToString.toString(address(this)),
        packedPayload,
        investRequest.token,
        (investRequest.lockAmt + investRequest.liquidAmt)
      );

      if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.STATES[id].balances.locked[tokenAddress] -= response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] -= response.liqAmt;
        state.STATES[id].activeStrategies[investRequest.strategy] == true;
        emit EndowmentInvested(response.status);
      } else {
        revert InvestFailed(response.status);
      }
    }
    // Strategy lives on another chain
    else {
      NetworkInfo memory network = IRegistrar(state.config.registrarContract)
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
      IGasFwd(state.ENDOWMENTS[id].gasFwd).payForGas(tokenAddress, investRequest.gasFee);
      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, investRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCallWithToken(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        investRequest.token,
        (investRequest.lockAmt + investRequest.liquidAmt),
        tokenAddress,
        investRequest.gasFee,
        state.ENDOWMENTS[id].gasFwd
      );
      IERC20(tokenAddress).approve(
        thisNetwork.axelarGateway,
        (investRequest.lockAmt + investRequest.liquidAmt)
      );
      IAxelarGateway(thisNetwork.axelarGateway).callContractWithToken(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        investRequest.token,
        (investRequest.lockAmt + investRequest.liquidAmt)
      );
      state.STATES[id].balances.locked[tokenAddress] -= investRequest.lockAmt;
      state.STATES[id].balances.liquid[tokenAddress] -= investRequest.liquidAmt;
      state.STATES[id].activeStrategies[investRequest.strategy] = true;
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

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

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
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
        state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
      } else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
        state.STATES[id].activeStrategies[redeemRequest.strategy] == false;
      } else {
        revert RedeemFailed(response.status);
      }
    }
    // Strategy lives on another chain
    else {
      NetworkInfo memory network = IRegistrar(state.config.registrarContract)
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

      IGasFwd(state.ENDOWMENTS[id].gasFwd).payForGas(tokenAddress, redeemRequest.gasFee);
      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, redeemRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        redeemRequest.gasFee,
        state.ENDOWMENTS[id].owner
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    require(
      redeemAllRequest.redeemLiquid || redeemAllRequest.redeemLocked,
      "Must redeem at least one of Locked/Liquid"
    );
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

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
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
        state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
        state.STATES[id].activeStrategies[redeemAllRequest.strategy] == false;
        emit EndowmentRedeemed(response.status);
      } else {
        revert RedeemAllFailed(response.status);
      }

      // Strategy lives on another chain
    } else {
      NetworkInfo memory network = IRegistrar(state.config.registrarContract)
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

      IGasFwd(state.ENDOWMENTS[id].gasFwd).payForGas(tokenAddress, redeemAllRequest.gasFee);
      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, redeemAllRequest.gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        redeemAllRequest.gasFee,
        state.ENDOWMENTS[id].owner
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
      state.STATES[id].balances.locked[response.token] += response.lockAmt;
      state.STATES[id].balances.liquid[response.token] += response.liqAmt;
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
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
        return true;
      } else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
        state.STATES[id].activeStrategies[response.strategyId] == false;
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
    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    LocalRegistrarLib.AngelProtocolParams memory apParams = IRegistrar(
      state.config.registrarContract
    ).getAngelProtocolParams();
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(tokenSymbol);
    IERC20(tokenAddress).transfer(apParams.refundAddr, amount);
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
    NetworkInfo memory stratNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(stratParams.network);
    if (stratNetwork.router != StringToAddress.toAddress(sourceAddress)) {
      revert UnexpectedCaller(response, sourceChain, sourceAddress);
    }
  }
}
