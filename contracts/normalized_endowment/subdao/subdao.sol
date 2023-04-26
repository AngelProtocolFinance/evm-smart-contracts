// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Array} from "../../lib/array.sol";
import {ProxyContract} from "./../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {SubDaoToken, SubDaoTokenMessage, subDaoTokenStorage} from "./../subdao-token/subdoa-token.sol";
import {QueryIIncentivisedVotingLockup} from "./../incentivised-voting/interface/QueryIIncentivisedVotingLockup.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ISubdaoEmitter} from "./ISubdaoEmitter.sol";
import "./Token/ERC20.sol";
import "./storage.sol";
import "hardhat/console.sol";

library SubDaoLib {
    uint256 constant MIN_TITLE_LENGTH = 4;
    uint256 constant MAX_TITLE_LENGTH = 64;
    uint256 constant MIN_DESC_LENGTH = 4;
    uint256 constant MAX_DESC_LENGTH = 1024;
    uint256 constant MIN_LINK_LENGTH = 12;
    uint256 constant MAX_LINK_LENGTH = 128;

    /**
     * @dev internal function returns length of utf string
     * @param str string to be checked
     */
    function utfStringLength(
        string memory str
    ) public pure returns (uint256 length) {
        uint256 i = 0;
        bytes memory string_rep = bytes(str);

        while (i < string_rep.length) {
            if (string_rep[i] >> 7 == 0) i += 1;
            else if (string_rep[i] >> 5 == bytes1(uint8(0x6))) i += 2;
            else if (string_rep[i] >> 4 == bytes1(uint8(0xE))) i += 3;
            else if (string_rep[i] >> 3 == bytes1(uint8(0x1E))) i += 4;
            else i += 1;

            length++;
        }
    }

    /**
     * @notice function used to validate title
     * @dev validate title
     * @param curTitle title to be validated
     */
    function validateTitle(string memory curTitle) public pure returns (bool) {
        require(
            utfStringLength(curTitle) > MIN_TITLE_LENGTH,
            "Title too short"
        );

        require(utfStringLength(curTitle) < MAX_TITLE_LENGTH, "Title too long");

        return true;
    }

    /**
     * @notice function used to validate description
     * @dev validate description
     * @param curDescription description to be validated
     */
    function validateDescription(
        string memory curDescription
    ) public pure returns (bool) {
        require(
            utfStringLength(curDescription) > MIN_DESC_LENGTH,
            "Description too short"
        );

        require(
            utfStringLength(curDescription) < MAX_DESC_LENGTH,
            "Description too long"
        );

        return true;
    }

    /**
     * @notice function used to validate link
     * @dev validate link
     * @param curLink link to be validated
     */

    function validateLink(string memory curLink) public pure returns (bool) {
        require(utfStringLength(curLink) > MIN_LINK_LENGTH, "Link too short");

        require(utfStringLength(curLink) < MAX_LINK_LENGTH, "Link too long");

        return true;
    }

    /**
     * @notice function used to validate curQuorum
     * @dev validate curQuorum
     * @param curQuorum curQuorum to be validated
     */
    function validateQuorum(uint256 curQuorum) public pure returns (bool) {
        require(curQuorum < 100, "quorum must be 0 to 100");

        return true;
    }

    /**
     * @notice function used to validate curThreshold
     * @dev validate curThreshold
     * @param curThreshold curThreshold to be validated
     */
    function validateThreshold(
        uint256 curThreshold
    ) public pure returns (bool) {
        require(curThreshold < 100, "threshold must be 0 to 100");

        return true;
    }

    /**
     * @notice function used to query voting balance of an address
     * @dev query voting balance of an address
     * @param curVeaddr ve address
     * @param curAddress address to be queried
     * @param curBlocknumber block number to be queried
     */
    function queryAddressVotingBalanceAtBlock(
        address curVeaddr,
        address curAddress,
        uint256 curBlocknumber
    ) public view returns (uint256) {
        // return IERC20(curVeaddr).balanceOf(curAddress);
        return
            QueryIIncentivisedVotingLockup(curVeaddr).balanceOfAt(
                curAddress,
                curBlocknumber
            );
    }

    /**
     * @notice function used to query total voting balance
     * @dev query total voting balance
     * @param curVeaddr ve address
     * @param curBlocknumber block number to be queried
     */
    function queryTotalVotingBalanceAtBlock(
        address curVeaddr,
        uint256 curBlocknumber
    ) public view returns (uint256) {
        return
            QueryIIncentivisedVotingLockup(curVeaddr).totalSupplyAt(
                curBlocknumber
            );
    }

    /**
     * @notice function used to build the dao token deployment message
     * @dev Build the dao token deployment message
     * @param curToken The token used to build the dao token
     * @param curEndowType The endowment type used to build the dao token
     * @param curEndowowner The endowment owner used to build the dao token
     */
    function buildDaoTokenMesage(
        AngelCoreStruct.DaoToken memory curToken,
        AngelCoreStruct.EndowmentType curEndowType,
        address curEndowowner,
        subDaoStorage.Config storage config,
        address emitterAddress
    ) public {
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            config.registrarContract
        ).queryConfig();

        if (
            curToken.token == AngelCoreStruct.TokenType.ExistingCw20 &&
            curEndowType == AngelCoreStruct.EndowmentType.Normal
        ) {
            require(
                AngelCoreStruct.cw20Valid(
                    registrar_config.acceptedTokens.cw20,
                    curToken.data.existingCw20Data
                ),
                "NotInApprovedCoins"
            );
            config.daoToken = curToken.data.existingCw20Data;
        } else if (
            curToken.token == AngelCoreStruct.TokenType.NewCw20 &&
            curEndowType == AngelCoreStruct.EndowmentType.Normal
        ) {
            bytes memory callData = abi.encodeWithSignature(
                "initErC20(string,string,address,uint256,address)",
                curToken.data.newCw20Name,
                curToken.data.newCw20Symbol,
                curEndowowner,
                curToken.data.newCw20InitialSupply,
                address(0)
            );
            config.daoToken = address(
                new ProxyContract(
                    registrar_config.subdaoCw20TokenCode,
                    registrar_config.proxyAdmin,
                    callData
                )
            );
        } else if (
            curToken.token == AngelCoreStruct.TokenType.BondingCurve &&
            curEndowType == AngelCoreStruct.EndowmentType.Normal
        ) {
            SubDaoTokenMessage.InstantiateMsg
                memory curTemp = SubDaoTokenMessage.InstantiateMsg({
                    name: curToken.data.bondingCurveName,
                    symbol: curToken.data.bondingCurveSymbol,
                    reserveDenom: curToken.data.bondingCurveReserveDenom,
                    curve_type: curToken.data.bondingCurveCurveType.curve_type,
                    unbondingPeriod: curToken.data.bondingCurveUnbondingPeriod
                });
            bytes memory callData = abi.encodeWithSignature(
                "continuosToken((string,string,address,uint8,uint256),address)",
                curTemp,
                emitterAddress
            );
            config.daoToken = address(
                new ProxyContract(
                    registrar_config.subdaoBondingTokenCode,
                    registrar_config.proxyAdmin,
                    callData
                )
            );
        } else if (
            curToken.token == AngelCoreStruct.TokenType.BondingCurve &&
            curEndowType == AngelCoreStruct.EndowmentType.Charity
        ) {
            require(
                registrar_config.haloToken != address(0),
                "Registrar's HALO token address is empty"
            );

            SubDaoTokenMessage.InstantiateMsg
                memory curTemp = SubDaoTokenMessage.InstantiateMsg({
                    name: curToken.data.bondingCurveName,
                    symbol: curToken.data.bondingCurveSymbol,
                    reserveDenom: registrar_config.haloToken,
                    curve_type: curToken.data.bondingCurveCurveType.curve_type,
                    unbondingPeriod: 21 days
                });

            bytes memory callData = abi.encodeWithSignature(
                "continuosToken((string,string,address,uint8,uint256),address)",
                curTemp,
                emitterAddress
            );
            config.daoToken = address(
                new ProxyContract(
                    registrar_config.subdaoBondingTokenCode,
                    registrar_config.proxyAdmin,
                    callData
                )
            );
        } else {
            revert("InvalidInputs");
        }

        bytes memory cw900lvData = abi.encodeWithSignature(
            "initialize(address,string,string)",
            config.daoToken,
            "LV900",
            "LV900"
        );

        config.veToken = address(
            new ProxyContract(
                registrar_config.cw900lvAddress,
                registrar_config.proxyAdmin,
                cw900lvData
            )
        );

        //TODO: handle on sub graph if there is no entry create one for the subgraph
        ISubdaoEmitter(emitterAddress).updateSubdaoConfig(config);
    }
}

