// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Halo is ERC20 {
  constructor(address receiver, uint256 supply) ERC20("Halo", "HALO") {
    _mint(receiver, supply);
  }
}
