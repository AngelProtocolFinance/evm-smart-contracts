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
    /// @param diamondcut Contains the facet addresses and function selectors
    /// @param init The address of the contract or facet to execute calldata
    /// @param data A function call, including function selector and arguments
    ///                  data is executed with delegatecall on init
    function diamondCut(
        FacetCut[] calldata diamondcut,
        address init,
        bytes calldata data
    ) external override {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.diamondCut(diamondcut, init, data);
    }
}
