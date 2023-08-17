// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DummyAggregatorV3Interface is AggregatorV3Interface {
  int256 value;

  function setValue(int256 _value) external {
    value = _value;
  }

  function decimals() external view returns (uint8) {
    return uint8(18);
  }

  function description() external view returns (string memory) {
    return "ThisIsOnlyATest";
  }

  function version() external view returns (uint256) {
    return 0;
  }

  function getRoundData(
    uint80 _roundId
  )
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    )
  {
    return (uint80(0), int256(0), 0, 0, uint80(0));
  }

  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    )
  {
    return (uint80(0), value, 0, 0, uint80(0));
  }
}
