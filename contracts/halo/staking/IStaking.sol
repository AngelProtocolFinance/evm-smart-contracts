// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IStaking {
  function updateConfig(uint256 interestRate) external;

  function stake(uint256 amount) external;

  function stakeFor(address user, uint256 amount) external;

  function unstake(uint256 amount, uint256 stakeId) external;

  function totalStakedFor(address addr) external view returns (uint256);

  function totalStaked() external view returns (uint256);

  function token() external view returns (address);

  function supportsHistory() external pure returns (bool);

  // optional
  function lastStakedFor(address addr) external view returns (uint256);

  function totalStakedForAt(address addr, uint256 blockNumber) external view returns (uint256);

  function totalStakedAt(uint256 blockNumber) external view returns (uint256);
}
