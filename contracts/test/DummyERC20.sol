// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
  bool approveAllowed = true;
  bool transferAllowed = true;
  uint8 tokenDecimals;

  constructor(uint8 _decimals) ERC20("Token", "TKN") {
    if (_decimals == 0) {
      tokenDecimals = 18;
    } else {
      tokenDecimals = _decimals;
    }
  }

  function mint(address account, uint256 amount) external {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) external {
    _burn(account, amount);
  }

  function approveFor(address owner, address spender, uint256 amount) external {
    if (approveAllowed) {
      _approve(owner, spender, amount);
    }
  }

  function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
    if (transferAllowed) {
      address spender = _msgSender();
      _spendAllowance(from, spender, amount);
      _transfer(from, to, amount);
      return true;
    } else {
      return false;
    }
  }

  function setTransferAllowed(bool allowed) external {
    transferAllowed = allowed;
  }

  function setApproveAllowed(bool _approved) external {
    approveAllowed = _approved;
  }

  function approve(address spender, uint256 amount) public override returns (bool) {
    if (approveAllowed) {
      return super.approve(spender, amount);
    } else {
      return false;
    }
  }

  function setDecimals(uint8 _newDecimals) external {
    tokenDecimals = _newDecimals;
  }

  function decimals() public view override returns (uint8) {
    return tokenDecimals;
  }
}
