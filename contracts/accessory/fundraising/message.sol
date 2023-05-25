// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;

// import {AngelCoreStruct} from "../../core/struct.sol";

// struct Coin {
//     string denom;
//     uint amount;
// }

// struct Balance {
//     uint256 coinNativeAmount;
//     address cw20Addr;
//     uint256 cw20Amount;
// }
// struct Cw20CoinVerified {
//     address addr;
//     uint amount;
//     string symbol;
//     string name;
// }

// struct Campaign {
//     address creator;
//     bool open;
//     bool success;
//     string title;
//     string description;
//     string imageUrl;
//     uint endTimeEpoch;
//     AngelCoreStruct.GenericBalance fundingGoal;
//     AngelCoreStruct.GenericBalance fundingThreshold;
//     AngelCoreStruct.GenericBalance lockedBalance;
//     AngelCoreStruct.GenericBalance contributedBalance;
//     address[] contributors; // TODO: make this a mapping(address => bool) to save gas ?
// }

// library FundraisingMessage {
//     // struct Cw20ReceiveMsg {
//     //     string sender,
//     //     uint128 amount,
//     //     ,
//     // }
//     struct ListResponse {
//         Campaign[] campaigns;
//     }

//     struct MessageInfo {
//         address sender;
//         string[] denom;
//         uint[] amount;
//     }

//     struct InstantiateMsg {
//         address registrarContract;
//         uint nextId;
//         uint campaignPeriodSeconds;
//         uint taxRate;
//         AngelCoreStruct.GenericBalance acceptedTokens;
//     }

//     struct CreateMsg {
//         string title;
//         string description;
//         string imageUrl;
//         uint endTimeEpoch;
//         AngelCoreStruct.GenericBalance fundingGoal;
//         uint rewardThreshold;
//     }

//     struct DetailsResponse {
//         uint id;
//         address creator;
//         string title;
//         string description;
//         string imageUrl;
//         uint endTimeEpoch;
//         AngelCoreStruct.GenericBalance fundingGoal;
//         AngelCoreStruct.GenericBalance fundingThreshold;
//         AngelCoreStruct.GenericBalance lockedBalance;
//         AngelCoreStruct.GenericBalance contributedBalance;
//         uint contributorCount;
//         bool success;
//         bool open;
//     }
// }
