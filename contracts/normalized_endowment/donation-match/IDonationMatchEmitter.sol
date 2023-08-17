// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {DonationMatchStorage} from "./storage.sol";

interface IDonationMatchEmitter {
  function initializeDonationMatch(
    uint32 endowmentId,
    address donationMatch,
    DonationMatchStorage.Config memory config
  ) external;

  function giveApprovalErc20(
    uint32 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) external;

  function transferErc20(
    uint32 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) external;

  function burnErc20(uint32 endowmentId, address tokenAddress, uint amount) external;

  function executeDonorMatch(
    address tokenAddress,
    uint256 amount,
    address accountsContract,
    uint32 endowmentId,
    address donor
  ) external;
}
