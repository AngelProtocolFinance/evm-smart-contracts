// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

contract DummyUniswapV3Facotry is IUniswapV3Factory {
  address pool;

  function setPool(address _pool) external {
    pool = _pool;
  }

  function owner() external view returns (address) {
    return address(this);
  }

  function feeAmountTickSpacing(uint24) external view returns (int24) {
    return 0;
  }

  function getPool(address, address, uint24) external view returns (address) {
    return pool;
  }

  function createPool(address, address, uint24) external returns (address) {
    return pool;
  }

  function setOwner(address _owner) external {}

  function enableFeeAmount(uint24, int24) external {}
}
