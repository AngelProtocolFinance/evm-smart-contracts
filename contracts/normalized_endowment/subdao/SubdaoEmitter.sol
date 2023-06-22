// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";

// SHOULD INHERIT 'Initializable'?
// SHOULD INHERIT 'ISubdaoEmitter'
contract SubdaoEmitter {
  bool initialized = false;
  address accountsContract;

  function initEmitter(address accountscontract) public {
    require(accountscontract != address(0), "Invalid accounts contract address");
    require(!initialized, "Already Initialized");
    initialized = true;
    accountsContract = accountscontract;
  }

  mapping(address => bool) isSubdao;
  modifier isOwner() {
    require(msg.sender == accountsContract, "Unauthorized");
    _;
  }
  modifier isEmitter() {
    require(isSubdao[msg.sender], "Unauthorized");
    _;
  }
  event SubdaoInitialized(address subdao, subDaoMessage.InstantiateMsg instantiateMsg);
  event ConfigUpdated(address subdao, subDaoStorage.Config config);
  event Transfer(address subdao, address tokenAddress, address from, address to, uint256 amount);
  event StateUpdated(address subdao, subDaoStorage.State state);
  event PollUpdated(address subdao, uint256 id, subDaoStorage.Poll poll);
  event PollStatusUpdated(address subdao, uint256 id, subDaoStorage.PollStatus pollStatus);
  event VotingStatusUpdated(
    address subdao,
    uint256 pollId,
    address voter,
    subDaoStorage.VoterInfo voterInfo
  );

  function initializeSubdao(
    address subdao,
    subDaoMessage.InstantiateMsg memory instantiateMsg
  ) public isOwner {
    isSubdao[subdao] = true;
    emit SubdaoInitialized(msg.sender, instantiateMsg);
  }

  function updateSubdaoConfig(subDaoStorage.Config memory config) public isEmitter {
    emit ConfigUpdated(msg.sender, config);
  }

  function updateSubdaoState(subDaoStorage.State memory state) public isEmitter {
    emit StateUpdated(msg.sender, state);
  }

  function updateSubdaoPoll(uint256 id, subDaoStorage.Poll memory poll) public isEmitter {
    emit PollUpdated(msg.sender, id, poll);
  }

  function transferSubdao(
    address tokenAddress,
    address from,
    address to,
    uint amount
  ) public isEmitter {
    emit Transfer(msg.sender, tokenAddress, from, to, amount);
  }

  function updateVotingStatus(
    uint256 pollId,
    address voter,
    subDaoStorage.VoterInfo memory voterInfo
  ) public isEmitter {
    emit VotingStatusUpdated(msg.sender, pollId, voter, voterInfo);
  }

  function updateSubdaoPollAndStatus(
    uint256 id,
    subDaoStorage.Poll memory poll,
    subDaoStorage.PollStatus pollStatus
  ) public isEmitter {
    emit PollUpdated(msg.sender, id, poll);
    emit PollStatusUpdated(msg.sender, id, pollStatus);
  }
}
