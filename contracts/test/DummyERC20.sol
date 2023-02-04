// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
    uint8 tokenDecimals = 18; // default for erc20

    constructor() ERC20("Token","TKN") {
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function approveFor(address owner, address spender, uint256 amount) external {
        _approve(owner, spender, amount);
    }

    function setDecimals(uint8 _newDecimals) external {
        tokenDecimals = _newDecimals;
    }

    function decimals() override public view returns (uint8) {
        return tokenDecimals;
    }
}