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
import {IAccountDeployContract} from "./../interfaces/IAccountDeployContract.sol";
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
  ) public nonReentrant returns (uint32) {
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
      details.members[0] = details.owner;
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

    if (details.categories.general.length > 0) {
      uint256 max = details.categories.general[0];
      for (uint256 i = 1; i < details.categories.general.length; i++) {
        if (max < details.categories.general[i]) {
          max = details.categories.general[i];
        }
      }

      require(max < state.config.maxGeneralCategoryId, "Invalid inputs");
    }

    require(Validator.addressChecker(details.owner), "Invalid owner address");

    state.ENDOWMENTS[state.config.nextAccountId] = AccountStorage.Endowment({
      owner: details.owner,
      name: details.name,
      categories: details.categories,
      endowType: details.endowType,
      maturityTime: details.maturityTime,
      strategies: AngelCoreStruct.accountStrategiesDefaut(),
      oneoffVaults: AngelCoreStruct.oneOffVaultsDefault(),
      rebalance: IRegistrar(registrarAddress).getRebalanceParams(),
      kycDonorsOnly: details.kycDonorsOnly,
      pendingRedemptions: 0,
      multisig: details.owner,
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

    state.STATES[state.config.nextAccountId].closingEndowment = false;

    state.ENDOWMENTS[state.config.nextAccountId].owner = IEndowmentMultiSigFactory(
      registrar_config.multisigFactory
    ).create(
        state.config.nextAccountId,
        registrar_config.multisigEmitter,
        details.members,
        details.threshold
      );
    state.ENDOWMENTS[state.config.nextAccountId].multisig = state
      .ENDOWMENTS[state.config.nextAccountId]
      .owner;

    if (details.createDao) {
      subDaoMessage.InstantiateMsg memory createDaoMessage = subDaoMessage.InstantiateMsg({
        id: state.config.nextAccountId,
        quorum: details.dao.quorum,
        owner: state.ENDOWMENTS[state.config.nextAccountId].owner,
        threshold: details.dao.threshold,
        votingPeriod: details.dao.votingPeriod,
        timelockPeriod: details.dao.timelockPeriod,
        expirationPeriod: details.dao.expirationPeriod,
        proposalDeposit: details.dao.proposalDeposit,
        snapshotPeriod: details.dao.snapshotPeriod,
        token: details.dao.token,
        endowType: state.ENDOWMENTS[state.config.nextAccountId].endowType,
        endowOwner: state.ENDOWMENTS[state.config.nextAccountId].owner,
        registrarContract: registrarAddress
      });

      address daoAddress = IAccountDeployContract(address(this)).createDaoContract(
        createDaoMessage
      );
      state.ENDOWMENTS[state.config.nextAccountId].dao = daoAddress;

      subDaoMessage.QueryConfigResponse memory subDaoConfid = ISubDao(daoAddress).queryConfig();

      state.ENDOWMENTS[state.config.nextAccountId].daoToken = subDaoConfid.daoToken;
    }

    state.config.nextAccountId += 1;

    emit EndowmentCreated(
      state.config.nextAccountId - 1,
      state.ENDOWMENTS[state.config.nextAccountId - 1]
    );
    return state.config.nextAccountId - 1;
  }
}
