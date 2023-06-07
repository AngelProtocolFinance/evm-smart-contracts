// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {DonationMatchStorage} from "./storage.sol";

interface IDonationMatchEmitter {
  function initializeDonationMatch(
    uint256 endowmentId,
    address donationMatch,
    DonationMatchStorage.Config memory config
  ) external;

  function giveApprovalErC20(
    uint256 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) external;

  function transferErC20(
    uint256 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) external;

  function burnErC20(uint256 endowmentId, address tokenAddress, uint amount) external;

  function executeDonorMatch(
    address tokenAddress,
    uint256 amount,
    address accountsContract,
    uint256 endowmentId,
    address donor
  ) external;
}
