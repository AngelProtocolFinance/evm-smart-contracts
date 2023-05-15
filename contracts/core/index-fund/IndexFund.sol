// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import "./storage.sol";
import {AngelCoreStruct} from "../struct.sol";
import {Array} from "../../lib/array.sol";
import {IRegistrar} from "../registrar/interface/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IndexFundMessage} from "./message.sol";
import {AccountMessages} from "../accounts/message.sol";
import {Validator} from "../registrar/lib/validator.sol";
import {AddressArray} from "../../lib/address/array.sol";
import {Array} from "../../lib/array.sol";
import {Validator} from "../registrar/lib/validator.sol";
import {Utils} from "../../lib/utils.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

// TODO: Edit Query functions with start and limit to optimise the size of data being returned

/**
 * @title IndexFund
 * @notice User can deposit/donate to a collection of endowments (index funds) through this contract
 * @dev IndexFund is a contract that manages the funds of the angelcore platform
 * It is responsible for creating new funds, adding members to funds, and
 * distributing funds to members
 */
contract IndexFund is StorageIndexFund, ReentrancyGuard, Initializable {
    event OwnerUpdated(address newOwner);
    event RegistrarUpdated(address newRegistrar);
    event ConfigUpdated(IndexFundStorage.Config config);
    event AllianceMemberAdded(address member);
    event AllianceMemberRemoved(address member);
    event IndexFundCreated(uint256 id, AngelCoreStruct.IndexFund fund);
    event IndexFundRemoved(uint256 id);
    event MemberRemoved(uint256 fundId, uint256 memberId);
    event MemberAdded(uint256 fundId, uint256 memberId);
    event DonationMessagesUpdated(IndexFundStorage.DonationMessages messages);
    event UpdateActiveFund(uint256 fundId);
    event UpdateIndexFundState(IndexFundStorage._State state);
    uint256 maxLimit;
    uint256 defaultLimit;

    using SafeMath for uint256;

    /**
     * @notice Initializer function for index fund contract, to be called when proxy is deployed
     * @dev This function is called by deployer only once at the time of initialization
     * @param curDetails IndexFundMessage.InstantiateMessage
     */
    function initIndexFund(
        IndexFundMessage.InstantiateMessage memory curDetails
    ) public initializer {
        require(
            curDetails.registrarContract != address(0),
            "invalid registrar address"
        );

        maxLimit = 30;
        defaultLimit = 10;

        require(!state.initIndexFund, "AlreadyInitilized");
        state.initIndexFund = true;

        state.config = IndexFundStorage.Config({
            owner: msg.sender,
            registrarContract: curDetails.registrarContract,
            fundRotation: curDetails.fundRotation,
            fundMemberLimit: curDetails.fundMemberLimit,
            fundingGoal: curDetails.fundingGoal,
            alliance_members: new address[](0)
        });
        emit ConfigUpdated(state.config);

        state.state = IndexFundStorage._State({
            totalFunds: 0,
            activeFund: 0,
            nextFundId: 1,
            round_donations: 0,
            nextRotationBlock: block.number + state.config.fundRotation
        });
        emit UpdateIndexFundState(state.state);
    }

    /**
     * @notice function to update ownder of the contract
     * @dev can be called by current owner to set new owner
     * @param newOwner address of new owner
     */
    function updateOwner(address newOwner) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        require(newOwner != address(0), "invalid input address");

        state.config.owner = newOwner;
        emit OwnerUpdated(newOwner);
        return true;
    }

    /**
     * @notice function to update registrar contract address
     * @dev can be called by current owner to set new registrar contract address
     * @param newRegistrar address of new registrar contract
     */
    function updateRegistrar(
        address newRegistrar
    ) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        require(newRegistrar != address(0), "invalid input address");

        state.config.registrarContract = newRegistrar;
        emit RegistrarUpdated(newRegistrar);
        return true;
    }

    /**
     * @notice function to update config of index fund
     * @dev can be called by current owner to set new config
     * @param curDetails IndexFundMessage.UpdateConfigMessage
     */
    function updateConfig(
        IndexFundMessage.UpdateConfigMessage memory curDetails
    ) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        if (curDetails.fundingGoal != 0) {
            if (curDetails.fundingGoal < state.state.round_donations) {
                revert("Invalid Inputs");
            }
            state.config.fundingGoal = curDetails.fundingGoal;
        } else {
            state.config.fundingGoal = 0;
        }

        state.config.fundRotation = curDetails.fundRotation;
        state.config.fundMemberLimit = curDetails.fundMemberLimit;
        emit ConfigUpdated(state.config);
        return true;
    }

    /**
     * @notice function to update alliance member list
     * @dev can be called by current owner to add/remove members from alliance member list
     * @param addr address of member to be added/removed
     * @param action string to indicate add/remove
     */
    function updateAllianceMemberList(
        address addr,
        string memory action
    ) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        if (!Validator.addressChecker(addr)) {
            revert("Invalid Address");
        }

        if (Validator.compareStrings(action, "add")) {
            uint256 curNone;
            bool indexFound;
            (curNone, indexFound) = AddressArray.indexOf(
                state.config.alliance_members,
                addr
            );
            if (!indexFound) {
                state.config.alliance_members.push(addr);
                emit AllianceMemberAdded(addr);
            }
        } else if (Validator.compareStrings(action, "remove")) {
            uint256 delIndex;
            bool indexFound;
            (delIndex, indexFound) = AddressArray.indexOf(
                state.config.alliance_members,
                addr
            );

            if (indexFound) {
                state.config.alliance_members = AddressArray.remove(
                    state.config.alliance_members,
                    delIndex
                );
                emit AllianceMemberRemoved(addr);
            }
        } else {
            revert("Invalid Action");
        }
        return true;
    }

    /**
     * @notice function to create index fund
     * @dev can be called by current owner to create index fund
     * @param name name of index fund
     * @param description description of index fund
     * @param members array of members of index fund
     * @param rotatingFund boolean to indicate if index fund is rotating fund
     * @param splitToLiquid split of index fund to liquid fund
     * @param expiryTime expiry time of index fund
     * @param expiryHeight expiry height of index fund
     */
    function createIndexFund(
        string memory name,
        string memory description,
        uint256[] memory members,
        bool rotatingFund,
        uint256 splitToLiquid,
        uint256 expiryTime,
        uint256 expiryHeight
    ) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        require(splitToLiquid <= 100, "invalid split");

        state.FUND[state.state.nextFundId] = AngelCoreStruct.IndexFund({
            id: state.state.nextFundId,
            name: name,
            description: description,
            members: members,
            rotatingFund: rotatingFund,
            splitToLiquid: splitToLiquid,
            expiryTime: expiryTime,
            expiryHeight: expiryHeight
        });

        emit IndexFundCreated(
            state.state.nextFundId,
            state.FUND[state.state.nextFundId]
        );

        if (state.FUND_LIST.length == 0) {
            state.state.activeFund = state.state.nextFundId;
            emit UpdateActiveFund(state.state.activeFund);
        }

        state.FUND_LIST.push(state.state.nextFundId);

        state.state.totalFunds += 1;
        state.state.nextFundId += 1;

        return true;
    }

    /**
     * @notice function to remove index fund
     * @dev can be called by current owner to remove an index fund
     * @param fundId id of index fund to be removed
     */
    function removeIndexFund(
        uint256 fundId
    ) public nonReentrant returns (bool) {
        if (msg.sender != state.config.owner) {
            revert("Unauthorized");
        }

        if (state.state.activeFund == fundId) {
            state.state.activeFund = rotateFund(
                fundId,
                block.number,
                block.timestamp
            );
            emit UpdateActiveFund(state.state.activeFund);
        }
        state.state.totalFunds -= 1;

        uint256 index = state.FUND_LIST.length + 1;

        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            if (state.FUND[state.FUND_LIST[i]].id == fundId) {
                index = i;
            }
        }

        require(index != state.FUND_LIST.length + 1, "Invalid fundId");

        state.FUND_LIST = Array.remove(state.FUND_LIST, index);
        delete state.FUND[fundId];

        emit IndexFundRemoved(fundId);
        return true;
    }

    /**
     *  @notice function to remove member from all the index funds
     *  @dev can be called by current owner to remove a member from all the index funds
     *  @param member member to be removed from index fund
     */
    function removeMember(uint256 member) public nonReentrant returns (bool) {
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            address(0) != registrar_config.accountsContract,
            "accounts contract not configured"
        );

        // TODO: added owner for testing
        require(
            msg.sender == registrar_config.accountsContract ||
                msg.sender == state.config.owner,
            "Unauthorized"
        );

        // check all funds and remove member if found

        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            bool found;
            uint256 index;
            (index, found) = Array.indexOf(
                state.FUND[state.FUND_LIST[i]].members,
                member
            );
            if (found) {
                Array.remove(state.FUND[state.FUND_LIST[i]].members, index);
                emit MemberRemoved(i, member);
            }
        }
        return true;
    }

    /**
     *  @notice function to update fund members
     *  @dev can be called by current owner to add/remove member to an index fund
     *  @param fundId id of index fund to be updated
     *  @param add array of members to be added to index fund
     *  @param remove array of members to be removed from index fund
     */
    function updateFundMembers(
        uint256 fundId,
        uint256[] memory add,
        uint256[] memory remove
    ) public nonReentrant returns (bool) {
        bool found;
        uint256 index;
        require(msg.sender == state.config.owner, "Unauthorized");

        if (fundIsExpired(state.FUND[fundId], block.number, block.timestamp)) {
            revert("Index Fund Expired");
        }

        // add members
        for (uint256 i = 0; i < add.length; i++) {
            (index, found) = Array.indexOf(state.FUND[fundId].members, add[i]);
            if (!found) {
                state.FUND[fundId].members.push(add[i]);
                emit MemberAdded(fundId, add[i]);
            }
        }

        // remove members
        for (uint256 i = 0; i < remove.length; i++) {
            (index, found) = Array.indexOf(
                state.FUND[fundId].members,
                remove[i]
            );
            if (found) {
                Array.remove(state.FUND[fundId].members, index);
            }
            emit MemberRemoved(fundId, remove[i]);
        }

        require(
            state.FUND[fundId].members.length < state.config.fundMemberLimit,
            "Fund member limit exceeded"
        );
        return true;
    }

    /**
     * @notice deposit function which can be called by user to add funds to index fund
     * @dev converted from rust implementation, handles donations by managing limits and rotating active fund
     * @param curDetails deposit details
     * @param fund fund to deposit to
     */
    function depositERC20(
        address senderAddr,
        IndexFundMessage.DepositMsg memory curDetails,
        AngelCoreStruct.AssetBase memory fund
    ) public nonReentrant returns (bool) {
        if (fund.info != AngelCoreStruct.AssetInfoBase.Cw20) {
            revert("Invalid asset type");
        }

        // validate fund
        validateDepositFund(fund);

        // check each of the currently allowed Alliance member addr
        bool isAllianceMem = false;
        uint256 depositAmount = fund.amount;

        for (uint256 i = 0; i < state.config.alliance_members.length; i++) {
            if (senderAddr == state.config.alliance_members[i]) {
                isAllianceMem = true;
                break;
            }
        }

        // check if block height limit is reached
        if (state.config.fundRotation != 0) {
            if (block.number >= state.state.nextRotationBlock) {
                uint256 newFundId = rotateFund(
                    state.state.activeFund,
                    block.number,
                    block.timestamp
                );
                state.state.activeFund = newFundId;
                emit UpdateActiveFund(state.state.activeFund);
                state.state.round_donations = 0;

                while (block.number >= state.state.nextRotationBlock) {
                    state.state.nextRotationBlock += state.config.fundRotation;
                }
            }
        }

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        if (curDetails.fundId != 0) {
            require(
                state.FUND[curDetails.fundId].members.length != 0,
                "Empty Fund"
            );

            require(
                !fundIsExpired(
                    state.FUND[curDetails.fundId],
                    block.number,
                    block.timestamp
                ),
                "Expired Fund"
            );

            uint256 split = calculateSplit(
                isAllianceMem,
                registrar_config.splitToLiquid,
                state.FUND[curDetails.fundId].splitToLiquid,
                curDetails.split
            );

            updateDonationMessages(
                state.FUND[curDetails.fundId].members,
                split,
                fund.amount,
                state.donationMessages
            );
        } else {
            if (state.config.fundingGoal != 0) {
                uint256 loopDonation = 0;

                while (depositAmount > 0) {
                    // This will revert the transaction and donation will fail. TODO: check with team
                    require(
                        state.FUND[state.state.activeFund].members.length != 0,
                        "Empty Index Fund"
                    );

                    require(
                        !fundIsExpired(
                            state.FUND[state.state.activeFund],
                            block.number,
                            block.timestamp
                        ),
                        "Expired Fund"
                    );
                    uint256 goalLeftover = state.config.fundingGoal -
                        state.state.round_donations;

                    uint256 curActiveFund = state.state.activeFund;


                    if (depositAmount >= goalLeftover) {
                        state.state.round_donations = 0;
                        // set state active fund to next fund for next loop iteration

                        state.state.activeFund = rotateFund(
                            state.state.activeFund,
                            block.number,
                            block.timestamp
                        );

                        emit UpdateActiveFund(state.state.activeFund);
                        loopDonation = goalLeftover;
                    } else {
                        state.state.round_donations += depositAmount;
                        loopDonation = depositAmount;
                    }

                    uint256 split = calculateSplit(
                        isAllianceMem,
                        registrar_config.splitToLiquid,
                        state.FUND[curActiveFund].splitToLiquid,
                        curDetails.split
                    );

                    updateDonationMessages(
                        state.FUND[curActiveFund].members,
                        split,
                        loopDonation,
                        state.donationMessages
                    );
                    // deduct donated amount in this round from total donation amt
                    depositAmount -= loopDonation;
                }
            } else {
                require(
                    state.FUND[state.state.activeFund].members.length != 0,
                    "Empty Index Fund"
                );

                require(
                    !fundIsExpired(
                        state.FUND[state.state.activeFund],
                        block.number,
                        block.timestamp
                    ),
                    "Expired Fund"
                );

                uint256 split = calculateSplit(
                    isAllianceMem,
                    registrar_config.splitToLiquid,
                    state.FUND[state.state.activeFund].splitToLiquid,
                    curDetails.split
                );

                updateDonationMessages(
                    state.FUND[state.state.activeFund].members,
                    split,
                    fund.amount,
                    state.donationMessages
                );
            }
        }

        // transfer funds from msg sender to here
        require(
            IERC20(fund.addr).transferFrom(
                senderAddr,
                address(this),
                fund.amount
            ),
            "Failed to transfer funds"
        );

        // give allowance to accounts
        require(
            IERC20(fund.addr).approve(
                registrar_config.accountsContract,
                fund.amount
            ),
            "Failed to approve funds"
        );

        (
            address[] memory target,
            uint256[] memory value,
            bytes[] memory callData
        ) = buildDonationMessages(
                registrar_config.accountsContract,
                state.donationMessages,
                fund.addr
            );

        Utils._execute(target, value, callData);

        // Clean up storage for next call
        delete state.donationMessages.member_ids;
        delete state.donationMessages.locked_donation_amount;
        delete state.donationMessages.liquid_donation_amount;
        delete state.donationMessages.lockedSplit;
        delete state.donationMessages.liquidSplit;

        emit UpdateIndexFundState(state.state);
        return true;
    }

    /**
     * @dev Update donation messages
     * @param members Array of members
     * @param split Split to liquid
     * @param balance Balance of fund
     * @param curDonationMessages Donation messages
     */
    function updateDonationMessages(
        uint256[] memory members,
        uint256 split,
        uint256 balance,
        IndexFundStorage.DonationMessages storage curDonationMessages
    ) internal {
        uint256 memberPortion = balance;

        if (members.length > 0) {
            memberPortion = memberPortion.div(members.length);
        }

        uint256 lockSplit = 100 - split;

        for (uint256 i = 0; i < members.length; i++) {
            // check if member is in membersidsm, then modify, else push
            bool alreadyExists = false;
            uint256 index = 0;

            for (
                uint256 j = 0;
                j < curDonationMessages.member_ids.length;
                j++
            ) {
                if (curDonationMessages.member_ids[j] == members[i]) {
                    alreadyExists = true;
                    index = j;
                    break;
                }
            }

            if (alreadyExists) {
                curDonationMessages.lockedSplit[index] = lockSplit;
                curDonationMessages.liquidSplit[index] = split;
                curDonationMessages.locked_donation_amount[index] +=
                    (memberPortion * lockSplit) /
                    100;
                // avoid any over and under flows
                curDonationMessages.liquid_donation_amount[index] += (
                    (memberPortion - ((memberPortion * lockSplit) / 100))
                );
            } else {
                curDonationMessages.member_ids.push(members[i]);
                curDonationMessages.lockedSplit.push(lockSplit);
                curDonationMessages.liquidSplit.push(split);
                curDonationMessages.locked_donation_amount.push(
                    (memberPortion * lockSplit) / 100
                );
                // avoid any over and under flows
                curDonationMessages.liquid_donation_amount.push(
                    (memberPortion - ((memberPortion * lockSplit) / 100))
                );
            }
        }
        emit DonationMessagesUpdated(curDonationMessages);
    }

    /**
     * @dev Build donation messages
     * @param curAccountscontract Accounts contract address
     * @param curDonationMessages Donation messages
     * @param curTokenaddress Token address
     */
    function buildDonationMessages(
        address curAccountscontract,
        IndexFundStorage.DonationMessages storage curDonationMessages,
        address curTokenaddress
    )
        internal
        view
        returns (
            address[] memory target,
            uint256[] memory value,
            bytes[] memory callData
        )
    {
        target = new address[](curDonationMessages.member_ids.length);
        value = new uint256[](curDonationMessages.member_ids.length);
        callData = new bytes[](curDonationMessages.member_ids.length);
        // TODO: check with andrey for the split logic in index fund
        for (uint256 i = 0; i < curDonationMessages.member_ids.length; i++) {
            target[i] = curAccountscontract;
            value[i] = 0;
            callData[i] = abi.encodeWithSignature(
                "depositERC20((uint256,uint256,uint256),address,uint256)",
                AccountMessages.DepositRequest({
                    id: curDonationMessages.member_ids[i],
                    lockedPercentage: curDonationMessages.lockedSplit[i],
                    liquidPercentage: curDonationMessages.liquidSplit[i]
                }),
                curTokenaddress,
                curDonationMessages.locked_donation_amount[i] +
                    curDonationMessages.liquid_donation_amount[i]
            );
        }
    }

    /**
     * @dev Calculate split
     * @param tca True if this is a split for a TCA (Terra charity alliance)
     * @param registrar_split Registrar split
     * @param fundSplit Fund split (set on index fund contract)
     * @param userSplit User split
     */

    function calculateSplit(
        bool tca,
        AngelCoreStruct.SplitDetails memory registrar_split,
        uint256 fundSplit,
        uint256 userSplit
    ) internal pure returns (uint256) {
        uint256 split = 0;

        if (fundSplit == 0) {
            if (!tca) {
                if (userSplit == 0) {
                    split = registrar_split.defaultSplit;
                } else {
                    if (
                        userSplit > registrar_split.min &&
                        userSplit < registrar_split.max
                    ) {
                        split = userSplit;
                    }
                }
            }
        } else {
            split = fundSplit;
        }

        return split;
    }

    // QUERIES

    /**
     * @dev Query config
     * @return Config
     */
    function queryConfig()
        public
        view
        returns (
            // TODO: Add reentrancy guard to `view` functions
            IndexFundStorage.Config memory
        )
    {
        return state.config;
    }

    /**
     * @dev Query state
     * @return State
     */
    function queryState()
        public
        view
        returns (IndexFundMessage.StateResponseMessage memory)
    {
        return
            IndexFundMessage.StateResponseMessage({
                totalFunds: state.state.totalFunds,
                activeFund: state.state.activeFund,
                round_donations: state.state.round_donations,
                nextRotationBlock: state.state.nextRotationBlock
            });
    }

    /**
     * @dev Query fund list
     * @param startAfter Start after (Index after which to start getting values)
     * @param limit Limit (total number of values to return)
     * @return Fund details
     */
    function queryFundsList(
        uint256 startAfter,
        uint256 limit
    ) public view returns (AngelCoreStruct.IndexFund[] memory) {
        if (limit == 0) {
            limit = defaultLimit;
        }

        if (limit > maxLimit) {
            limit = maxLimit;
        }

        AngelCoreStruct.IndexFund[]
            memory resp = new AngelCoreStruct.IndexFund[](limit);

        for (uint256 i = 0; i < limit; i++) {
            if (i + startAfter >= state.FUND_LIST.length) {
                break;
            }
            resp[i] = state.FUND[state.FUND_LIST[i + startAfter]];
        }

        return resp;
    }

    /**
     * @dev Query fund details
     * @param fundId Fund id
     * @return Fund details
     */
    function queryFundDetails(
        uint256 fundId
    ) public view returns (AngelCoreStruct.IndexFund memory) {
        return state.FUND[fundId];
    }

    /**
     * @dev Query in which index funds is an endowment part of
     * @param endowmentId Endowment id
     * @return Fund details
     */
    function queryInvolvedFunds(
        uint256 endowmentId
    ) public view returns (AngelCoreStruct.IndexFund[] memory) {
        uint256 counter = 0;
        // check how many
        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            bool found;
            uint256 index;
            (index, found) = Array.indexOf(
                state.FUND[state.FUND_LIST[i]].members,
                endowmentId
            );
            if (found) {
                counter++;
            }
        }
        // make memory and allocate to response object

        AngelCoreStruct.IndexFund[]
            memory resp = new AngelCoreStruct.IndexFund[](counter);

        uint256 indexer = 0;

        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            bool found;
            uint256 index;
            (index, found) = Array.indexOf(
                state.FUND[state.FUND_LIST[i]].members,
                endowmentId
            );
            if (found) {
                resp[indexer] = state.FUND[state.FUND_LIST[i]];
                indexer++;
            }
        }

        return resp;
    }

    /**
     * @dev Query active fund details
     * @return Fund details
     */
    function queryActiveFundDetails()
        public
        view
        returns (AngelCoreStruct.IndexFund memory)
    {
        return state.FUND[state.state.activeFund];
    }

    // function queryAllianceMember(address wallet)
    //     public
    //     view
    //     returns (IndexFundMessage.AllianceMemberResponse memory)
    // {
    //     return
    //         IndexFundMessage.AllianceMemberResponse({
    //             wallet: wallet,
    //             name: state.config.alliance_members[wallet].name,
    //             logo: state.config.alliance_members[wallet].logo,
    //             website: state.config.alliance_members[wallet].website
    //         });
    // }

    /**
     * @dev Query alliance members
     * @param startAfter Start after (Index after which to start getting values)
     * @param limit Limit (total number of values to return)
     * @return Alliance members
     */
    function queryAllianceMembers(
        uint256 startAfter,
        uint256 limit
    ) public view returns (address[] memory) {
        if (limit == 0) {
            limit = defaultLimit;
        }

        if (limit > maxLimit) {
            limit = maxLimit;
        }

        address[] memory resp = new address[](limit);

        for (uint256 i = 0; i < limit; i++) {
            if (i + startAfter >= state.config.alliance_members.length) {
                break;
            }

            resp[i] = state.config.alliance_members[i + startAfter];
        }

        return resp;
    }

    // Internal functions
    /**
     * @dev Check if fund is expired
     * @param fund Fund
     * @param envHeight Current block height
     * @param envTime Current block time
     * @return True if fund is expired
     */
    function fundIsExpired(
        AngelCoreStruct.IndexFund memory fund,
        uint256 envHeight,
        uint256 envTime
    ) internal pure returns (bool) {
        if (
            (fund.expiryHeight != 0 && envHeight >= fund.expiryHeight) ||
            (fund.expiryTime != 0 && envTime >= fund.expiryTime)
        ) {
            return true;
        }
        return false;
    }

    /**
     * @dev rotate active based if investment goal is fulfillef
     * @param currFund Current Active fund
     * @param envHeight Current block height
     * @param envTime Current block time
     * @return New active fund
     */
    function rotateFund(
        uint256 currFund,
        uint256 envHeight,
        uint256 envTime
    ) internal view returns (uint256) {
        uint256 activeFundCount = 0;

        // TODO: can be optimised by storing indexes of active funds in a memory array

        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            if (
                !fundIsExpired(
                    state.FUND[state.FUND_LIST[i]],
                    envHeight,
                    envTime
                ) && state.FUND[state.FUND_LIST[i]].rotatingFund == true
            ) {
                activeFundCount++;
            }
        }

        uint256 indexer = 0;

        AngelCoreStruct.IndexFund[]
            memory activeFunds = new AngelCoreStruct.IndexFund[](
                activeFundCount
            );

        for (uint256 i = 0; i < state.FUND_LIST.length; i++) {
            if (
                !fundIsExpired(
                    state.FUND[state.FUND_LIST[i]],
                    envHeight,
                    envTime
                ) && state.FUND[state.FUND_LIST[i]].rotatingFund == true
            ) {
                activeFunds[indexer] = state.FUND[state.FUND_LIST[i]];
                indexer++;
            }
        }

        // default value outside of index range
        uint256 currFundIndex = activeFunds.length + 1;

        for (uint256 i = 0; i < activeFunds.length; i++) {
            if (activeFunds[i].id == currFund) {
                currFundIndex = i;
            }
        }

        if (currFundIndex < state.FUND_LIST.length) {
            if (currFundIndex == activeFunds.length - 1) {
                return activeFunds[0].id;
            } else {
                return activeFunds[currFundIndex + 1].id;
            }
        } else {
            AngelCoreStruct.IndexFund memory filter_fund;
            for (uint256 i = 0; i < activeFunds.length; i++) {
                if (activeFunds[i].id > currFund) {
                    filter_fund = activeFunds[i];
                    break;
                }
            }

            if (filter_fund.id != 0) {
                return filter_fund.id;
            } else {
                return activeFunds[0].id;
            }
        }
    }

    /**
     * @dev Validate deposit fund (by querying registrar contract)
     * @param fund Fund
     * @return True if fund is valid
     */
    function validateDepositFund(
        AngelCoreStruct.AssetBase memory fund
    ) internal view returns (bool) {
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        if (fund.info == AngelCoreStruct.AssetInfoBase.Cw20) {
            require(IRegistrar(state.config.registrarContract)
                .isTokenAccepted(fund.addr), 
                "Not accepted token");
        } else {
            revert();
        }

        require(fund.amount != 0, "invalid fund amount");

        return true;
    }
}
