// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
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
   * @param strategy The strategies to invest into
   * @param token The tokens to withdraw
   * @param lockAmt The amount to deposit lock
   * @param liquidAmt The amount to deposit liquid
   */
  function strategyInvest(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 lockAmt,
    uint256 liquidAmt,
    uint256 gasFee
  ) public payable nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    // check if the msg sender is either the owner or their delegate address and
    // that they have the power to manage the investments for an account balance
    if (lockAmt > 0) {
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
    if (liquidAmt > 0) {
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
      .getStrategyParamsById(strategy);
    require(
      stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Strategy is not approved"
    );

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);

    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(token);

    require(state.STATES[id].balances.locked[tokenAddress] >= lockAmt, "Insufficient Balance");
    require(state.STATES[id].balances.liquid[tokenAddress] >= liquidAmt, "Insufficient Balance");

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
        strategyId: strategy,
        selector: IVault.deposit.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: lockAmt,
        liqAmt: liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IERC20(tokenAddress).transfer(thisNetwork.router, (lockAmt + liquidAmt));
      IVault.VaultActionData memory response = IRouter(thisNetwork.router).executeWithTokenLocal(
        state.config.networkName,
        AddressToString.toString(address(this)),
        packedPayload,
        token,
        (lockAmt + liquidAmt)
      );

      if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.STATES[id].balances.locked[tokenAddress] -= response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] -= response.liqAmt;
        state.STATES[id].activeStrategies[strategy] == true;
        emit EndowmentInvested(response.status);
      } else {
        revert InvestFailed(response.status);
      }
    }
    
    // Strategy lives on another chain
    else {
      NetworkInfo memory network = IRegistrar(state.config.registrarContract)
        .queryNetworkConnection(stratParams.network);
      // @todo get gas from gasFwd
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: stratParams.network,
        strategyId: strategy,
        selector: IVault.deposit.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: lockAmt,
        liqAmt: liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCallWithToken(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        token,
        (lockAmt + liquidAmt),
        StringToAddress.toAddress(token),
        gasFee,
        state.ENDOWMENTS[id].owner
      );

      IERC20(tokenAddress).approve(thisNetwork.axelarGateway, (lockAmt + liquidAmt));
      IAxelarGateway(thisNetwork.axelarGateway).callContractWithToken(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        token,
        (lockAmt + liquidAmt)
      );
      
      state.STATES[id].balances.locked[tokenAddress] -= lockAmt;
      state.STATES[id].balances.liquid[tokenAddress] -= liquidAmt;
    }
  }

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   * @param lockAmt The amt to remdeem from the locked component
   * @param liquidAmt The amt to redeem from the liquid component
   * @param gasFee for cross-chain calls, this should be the expected gas cost to fwd
   */
  function strategyRedeem(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 lockAmt,
    uint256 liquidAmt,
    uint256 gasFee
  ) public payable nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    // check if the msg sender is either the owner or their delegate address and
    // that they have the power to manage the investments for an account balance
    console.log("checking lock");
    console.log(lockAmt);
    if (lockAmt > 0) {
      console.log("inside lockcheck");
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
    console.log("checking liquid");
    console.log(liquidAmt);
    if (liquidAmt > 0) {
      console.log("inside liqcheck");
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
    console.log("checking redemptions");
    require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");

    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(strategy);
    require(
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED) || 
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.WITHDRAW_ONLY),
      "Strategy is not approved"
    );

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(token);
    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    // Strategy exists on the local network
    if (Validator.compareStrings(state.config.networkName, stratParams.network)) {
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: state.config.networkName,
        strategyId: strategy,
        selector: IVault.redeem.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: lockAmt,
        liqAmt: liquidAmt,
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
        // emit EndowmentStateUpdated(id);
      } else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
        state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
        state.STATES[id].activeStrategies[strategy] == false;
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
        strategyId: strategy,
        selector: IVault.redeem.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: lockAmt,
        liqAmt: liquidAmt,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        gasFee,
        state.ENDOWMENTS[id].owner
      );
      IAxelarGateway(thisNetwork.axelarGateway).callContract(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload
      );
    }
  }

  //@todo fix granularity on redeemAll
  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   */
  function strategyRedeemAll(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 gasFee
  ) public payable nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];
    require(
      Validator.canChange(
        tempEndowment.settingsController.lockedInvestmentManagement,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ) || 
      Validator.canChange(
          tempEndowment.settingsController.liquidInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
      ),
      "Unauthorized"
    );

    require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");

    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(state.config.registrarContract)
      .getStrategyParamsById(strategy);
    require(
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.APPROVED) || 
      (stratParams.approvalState == LocalRegistrarLib.StrategyApprovalState.WITHDRAW_ONLY),
      "Strategy is not approved"
    );

    NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    address tokenAddress = IAxelarGateway(thisNetwork.axelarGateway).tokenAddresses(token);
    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    if (Validator.compareStrings(state.config.networkName, stratParams.network)) {
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: state.config.networkName,
        strategyId: strategy,
        selector: IVault.redeemAll.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: 0,
        liqAmt: 0,
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
        state.STATES[id].activeStrategies[strategy] == false;
        emit EndowmentRedeemed(response.status);
      }
      else{
        revert RedeemAllFailed(response.status);
      }

    // Strategy lives on another chain
    } else {
      NetworkInfo memory network = IRegistrar(state.config.registrarContract)
        .queryNetworkConnection(stratParams.network);
      IVault.VaultActionData memory payload = IVault.VaultActionData({
        destinationChain: stratParams.network,
        strategyId: strategy,
        selector: IVault.redeemAll.selector,
        accountIds: accts,
        token: tokenAddress,
        lockAmt: 0,
        liqAmt: 0,
        status: IVault.VaultActionStatus.UNPROCESSED
      });
      bytes memory packedPayload = RouterLib.packCallData(payload);

      IERC20(tokenAddress).approve(thisNetwork.gasReceiver, gasFee);
      IAxelarGasService(thisNetwork.gasReceiver).payGasForContractCall(
        address(this),
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload,
        tokenAddress,
        gasFee,
        state.ENDOWMENTS[id].owner
      );
      IAxelarGateway(thisNetwork.axelarGateway).callContract(
        stratParams.network,
        AddressToString.toString(network.router),
        packedPayload
      );
    }
  }

  // axelar endpoints
  function _executeWithToken(
    string calldata,
    string calldata,
    bytes calldata payload,
    string calldata,
    uint256
  ) internal override returns (IVault.VaultActionData memory) {
    IVault.VaultActionData memory response = RouterLib.unpackCalldata(payload);
    uint32 id = response.accountIds[0];
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    
    // Invest Cases
    // FAIL_TOKENS_RETURNED => Refund upon failed invest call
    // ALL ELSE => Unexpected cases; all other responses should not have tokens
    if (response.selector == IVault.deposit.selector) {
      if (response.status == IVault.VaultActionStatus.FAIL_TOKENS_RETURNED) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
      }
      else {
        revert UnexpectedResponse(response);
      }
    }

    // Redeem Cases
    // SUCCESS => Tokens returning from successful redemption call
    // POSITION_EXITED => Specified amounts led to a full, successful redemption
    // ALL ELSE => Unexpected; all other responses should not have tokens
    else if (response.selector == IVault.redeem.selector) {
      if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
      }
      else if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
        state.STATES[id].activeStrategies[response.strategyId] == false;
      }
      else {
        revert UnexpectedResponse(response);
      }
    }

    // RedeemAll Cases
    // POSITION_EXITED => Successful full redemption
    // SUCCESS => Should not happen, but need to reflect acct balances anyway
    // ALL ELSE => Unexpected; all other responses should not have tokens
    else if (response.selector == IVault.redeemAll.selector) {
      if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
        state.STATES[id].activeStrategies[response.strategyId] == false;
      }
      else if (response.status == IVault.VaultActionStatus.SUCCESS) {
        state.STATES[id].balances.locked[response.token] += response.lockAmt;
        state.STATES[id].balances.liquid[response.token] += response.liqAmt;
      }
      else {
        revert UnexpectedResponse(response);
      }
    }

    // Fallback  
    else {
      revert UnexpectedResponse(response);
    }

    return response;
  }

  function _execute(
    string calldata,
    string calldata,
    bytes calldata payload
  ) internal override returns (IVault.VaultActionData memory) {
    IVault.VaultActionData memory response = RouterLib.unpackCalldata(payload);
    uint32 id = response.accountIds[0];
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    // FAIL_TOKENS_FALLBACK => Call failed and tokens could not be returned, manual refund needed
    if (response.status == IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK) {
      emit RefundNeeded(response);
      return response;
    }

    // Only unique case
    // Invest selector && SUCCESS => Invest call happy path
    if ((response.selector == IVault.deposit.selector) && (response.status == IVault.VaultActionStatus.SUCCESS)) {
      state.STATES[id].activeStrategies[response.strategyId] == true;
      return response;
    }

    // Fallback  
    revert UnexpectedResponse(response);
  }
}
