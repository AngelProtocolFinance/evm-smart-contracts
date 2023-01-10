// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {ICurveLP} from "../ICurveLP.sol";

contract DummyCRVLP is ICurveLP {
  uint256 dy_for_get_dy;
  uint256 dy_for_exchange;

// Helpers
  function setDys(uint256 _dy_for_get_dy, uint256 _dy_for_exchange) external {
    dy_for_get_dy = _dy_for_get_dy;
    dy_for_exchange = _dy_for_exchange;
  }
    
// Necessary for integration tests
  function get_dy(
    uint256,
    uint256,
    uint256
  ) external view returns (uint256) {
    return dy_for_get_dy;
  }

  function exchange(
    uint256,
    uint256,
    uint256,
    uint256
  ) external returns (uint256) {
    return dy_for_exchange;
  }

/// Unused by integration

  function coins(uint256) external view returns (address) {}

  function token() external view returns (address) {}

  function calc_token_amount(uint256[2] calldata amounts) external view returns (uint256) {}

  function lp_price() external view returns (uint256) {}

  function add_liquidity(
    uint256[2] calldata amounts,
    uint256 min_mint_amount,
    bool use_eth,
    address receiver
  ) external returns (uint256) {}

  function remove_liquidity(uint256 _amount, uint256[2] calldata min_amounts) external returns (uint256) {}

  function remove_liquidity_one_coin(
    uint256 token_amount,
    uint256 i,
    uint256 min_amount
  ) external returns (uint256) {}

  function balances(uint256 arg0) external view returns (uint256) {}

}