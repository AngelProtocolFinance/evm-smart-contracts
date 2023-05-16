// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// import {subDaoTokenStorage} from "./storage.sol";
import {AngelCoreStruct} from "./../../core/struct.sol";

library SubDaoTokenMessage {
    struct InstantiateMsg {
        /// name of the supply token
        string name;
        /// symbol / ticker of the supply token
        string symbol;
        // /// number of decimal places of the supply token, needed for proper curve math.
        // /// If it is eg. HALO, where a balance of 10^6 means 1 HALO, then use 6 here.
        // uint256 decimals;
        /// this is the cw20 reserve token address
        /// For Charity Shares, this is the address of the HALO CW20 Contract
        address reserveDenom;
        // /// number of decimal places for the reserve token, needed for proper curve math.
        // /// Same format as decimals above, eg. if it is uatom, where 1 unit is 10^-6 ATOM, use 6 here
        // uint256 reserveDecimals;
        /// enum to store the curve parameters used for this contract
        /// if you want to add a custom Curve, you should make a new contract that imports this one.
        /// write a custom `instantiate`, and then dispatch `your::execute` -> `cw20_bonding::do_execute`
        /// with your custom curve as a parameter (and same with `query` -> `do_query`)
        AngelCoreStruct.CurveTypeEnum curve_type;
        // days of unbonding
        uint256 unbondingPeriod;
    }
}
