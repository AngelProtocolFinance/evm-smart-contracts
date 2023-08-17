// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../../validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IEndowmentMultiSigFactory} from "../../../normalized_endowment/endowment-multisig/interfaces/IEndowmentMultiSigFactory.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsCreateEndowment} from "../interfaces/IAccountsCreateEndowment.sol";
import {IGasFwdFactory} from "../../gasFwd/IGasFwdFactory.sol";
import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";

/**
 * @title AccountsCreateEndowment
 * @dev This contract facet manages the creation of endowments
 */
contract AccountsCreateEndowment is
  IAccountsCreateEndowment,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMappingAddr
{
  /**
   * @notice This function creates an endowment
   * @dev creates an endowment based on parameters and setups a dao if required
   * @param details The details of the endowment
   */
  function createEndowment(
    AccountMessages.CreateEndowmentRequest memory details
  ) public nonReentrant returns (uint32 newEndowId) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    address registrarAddress = state.config.registrarContract;

    RegistrarStorage.Config memory registrar_config = IRegistrar(registrarAddress).queryConfig();

    if (LibAccounts.EndowmentType.Charity == details.endowType) {
      require(msg.sender == registrar_config.charityApplications, "Unauthorized");
    } else {
      // validate SDG inputs for non-Charity Endowments (if any)
      // @dev Charity Endowments have their SDG Inputs validated when creating
      // an Application for approval in the Charity Applications MultiSig
      for (uint256 i = 0; i < details.sdgs.length; i++) {
        if (
          details.sdgs[i] > LibAccounts.MAX_SDGS_NUM || details.sdgs[i] < LibAccounts.MIN_SDGS_NUM
        ) {
          revert("Invalid UN SDG inputs given");
        }
      }
    }
    // check all fees are valid
    Validator.validateFee(details.earlyLockedWithdrawFee);
    Validator.validateFee(details.withdrawFee);
    Validator.validateFee(details.depositFee);
    Validator.validateFee(details.balanceFee);

    require(details.duration > 0, "Duration must greater than zero");
    require(details.members.length >= 1, "No members provided for Endowment multisig");
    require(details.threshold > 0, "Threshold must be a positive number");

    if (LibAccounts.EndowmentType.Charity != details.endowType) {
      require(details.threshold <= details.members.length, "Threshold greater than member count");
    }

    newEndowId = state.config.nextAccountId;
    address owner = IEndowmentMultiSigFactory(registrar_config.multisigFactory).create(
      newEndowId,
      registrar_config.multisigEmitter,
      details.members,
      details.threshold,
      details.duration
    );

    address gasFwd = IGasFwdFactory(registrar_config.gasFwdFactory).create();

    state.Endowments[newEndowId] = AccountStorage.Endowment({
      owner: owner,
      name: details.name,
      sdgs: details.sdgs,
      tier: details.tier,
      endowType: details.endowType,
      logo: details.logo,
      image: details.image,
      maturityTime: details.maturityTime,
      rebalance: IRegistrar(registrarAddress).getRebalanceParams(),
      proposalLink: details.proposalLink,
      multisig: owner,
      dao: address(0),
      daoToken: address(0),
      donationMatchContract: address(0),
      donationMatchActive: false,
      earlyLockedWithdrawFee: details.earlyLockedWithdrawFee,
      withdrawFee: details.withdrawFee,
      depositFee: details.depositFee,
      balanceFee: details.balanceFee,
      settingsController: details.settingsController,
      parent: details.parent,
      ignoreUserSplits: details.ignoreUserSplits,
      splitToLiquid: details.splitToLiquid,
      referralId: details.referralId,
      gasFwd: gasFwd
    });

    state.States[newEndowId].closingEndowment = false;
    state.config.nextAccountId += 1;

    // process all initial allowlists provided by user into their respective mappings
    for (uint256 i = 0; i < details.allowlistedBeneficiaries.length; i++) {
      IterableMappingAddr.set(
        state.Allowlists[newEndowId][LibAccounts.AllowlistType.AllowlistedBeneficiaries],
        details.allowlistedBeneficiaries[i],
        true
      );
    }
    for (uint256 i = 0; i < details.allowlistedContributors.length; i++) {
      IterableMappingAddr.set(
        state.Allowlists[newEndowId][LibAccounts.AllowlistType.AllowlistedContributors],
        details.allowlistedContributors[i],
        true
      );
    }
    for (uint256 i = 0; i < details.maturityAllowlist.length; i++) {
      IterableMappingAddr.set(
        state.Allowlists[newEndowId][LibAccounts.AllowlistType.MaturityAllowlist],
        details.maturityAllowlist[i],
        true
      );
    }

    emit EndowmentCreated(newEndowId, details.endowType);
  }
}
