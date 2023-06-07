// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Power.sol"; // Efficient power function.

/**
 * @title Bancor formula by Bancor
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements;
 * and to You under the Apache License, Version 2.0. "
 */
contract BancorBondingCurve is Power {
  using SafeMath for uint256;
  uint32 private constant MAX_RESERVE_RATIO = 1000000;

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio, and a deposit amount (in the reserve token),
   * calculates the return for a given conversion (in the continuous token)
   *
   * Formula:
   * Return = supply * ((1 + depositamount / reservebalance) ^ (reserveratio / MAX_RESERVE_RATIO) - 1)
   *
   * @param supply              continuous token total supply
   * @param reservebalance    total reserve token balance
   * @param reserveratio     reserve ratio, represented in ppm, 1-1000000
   * @param depositamount       deposit amount, in reserve token
   *
   *  @return purchase return amount
   */
  function calculatePurchaseReturn(
    uint256 supply,
    uint256 reservebalance,
    uint32 reserveratio,
    uint256 depositamount
  ) public view returns (uint256) {
    // validate input
    require(
      supply > 0 && reservebalance > 0 && reserveratio > 0 && reserveratio <= MAX_RESERVE_RATIO
    );
    // special case for 0 deposit amount
    if (depositamount == 0) {
      return 0;
    }
    // special case if the ratio = 100%
    if (reserveratio == MAX_RESERVE_RATIO) {
      return supply.mul(depositamount).div(reservebalance);
    }
    uint256 result;
    uint8 precision;
    uint256 baseN = depositamount.add(reservebalance);
    (result, precision) = power(baseN, reservebalance, reserveratio, MAX_RESERVE_RATIO);
    uint256 newTokenSupply = supply.mul(result) >> precision;
    return newTokenSupply - supply;
  }

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio and a sell amount (in the continuous token),
   * calculates the return for a given conversion (in the reserve token)
   *
   * Formula:
   * Return = reservebalance * (1 - (1 - sellamount / supply) ^ (1 / (reserveratio / MAX_RESERVE_RATIO)))
   *
   * @param supply              continuous token total supply
   * @param reservebalance    total reserve token balance
   * @param reserveratio     constant reserve ratio, represented in ppm, 1-1000000
   * @param sellamount          sell amount, in the continuous token itself
   *
   * @return sale return amount
   */
  function calculateSaleReturn(
    uint256 supply,
    uint256 reservebalance,
    uint32 reserveratio,
    uint256 sellamount
  ) public view returns (uint256) {
    // validate input
    require(
      supply > 0 &&
        reservebalance > 0 &&
        reserveratio > 0 &&
        reserveratio <= MAX_RESERVE_RATIO &&
        sellamount <= supply
    );
    // special case for 0 sell amount
    if (sellamount == 0) {
      return 0;
    }
    // special case for selling the entire supply
    if (sellamount == supply) {
      return reservebalance;
    }
    // special case if the ratio = 100%
    if (reserveratio == MAX_RESERVE_RATIO) {
      return reservebalance.mul(sellamount).div(supply);
    }
    uint256 result;
    uint8 precision;
    uint256 baseD = supply - sellamount;
    (result, precision) = power(supply, baseD, MAX_RESERVE_RATIO, reserveratio);
    uint256 oldBalance = reservebalance.mul(result);
    uint256 newBalance = reservebalance << precision;
    return oldBalance.sub(newBalance).div(result);
  }
}
