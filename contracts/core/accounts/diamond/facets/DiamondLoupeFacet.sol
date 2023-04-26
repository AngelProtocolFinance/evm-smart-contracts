// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IERC165} from "../interfaces/IERC165.sol";

// The functions in DiamondLoupeFacet MUST be added to a diamond.
// The EIP-2535 Diamond standard requires these functions.

contract DiamondLoupeFacet is IDiamondLoupe, IERC165 {
    // Diamond Loupe Functions
    ////////////////////////////////////////////////////////////////////
    /// These functions are expected to be called frequently by tools.
    //
    // struct Facet {
    //     address facetAddress;
    //     bytes4[] functionSelectors;
    // }

    /// @notice Gets all facets and their selectors.
    /// @return curFacets Facet
    function facets() external view override returns (Facet[] memory curFacets) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 numFacets = ds.facetAddresses.length;
        curFacets = new Facet[](numFacets);
        for (uint256 i = 0; i < numFacets; i++) {
            address curFacetaddress = ds.facetAddresses[i];
            curFacets[i].facetAddress = curFacetaddress;
            curFacets[i].functionSelectors = ds
                .facetFunctionSelectors[curFacetaddress]
                .functionSelectors;
        }
    }

    /// @notice Gets all the function selectors provided by a facet.
    /// @param curFacet The facet address.
    /// @return curFacetfunctionselectors
    function facetFunctionSelectors(address curFacet)
        external
        view
        override
        returns (bytes4[] memory curFacetfunctionselectors)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        curFacetfunctionselectors = ds
            .facetFunctionSelectors[curFacet]
            .functionSelectors;
    }

    /// @notice Get all the facet addresses used by a diamond.
    /// @return curFacetaddresses
    function facetAddresses()
        external
        view
        override
        returns (address[] memory curFacetaddresses)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        curFacetaddresses = ds.facetAddresses;
    }

    /// @notice Gets the facet that supports the given selector.
    /// @dev If facet is not found return address(0).
    /// @param curFunctionselector The function selector.
    /// @return curFacetaddress The facet address.
    function facetAddress(bytes4 curFunctionselector)
        external
        view
        override
        returns (address curFacetaddress)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        curFacetaddress = ds
            .selectorToFacetAndPosition[curFunctionselector]
            .facetAddress;
    }

    // This implements ERC-165.
    function supportsInterface(bytes4 curInterfaceid)
        external
        view
        override
        returns (bool)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.supportedInterfaces[curInterfaceid];
    }
}
