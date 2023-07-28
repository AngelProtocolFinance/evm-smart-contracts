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

/**
 * @title AccountsCreateEndowment
 * @dev This contract facet manages the creation of endowments
 */
contract AccountsCreateEndowment is
  IAccountsCreateEndowment,
  ReentrancyGuardFacet,
  IAccountsEvents
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
    LibAccounts.FeeSetting memory earlyLockedWithdrawFee = IRegistrar(registrarAddress)
      .getFeeSettingsByFeeType(LibAccounts.FeeTypes.EarlyLockedWithdrawCharity);

    if (LibAccounts.EndowmentType.Charity == details.endowType) {
      require(msg.sender == registrar_config.charityApplications, "Unauthorized");
    } else {
      Validator.validateFee(details.earlyLockedWithdrawFee);
      earlyLockedWithdrawFee = details.earlyLockedWithdrawFee;
    }
    // check all of the other fees
    Validator.validateFee(details.withdrawFee);
    Validator.validateFee(details.depositFee);
    Validator.validateFee(details.balanceFee);

    require(details.members.length >= 1, "No members provided for Endowment multisig");
    require(details.threshold > 0, "Threshold must be a positive number");

    if (LibAccounts.EndowmentType.Charity != details.endowType) {
      require(details.threshold <= details.members.length, "Threshold greater than member count");
    }

    LibAccounts.SplitDetails memory splitSettings;
    bool ignoreUserSplit;

    if (LibAccounts.EndowmentType.Charity == details.endowType) {
      ignoreUserSplit = false;
    } else {
      splitSettings = details.splitToLiquid;
      ignoreUserSplit = details.ignoreUserSplits;
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

    state.ENDOWMENTS[newEndowId] = AccountStorage.Endowment({
      owner: owner,
      name: details.name,
      sdgs: details.sdgs,
      endowType: details.endowType,
      maturityTime: details.maturityTime,
      rebalance: IRegistrar(registrarAddress).getRebalanceParams(),
      multisig: owner,
      dao: address(0),
      daoToken: address(0),
      donationMatchActive: false,
      donationMatchContract: address(0),
      allowlistedBeneficiaries: details.allowlistedBeneficiaries,
      allowlistedContributors: details.allowlistedContributors,
      earlyLockedWithdrawFee: earlyLockedWithdrawFee,
      withdrawFee: details.withdrawFee,
      depositFee: details.depositFee,
      balanceFee: details.balanceFee,
      maturityAllowlist: details.maturityAllowlist,
      tier: details.tier,
      logo: details.logo,
      image: details.image,
      proposalLink: details.proposalLink,
      settingsController: details.settingsController,
      parent: details.parent,
      ignoreUserSplits: ignoreUserSplit,
      splitToLiquid: splitSettings,
      referralId: details.referralId,
      gasFwd: gasFwd
    });

    state.STATES[newEndowId].closingEndowment = false;
    state.config.nextAccountId += 1;

    emit EndowmentCreated(newEndowId, details.endowType);
  }
}
