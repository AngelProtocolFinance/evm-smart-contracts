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
    /// @return facets Facet
    function facets() external view override returns (Facet[] memory facets) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 numFacets = ds.facetAddresses.length;
        facets = new Facet[](numFacets);
        for (uint256 i = 0; i < numFacets; i++) {
            address facetaddress = ds.facetAddresses[i];
            facets[i].facetAddress = facetaddress;
            facets[i].functionSelectors = ds
                .facetFunctionSelectors[facetaddress]
                .functionSelectors;
        }
    }

    /// @notice Gets all the function selectors provided by a facet.
    /// @param facet The facet address.
    /// @return facetfunctionselectors
    function facetFunctionSelectors(address facet)
        external
        view
        override
        returns (bytes4[] memory facetfunctionselectors)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetfunctionselectors = ds
            .facetFunctionSelectors[facet]
            .functionSelectors;
    }

    /// @notice Get all the facet addresses used by a diamond.
    /// @return facetaddresses
    function facetAddresses()
        external
        view
        override
        returns (address[] memory facetaddresses)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetaddresses = ds.facetAddresses;
    }

    /// @notice Gets the facet that supports the given selector.
    /// @dev If facet is not found return address(0).
    /// @param functionselector The function selector.
    /// @return facetaddress The facet address.
    function facetAddress(bytes4 functionselector)
        external
        view
        override
        returns (address facetaddress)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetaddress = ds
            .selectorToFacetAndPosition[functionselector]
            .facetAddress;
    }

    // This implements ERC-165.
    function supportsInterface(bytes4 interfaceid)
        external
        view
        override
        returns (bool)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.supportedInterfaces[interfaceid];
    }
}
