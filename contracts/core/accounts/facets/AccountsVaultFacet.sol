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
import {AddressToString} from "../../../lib/StringAddressUtils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IAccountsVaultFacet} from "../interfaces/IAccountsVaultFacet.sol";

/**
 * @title AccountsVaultFacet
 * @dev This contract manages the vaults for endowments
 */
contract AccountsVaultFacet is IAccountsVaultFacet, ReentrancyGuardFacet, IAccountsEvents {
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
    uint256 liquidAmt
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

    require(
      IRegistrar(state.config.registrarContract).getStrategyApprovalState(strategy) ==
        LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Vault is not approved"
    );

    NetworkInfo memory network = IRegistrar(state.config.registrarContract).queryNetworkConnection(
      block.chainid
    );

    address tokenAddress = IAxelarGateway(network.axelarGateway).tokenAddresses(token);

    require(state.STATES[id].balances.locked[tokenAddress] >= lockAmt, "Insufficient Balance");
    require(state.STATES[id].balances.liquid[tokenAddress] >= liquidAmt, "Insufficient Balance");

    require(
      IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddress),
      "Token not approved"
    );

    uint32[] memory accts = new uint32[](1);
    accts[0] = id;

    IVault.VaultActionData memory payload = IVault.VaultActionData({
      destinationChain: network.name,
      strategyId: strategy,
      selector: IVault.deposit.selector,
      accountIds: accts,
      token: tokenAddress,
      lockAmt: lockAmt,
      liqAmt: liquidAmt,
      status: IVault.VaultActionStatus.UNPROCESSED
    });
    bytes memory packedPayload = RouterLib.packCallData(payload);

    IVault.VaultActionData memory response = IRouter(network.router).executeWithTokenLocal(
      network.name,
      AddressToString.toString(address(this)),
      packedPayload,
      token,
      (lockAmt + liquidAmt)
    );

    if (
      response.status == IVault.VaultActionStatus.SUCCESS ||
      response.status == IVault.VaultActionStatus.FAIL_TOKENS_FALLBACK
    ) {
      state.STATES[id].balances.locked[tokenAddress] -= response.lockAmt;
      state.STATES[id].balances.liquid[tokenAddress] -= response.liqAmt;
      state.STATES[id].activeStrategies[strategy] == true;
      // emit EndowmentStateUpdated(id);
    }
  }

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   * @param lockAmt The amt to remdeem from the locked component
   * @param liquidAmt The amt to redeem from the liquid component
   */
  function strategyRedeem(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 lockAmt,
    uint256 liquidAmt
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

    require(tempEndowment.owner == msg.sender, "Unauthorized");
    require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");
    require(
      IRegistrar(state.config.registrarContract).getStrategyApprovalState(strategy) ==
        LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Vault is not approved"
    );
    NetworkInfo memory network = IRegistrar(state.config.registrarContract).queryNetworkConnection(
      block.chainid
    );

    address tokenAddress = IAxelarGateway(network.axelarGateway).tokenAddresses(token);

    uint32[] memory accts = new uint32[](1);
    accts[0] = id;
    IVault.VaultActionData memory payload = IVault.VaultActionData({
      destinationChain: network.name,
      strategyId: strategy,
      selector: IVault.redeem.selector,
      accountIds: accts,
      token: tokenAddress,
      lockAmt: lockAmt,
      liqAmt: liquidAmt,
      status: IVault.VaultActionStatus.UNPROCESSED
    });

    bytes memory packedPayload = RouterLib.packCallData(payload);

    IVault.VaultActionData memory response = IRouter(network.router).executeLocal(
      network.name,
      AddressToString.toString(address(this)),
      packedPayload
    );
    if (response.status == IVault.VaultActionStatus.SUCCESS) {
      state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
      state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
      // emit EndowmentStateUpdated(id);
    }
    if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
      state.STATES[id].activeStrategies[strategy] == false;
    }
  }

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   */
  function strategyRedeemAll(
    uint32 id,
    bytes4 strategy,
    string memory token
  ) public payable nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];
    require(tempEndowment.owner == msg.sender, "Unauthorized");
    require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");
    require(
      IRegistrar(state.config.registrarContract).getStrategyApprovalState(strategy) ==
        LocalRegistrarLib.StrategyApprovalState.APPROVED,
      "Vault is not approved"
    );
    NetworkInfo memory network = IRegistrar(state.config.registrarContract).queryNetworkConnection(
      block.chainid
    );

    address tokenAddress = IAxelarGateway(network.axelarGateway).tokenAddresses(token);

    uint32[] memory accts = new uint32[](1);
    accts[0] = id;
    IVault.VaultActionData memory payload = IVault.VaultActionData({
      destinationChain: network.name,
      strategyId: strategy,
      selector: IVault.redeemAll.selector,
      accountIds: accts,
      token: tokenAddress,
      lockAmt: 0,
      liqAmt: 0,
      status: IVault.VaultActionStatus.UNPROCESSED
    });
    bytes memory packedPayload = RouterLib.packCallData(payload);

    IVault.VaultActionData memory response = IRouter(network.router).executeLocal(
      network.name,
      AddressToString.toString(address(this)),
      packedPayload
    );

    if (response.status == IVault.VaultActionStatus.SUCCESS) {
      state.STATES[id].balances.locked[tokenAddress] += response.lockAmt;
      state.STATES[id].balances.liquid[tokenAddress] += response.liqAmt;
      // emit EndowmentStateUpdated(id);
    }
    if (response.status == IVault.VaultActionStatus.POSITION_EXITED) {
      state.STATES[id].activeStrategies[strategy] == false;
    }
  }
}
