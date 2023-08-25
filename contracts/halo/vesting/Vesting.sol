// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {VestingMessages} from "./message.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 *@title Vesting
 * @dev Vesting contract
 * The `Vesting` contract implements a vesting mechanism for the Halo Token.
 * Vesting is the process of gradually unlocking an amount of tokens over a set period of time.
 */
contract Vesting is Storage, Ownable, ReentrancyGuard, Initializable {
  using SafeERC20 for IERC20;

  event HaloVested(address user, uint256 amount);
  event HaloClaimed(address user, uint256 vestingId, uint256 amount);
  event ConfigUpdated(uint256 vestingDuration, uint256 vestingSlope);

  /**
   * @dev Initialize contract
   * @param details instantiate message containing halo token address
   */

  function initialize(VestingMessages.InstantiateMsg memory details) public initializer {
    state.totalVesting = 0;
    state.haloToken = details.haloToken;
    state.config.vestingDuration = details.vestingDuration;
    state.config.vestingSlope = details.vestingSlope;
  }

  /**
   * @dev Deposits an amount of tokens into the vesting contract for a recipient address.
   * @param recipient address to recieve/claim tokens
   * @param amount uint amount to add
   *
   */
  function deposit(address recipient, uint256 amount) public nonReentrant {
    require(amount > 0, "Amount must be greater than 0");
    IERC20(state.haloToken).safeTransferFrom(msg.sender, address(this), amount);
    state.Vestings[recipient][state.VestingNumber[recipient]] = VestingStorage.VestingInfo({
      amount: amount,
      startTime: block.timestamp,
      endTime: block.timestamp + state.config.vestingDuration,
      claimed: 0
    });
    state.VestingNumber[recipient] += 1;
    state.totalVesting += amount;
    emit HaloVested(recipient, amount);
  }

  /**
   * @dev Allows the sender to withdraw the claimed tokens from the vesting contract.
   * @param vestingId uint
   */
  function claim(uint256 vestingId) public nonReentrant {
    require(
      state.Vestings[msg.sender][vestingId].claimed < state.Vestings[msg.sender][vestingId].amount,
      "Fully claimed"
    );

    uint256 unlockedAmnt = calcAmountUnlocked(
      state.Vestings[msg.sender][vestingId].startTime,
      state.Vestings[msg.sender][vestingId].endTime,
      state.Vestings[msg.sender][vestingId].amount,
      state.config.vestingDuration,
      block.timestamp
    );

    uint256 claimable = unlockedAmnt - state.Vestings[msg.sender][vestingId].claimed;
    require(claimable > 0, "Nothing available to claim");

    IERC20(state.haloToken).safeTransfer(msg.sender, claimable);

    state.totalVesting -= claimable;
    state.Vestings[msg.sender][vestingId].claimed += claimable;
    emit HaloClaimed(msg.sender, vestingId, claimable);
  }

  /**
   * @dev Allows the owner of the contract to modify the vesting configurations.
   * @param vestingDuration uint
   * @param vestingSlope uint
   */
  function updateConfig(uint256 vestingDuration, uint256 vestingSlope) public onlyOwner {
    state.config.vestingDuration = vestingDuration;
    state.config.vestingSlope = vestingSlope;
    emit ConfigUpdated(vestingDuration, vestingSlope);
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~
   *      Queries
   * ~~~~~~~~~~~~~~~~~~~
   */

  /**
   * @dev Query config
   * @return Config
   */
  function queryConfig() public view returns (VestingStorage.Config memory) {
    return state.config;
  }

  /**
   * @dev Query state
   * @return State
   */
  function queryState() public view returns (VestingMessages.StateResponse memory) {
    return
      VestingMessages.StateResponse({
        haloToken: state.haloToken,
        genesisTime: state.genesisTime,
        totalVesting: state.totalVesting
      });
  }

  /**
   * @dev Query an address claimant's info for a single vesting number
   * @param claimant address to lookup
   * @param vestingId vesting number
   * @return VestingInfo
   */
  function getVesting(
    address claimant,
    uint256 vestingId
  ) public view returns (VestingStorage.VestingInfo memory) {
    require(
      state.Vestings[claimant][vestingId].amount > 0,
      "Invalid claimant address or Vesting number passed"
    );
    return state.Vestings[claimant][vestingId];
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~
   *  Internal Functions
   * ~~~~~~~~~~~~~~~~~~~
   */
  function min(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a < b) {
      return a;
    }
    return b;
  }

  function calcAmountUnlocked(
    uint256 startTime,
    uint256 endTime,
    uint256 amount,
    uint256 vestingDuration,
    uint256 currTime
  ) internal pure returns (uint256) {
    uint256 timeDiff = min(currTime, endTime) - startTime;
    // uint256 totalArea = (vestingDuration * (vestingSlope * vestingDuration)/100)/2;
    // uint256 area = (timediff * (vestingSlope * timediff)/100)/2;
    // claimable = (vesting amount * area) / total area
    // the following is a simplified equation
    return (amount * timeDiff * timeDiff) / (vestingDuration * vestingDuration);
  }
}
