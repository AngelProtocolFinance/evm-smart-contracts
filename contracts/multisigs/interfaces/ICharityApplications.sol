// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../../core/accounts/message.sol";
import {ApplicationsStorage} from "../CharityApplicationsStorage.sol";

abstract contract ICharityApplications {
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

  /**
   * @notice Initialize the charity applications contract
   * where anyone can submit applications to open a charity endowment on AP for review and approval
   * @dev seed asset will always be USDC
   * @dev Initialize the contract
   * @param owners List of initial owners.
   * @param _approvalsRequired Number of required confirmations.
   * @param _requireExecution setting for if an explicit execution call is required
   * @param _transactionExpiry Proposal expiry time in seconds
   * @param _accountscontract Accounts contract address
   * @param _newendowgasmoney New endow gas money
   * @param _gasamount Gas amount
   * @param _fundseedasset Fund seed asset
   * @param _seedsplittoliquid Seed split to liquid
   * @param _seedasset Seed asset
   * @param _seedassetamount Seed asset amount
   */
  function initializeApplications(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry,
    address _accountscontract,
    bool _newendowgasmoney,
    uint256 _gasamount,
    bool _fundseedasset,
    uint256 _seedsplittoliquid,
    address _seedasset,
    uint256 _seedassetamount
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
