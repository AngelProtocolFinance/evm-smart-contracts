// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccountMessages} from "../core/accounts/message.sol";
import {MultiSigStorage} from "./storage.sol";

library ApplicationsStorage {
  struct ApplicationProposal {
    address proposer;
    AccountMessages.CreateEndowmentRequest application;
    bytes metadata;
    uint256 expiry;
    bool executed;
  }

  struct Config {
    address accountsContract;
    uint256 seedSplitToLiquid;
    uint256 gasAmount;
    address seedAsset;
    uint256 seedAmount;
  }
}

contract StorageApplications {
  mapping(uint256 => ApplicationsStorage.ApplicationProposal) public proposals;
  mapping(uint256 => MultiSigStorage.Confirmations) public proposalConfirmations;
  ApplicationsStorage.Config public config;
  uint256 proposalCount;
}
