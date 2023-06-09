// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// From https://github.com/aragonone/voting-connectors
abstract contract IERC20WithCheckpointing {
  function balanceOf(address owner) public view virtual returns (uint256);

  function balanceOfAt(address owner, uint256 blocknumber) public view virtual returns (uint256);

  function totalSupply() public view virtual returns (uint256);

  function totalSupplyAt(uint256 blocknumber) public view virtual returns (uint256);
}
