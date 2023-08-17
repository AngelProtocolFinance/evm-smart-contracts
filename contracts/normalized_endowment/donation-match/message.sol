// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library DonationMatchMessages {
  struct InstantiateMessage {
    address reserveToken;
    address uniswapFactory;
    address registrarContract;
    uint24 poolFee;
    address usdcAddress;
  }
}
