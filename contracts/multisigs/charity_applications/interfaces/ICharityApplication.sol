// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// import {MultiSigStorage} from "../storage.sol";
import {AccountMessages} from "../../../core/accounts/message.sol";
import "./../storage.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

abstract contract ICharityApplication is IERC165 {
  /*
   * Events
   */

  event InitilizedCharityApplication();

  event CharityProposed(address proposer, uint256 proposalId, string meta);

  event CharityApproved(uint256 proposalId, uint256 endowmentId);

  event CharityRejected(uint256 proposalId);

  event Deposit(address sender, uint256 value);

  // event emitted when gas is sent to endowments first member
  event GasSent(uint256 endowmentId, address member, uint256 amount);

  // event emitted when seed funding is given to endowment
  event SeedAssetSent(uint256 endowmentId, address asset, uint256 amount);

  // For storing mattic to send gas fees
  /// @dev Receive function allows to deposit ether.
  receive() external payable virtual;

  // For storing mattic to send gas fees
  /// @dev Fallback function allows to deposit ether.
  fallback() external payable virtual;

  function proposeCharity(
    AccountMessages.CreateEndowmentRequest memory charityApplication,
    string memory meta
  ) public virtual;

  function approveCharity(uint256 proposalId) public virtual;

  function rejectCharity(uint256 proposalId) public virtual;

  function updateConfig(
    uint256 expiry,
    address apteammultisig,
    address accountscontract,
    uint256 seedsplittoliquid,
    bool newendowgasmoney,
    uint256 gasamount,
    bool fundseedasset,
    address seedasset,
    uint256 seedassetamount
  ) public virtual;
}
