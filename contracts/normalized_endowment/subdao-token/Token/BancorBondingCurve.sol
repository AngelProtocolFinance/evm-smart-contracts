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
   * Return = curSupply * ((1 + curDepositamount / curReservebalance) ^ (curReserveratio / MAX_RESERVE_RATIO) - 1)
   *
   * @param curSupply              continuous token total supply
   * @param curReservebalance    total reserve token balance
   * @param curReserveratio     reserve ratio, represented in ppm, 1-1000000
   * @param curDepositamount       deposit amount, in reserve token
   *
   *  @return purchase return amount
  */
  function calculatePurchaseReturn(
    uint256 curSupply,
    uint256 curReservebalance,
    uint32 curReserveratio,
    uint256 curDepositamount) view public returns (uint256)
  {
    // validate input
    require(curSupply > 0 && curReservebalance > 0 && curReserveratio > 0 && curReserveratio <= MAX_RESERVE_RATIO);
     // special case for 0 deposit amount
    if (curDepositamount == 0) {
      return 0;
    }
     // special case if the ratio = 100%
    if (curReserveratio == MAX_RESERVE_RATIO) {
      return curSupply.mul(curDepositamount).div(curReservebalance);
    }
     uint256 result;
    uint8 precision;
    uint256 baseN = curDepositamount.add(curReservebalance);
    (result, precision) = power(
      baseN, curReservebalance, curReserveratio, MAX_RESERVE_RATIO
    );
    uint256 newTokenSupply = curSupply.mul(result) >> precision;
    return newTokenSupply - curSupply;
  }
   /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio and a sell amount (in the continuous token),
   * calculates the return for a given conversion (in the reserve token)
   *
   * Formula:
   * Return = curReservebalance * (1 - (1 - curSellamount / curSupply) ^ (1 / (curReserveratio / MAX_RESERVE_RATIO)))
   *
   * @param curSupply              continuous token total supply
   * @param curReservebalance    total reserve token balance
   * @param curReserveratio     constant reserve ratio, represented in ppm, 1-1000000
   * @param curSellamount          sell amount, in the continuous token itself
   *
   * @return sale return amount
  */
  function calculateSaleReturn(
    uint256 curSupply,
    uint256 curReservebalance,
    uint32 curReserveratio,
    uint256 curSellamount) view public returns (uint256)
  {
    // validate input
    require(curSupply > 0 && curReservebalance > 0 && curReserveratio > 0 && curReserveratio <= MAX_RESERVE_RATIO && curSellamount <= curSupply);
     // special case for 0 sell amount
    if (curSellamount == 0) {
      return 0;
    }
     // special case for selling the entire supply
    if (curSellamount == curSupply) {
      return curReservebalance;
    }
     // special case if the ratio = 100%
    if (curReserveratio == MAX_RESERVE_RATIO) {
      return curReservebalance.mul(curSellamount).div(curSupply);
    }
     uint256 result;
    uint8 precision;
    uint256 baseD = curSupply - curSellamount;
    (result, precision) = power(
      curSupply, baseD, MAX_RESERVE_RATIO, curReserveratio
    );
    uint256 oldBalance = curReservebalance.mul(result);
    uint256 newBalance = curReservebalance << precision;
    return oldBalance.sub(newBalance).div(result);
  }
}