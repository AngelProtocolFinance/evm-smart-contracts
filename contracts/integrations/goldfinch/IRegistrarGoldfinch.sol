// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IRegistrar} from "../../interfaces/IRegistrar.sol";
import {APGoldfinchConfigLib} from "./APGoldfinchConfig.sol";

interface IRegistrarGoldfinch is IRegistrar {

    struct principle {
        uint256 usdcP;
        uint256 fiduP;
    }
    
    function getAPGoldfinchParams() external view returns (APGoldfinchConfigLib.APGoldfinchConfig memory);
}