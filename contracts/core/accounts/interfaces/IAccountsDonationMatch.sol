// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";

interface IAccountsDonationMatch {
  function depositDonationMatchERC20(uint32 id, address token, uint256 amount) external;

  function withdrawDonationMatchERC20(uint32 id, address recipient, uint256 amount) external;

  function setupDonationMatch(uint32 id, AccountMessages.DonationMatch memory details) external;
}
