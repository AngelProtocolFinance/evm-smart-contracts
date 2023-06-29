// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {SubDaoStorage} from "./storage.sol";

interface ISubDaoEmitter {
  function initializeSubDao(address subdao) external;

  function updateSubDaoConfig() external;

  function transferSubDao(address tokenAddress, address from, address to, uint256 amount) external;

  function updateSubDaoState() external;

  function updateSubDaoPoll(uint256 pollId, address voter) external;

  function updateVotingStatus(uint256 pollId, address voter) external;

  function updateSubDaoPollAndStatus(
    uint256 pollId,
    address voter,
    SubDaoStorage.PollStatus pollStatus
  ) external;
}
