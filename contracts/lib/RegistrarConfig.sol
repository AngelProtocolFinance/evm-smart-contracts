// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

library RegistrarConfig {

    // DEFAULT REBALANCE PARAMS
    bool constant REBALANCE_LIQUID_PROFITS = false;
    uint32 constant LOCKED_REBALANCE_TO_LIQUID = 75; // 75%
    uint32 constant INTEREST_DISTRIBUTION = 20;      // 20%
    bool constant LOCKED_PRINCIPLE_TO_LIQUID = false;
    uint32 constant PRINCIPLE_DISTRIBUTION = 0;
    uint32 constant BASIS = 100;

    // DEFAULT ANGEL PROTOCOL PARAMS
    uint32 constant PROTOCOL_TAX_RATE = 2;
    uint32 constant PROTOCOL_TAX_BASIS = 100;
    address constant PROTOCOL_TAX_COLLECTOR = address(0);
    string constant PRIMARY_CHAIN = "Polygon";
    string constant PRIMARY_CHAIN_ROUTER_ADDRESS = "";
    address constant ROUTER_ADDRESS = address(0);
    address constant REFUND_ADDRESS = address(0);
}