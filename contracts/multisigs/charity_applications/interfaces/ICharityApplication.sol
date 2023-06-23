// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../../../core/accounts/message.sol";
import {ApplicationsStorage} from "../storage.sol";

abstract contract ICharityApplication {
  /*
   * Events
   */
  event ApplicationProposed(address proposer, uint256 proposalId, string meta);
  event ApplicationExecuted(uint256 proposalId);
  event ApplicaitonConfirmed(uint256 proposalId, address owner);
  event ApplicaitonConfirmationRevoked(uint256 proposalId, address owner);
  // event emitted when gas is sent to endowments first member
  event GasSent(uint256 endowmentId, address member, uint256 amount);
  // event emitted when seed funding is given to endowment
  event SeedAssetSent(uint256 endowmentId, address asset, uint256 amount);

  function proposeApplication(
    AccountMessages.CreateEndowmentRequest memory application,
    string memory meta
  ) public virtual;

  function confirmProposal(uint256 proposalId) public virtual;

  /// @dev Allows an owner to revoke a confirmation for an application proposal.
  /// @param proposalId Proposal ID.
  function revokeProposalConfirmation(uint256 proposalId) public virtual;

  function executeProposal(uint256 proposalId) public virtual returns (uint32);

  function updateConfig(
    uint256 expiry,
    address accountscontract,
    uint256 seedsplittoliquid,
    bool newendowgasmoney,
    uint256 gasamount,
    bool fundseedasset,
    address seedasset,
    uint256 seedassetamount
  ) public virtual;

  function queryConfig() public view virtual returns (ApplicationsStorage.Config memory);
}
