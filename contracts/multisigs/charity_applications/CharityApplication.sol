// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./storage.sol";
import {ICharityApplication} from "./interfaces/ICharityApplication.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {IAccountsCreateEndowment} from "../../core/accounts/interfaces/IAccountsCreateEndowment.sol";
import {IAccountsQueryEndowments} from "../../core/accounts/interfaces/IAccountsQueryEndowments.sol";
import {IAccountsDepositWithdrawEndowments} from "../../core/accounts/interfaces/IAccountsDepositWithdrawEndowments.sol";
import {AccountStorage} from "../../core/accounts/storage.sol";
import {AccountMessages} from "../../core/accounts/message.sol";

/**
 * @title IMultiSig
 * @dev Interface for MultiSig contract
 */
interface IMultiSig {
  function getOwners() external view returns (address[] memory);
}

library CharityApplicationLib {
  function proposeCharity(
    AccountMessages.CreateEndowmentRequest memory charityApplication,
    string memory meta,
    uint256 proposalCounter,
    mapping(uint256 => CharityApplicationsStorage.CharityApplicationProposal) storage proposals,
    CharityApplicationsStorage.Config storage config
  ) public {
    require(proposals[proposalCounter].proposer == address(0), "Proposal already exists");
    require(charityApplication.endowType == AngelCoreStruct.EndowmentType.Charity, "Unauthorized");
    require(charityApplication.sdgs.length > 0, "No UN SDGs given");

    // check all sdgs id
    for (uint256 i = 0; i < charityApplication.sdgs.length; i++) {
      if (charityApplication.sdgs[i] > 17 || charityApplication.sdgs[i] == 0) {
        revert("Invalid UN SDG inputs given");
      }
    }

    // Maturity always set to zero (None) for all Charity Endowments
    charityApplication.maturityTime = 0;
    // save new proposal
    proposals[proposalCounter] = CharityApplicationsStorage.CharityApplicationProposal({
      proposalId: proposalCounter,
      proposer: msg.sender,
      charityApplication: charityApplication,
      meta: meta,
      expiry: block.timestamp + config.proposalExpiry,
      status: CharityApplicationsStorage.Status.Pending
    });
  }
}

/**
 * @title CharityApplication
 * @notice Contract for managing charity applications, sent by public to open a charity endowment on AP
 * @dev Charity Applications have to be approved by AP Team multisig
 * @dev Contract for managing charity applications
 */
