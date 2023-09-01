// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {IERC173} from "../interfaces/IERC173.sol";
import {Validator} from "../../../validator.sol";

contract OwnershipFacet is IERC173 {
  function transferOwnership(address newOwner) external override {
    LibDiamond.enforceIsContractOwner();
    require(Validator.addressChecker(newOwner), "Invalid address");
    LibDiamond.setContractOwner(newOwner);
  }

  function owner() external view override returns (address owner_) {
    owner_ = LibDiamond.contractOwner();
  }
}
