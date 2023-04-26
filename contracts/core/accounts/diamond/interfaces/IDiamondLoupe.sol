// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/

// A loupe is a small magnifying glass used to look at diamonds.
// These functions look at diamonds
interface IDiamondLoupe {
    /// These functions are expected to be called frequently
    /// by tools.

    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    /// @notice Gets all facet addresses and their four byte function selectors.
    /// @return curFacets Facet
    function facets() external view returns (Facet[] memory curFacets);

    /// @notice Gets all the function selectors supported by a specific facet.
    /// @param curFacet The facet address.
    /// @return curFacetfunctionselectors
    function facetFunctionSelectors(address curFacet) external view returns (bytes4[] memory curFacetfunctionselectors);

    /// @notice Get all the facet addresses used by a diamond.
    /// @return curFacetaddresses
    function facetAddresses() external view returns (address[] memory curFacetaddresses);

    /// @notice Gets the facet that supports the given selector.
    /// @dev If facet is not found return address(0).
    /// @param curFunctionselector The function selector.
    /// @return curFacetaddress The facet address.
    function facetAddress(bytes4 curFunctionselector) external view returns (address curFacetaddress);
}
