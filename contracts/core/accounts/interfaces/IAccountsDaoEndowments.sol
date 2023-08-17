// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SubDaoLib} from "../../../normalized_endowment/subdao/message.sol";

/**
 * @title AccountsDaoEndowments
 * @dev This contract facet manages the creation contracts required for DAO Functioning
 */
interface IAccountsDaoEndowments {
  /**
   * @notice This function creates a DAO for an endowment
   * @dev creates a DAO for an endowment based on parameters
   * @param id The id of the endowment
   * @param details The details of the DAO
   */
  function setupDao(uint32 id, SubDaoLib.DaoSetup memory details) external;
}
