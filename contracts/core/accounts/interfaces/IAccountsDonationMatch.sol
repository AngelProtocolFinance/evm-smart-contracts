// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IAccountsDonationMatch {
  function depositDonationMatchErC20(uint32 id, address token, uint256 amount) external;
}
