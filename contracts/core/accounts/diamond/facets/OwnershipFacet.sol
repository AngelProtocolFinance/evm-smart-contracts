// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { IERC173 } from "../interfaces/IERC173.sol";

contract OwnershipFacet is IERC173 {
    function transferOwnership(address newowner) external override {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.setContractOwner(newowner);
    }

    function owner() external override view returns (address owner) {
        owner = LibDiamond.contractOwner();
    }
}
