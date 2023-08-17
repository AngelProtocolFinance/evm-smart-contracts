// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Validator} from "../core/validator.sol";
import "./CharityApplicationsStorage.sol";
import {ICharityApplications} from "./interfaces/ICharityApplications.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LibAccounts} from "../core/accounts/lib/LibAccounts.sol";
import {IAccountsCreateEndowment} from "../core/accounts/interfaces/IAccountsCreateEndowment.sol";
import {IAccountsQueryEndowments} from "../core/accounts/interfaces/IAccountsQueryEndowments.sol";
import {IAccountsDepositWithdrawEndowments} from "../core/accounts/interfaces/IAccountsDepositWithdrawEndowments.sol";
import {AccountStorage} from "../core/accounts/storage.sol";
import {AccountMessages} from "../core/accounts/message.sol";
import {MultiSigGeneric} from "./MultiSigGeneric.sol";

/**
 * @title CharityApplications
 * @notice Contract for managing charity applications, sent by public to open a charity endowment on AP
 * @dev Charity Applications have to be approved by AP Team multisig
 * @dev Contract for managing charity applications
 */
contract CharityApplications is MultiSigGeneric, StorageApplications, ICharityApplications {
  /*
   * Modifiers
   */

  modifier proposalExists(uint256 proposalId) {
    require(Validator.addressChecker(proposals[proposalId].proposer), "Proposal dne");
    _;
  }

  // Check if proposal is not expired
  modifier proposalNotExpired(uint256 proposalId) {
    require(proposals[proposalId].expiry > block.timestamp, "Proposal is expired");
    _;
  }

  modifier proposalConfirmed(uint256 proposalId, address _owner) {
    require(
      proposalConfirmations[proposalId].confirmationsByOwner[_owner],
      "Proposal is not confirmed"
    );
    _;
  }

  modifier proposalNotConfirmed(uint256 proposalId, address _owner) {
    require(
      !proposalConfirmations[proposalId].confirmationsByOwner[_owner],
      "Proposal is already confirmed"
    );
    _;
  }

  modifier proposalNotExecuted(uint256 proposalId) {
    require(!proposals[proposalId].executed, "Proposal is executed");
    _;
  }

  modifier proposalApprovalsThresholdMet(uint256 proposalId) {
    require(
      proposalConfirmations[proposalId].count >= approvalsRequired,
      "Not enough confirmations to execute"
    );
    _;
  }

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
  ) public override initializer {
    require(Validator.addressChecker(_accountsContract), "Invalid Accounts contract");
    require(Validator.addressChecker(_seedAsset), "Invalid seed asset");
    require(
      _seedSplitToLiquid >= 0 && _seedSplitToLiquid <= 100,
      "Seed split to liquid must be between 0 & 100"
    );
    // set Applications Multisig storage items
    proposalCount = 1;
    config.accountsContract = _accountsContract;
    config.seedSplitToLiquid = _seedSplitToLiquid;
    config.gasAmount = _gasAmount;
    config.seedAsset = _seedAsset;
    config.seedAmount = _seedAmount;
    super.initialize(owners, _approvalsRequired, _requireExecution, _transactionExpiry);
  }

  /**
   * @notice propose a charity to be opened on Accounts
   * @dev propose a charity to be opened on Accounts
   * @param _application.Charity application
   * @param _metadata Metadata
   */
  function proposeApplication(
    AccountMessages.CreateEndowmentRequest memory _application,
    bytes memory _metadata
  ) public override {
    require(proposals[proposalCount].proposer == address(0), "Proposal already exists");
    require(
      _application.endowType == LibAccounts.EndowmentType.Charity,
      "Only Charity endowments can be proposed"
    );
    require(_application.sdgs.length > 0, "No UN SDGs given");

    // check all sdgs id
    for (uint256 i = 0; i < _application.sdgs.length; i++) {
      if (
        _application.sdgs[i] > LibAccounts.MAX_SDGS_NUM ||
        _application.sdgs[i] < LibAccounts.MIN_SDGS_NUM
      ) {
        revert("Invalid UN SDG inputs given");
      }
    }

    uint256 expiry = block.timestamp + transactionExpiry;

    // Maturity always set to zero (None) for all Charity Endowments
    _application.maturityTime = 0;
    // save new proposal
    proposals[proposalCount] = ApplicationsStorage.ApplicationProposal({
      proposer: msg.sender,
      application: _application,
      metadata: _metadata,
      expiry: expiry,
      executed: false
    });

    emit ApplicationProposed(proposalCount, msg.sender, _application.name, expiry, _metadata);

    if (isOwner[msg.sender]) {
      confirmProposal(proposalCount);
    }

    proposalCount++;
  }

  /// @dev Allows an owner to confirm a proposal.
  /// @param proposalId Proposal ID.
  function confirmProposal(
    uint256 proposalId
  )
    public
    override
    ownerExists(msg.sender)
    proposalExists(proposalId)
    proposalNotConfirmed(proposalId, msg.sender)
    proposalNotExpired(proposalId)
    proposalNotExecuted(proposalId)
  {
    proposalConfirmations[proposalId].confirmationsByOwner[msg.sender] = true;
    proposalConfirmations[proposalId].count += 1;
    emit ApplicationConfirmed(proposalId, msg.sender);
    // if execution is required, do not auto-execute
    if (!requireExecution) {
      executeProposal(proposalId);
    }
  }

  /// @dev Allows an owner to revoke a confirmation for a proposal.
  /// @param proposalId Proposal ID.
  function revokeProposalConfirmation(
    uint256 proposalId
  )
    public
    override
    ownerExists(msg.sender)
    proposalExists(proposalId)
    proposalConfirmed(proposalId, msg.sender)
    proposalNotExpired(proposalId)
    proposalNotExecuted(proposalId)
  {
    proposalConfirmations[proposalId].confirmationsByOwner[msg.sender] = false;
    proposalConfirmations[proposalId].count -= 1;
    emit ApplicationConfirmationRevoked(proposalId, msg.sender);
  }

  /**
   * @notice function called by Applications Review Team to execute an approved charity application
   * @dev function called by Applications Review Team to execute an approved charity application
   * @param proposalId id of the proposal to be executed
   */
  function executeProposal(
    uint256 proposalId
  )
    public
    override
    ownerExists(msg.sender)
    proposalExists(proposalId)
    proposalApprovalsThresholdMet(proposalId)
    proposalNotExecuted(proposalId)
    proposalNotExpired(proposalId)
    nonReentrant
    returns (uint32)
  {
    // create the new endowment with proposal's applicaiton
    uint32 endowmentId = IAccountsCreateEndowment(config.accountsContract).createEndowment(
      proposals[proposalId].application
    );

    if (config.gasAmount > 0) {
      // get the first member of the new endowment
      address payable signer = payable(proposals[proposalId].application.members[0]);
      require(Validator.addressChecker(signer), "Endowment Member not set");

      // check matic balance on this contract
      if (address(this).balance >= config.gasAmount) {
        // transfer matic to them and emit gas fee payment event
        (bool success, ) = signer.call{value: config.gasAmount}("");
        require(success, "Failed gas payment");
        emit GasSent(endowmentId, signer, config.gasAmount);
      }
    }

    if (config.seedAmount > 0) {
      // check seed asset balance
      if (IERC20(config.seedAsset).balanceOf(address(this)) >= config.seedAmount) {
        // call deposit on Accounts for the new Endowment ID
        require(
          IERC20(config.seedAsset).approve(config.accountsContract, config.seedAmount),
          "Approve failed"
        );

        IAccountsDepositWithdrawEndowments(config.accountsContract).depositERC20(
          AccountMessages.DepositRequest({
            id: endowmentId,
            lockedPercentage: 100 - config.seedSplitToLiquid,
            liquidPercentage: config.seedSplitToLiquid,
            donationMatch: address(this)
          }),
          config.seedAsset,
          config.seedAmount
        );
        // emit seed asset event
        emit SeedAssetSent(endowmentId, config.seedAsset, config.seedAmount);
      }
    }
    // mark the proposal as executed
    proposals[proposalId].executed = true;
    emit ApplicationExecuted(proposalId);

    return endowmentId;
  }

  //update config function which updates config if the supplied input parameter is not null or 0
  /**
   * @notice update config function which updates config if the supplied input parameter is not null or 0
   * @dev update config function which updates config if the supplied input parameter is not null or 0
   * @param _transactionExpiry expiry time for proposals
   * @param accountsContract address of accounts contract
   * @param seedSplitToLiquid percentage of seed asset to be sent to liquid
   * @param gasAmount amount of gas to be sent
   * @param seedAsset address of seed asset
   * @param seedAmount amount of seed asset to be sent
   */
  function updateConfig(
    uint256 _transactionExpiry,
    address accountsContract,
    uint256 seedSplitToLiquid,
    uint256 gasAmount,
    address seedAsset,
    uint256 seedAmount
  ) public override ownerExists(msg.sender) {
    require(Validator.addressChecker(seedAsset), "Seed Asset is not a valid address");
    require(Validator.addressChecker(accountsContract), "Accounts Contract is not a valid address");
    require(
      seedSplitToLiquid >= 0 && seedSplitToLiquid <= 100,
      "Seed split to liquid must be between 0 & 100"
    );
    transactionExpiry = _transactionExpiry;
    config.accountsContract = accountsContract;
    config.seedSplitToLiquid = seedSplitToLiquid;
    config.gasAmount = gasAmount;
    config.seedAsset = seedAsset;
    config.seedAmount = seedAmount;
  }

  function queryConfig() public view override returns (ApplicationsStorage.Config memory) {
    return config;
  }

  /// @dev Returns status of owner confirmation of a given proposal.
  /// @param proposalId Proposal ID.
  /// @param ownerAddr Owner's Address.
  /// @return bool
  function getProposalConfirmationStatus(
    uint256 proposalId,
    address ownerAddr
  ) public view override proposalExists(proposalId) returns (bool) {
    return proposalConfirmations[proposalId].confirmationsByOwner[ownerAddr];
  }

  /// @dev Returns number of confirmations of a proposal.
  /// @param proposalId Proposal ID.
  /// @return uint256
  function getProposalConfirmationCount(
    uint256 proposalId
  ) public view override proposalExists(proposalId) returns (uint256) {
    return proposalConfirmations[proposalId].count;
  }
}
