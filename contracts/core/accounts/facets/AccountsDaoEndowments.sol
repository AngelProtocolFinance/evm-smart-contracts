// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {SubDaoLib} from "../../../normalized_endowment/subdao/message.sol";
import {IAccountsDeployContract} from "../interfaces/IAccountsDeployContract.sol";
import {IAccountsDaoEndowments} from "../interfaces/IAccountsDaoEndowments.sol";
import {SubDaoMessages} from "../../../normalized_endowment/subdao/message.sol";
import {ISubDao} from "../../../normalized_endowment/subdao/ISubDao.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";

/**
 * @title AccountsDaoEndowments
 * @dev This contract facet manages the creation contracts required for DAO Functioning
 */
contract AccountsDaoEndowments is IAccountsDaoEndowments, ReentrancyGuardFacet, IAccountsEvents {
  /**
   * @notice This function creates a DAO for an endowment
   * @dev creates a DAO for an endowment based on parameters
   * @param id The id of the endowment
   * @param details The details of the DAO
   */
  function setupDao(uint32 id, SubDaoLib.DaoSetup memory details) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[id];
    // AccountStorage.Config memory tempConfig = state.config;

    require(tempEndowment.owner == msg.sender, "Unauthorized");
    require(tempEndowment.dao == address(0), "AD E01"); // A DAO already exists for this Endowment

    SubDaoMessages.InstantiateMsg memory createDaoMessage = SubDaoMessages.InstantiateMsg({
      id: id,
      quorum: details.quorum,
      owner: tempEndowment.owner,
      threshold: details.threshold,
      votingPeriod: details.votingPeriod,
      timelockPeriod: details.timelockPeriod,
      expirationPeriod: details.expirationPeriod,
      proposalDeposit: details.proposalDeposit,
      snapshotPeriod: details.snapshotPeriod,
      token: details.token,
      endowType: tempEndowment.endowType,
      endowOwner: tempEndowment.owner,
      registrarContract: state.config.registrarContract
    });

    address daoAddress = IAccountsDeployContract(address(this)).createDaoContract(createDaoMessage);

    tempEndowment.dao = daoAddress;

    SubDaoMessages.QueryConfigResponse memory subDaoConfid = ISubDao(daoAddress).queryConfig();

    tempEndowment.daoToken = subDaoConfid.daoToken;

    state.ENDOWMENTS[id] = tempEndowment;
    emit EndowmentUpdated(id);
  }
}
