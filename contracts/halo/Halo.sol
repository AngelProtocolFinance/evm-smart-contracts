// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Halo is ERC20, ERC20Burnable, ERC20Snapshot, ERC20Votes, Ownable {
  constructor() ERC20("Halo", "HALO") ERC20Permit("Halo") {
    _mint(msg.sender, 1000000000 * 10 ** decimals());
  }

  function snapshot() public onlyOwner {
    _snapshot();
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Snapshot) {
    ERC20Snapshot._beforeTokenTransfer(from, to, amount);
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._burn(account, amount);
  }

  /**
    * @dev Clock used for flagging checkpoints. Overridding to implement timestamp based checkpoints (and voting).
    */
  function clock() public view override(ERC20Votes) returns (uint48) {
      return SafeCast.toUint48(block.timestamp);
  }
}