contract CharityApplication is CharityStorage, ICharityApplication, ERC165, ReentrancyGuard {
  /*
   * Modifiers
   */
  modifier onlyApplicationsMultisig() {
    require(config.applicationMultisig == msg.sender, "Only Applications Team");
    _;
  }

  // Check if proposal is not expired
  modifier notExpired(uint256 proposalId) {
    require(proposals[proposalId].expiry > block.timestamp, "is expired");
    _;
  }

  // Check if proposal is pending
  modifier isPending(uint256 proposalId) {
    require(
      proposals[proposalId].status == CharityApplicationsStorage.Status.Pending,
      "not pending"
    );
    _;
  }

  // Check if proposal is approved
  modifier isApproved(uint256 proposalId) {
    require(
      proposals[proposalId].status == CharityApplicationsStorage.Status.Approved,
      "not approved"
    );
    _;
  }

  /// @dev Receive function allows to deposit ether.
  receive() external payable override {
    if (msg.value > 0) emit Deposit(msg.sender, msg.value);
  }

  /// @dev Fallback function allows to deposit ether.
  fallback() external payable override {
    if (msg.value > 0) emit Deposit(msg.sender, msg.value);
  }

  // seed asset will always be USDC
  bool initialized = false;

  /**
   * @notice Initialize the charity applications contract
   * where people can send applications to open a charity endowment on AP
   * @dev seed asset will always be USDC
   * @dev Initialize the contract
   * @param expiry Proposal expiry time in seconds
   * @param applicationmultisig AP Team multisig address
   * @param accountscontract Accounts contract address
   * @param seedsplittoliquid Seed split to liquid
   * @param newendowgasmoney New endow gas money
   * @param gasamount Gas amount
   * @param fundseedasset Fund seed asset
   * @param seedasset Seed asset
   * @param seedassetamount Seed asset amount
   */
  function initialize(
    uint256 expiry,
    address applicationmultisig,
    address accountscontract,
    uint256 seedsplittoliquid,
    bool newendowgasmoney,
    uint256 gasamount,
    bool fundseedasset,
    address seedasset,
    uint256 seedassetamount
  ) public {
    require(!initialized, "already initialized");
    initialized = true;
    proposalCounter = 1;
    config.applicationMultisig = applicationmultisig;
    config.accountsContract = accountscontract;
    config.seedSplitToLiquid = seedsplittoliquid;
    config.newEndowGasMoney = newendowgasmoney;
    config.gasAmount = gasamount;
    config.fundSeedAsset = fundseedasset;
    config.seedAsset = seedasset;
    config.seedAssetAmount = seedassetamount;
    if (expiry == 0)
      config.proposalExpiry = 4 * 24 * 60 * 60; // 4 days in seconds
    else config.proposalExpiry = expiry;

    emit InitilizedCharityApplication(config);
  }

  /**
   * @notice propose a charity to be opened on AP
   * @dev propose a charity to be opened on AP
   * @param charityApplication Charity application
   * @param meta Meta (URL of Metadata)
   */
  function proposeCharity(
    AccountMessages.CreateEndowmentRequest memory charityApplication,
    string memory meta
  ) public override nonReentrant {
    CharityApplicationLib.proposeCharity(
      charityApplication,
      meta,
      proposalCounter,
      proposals,
      config
    );
    proposalCounter++;
    emit CharityProposed(msg.sender, proposalCounter - 1, charityApplication, meta);
  }

  /**
   * @notice function called by AP Team to approve a charity application
   * @dev function called by AP Team to approve a charity application
   * @param proposalId id of the proposal to be approved
   */

  function approveCharity(
    uint256 proposalId
  )
    public
    override
    nonReentrant
    onlyApplicationsMultisig
    isPending(proposalId)
    notExpired(proposalId)
  {
    proposals[proposalId].status = CharityApplicationsStorage.Status.Approved;

    uint32 endowmentId = _executeCharity(proposalId);

    emit CharityApproved(proposalId, endowmentId);
  }

  /**
   * @notice function called by AP Team to reject a charity application
   * @dev function called by AP Team to reject a charity application
   * @param proposalId id of the proposal to be rejected
   */
  function rejectCharity(
    uint256 proposalId
  )
    public
    override
    nonReentrant
    onlyApplicationsMultisig
    isPending(proposalId)
    notExpired(proposalId)
  {
    proposals[proposalId].status = CharityApplicationsStorage.Status.Rejected;

    emit CharityRejected(proposalId);
  }

  // Internal function that executes create endowment request based on proposal data
  /**
   * @notice Internal function that executes create endowment request based on proposal data
   * @dev Internal function that executes create endowment request based on proposal data
   * @param proposalId id of the proposal to be executed
   */
  function _executeCharity(
    uint256 proposalId
  ) internal isApproved(proposalId) notExpired(proposalId) returns (uint32) {
    uint32 endowmentId = IAccountsCreateEndowment(config.accountsContract).createEndowment(
      proposals[proposalId].charityApplication
    );

    if (config.newEndowGasMoney) {
      //query endowments from accounts contract and get the owner address
      AccountStorage.Endowment memory endowDetails = IAccountsQueryEndowments(
        config.accountsContract
      ).queryEndowmentDetails(endowmentId);

      // TODO: Test this in remix
      // query owner multisig to find the first signer
      address payable signer = payable(IMultiSig(endowDetails.owner).getOwners()[0]);

      require(signer != address(0), "SignNotSet");

      // check ethereum balance on this contract
      uint256 balance = address(this).balance;

      if (balance > config.gasAmount) {
        // transfer ether to them and emit gas fee event
        (bool success, ) = signer.call{value: config.gasAmount}("FailedGas");

        if (!success) {
          revert("FailedGas");
        }
      } else {
        revert("FailedGas");
      }
      emit GasSent(endowmentId, signer, config.gasAmount);
    }

    if (config.fundSeedAsset) {
      // check seed asset balance
      uint256 bal = IERC20(config.seedAsset).balanceOf(address(this));

      if (bal > config.seedAssetAmount) {
        // call deposit on accounts

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
   * @param expiry expiry time for proposals
   * @param applicationmultisig address of AP Team multisig
   * @param accountscontract address of accounts contract
   * @param seedsplittoliquid percentage of seed asset to be sent to liquid
   * @param newendowgasmoney boolean to check if gas money is to be sent
   * @param gasamount amount of gas to be sent
   * @param fundseedasset boolean to check if seed asset is to be sent
   * @param seedasset address of seed asset
   * @param seedassetamount amount of seed asset to be sent
   */
  function updateConfig(
    uint256 expiry,
    address applicationmultisig,
    address accountscontract,
    uint256 seedsplittoliquid,
    bool newendowgasmoney,
    uint256 gasamount,
    bool fundseedasset,
    address seedasset,
    uint256 seedassetamount
  ) public override nonReentrant onlyApplicationsMultisig {
    if (expiry != 0) config.proposalExpiry = expiry;
    if (applicationmultisig != address(0)) config.applicationMultisig = applicationmultisig;
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

  function queryConfig() public view returns (CharityApplicationsStorage.Config memory) {
    return config;
  }
}
