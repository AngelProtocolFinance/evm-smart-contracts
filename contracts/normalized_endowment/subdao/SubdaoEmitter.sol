// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoStorage} from "./storage.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISubdaoEmitter} from "./ISubdaoEmitter.sol";

contract SubdaoEmitter is ISubdaoEmitter, Initializable {
  event SubdaoInitialized(address subdao);
  event ConfigUpdated(address subdao);
  event Transfer(address subdao, address tokenAddress, address from, address to, uint256 amount);
  event StateUpdated(address subdao);
  event PollUpdated(address subdao, uint256 id, address sender);
  event PollStatusUpdated(address subdao, uint256 id, subDaoStorage.PollStatus pollStatus);
  event VotingStatusUpdated(address subdao, uint256 pollId, address voter);

  address accountsContract;
  mapping(address => bool) isSubdao;

  function initEmitter(address _accountsContract) public initializer {
    require(_accountsContract != address(0), "Invalid accounts contract address");
    accountsContract = _accountsContract;
  }

  modifier isOwner() {
    require(msg.sender == accountsContract, "Unauthorized");
    _;
  }
  modifier isEmitter() {
    require(isSubdao[msg.sender], "Unauthorized");
    _;
  }

  function initializeSubdao(address subdao) public isOwner {
    isSubdao[subdao] = true;
    emit SubdaoInitialized(subdao);
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
    subDaoStorage.PollStatus pollStatus
  ) public isEmitter {
    emit PollUpdated(msg.sender, pollId, voter);
    emit PollStatusUpdated(msg.sender, pollId, pollStatus);
  }
}
