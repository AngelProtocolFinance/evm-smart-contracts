// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/

interface IDiamondCut {
    enum FacetCutAction {Add, Replace, Remove}
    // Add=0, Replace=1, Remove=2

    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }

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
    ) external;

    event DiamondCut(FacetCut[] curDiamondcut, address curInit, bytes curCalldata);
}
