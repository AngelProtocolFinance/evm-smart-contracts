// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IAccountDeployContract} from "./../interfaces/IAccountDeployContract.sol";
import {SubDao, subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";
import {ISubDao} from "./../../../normalized_endowment/subdao/Isubdao.sol";
import {ProxyContract} from "../../proxy.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IDonationMatchEmitter} from "./../../../normalized_endowment/donation-match/IDonationMatchEmitter.sol";
import {DonationMatchStorage} from "./../../../normalized_endowment/donation-match/storage.sol";
import {DonationMatchMessages} from "./../../../normalized_endowment/donation-match/message.sol";

/**
 * @title AccountsDaoEndowments
 * @dev This contract facet manages the creation contracts required for DAO Functioning
 */
<<<<<<< Updated upstream:contracts/core/accounts/facets/AccountsDaoEndowments.sol
contract AccountsDaoEndowments is ReentrancyGuardFacet, AccountsEvents {
  /**
   * @notice This function creates a DAO for an endowment
   * @dev creates a DAO for an endowment based on parameters
   * @param id The id of the endowment
   * @param details The details of the DAO
   */
  function setupDao(uint32 id, AngelCoreStruct.DaoSetup memory details) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
=======
contract AccountsDaoEndowments is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice This function creates a DAO for an endowment
     * @dev creates a DAO for an endowment based on parameters
     * @param id The id of the endowment
     * @param details The details of the DAO
     */
    function setupDao(
        uint32 id,
        AngelCoreStruct.DaoSetup memory details
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
>>>>>>> Stashed changes:contracts/core/accounts/facets/AccountsDaoEndowments.sol

    AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[id];
    // AccountStorage.Config memory tempConfig = state.config;

    require(tempEndowment.owner == msg.sender, "Unauthorized");
    require(tempEndowment.dao == address(0), "AD E01"); // A DAO already exists for this Endowment

    subDaoMessage.InstantiateMsg memory createDaoMessage = subDaoMessage.InstantiateMsg({
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

    address daoAddress = IAccountDeployContract(address(this)).createDaoContract(createDaoMessage);

    tempEndowment.dao = daoAddress;

    subDaoMessage.QueryConfigResponse memory subDaoConfid = ISubDao(daoAddress).queryConfig();

    tempEndowment.daoToken = subDaoConfid.daoToken;

    state.ENDOWMENTS[id] = tempEndowment;
    emit UpdateEndowment(id, tempEndowment);
  }
}
