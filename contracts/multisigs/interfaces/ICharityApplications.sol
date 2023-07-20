// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../../core/accounts/message.sol";
import {ApplicationsStorage} from "../CharityApplicationsStorage.sol";

abstract contract ICharityApplications {
  /*
   * Events
   */
  event ApplicationProposed(uint256 proposalId, address proposer, string charityName);
  event ApplicationExecuted(uint256 proposalId);
  event ApplicationConfirmed(uint256 proposalId, address owner);
  event ApplicationConfirmationRevoked(uint256 proposalId, address owner);
  // event emitted when gas is sent to endowments first member
  event GasSent(uint256 endowmentId, address member, uint256 amount);
  // event emitted when seed funding is given to endowment
  event SeedAssetSent(uint256 endowmentId, address asset, uint256 amount);

  /**
   * @notice Initialize the charity applications contract
   * where anyone can submit applications to open a charity endowment on AP for review and approval
   * @dev seed asset will always be USDC
   * @dev Initialize the contract
   * @param owners List of initial owners.
   * @param _approvalsRequired Number of required confirmations.
   * @param _requireExecution setting for if an explicit execution call is required
   * @param _transactionExpiry Proposal expiry time in seconds
   * @param _accountsContract Accounts contract address
   * @param _gasAmount Gas amount
   * @param _seedSplitToLiquid Seed split to liquid
   * @param _seedAsset Seed asset
   * @param _seedAmount Seed asset amount
   */
  function initializeApplications(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry,
    address _accountsContract,
    uint256 _gasAmount,
    uint256 _seedSplitToLiquid,
    address _seedAsset,
    uint256 _seedAmount
  ) public virtual;

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
    uint256 _transactionExpiry,
    address accountsContract,
    uint256 seedSplitToLiquid,
    uint256 gasAmount,
    address seedAsset,
    uint256 seedAmount
  ) public virtual;

  function queryConfig() public view virtual returns (ApplicationsStorage.Config memory);

  function getProposalConfirmationCount(uint256 proposalId) public view virtual returns (uint256);

  function getProposalConfirmationStatus(
    uint256 proposalId,
    address ownerAddr
  ) public view virtual returns (bool);
}
