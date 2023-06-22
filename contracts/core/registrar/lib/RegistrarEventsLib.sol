// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library RegistrarEventsLib {
  event UpdateRegistrarConfig();
  event UpdateRegistrarOwner(address newOwner);
  event PostNetworkConnection(uint256 chainId);
  event DeleteNetworkConnection(uint256 chainId);
}
