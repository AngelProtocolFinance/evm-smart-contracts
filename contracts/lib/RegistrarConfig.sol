// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

library RegistrarConfig {

    // DEFAULT REBALANCE PARAMS
    bool constant REBALANCE_LIQUID_PROFITS = false;
    bool constant LOCKED_REBALANCE_TO_LIQUID = false;
    uint32 constant INTEREST_DISTRIBUTION = 20;
    bool constant LOCKED_PRINCIPLE_TO_LIQUID = false;
    uint32 constant PRINCIPLE_DISTRIBUTION = 0;
    
    // DEFAULT ANGEL PROTOCOL PARAMS
    uint32 constant PROTOCOL_TAX_RATE = 2;
    uint32 constant PROTOCOL_TAX_BASIS = 100;
    string constant PRIMARY_CHAIN = "Polygon";
    string constant PRIMARY_CHAIN_ROUTER_ADDRESS = "";
}