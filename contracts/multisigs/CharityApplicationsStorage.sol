// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../core/accounts/message.sol";
import {MultiSigStorage} from "./storage.sol";

library ApplicationsStorage {
  enum Status {
    Pending,
    Approved,
    Rejected
  }

  struct ApplicationProposal {
    address proposer;
    AccountMessages.CreateEndowmentRequest application;
    string meta;
    uint256 expiry;
    Status status;
  }

  struct Config {
    address accountsContract;
    uint256 seedSplitToLiquid;
    bool newEndowGasMoney;
    uint256 gasAmount;
    bool fundSeedAsset;
    address seedAsset;
    uint256 seedAssetAmount;
  }
}

contract StorageApplications {
  mapping(uint256 => ApplicationsStorage.ApplicationProposal) public proposals;
  mapping (uint256 => MultiSigStorage.Confirmations) proposalConfirmations;
  ApplicationsStorage.Config public config;
  uint256 proposalCount;
}
