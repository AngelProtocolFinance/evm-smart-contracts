// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library subDaoStorage {
  struct Config {
    address registrarContract;
    address owner;
    address daoToken;
    address veToken;
    address swapFactory;
    uint256 quorum;
    uint256 threshold;
    uint256 votingPeriod;
    uint256 timelockPeriod;
    uint256 expirationPeriod;
    uint256 proposalDeposit;
    uint256 snapshotPeriod;
  }

  struct State {
    uint256 pollCount;
    uint256 totalShare;
    uint256 totalDeposit;
  }

  enum VoteOption {
    Yes,
    No
  }

  struct VoterInfo {
    VoteOption vote;
    uint256 balance;
    bool voted;
  }

  // struct TokenManager {
  //     uint256 share;                        // total staked balance
  //     VoterInfo lockedBalance; // maps pollId to weight voted
  // }

  struct ExecuteData {
    uint256[] order;
    address[] contractAddress;
    bytes[] execution_message;
  }

  enum PollStatus {
    InProgress,
    Passed,
    Rejected,
    Executed,
    Expired
  }

  struct Poll {
    uint256 id;
    address creator;
    PollStatus status;
    uint256 yesVotes;
    uint256 noVotes;
    uint256 startBlock;
    uint256 startTime;
    uint256 endHeight;
    string title;
    string description;
    string link;
    ExecuteData executeData;
    uint256 depositAmount;
    /// Total balance at the end poll
    uint256 totalBalanceAtEndPoll;
    uint256 stakedAmount;
  }
}

contract Storage {
  subDaoStorage.Config config;
  subDaoStorage.State state;

  mapping(uint256 => subDaoStorage.Poll) poll;
  mapping(uint256 => subDaoStorage.PollStatus) poll_status;

  mapping(uint256 => mapping(address => subDaoStorage.VoterInfo)) voting_status;

  uint256 constant MIN_TITLE_LENGTH = 4;
  uint256 constant MAX_TITLE_LENGTH = 64;
  uint256 constant MIN_DESC_LENGTH = 4;
  uint256 constant MAX_DESC_LENGTH = 1024;
  uint256 constant MIN_LINK_LENGTH = 12;
  uint256 constant MAX_LINK_LENGTH = 128;
}
