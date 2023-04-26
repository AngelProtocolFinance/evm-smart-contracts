// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

// Remember to add the loupe functions from DiamondLoupeFacet to the diamond.
// The loupe functions are required by the EIP2535 Diamonds standard

contract DiamondCutFacet is IDiamondCut {
    /// @notice Add/replace/remove any number of functions and optionally execute
    ///         a function with delegatecall
    /// @param curDiamondcut Contains the facet addresses and function selectors
    /// @param curInit The address of the contract or facet to execute curCalldata
    /// @param curCalldata A function call, including function selector and arguments
    ///                  curCalldata is executed with delegatecall on curInit
    function diamondCut(
        FacetCut[] calldata curDiamondcut,
        address curInit,
        bytes calldata curCalldata
    ) external override {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.diamondCut(curDiamondcut, curInit, curCalldata);
    }
}
