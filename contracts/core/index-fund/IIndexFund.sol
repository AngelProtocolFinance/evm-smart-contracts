// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IndexFundStorage} from "./storage.sol";

interface IIndexFund {
  function queryFundDetails(uint256 fundId) external view returns (IndexFundStorage.Fund memory);

  function queryInvolvedFunds(uint32 endowmentId) external view returns (uint256[] memory);

  function removeMember(uint32 member) external;
}
