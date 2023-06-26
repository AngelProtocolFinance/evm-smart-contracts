// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./CharityApplicationsStorage.sol";
import {ICharityApplications} from "./interfaces/ICharityApplications.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AngelCoreStruct} from "../core/struct.sol";
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
  
  // Check if proposal is not expired
  modifier proposalNotExpired(uint256 proposalId) {
    require(proposals[proposalId].expiry > block.timestamp, "Proposal is expired");
    _;
  }

  // Check if proposal is pending
  modifier proposalIsPending(uint256 proposalId) {
    require(
      proposals[proposalId].status == ApplicationsStorage.Status.Pending,
      "Proposal is not pending"
    );
    _;
  }

  // Check if proposal is approved
  modifier proposalIsApproved(uint256 proposalId) {
    require(
      proposals[proposalId].status == ApplicationsStorage.Status.Approved,
      "Proposal is not approved"
    );
    _;
  }

  // @dev overrides the generic multisig initializer and restricted function
  function initialize(address[] memory, uint256, bool, uint256) public override initializer {
    revert("Not Implemented");
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
  ) public override initializer {
    require(owners.length > 0, "Must pass at least one owner address");
    for (uint256 i = 0; i < owners.length; i++) {
      require(!isOwner[owners[i]] && owners[i] != address(0));
      isOwner[owners[i]] = true;
    }
    // set Generic Multisig storage variables
    approvalsRequired = _approvalsRequired;
    requireExecution = _requireExecution;
    transactionExpiry = _transactionExpiry;
    // set Applications Multisig storage items
    proposalCount = 1;
    config.accountsContract = _accountscontract;
    config.seedSplitToLiquid = _seedsplittoliquid;
    config.newEndowGasMoney = _newendowgasmoney;
    config.gasAmount = _gasamount;
    config.fundSeedAsset = _fundseedasset;
    config.seedAsset = _seedasset;
    config.seedAssetAmount = _seedassetamount;
  }

  /**
   * @notice propose a charity to be opened on Accounts
   * @dev propose a charity to be opened on Accounts
   * @param _application.Charity application
   * @param _meta Meta (URL of Metadata)
   */
  function proposeApplication(
    AccountMessages.CreateEndowmentRequest memory _application,
    string memory _meta
  ) public override {
    require(proposals[proposalCount].proposer == address(0), "Proposal already exists");
    require(_application.endowType == AngelCoreStruct.EndowmentType.Charity, "Unauthorized");
    require(_application.sdgs.length > 0, "No UN SDGs given");

    // check all sdgs id
    for (uint256 i = 0; i < _application.sdgs.length; i++) {
      if (_application.sdgs[i] > 17 || _application.sdgs[i] == 0) {
        revert("Invalid UN SDG inputs given");
      }
    }

    // Maturity always set to zero (None) for all Charity Endowments
    _application.maturityTime = 0;
    // save new proposal
    proposals[proposalCount] = ApplicationsStorage.ApplicationProposal({
      proposer: msg.sender,
      application: _application,
      meta: _meta,
      expiry: block.timestamp + transactionExpiry,
      status: ApplicationsStorage.Status.Pending
    });

    emit ApplicationProposed(msg.sender, proposalCount, _meta);
    proposalCount++;
  }

  /// @dev Allows an owner to confirm a proposal.
  /// @param proposalId Proposal ID.
  function confirmProposal(uint256 proposalId) public override ownerExists(msg.sender) proposalNotExpired(proposalId) {
    
  }

  /// @dev Allows an owner to revoke a confirmation for a proposal.
  /// @param proposalId Proposal ID.
  function revokeProposalConfirmation(uint256 proposalId) public override ownerExists(msg.sender) proposalNotExpired(proposalId) {

  }

  /**
   * @notice function called by AP Team to approve a charity application
   * @dev function called by AP Team to approve a charity application
   * @param proposalId id of the proposal to be approved
   */
  function executeProposal(
    uint256 proposalId
  )
    public override
    ownerExists(msg.sender)
    proposalIsApproved(proposalId)
    nonReentrant 
    returns (uint32) {
    uint32 endowmentId = IAccountsCreateEndowment(config.accountsContract).createEndowment(
      proposals[proposalId].application
    );

    if (config.newEndowGasMoney) {
      // get the first member of the new endowment
      address payable signer = payable(proposals[proposalId].application.members[0]);
      require(signer != address(0), "Endowment Member not set");

      // check ethereum balance on this contract
      if (address(this).balance >= config.gasAmount) {
        // transfer matic to them and emit gas fee payment event
        (bool success, ) = signer.call{value: config.gasAmount}("Failed gas payment");
        if (success) emit GasSent(endowmentId, signer, config.gasAmount);
      }
    }

    if (config.fundSeedAsset) {
      // check seed asset balance
      if (IERC20(config.seedAsset).balanceOf(address(this)) >= config.seedAssetAmount) {
        // call deposit on Accounts for the new Endowment ID 
        require(
          IERC20(config.seedAsset).approve(config.accountsContract, config.seedAssetAmount),
          "Approve failed"
        );

        IAccountsDepositWithdrawEndowments(config.accountsContract).depositERC20(
          AccountMessages.DepositRequest({
            id: endowmentId,
            lockedPercentage: 100 - config.seedSplitToLiquid,
            liquidPercentage: config.seedSplitToLiquid
          }),
          config.seedAsset,
          config.seedAssetAmount
        );
        // emit seed asset event
        emit SeedAssetSent(endowmentId, config.seedAsset, config.seedAssetAmount);
      }
    }
    return endowmentId;
  }

  //update config function which updates config if the supplied input parameter is not null or 0
  /**
   * @notice update config function which updates config if the supplied input parameter is not null or 0
   * @dev update config function which updates config if the supplied input parameter is not null or 0
   * @param _transactionExpiry expiry time for proposals
   * @param accountscontract address of accounts contract
   * @param seedsplittoliquid percentage of seed asset to be sent to liquid
   * @param newendowgasmoney boolean to check if gas money is to be sent
   * @param gasamount amount of gas to be sent
   * @param fundseedasset boolean to check if seed asset is to be sent
   * @param seedasset address of seed asset
   * @param seedassetamount amount of seed asset to be sent
   */
  function updateConfig(
    uint256 _transactionExpiry,
    address accountscontract,
    uint256 seedsplittoliquid,
    bool newendowgasmoney,
    uint256 gasamount,
    bool fundseedasset,
    address seedasset,
    uint256 seedassetamount
  ) public override ownerExists(msg.sender) {
    transactionExpiry = _transactionExpiry;
    if (accountscontract != address(0)) config.accountsContract = accountscontract;
    if (seedsplittoliquid != 0 && seedsplittoliquid <= 100)
      config.seedSplitToLiquid = seedsplittoliquid;
    if (newendowgasmoney || (newendowgasmoney == false && config.newEndowGasMoney == true))
      config.newEndowGasMoney = newendowgasmoney;
    if (gasamount != 0) config.gasAmount = gasamount;
    if (fundseedasset) config.fundSeedAsset = fundseedasset;
    if (seedasset != address(0)) config.seedAsset = seedasset;
    if (seedassetamount != 0) config.seedAssetAmount = seedassetamount;
  }

  function queryConfig() public view override returns (ApplicationsStorage.Config memory) {
    return config;
  }
}
