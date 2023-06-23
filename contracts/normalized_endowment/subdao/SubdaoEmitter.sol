// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoStorage} from "./storage.sol";

// >> SHOULD INHERIT 'Initializable'?
// >> SHOULD INHERIT 'ISubdaoEmitter'
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
  event SubdaoInitialized(address subdao);
  event ConfigUpdated(address subdao);
  event Transfer(address subdao, address tokenAddress, address from, address to, uint256 amount);
  event StateUpdated(address subdao);
  event PollUpdated(address subdao, uint256 id, address sender);
  event PollStatusUpdated(
    address subdao,
    uint256 id,
    subDaoStorage.PollStatus prevPollStatus,
    subDaoStorage.PollStatus newPollStatus
  );
  event VotingStatusUpdated(address subdao, uint256 pollId, address voter);

  function initializeSubdao(address subdao) public isOwner {
    isSubdao[subdao] = true;
    emit SubdaoInitialized(msg.sender);
  }

  function updateSubdaoConfig() public isEmitter {
    emit ConfigUpdated(msg.sender);
  }

  function updateSubdaoState() public isEmitter {
    emit StateUpdated(msg.sender);
  }

  function updateSubdaoPoll(uint256 pollId, address voter) public isEmitter {
    emit PollUpdated(msg.sender, pollId, voter);
  }

  function transferSubdao(
    address tokenAddress,
    address from,
    address to,
    uint amount
  ) public isEmitter {
    emit Transfer(msg.sender, tokenAddress, from, to, amount);
  }

  function updateVotingStatus(uint256 pollId, address voter) public isEmitter {
    emit VotingStatusUpdated(msg.sender, pollId, voter);
  }

  function updateSubdaoPollAndStatus(
    uint256 pollId,
    address voter,
    subDaoStorage.PollStatus prevPollStatus,
    subDaoStorage.PollStatus newPollStatus
  ) public isEmitter {
    emit PollUpdated(msg.sender, pollId, voter);
    emit PollStatusUpdated(msg.sender, pollId, prevPollStatus, newPollStatus);
  }
}
