// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
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
    address proposer,
    uint256 depositamount,
    string memory title,
    string memory description,
    string memory link,
    subDaoStorage.ExecuteData memory executeMsgs
  ) external;

  function endPoll(uint256 pollid) external;

  function executePoll(uint256 pollid) external;

  function expirePoll(uint256 pollid) external;

  function castVote(uint256 pollid, subDaoStorage.VoteOption vote) external;

  function queryConfig() external view returns (subDaoMessage.QueryConfigResponse memory);

  function queryState() external view returns (subDaoStorage.State memory);

  function buildDaoTokenMesage(subDaoMessage.InstantiateMsg memory msg) external;
}
