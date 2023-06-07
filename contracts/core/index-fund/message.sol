// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library IndexFundMessage {
  struct InstantiateMessage {
    address registrarContract;
    uint256 fundRotation; // how many blocks are in a rotation cycle for the active IndexFund
    uint256 fundMemberLimit; // limit to number of members an IndexFund can have
    uint256 fundingGoal; // donation funding limit to trigger early cycle of the Active IndexFund
  }

  struct UpdateConfigMessage {
    uint256 fundRotation;
    uint256 fundMemberLimit;
    uint256 fundingGoal;
  }

  struct StateResponseMessage {
    uint256 totalFunds;
    uint256 activeFund; // index ID of the Active IndexFund
    uint256 roundDonations; // total donations given to active charity this round
    uint256 nextRotationBlock; // block height to perform next rotation on
  }

  struct DonationDetailsResponse {
    address addr;
    uint256 totalUst;
  }

  struct DepositMsg {
    uint256 fundId;
    uint256 split;
  }

  // struct BuildDonationMessage{
  //     uint256 key;
  //     uint256 key1;
  //     uint256 value1;
  //     uint256 key2;
  //     uint256 value2;
  // }
}
