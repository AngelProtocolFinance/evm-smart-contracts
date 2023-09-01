// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {CommunityMessage} from "./message.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 *@title Community
 * @dev Community contract
 * The `Community` contract serves as a management system for a community of token holders.
 * It provides functions to initialize the contract, update its configuration, transfer tokens,
 * and retrieve the rent configuration.
 */
contract Community is Storage, Initializable, ReentrancyGuard, Ownable {
  using SafeERC20 for IERC20;

  event ConfigUpdated();
  event HaloSpent(address recipient, uint amount);

  /**
   * @dev Initialize contract
   * @param details CommunityMessage.InstantiateMsg used to initialize contract
   */
  function initialize(CommunityMessage.InstantiateMsg memory details) public initializer {
    state.config = CommunityStorage.Config({
      spendLimit: details.spendLimit,
      haloToken: details.haloToken
    });
    emit ConfigUpdated();
  }

  /**
   * @dev Update config for community contract
   * @param spendLimit uint
   */
  function updateConfig(uint spendLimit) public nonReentrant onlyOwner {
    state.config.spendLimit = spendLimit;
    emit ConfigUpdated();
  }

  /**
   * @dev Transfer a specified amount of tokens from the contract's balance to the recipient's address.
   * @param recipient address
   * @param amount uint
   */
  function spend(address recipient, uint amount) public nonReentrant onlyOwner {
    require(state.config.spendLimit >= amount, "Cannot spend more than spend limit");
    require(
      amount <= IERC20(state.config.haloToken).balanceOf(address(this)),
      "Not enough balance"
    );
    IERC20(state.config.haloToken).safeTransfer(recipient, amount);
    emit HaloSpent(recipient, amount);
  }

  /**
   * @notice Query the config of community
   */
  function queryConfig() public view returns (CommunityMessage.ConfigResponse memory) {
    return
      CommunityMessage.ConfigResponse({
        spendLimit: state.config.spendLimit,
        haloToken: state.config.haloToken
      });
  }
}
