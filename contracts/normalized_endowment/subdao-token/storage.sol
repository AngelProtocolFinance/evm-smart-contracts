// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../core/struct.sol";

library subDaoTokenStorage {
    struct MinterData {
        address minter;
        /// cap is how many more tokens can be issued by the minter
        uint256 cap;
        bool hasCap;
    }

    struct TokenInfo {
        string name; //newName
        string symbol; //newSymbol
        uint256 decimals; //18
        MinterData mint;
    }

    struct Config {
        /// This is the unbonding period of CS tokens
        /// We need this to only allow claims to be redeemed after this period
        AngelCoreStruct.Duration unbondingPeriod;
    }

    enum veTypeEnum {
        Constant,
        Linear,
        SquareRoot
    }

    struct claimInfo {
        uint256 releaseTime;
        uint256 amount;
        bool isClaimed;
    }

    struct ClaimConfig {
        claimInfo[] details;
    }

    function getReserveRatio(
        AngelCoreStruct.veTypeEnum curveType
    ) internal pure returns (uint256) {
        if (curveType == AngelCoreStruct.veTypeEnum.Linear) {
            return 500000;
        } else if (curveType == AngelCoreStruct.veTypeEnum.SquarRoot) {
            return 660000;
        } else {
            return 1000000;
        }
    }
}

contract Storage {
    mapping(address => subDaoTokenStorage.ClaimConfig) CLAIM_AMOUNT;
    subDaoTokenStorage.TokenInfo tokenInfo;
    subDaoTokenStorage.Config config;
    address reserveDenom;
}
