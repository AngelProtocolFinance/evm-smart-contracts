// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SubDaoMessages} from "./message.sol";
import {SubDaoStorage} from "./storage.sol";
import {Array} from "../../lib/array.sol";

import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";

interface ISubDao {
  function registerContracts(address vetoken, address swapfactory) external;

  function updateConfig(
    address owner,
    uint256 quorum,
    uint256 threshold,
    uint256 votingperiod,
    uint256 timelockperiod,
    uint256 expirationperiod,
    uint256 proposaldeposit,
    uint256 snapshotperiod
  ) external;

  function createPoll(
    uint256 depositamount,
    string memory title,
    string memory description,
    string memory link,
    SubDaoStorage.ExecuteData memory executeMsgs
  ) external returns (uint256);

  function endPoll(uint256 pollid) external;

  function executePoll(uint256 pollid) external;

  function expirePoll(uint256 pollid) external;

  function castVote(uint256 pollid, SubDaoStorage.VoteOption vote) external;

  function queryConfig() external view returns (SubDaoMessages.QueryConfigResponse memory);

  function queryState() external view returns (SubDaoStorage.State memory);

  function buildDaoTokenMesage(SubDaoMessages.InstantiateMsg memory msg) external;
}
