// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Array} from "../../lib/array.sol";

import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";

interface ISubDao {
    function registerContracts(
        address curVetoken,
        address curSwapfactory
    ) external;

    function updateConfig(
        address curOwner,
        uint256 curQuorum,
        uint256 curThreshold,
        uint256 curVotingperiod,
        uint256 curTimelockperiod,
        uint256 curExpirationperiod,
        uint256 curProposaldeposit,
        uint256 curSnapshotperiod
    ) external;

    function createPoll(
        address curProposer,
        uint256 curDepositamount,
        string memory curTitle,
        string memory curDescription,
        string memory curLink,
        subDaoStorage.ExecuteData memory curExecuteMsgs
    ) external;

    function endPoll(uint256 curPollid) external;

    function executePoll(uint256 curPollid) external;

    function expirePoll(uint256 curPollid) external;

    function castVote(
        uint256 curPollid,
        subDaoStorage.VoteOption vote
    ) external;

    function queryConfig()
        external
        view
        returns (subDaoMessage.QueryConfigResponse memory);

    function queryState() external view returns (subDaoStorage.State memory);

    function buildDaoTokenMesage(
        subDaoMessage.InstantiateMsg memory curMsg
    ) external;
}
