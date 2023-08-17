// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SubDaoStorage} from "./storage.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISubDaoEmitter} from "./ISubDaoEmitter.sol";

contract SubDaoEmitter is ISubDaoEmitter, Initializable {
  event SubDaoInitialized(address subdao);
  event ConfigUpdated(address subdao);
  event Transfer(address subdao, address tokenAddress, address from, address to, uint256 amount);
  event StateUpdated(address subdao);
  event PollUpdated(address subdao, uint256 id, address sender);
  event PollStatusUpdated(address subdao, uint256 id, SubDaoStorage.PollStatus pollStatus);
  event VotingStatusUpdated(address subdao, uint256 pollId, address voter);

  address accountsContract;
  mapping(address => bool) isSubDao;

  function initEmitter(address _accountsContract) public initializer {
    require(_accountsContract != address(0), "Invalid accounts contract address");
    accountsContract = _accountsContract;
  }

  modifier isOwner() {
    require(msg.sender == accountsContract, "Unauthorized");
    _;
  }
  modifier isEmitter() {
    require(isSubDao[msg.sender], "Unauthorized");
    _;
  }

  function initializeSubDao(address subdao) public isOwner {
    isSubDao[subdao] = true;
    emit SubDaoInitialized(subdao);
  }

  function updateSubDaoConfig() public isEmitter {
    emit ConfigUpdated(msg.sender);
  }

  function updateSubDaoState() public isEmitter {
    emit StateUpdated(msg.sender);
  }

  function updateSubDaoPoll(uint256 pollId, address voter) public isEmitter {
    emit PollUpdated(msg.sender, pollId, voter);
  }

  function transferSubDao(
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

  function updateSubDaoPollAndStatus(
    uint256 pollId,
    address voter,
    SubDaoStorage.PollStatus pollStatus
  ) public isEmitter {
    emit PollUpdated(msg.sender, pollId, voter);
    emit PollStatusUpdated(msg.sender, pollId, pollStatus);
  }
}
