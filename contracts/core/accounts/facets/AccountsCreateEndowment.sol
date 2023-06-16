// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";
import {ISubDao} from "./../../../normalized_endowment/subdao/Isubdao.sol";
import {IAccountsDeployContract} from "./../interfaces/IAccountsDeployContract.sol";
import {IEndowmentMultiSigFactory} from "./../../../normalized_endowment/endowment-multisig/interfaces/IEndowmentMultiSigFactory.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IAccountsCreateEndowment} from "../interfaces/IAccountsCreateEndowment.sol";

/**
 * @title AccountsCreateEndowment
 * @dev This contract facet manages the creation of endowments
 */
contract AccountsCreateEndowment is IAccountsCreateEndowment, ReentrancyGuardFacet, AccountsEvents {
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

    AngelCoreStruct.FeeSetting memory earlyLockedWithdrawFee = state.config.earlyLockedWithdrawFee;
    if (AngelCoreStruct.EndowmentType.Charity == details.endowType) {
      require(msg.sender == registrar_config.charityProposal, "Unauthorized");
    } else {
      AngelCoreStruct.validateFee(details.earlyLockedWithdrawFee);
      earlyLockedWithdrawFee = details.earlyLockedWithdrawFee;
    }
    // check all of the other fees
    AngelCoreStruct.validateFee(details.withdrawFee);
    AngelCoreStruct.validateFee(details.depositFee);
    AngelCoreStruct.validateFee(details.balanceFee);

    if (details.members.length == 0) {
      details.members = new address[](1);
      details.members[0] = msg.sender;
    }

    require(details.threshold > 0, "Threshold must be a positive number");

    if (AngelCoreStruct.EndowmentType.Normal == details.endowType) {
      require(details.threshold <= details.members.length, "Threshold greater than member count");
    }

    AngelCoreStruct.SplitDetails memory splitSettings;
    bool ignoreUserSplit;

    if (AngelCoreStruct.EndowmentType.Charity == details.endowType) {
      ignoreUserSplit = false;
    } else {
      splitSettings = details.splitToLiquid;
      ignoreUserSplit = details.ignoreUserSplits;
    }

    address donationMatchContract = address(0);
    if (AngelCoreStruct.EndowmentType.Charity == details.endowType) {
      donationMatchContract = registrar_config.donationMatchCharitesContract;
    }

    uint32 newEndowId = state.config.nextAccountId;
    address owner = IEndowmentMultiSigFactory(registrar_config.multisigFactory).create(
      newEndowId,
      registrar_config.multisigEmitter,
      details.members,
      details.threshold
    );

    state.ENDOWMENTS[newEndowId] = AccountStorage.Endowment({
      owner: owner,
      name: details.name,
      sdgs: details.sdgs,
      endowType: details.endowType,
      maturityTime: details.maturityTime,
      rebalance: IRegistrar(registrarAddress).getRebalanceParams(),
      pendingRedemptions: 0,
      multisig: owner,
      dao: address(0),
      daoToken: address(0),
      donationMatchActive: false,
      donationMatchContract: donationMatchContract,
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
      referralId: details.referralId
    });

    state.STATES[newEndowId].closingEndowment = false;
    state.config.nextAccountId += 1;

    emit EndowmentCreated(
      newEndowId,
      state.ENDOWMENTS[newEndowId]
    );
  }
}
