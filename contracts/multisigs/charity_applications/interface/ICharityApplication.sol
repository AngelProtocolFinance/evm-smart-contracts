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

    event InitilizedCharityApplication(
        CharityApplicationsStorage.Config updatedConfig
    );

    event CharityProposed(
        address indexed proposer,
        uint256 indexed proposalId,
        AccountMessages.CreateEndowmentRequest charityApplication,
        string meta
    );

    event CharityApproved(
        uint256 indexed proposalId,
        uint256 indexed endowmentId
    );

    event CharityRejected(uint256 indexed proposalId);

    event Deposit(address indexed sender, uint256 value);

    // event emitted when gas is sent to endowments first member
    event GasSent(
        uint256 indexed endowmentId,
        address indexed member,
        uint256 amount
    );

    // event emitted when seed funding is given to endowment
    event SeedAssetSent(
        uint256 indexed endowmentId,
        address indexed asset,
        uint256 amount
    );

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
        uint256 curExpiry,
        address curApteammultisig,
        address curAccountscontract,
        uint256 curSeedsplittoliquid,
        bool curNewendowgasmoney,
        uint256 curGasamount,
        bool curFundseedasset,
        address curSeedasset,
        uint256 curSeedassetamount
    ) public virtual;
}
