// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NewERC20 is ERC20Upgradeable, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  function initErC20(
    string memory name,
    string memory symbol,
    address mintaddress,
    uint256 totalmint,
    address admin
  ) public initializer {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(MINTER_ROLE, msg.sender);
    __ERC20_init(name, symbol);
    mint(mintaddress, totalmint);
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  /// @dev Internal function that needs to be override
  function _msgSender()
    internal
    view
    virtual
    override(Context, ContextUpgradeable)
    returns (address)
  {
    return msg.sender;
  }

  function _msgData()
    internal
    view
    virtual
    override(Context, ContextUpgradeable)
    returns (bytes calldata)
  {
    return msg.data;
  }
}
