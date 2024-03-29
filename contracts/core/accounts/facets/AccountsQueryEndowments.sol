// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {IAccountsQueryEndowments} from "../interfaces/IAccountsQueryEndowments.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";

/**
 * @title AccountsQueryEndowments
 * @notice This contract facet queries for endowment and accounts config
 * @dev This contract facet queries for endowment and accounts config
 */
contract AccountsQueryEndowments is IAccountsQueryEndowments, IterableMappingAddr {
  /**
   * @notice This function queries the balance of a token for an endowment
   * @dev This function queries the balance of a token for an endowment based on its type and address
   * @param id The id of the endowment
   * @param accountType The account type
   * @param tokenAddress The address of the token
   * @return tokenAmount balance of token
   */
  function queryTokenAmount(
    uint32 id,
    IVault.VaultType accountType,
    address tokenAddress
  ) public view returns (uint256 tokenAmount) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(address(0) != tokenAddress, "Invalid token address");

    tokenAmount = state.Balances[id][accountType][tokenAddress];
  }

  /**
   * @notice queries the endowment details
   * @dev queries the endowment details
   * @param id The id of the endowment
   * @return endowment The endowment details
   */
  function queryEndowmentDetails(
    uint32 id
  ) public view returns (AccountMessages.EndowmentResponse memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage endowment = state.Endowments[id];
    return
      AccountMessages.EndowmentResponse({
        owner: endowment.owner,
        name: endowment.name,
        sdgs: endowment.sdgs,
        tier: endowment.tier,
        endowType: endowment.endowType,
        logo: endowment.logo,
        image: endowment.image,
        maturityTime: endowment.maturityTime,
        proposalLink: endowment.proposalLink,
        multisig: endowment.multisig,
        dao: endowment.dao,
        donationMatch: endowment.donationMatch,
        donationMatchActive: endowment.donationMatchActive,
        earlyLockedWithdrawFee: endowment.earlyLockedWithdrawFee,
        withdrawFee: endowment.withdrawFee,
        depositFee: endowment.depositFee,
        balanceFee: endowment.balanceFee,
        settingsController: endowment.settingsController,
        parent: endowment.parent,
        ignoreUserSplits: endowment.ignoreUserSplits,
        splitToLiquid: endowment.splitToLiquid,
        referralId: endowment.referralId,
        gasFwd: endowment.gasFwd,
        allowlistedBeneficiaries: state
        .Allowlists[id][LibAccounts.AllowlistType.AllowlistedBeneficiaries].keys,
        allowlistedContributors: state
        .Allowlists[id][LibAccounts.AllowlistType.AllowlistedContributors].keys,
        maturityAllowlist: state.Allowlists[id][LibAccounts.AllowlistType.MaturityAllowlist].keys
      });
  }

  /**
   * @notice queries the accounts contract config
   * @dev queries the accounts contract config
   * @return config The accounts contract config
   */
  function queryConfig() public view returns (AccountMessages.ConfigResponse memory config) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    config = AccountMessages.ConfigResponse({
      owner: state.config.owner,
      version: state.config.version,
      networkName: state.config.networkName,
      registrarContract: state.config.registrarContract,
      nextAccountId: state.config.nextAccountId
    });
  }

  /**
   * @notice queries the endowment donations state
   * @dev queries the endowment state
   * @param id The id of the endowment
   * @return stateResponse The endowment state
   */
  function queryState(
    uint32 id
  ) public view returns (AccountMessages.StateResponse memory stateResponse) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    stateResponse = AccountMessages.StateResponse({
      closingEndowment: state.States[id].closingEndowment,
      closingBeneficiary: state.States[id].closingBeneficiary
    });
  }

  /**
   * @notice queries DAF Approval state of an Endowment ID
   * @param id The id of the endowment
   * @return bool The DAF Approval state
   */
  function isDafApprovedEndowment(uint32 id) public view returns (bool) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.DafApprovedEndowments[id];
  }

  /**
   * @notice queries Endowments for whom a given Endowment ID is a Beneficiary of
   * @param id The id of the endowment
   * @return uint32[] list of Beneficiary endowments
   */
  function getEndowmentBeneficiaries(uint32 id) public view returns (uint32[] memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.BeneficiaryEndowment[id];
  }

  /**
   * @notice queries Endowments for whom a given Wallet Address is a Beneficiary of
   * @param addr The wallet address
   * @return uint32[] list of Beneficiary endowments
   */
  function getWalletBeneficiaries(address addr) public view returns (uint32[] memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.BeneficiaryWallet[addr];
  }
}
