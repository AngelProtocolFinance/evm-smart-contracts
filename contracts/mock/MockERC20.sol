// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20, ERC20Burnable, Ownable {
  constructor(string memory name, string memory symbol, uint256 supply) ERC20(name, symbol) {
    _mint(msg.sender, supply * 10 ** decimals());
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }
}
