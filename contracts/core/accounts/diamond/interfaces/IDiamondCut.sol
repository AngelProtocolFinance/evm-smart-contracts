// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/

interface IDiamondCut {
  enum FacetCutAction {
    Add,
    Replace,
    Remove
  }
  // Add=0, Replace=1, Remove=2

  struct FacetCut {
    address facetAddress;
    FacetCutAction action;
    bytes4[] functionSelectors;
  }

  /// @notice Add/replace/remove any number of functions and optionally execute
  ///         a function with delegatecall
  /// @param diamondcut Contains the facet addresses and function selectors
  /// @param init The address of the contract or facet to execute calldata
  /// @param data A function call, including function selector and arguments
  ///                  data is executed with delegatecall on init
  function diamondCut(FacetCut[] calldata diamondcut, address init, bytes calldata data) external;

  event DiamondCut(FacetCut[] diamondcut, address init, bytes data);
}
