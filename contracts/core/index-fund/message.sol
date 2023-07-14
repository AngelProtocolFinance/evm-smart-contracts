// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library IndexFundMessage {
  struct StateResponse {
    uint256 totalFunds;
    uint256 activeFund; // index ID of the Active IndexFund
    uint256 roundDonations; // total donations given to active charity this round
    uint256 nextRotationBlock; // block height to perform next rotation on
  }
}
