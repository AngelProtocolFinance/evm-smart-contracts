// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IPool {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}
