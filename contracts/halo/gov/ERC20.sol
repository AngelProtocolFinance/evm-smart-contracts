// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20WrapperUpgradeable.sol";

contract VotingERC20 is
  Initializable,
  ERC20Upgradeable,
  ERC20BurnableUpgradeable,
  ERC20SnapshotUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC20PermitUpgradeable,
  ERC20VotesUpgradeable,
  ERC20WrapperUpgradeable
{
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address underlyingToken) public initializer {
    __ERC20_init("VotingERC20", "ERCVote");
    __ERC20Burnable_init();
    __ERC20Snapshot_init();
    __Ownable_init();
    __Pausable_init();
    __ERC20Permit_init("VotingERC20");
    __ERC20Votes_init();
    __ERC20Wrapper_init(IERC20Upgradeable(underlyingToken));
  }

  function decimals()
    public
    pure
    override(ERC20Upgradeable, ERC20WrapperUpgradeable)
    returns (uint8)
  {
    return 18;
  }

  function snapshot() public onlyOwner {
    _snapshot();
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20SnapshotUpgradeable) whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(
    address to,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._mint(to, amount);
  }

  function _burn(
    address account,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._burn(account, amount);
  }
}
