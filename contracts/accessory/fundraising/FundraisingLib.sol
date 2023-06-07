// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;

// import {AngelCoreStruct} from "../../core/struct.sol";
// import "./message.sol";

// library FundraisingLib {
//     function isExpired(Campaign storage self) public view returns (bool) {
//         if (block.timestamp > self.endTimeEpoch) {
//             return true;
//         }
//         return false;
//     }

//     function calculateWitholding(
//         uint256 taxRate,
//         AngelCoreStruct.GenericBalance storage balance
//     )
//         public
//         view
//         returns (
//             AngelCoreStruct.GenericBalance memory,
//             AngelCoreStruct.GenericBalance memory
//         )
//     {
//         AngelCoreStruct.GenericBalance memory contributed_less_tax = balance;
//         AngelCoreStruct.GenericBalance memory withholding_balance; // initialized to default
//         // AngelCoreStruct.GenericBalance memory

//         withholding_balance.coinNativeAmount +=
//             (balance.coinNativeAmount * taxRate) /
//             100;
//         contributed_less_tax.coinNativeAmount -=
//             (balance.coinNativeAmount * taxRate) /
//             100;

//         for (uint256 i = 0; i < balance.Cw20CoinVerified_addr.length; i++) {
//             withholding_balance = AngelCoreStruct.addTokenMem(
//                 withholding_balance,
//                 balance.Cw20CoinVerified_addr[i],
//                 (balance.Cw20CoinVerified_amount[i] * taxRate) / 100
//             );
//             contributed_less_tax = AngelCoreStruct.subTokenMem(
//                 contributed_less_tax,
//                 balance.Cw20CoinVerified_addr[i],
//                 (balance.Cw20CoinVerified_amount[i] * taxRate) / 100
//             );
//         }
//         return (contributed_less_tax, withholding_balance);
//     }

//     function thresholdMet(
//         AngelCoreStruct.GenericBalance memory contributed,
//         AngelCoreStruct.GenericBalance memory threshold
//     ) public pure returns (bool) {
//         // TODO: verify this
//         bool result = false;
//         if (
//             contributed.coinNativeAmount >= threshold.coinNativeAmount &&
//             contributed.coinNativeAmount > 0
//         ) result = true;
//         int index = -1;
//         for (uint256 i = 0; i < threshold.Cw20CoinVerified_addr.length; i++) {
//             for (
//                 uint256 j = 0;
//                 j < contributed.Cw20CoinVerified_addr.length;
//                 j++
//             ) {
//                 if (
//                     contributed.Cw20CoinVerified_addr[j] ==
//                     threshold.Cw20CoinVerified_addr[i]
//                 ) {
//                     index = int(j);
//                     break;
//                 }
//             }
//             if (index > -1)
//                 result =
//                     contributed.Cw20CoinVerified_amount[uint256(index)] >=
//                     threshold.Cw20CoinVerified_amount[i];
//         }
//         return result;
//     }
// }
