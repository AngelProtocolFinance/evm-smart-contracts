// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IIndexFund {
  struct IndexFund {
    uint256 id;
    string name;
    string description;
    uint32[] members;
    //Fund Specific: over-riding SC level setting to handle a fixed split value
    // Defines the % to split off into liquid account, and if defined overrides all other splits
    uint256 splitToLiquid;
    // Used for one-off funds that have an end date (ex. disaster recovery funds)
    uint256 expiryTime; // datetime int of index fund expiry
  }

  function queryFundDetails(uint256 fundId) external view returns (IndexFund memory);

  function queryInvolvedFunds(uint32 endowmentId) external view returns (IndexFund[] memory);

  function removeMember(uint32 member) external returns (bool);
}
