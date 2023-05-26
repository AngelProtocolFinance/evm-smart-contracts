// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {ERC721AngelProtocolExtension} from "./ERC721AngelProtocolExtension.sol";
import {Accounting} from "./Accounting.sol";
import {IVault} from "../../interfaces/IVault.sol";

abstract contract APStrategy_V1 is ERC721AngelProtocolExtension, Accounting {

  function deposit() external {

  }
  
  function depositToExisting(uint256 id) external {

  }

  function redeem(uint256 id) external {

  }

  function redeemAll(uint256 id) external {

  }

  function harvest(uint256[] memory ids) external {

  }

  function getYieldForPosition(uint256 id) external {

  }
 
}