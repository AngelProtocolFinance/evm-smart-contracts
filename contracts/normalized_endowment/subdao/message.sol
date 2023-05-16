// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../core/struct.sol";

import {subDaoStorage} from "./storage.sol";

library subDaoMessage {
    struct InstantiateMsg {
        uint32 id;
        address owner;
        uint256 quorum;
        uint256 threshold;
        uint256 votingPeriod;
        uint256 timelockPeriod;
        uint256 expirationPeriod;
        uint256 proposalDeposit;
        uint256 snapshotPeriod;
        AngelCoreStruct.DaoToken token;
        AngelCoreStruct.EndowmentType endow_type;
        address endowOwner;
        address registrarContract;
    }

    struct QueryConfigResponse {
        address owner;
        address daoToken;
        address veToken;
        address swapFactory;
        uint256 quorum;
        uint256 threshold;
        uint256 votingPeriod;
        uint256 timelockPeriod;
        uint256 expirationPeriod;
        uint256 proposalDeposit;
        uint256 snapshotPeriod;
    }
}
