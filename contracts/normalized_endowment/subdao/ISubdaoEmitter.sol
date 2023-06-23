// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoStorage} from "./storage.sol";

interface ISubdaoEmitter {
  function initializeSubdao(address subdao) external;

  function updateSubdaoConfig() external;

  function transferSubdao(address tokenAddress, address from, address to, uint256 amount) external;

  function updateSubdaoState() external;

  function updateSubdaoPoll(uint256 pollId, address voter) external;

  function updateVotingStatus(uint256 pollId, address voter) external;

  function updateSubdaoPollAndStatus(
    uint256 pollId,
    address voter,
    subDaoStorage.PollStatus prevPollStatus,
    subDaoStorage.PollStatus newPollStatus
  ) external;
}
