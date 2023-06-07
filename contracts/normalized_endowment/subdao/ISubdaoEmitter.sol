// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";

interface ISubdaoEmitter {
    function initializeSubdao(
        address subdao,
        subDaoMessage.InstantiateMsg memory instantiateMsg
    ) external;

    function updateSubdaoConfig(subDaoStorage.Config memory config) external;

    function transferFromSubdao(
        address tokenAddress,
        address from,
        address to,
        uint256 amount
    ) external;

    function updateSubdaoState(subDaoStorage.State memory state) external;

    function updateSubdaoPoll(
        uint256 id,
        subDaoStorage.Poll memory poll
    ) external;

    function transferSubdao(
        address tokenAddress,
        address recipient,
        uint amount
    ) external;

    function updateVotingStatus(
        uint256 pollId,
        address voter,
        subDaoStorage.VoterInfo memory voterInfo
    ) external;

    function updateSubdaoPollAndStatus(
        uint256 id,
        subDaoStorage.Poll memory poll,
        subDaoStorage.PollStatus pollStatus
    ) external;
}
