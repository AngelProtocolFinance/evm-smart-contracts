// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface QueryIIncentivisedVotingLockup {
  function balanceOf(address owner) external view returns (uint256);

  function balanceOfAt(address owner, uint256 blocknumber) external view returns (uint256);

  function totalSupply() external view returns (uint256);

  function totalSupplyAt(uint256 blocknumber) external view returns (uint256);
}
