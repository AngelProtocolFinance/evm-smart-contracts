// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;
// import "./message.sol";

// import {AngelCoreStruct} from "../../core/struct.sol";

// library FundraisingStorage {
//     struct Config {
//         address registrarContract;
//         uint256 nextId;
//         uint256 campaignPeriodSeconds;
//         uint256 taxRate;
//         AngelCoreStruct.GenericBalance acceptedTokens;
//     }

//     struct ContributorInfo {
//         uint256 campaign;
//         AngelCoreStruct.GenericBalance balance;
//         bool rewardsClaimed;
//         bool contributionRefunded;
//         bool exists;
//     }

//     struct State {
//         Config config;
//         mapping(uint256 => Campaign) CAMPAIGNS;
//         uint256[] CAMPAIGN_IDS;
//         mapping(address => mapping(uint256 => ContributorInfo)) CONTRIBUTORS;
//         mapping(address => uint256[]) CONTRIBUTOR_CAMPAIGNS;
//     }
// }

// contract StorageFundraising {
//     FundraisingStorage.State state;
// }
