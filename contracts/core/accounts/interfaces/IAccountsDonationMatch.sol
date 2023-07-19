// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";

/**
 * @title AccountsDonationMatch
 * @dev This contract is used to manage donation match tokens
 */
interface IAccountsDonationMatch {
  /**
   * @notice Deposit DAOToken(or Halo) to the endowment and store its balance
   * @dev Function manages reserve token sent by donation matching contract
   * @param id Endowment ID
   * @param token DAOToken or HALO address
   * @param amount Amount of DAOToken to deposit
   */
  function depositDonationMatchERC20(uint32 id, address token, uint256 amount) external;

  /**
   * @notice Withdraw DAOToken(or Halo) from the endowment
   * @dev Function manages reserve token sent by donation matching contract
   * @param id Endowment ID
   * @param recipient Recipient address
   * @param amount Amount of DAOToken to withdraw
   */
  function withdrawDonationMatchERC20(uint32 id, address recipient, uint256 amount) external;

  /**
   * @notice This function creates a donation match contract for an endowment
   * @dev creates a donation match contract for an endowment based on parameters (performs donation matching for contract against USDC)
   * @param id The id of the endowment
   * @param details The details of the donation match contract
   */
  function setupDonationMatch(uint32 id, AccountMessages.DonationMatch memory details) external;
}
