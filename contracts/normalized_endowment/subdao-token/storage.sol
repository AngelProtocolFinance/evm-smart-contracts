// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {SubDaoLib} from "../subdao/SubDaoLib.sol";

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
    uint256 unbondingPeriod;
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

  function getReserveRatio(SubDaoLib.veTypeEnum curveType) internal pure returns (uint256) {
    if (curveType == SubDaoLib.veTypeEnum.Linear) {
      return 500000;
    } else if (curveType == SubDaoLib.veTypeEnum.SquarRoot) {
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