contract SubDao is Storage, ReentrancyGuard {
    // using SafeMath for uint256;

    bool private initFlag = false;
    address emitterAddress;
    address accountAddress;

    /**
     * @notice function used to initialize the contract
     * @dev Initialize the contract
     * @param curMsg The message used to initialize the contract
     */
    function initializeSubDao(
        subDaoMessage.InstantiateMsg memory curMsg,
        address curEmitteraddress
    ) public {
        require(curEmitteraddress != address(0), "InvalidEmitterAddress");
        require(!initFlag, "Already initialised");
        initFlag = true;

        emitterAddress = curEmitteraddress;

        config = subDaoStorage.Config({
            registrarContract: curMsg.registrarContract,
            owner: curMsg.owner,
            daoToken: address(0),
            veToken: address(0),
            swapFactory: address(0),
            quorum: curMsg.quorum,
            threshold: curMsg.threshold,
            votingPeriod: curMsg.votingPeriod,
            timelockPeriod: curMsg.timelockPeriod,
            expirationPeriod: curMsg.expirationPeriod,
            proposalDeposit: curMsg.proposalDeposit,
            snapshotPeriod: curMsg.snapshotPeriod
        });
        accountAddress = msg.sender;

        state = subDaoStorage.State({
            pollCount: 0,
            totalShare: 0,
            totalDeposit: 0
        });
    }

    /**
     * @notice function used to build the dao token message
     * @dev Build the dao token message
     * @param curMsg The message used to build the dao token message
     */
    function buildDaoTokenMesage(
        subDaoMessage.InstantiateMsg memory curMsg
    ) public {
        require(msg.sender == accountAddress, "Unauthorized");

        SubDaoLib.buildDaoTokenMesage(
            curMsg.token,
            curMsg.endow_type,
            curMsg.endowOwner,
            config,
            emitterAddress
        );
    }

    /**
     * @notice function used to register the contract address
     * @dev Register the contract address
     * @param curVetoken The address of the ve token contract
     * @param curSwapfactory The address of the swap factory contract
     */
    function registerContract(
        address curVetoken,
        address curSwapfactory
    ) external {
        require(config.owner == msg.sender, "Unauthorized");

        require(curVetoken != address(0), "Invalid input");
        require(curSwapfactory != address(0), "Invalid input");

        config.veToken = curVetoken;
        config.swapFactory = curSwapfactory;
        ISubdaoEmitter(emitterAddress).updateSubdaoConfig(config);
    }

    /**
     * @notice function used to update the config
     * @dev Update the config
     * @param curOwner The address of the owner
     * @param curQuorum The quorum value
     * @param curThreshold The threshold value
     * @param curVotingperiod The voting period value
     * @param curTimelockperiod The timelock period value
     * @param curExpirationperiod The expiration period value
     * @param curProposaldeposit The proposal deposit value
     * @param curSnapshotperiod The snapshot period value
     */
    function updateConfig(
        address curOwner,
        uint256 curQuorum,
        uint256 curThreshold,
        uint256 curVotingperiod,
        uint256 curTimelockperiod,
        uint256 curExpirationperiod,
        uint256 curProposaldeposit,
        uint256 curSnapshotperiod
    ) external {
        require(config.owner == msg.sender, "Unauthorized");

        if (curOwner != address(0)) {
            config.owner = curOwner;
        }

        require(SubDaoLib.validateQuorum(curQuorum), "InvalidQuorum");
        require(SubDaoLib.validateThreshold(curThreshold), "InvalidThreshold");

        config.quorum = curQuorum;
        config.threshold = curThreshold;
        config.votingPeriod = curVotingperiod;
        config.timelockPeriod = curTimelockperiod;
        config.expirationPeriod = curExpirationperiod;
        config.proposalDeposit = curProposaldeposit;
        config.snapshotPeriod = curSnapshotperiod;
        ISubdaoEmitter(emitterAddress).updateSubdaoConfig(config);
    }

    /**
     * @notice function used to create a poll
     * @dev Create a poll
     * @param curDepositamount The deposit amount
     * @param curTitle The title of the poll
     * @param curDescription The description of the poll
     * @param curLink The link of the poll
     * @param curExecuteMsgs The execute data
     */
    function createPoll(
        uint256 curDepositamount,
        string memory curTitle,
        string memory curDescription,
        string memory curLink,
        subDaoStorage.ExecuteData memory curExecuteMsgs
    ) external nonReentrant returns (uint256) {
        require(SubDaoLib.validateDescription(curDescription));
        require(SubDaoLib.validateTitle(curTitle));
        require(SubDaoLib.validateLink(curLink));

        require(
            curDepositamount >= config.proposalDeposit,
            "InsufficientProposalDeposit"
        );

        if (curDepositamount > 0) {
            IERC20(config.daoToken).transferFrom(
                msg.sender,
                address(this),
                curDepositamount
            );
            ISubdaoEmitter(emitterAddress).transferFromSubdao(
                config.daoToken,
                msg.sender,
                address(this),
                curDepositamount
            );
        }

        uint256 pollId = state.pollCount + 1;

        state.pollCount += 1;
        state.totalDeposit += curDepositamount;

        ISubdaoEmitter(emitterAddress).updateSubdaoState(state);

        uint256 stakedAmount = SubDaoLib.queryTotalVotingBalanceAtBlock(
            config.veToken,
            block.number
        );

        subDaoStorage.Poll memory a_poll = subDaoStorage.Poll({
            id: pollId,
            creator: msg.sender,
            status: subDaoStorage.PollStatus.InProgress,
            yesVotes: 0,
            noVotes: 0,
            startTime: block.timestamp,
            endHeight: block.number + config.votingPeriod,
            title: curTitle,
            description: curDescription,
            link: curLink,
            executeData: curExecuteMsgs,
            depositAmount: curDepositamount,
            totalBalanceAtEndPoll: 0,
            stakedAmount: stakedAmount,
            startBlock: block.number
        });

        poll[pollId] = a_poll;
        poll_status[pollId] = subDaoStorage.PollStatus.InProgress;
        ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
            pollId,
            poll[pollId],
            poll_status[pollId]
        );

        return pollId;
    }

    /**
     * @notice function used to end a poll
     * @dev End a poll
     * @param curPollid The poll id
     */
    function endPoll(uint256 curPollid) external nonReentrant {
        address[] memory target;
        uint256[] memory value;
        bytes[] memory callData;

        subDaoStorage.Poll memory a_poll = poll[curPollid];

        require(
            a_poll.status == subDaoStorage.PollStatus.InProgress,
            "PollNotInProgress"
        );

        require(a_poll.endHeight < block.number, "PollVotingPeriod");

        uint256 talliedWeight = a_poll.noVotes + a_poll.yesVotes;

        subDaoStorage.PollStatus temp_poll_status = subDaoStorage
            .PollStatus
            .Rejected;
        string memory rejected_reason = "";
        bool passed = false;

        uint256 stakedAmount = a_poll.stakedAmount;

        {
            uint256 quorum;
            uint256 stakedWeight;
            if (stakedAmount == 0) {
                (quorum, stakedWeight) = (0, 0);
            } else {
                (quorum, stakedWeight) = (
                    (talliedWeight * 100) / stakedAmount,
                    stakedAmount
                );
            }

            if (talliedWeight == 0 || quorum < config.quorum) {
                // Quorum: More than quorum of the total staked tokens at the end of the voting
                // period need to have participated in the vote.
                rejected_reason = "Quorum not reached";
            } else {
                if (
                    (a_poll.yesVotes * 100) / talliedWeight > config.threshold
                ) {
                    temp_poll_status = subDaoStorage.PollStatus.Passed;
                    passed = true;
                } else {
                    rejected_reason = "Threshold not reached";
                }

                if (a_poll.depositAmount != 0) {
                    target = new address[](1);
                    value = new uint256[](1);
                    callData = new bytes[](1);

                    target[0] = config.daoToken;
                    value[0] = 0;
                    callData[0] = abi.encodeWithSignature(
                        "transfer(address,uint256)",
                        a_poll.creator,
                        a_poll.depositAmount
                    );
                    ISubdaoEmitter(emitterAddress).transferSubdao(
                        config.daoToken,
                        a_poll.creator,
                        a_poll.depositAmount
                    );
                }
            }
            a_poll.totalBalanceAtEndPoll = stakedWeight;
        }

        state.totalDeposit -= a_poll.depositAmount;

        poll_status[curPollid] = temp_poll_status;

        a_poll.status = temp_poll_status;

        poll[curPollid] = a_poll;

        _execute(target, value, callData);
        ISubdaoEmitter(emitterAddress).updateSubdaoState(state);
        ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
            curPollid,
            poll[curPollid],
            poll_status[curPollid]
        );
    }

    //TODO: complete this function, add events
    /**
     * @notice function used to execute a poll
     * @dev Execute a poll
     * @param curPollid The poll id
     */
    function executePoll(uint256 curPollid) external nonReentrant {
        subDaoStorage.Poll memory a_poll = poll[curPollid];

        require(
            a_poll.status == subDaoStorage.PollStatus.Passed,
            "PollNotPassed"
        );

        require(
            a_poll.endHeight + config.timelockPeriod < block.number,
            "TimelockNotExpired"
        );

        poll_status[curPollid] = subDaoStorage.PollStatus.Executed;

        a_poll.status = subDaoStorage.PollStatus.Executed;

        poll[curPollid] = a_poll;

        require(a_poll.executeData.order.length > 0, "NoExecuteData");

        uint256[] memory sortedOrder = new uint256[](
            a_poll.executeData.order.length
        );

        sortedOrder = Array.sort(a_poll.executeData.order);

        uint256 maxOrder = Array.max(a_poll.executeData.order);

        uint256[] memory orderManager = new uint256[](maxOrder + 1);

        for (uint8 i = 0; i < sortedOrder.length; i++) {
            orderManager[sortedOrder[i]] = i;
        }

        address[] memory target = new address[](
            a_poll.executeData.order.length
        );
        uint256[] memory value = new uint256[](a_poll.executeData.order.length);
        bytes[] memory callData = new bytes[](a_poll.executeData.order.length);

        for (uint256 i = 0; i < a_poll.executeData.order.length; i++) {
            uint256 position = orderManager[a_poll.executeData.order[i]];

            target[position] = a_poll.executeData.contractAddress[i];
            callData[position] = a_poll.executeData.execution_message[i];
            value[position] = 0;
        }

        _execute(target, value, callData);
    }

    /**
     * @notice function used to expire a poll
     * @dev Expire a poll
     * @param curPollid The poll id
     */
    function expirePoll(uint256 curPollid) external {
        subDaoStorage.Poll memory a_poll = poll[curPollid];

        require(
            a_poll.status == subDaoStorage.PollStatus.Passed,
            "PollNotPassed"
        );

        require(a_poll.executeData.order.length != 0, "NoExecuteData");
        require(
            a_poll.endHeight + config.expirationPeriod < block.number,
            "PollNotExpired"
        );

        poll_status[curPollid] = subDaoStorage.PollStatus.Expired;

        a_poll.status = subDaoStorage.PollStatus.Expired;

        poll[curPollid] = a_poll;
        ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
            curPollid,
            poll[curPollid],
            poll_status[curPollid]
        );
    }

    /**
     * @notice function used to cast vote
     * @dev cast vote on a poll
     * @param curPollid The poll id
     */
    function castVote(
        uint256 curPollid,
        subDaoStorage.VoteOption vote
    ) external {
        require(curPollid != 0, "PollNotFound");
        require(state.pollCount >= curPollid, "PollNotFound");

        subDaoStorage.Poll memory a_poll = poll[curPollid];

        require(
            a_poll.status == subDaoStorage.PollStatus.InProgress,
            "PollNotInProgress"
        );

        require(a_poll.endHeight >= block.number, "PollNotInProgress");

        require(!(voting_status[curPollid][msg.sender].voted), "AlreadyVoted");

        uint256 amount = SubDaoLib.queryAddressVotingBalanceAtBlock(
            config.veToken,
            msg.sender,
            a_poll.startBlock
        );

        if (subDaoStorage.VoteOption.Yes == vote) {
            a_poll.yesVotes += amount;
        } else {
            a_poll.noVotes += amount;
        }

        voting_status[curPollid][msg.sender].voted = true;
        voting_status[curPollid][msg.sender].balance = amount;
        voting_status[curPollid][msg.sender].vote = vote;
        ISubdaoEmitter(emitterAddress).updateVotingStatus(
            curPollid,
            msg.sender,
            voting_status[curPollid][msg.sender]
        );

        poll[curPollid] = a_poll;
        ISubdaoEmitter(emitterAddress).updateSubdaoPoll(
            curPollid,
            poll[curPollid]
        );
    }

    /**
     * @notice function used to query config
     * @dev query config
     */
    function queryConfig()
        public
        view
        returns (subDaoMessage.QueryConfigResponse memory)
    {
        subDaoMessage.QueryConfigResponse memory response = subDaoMessage
            .QueryConfigResponse({
                owner: config.owner,
                daoToken: config.daoToken,
                veToken: config.veToken,
                swapFactory: config.swapFactory,
                quorum: config.quorum,
                threshold: config.threshold,
                votingPeriod: config.votingPeriod,
                timelockPeriod: config.timelockPeriod,
                expirationPeriod: config.expirationPeriod,
                proposalDeposit: config.proposalDeposit,
                snapshotPeriod: config.snapshotPeriod
            });

        return response;
    }

    /**
     * @notice function used to query state of contract
     * @dev query contract state
     */
    function queryState() public view returns (subDaoStorage.State memory) {
        return state;
    }

    /**
     * @notice internal function used to execute external calls
     * @dev sends external calls to target addresses with values and calldatas
     * @param targets target addresses
     * @param values values to be sent with call
     * @param calldatas calldatas to be sent with call
     */
    function _execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas
    ) internal {
        string memory errorMessage = "call reverted without message";
        for (uint256 i = 0; i < targets.length; ++i) {
            (bool success, bytes memory returndata) = targets[i].call{
                value: values[i]
            }(calldatas[i]);
            Address.verifyCallResult(success, returndata, errorMessage);
        }
    }
}
