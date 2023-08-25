// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {StakingMessages} from "./message.sol";
import {LibAccounts} from "../../core/accounts/lib/LibAccounts.sol";
import "./storage.sol";

/**
 *@title Staking
 * @dev Staking contract
 * The `Staking` contract enables users to stake their Halo token in exchange for rewards in form of additional tokens.
 */
contract Staking is Storage, Initializable, ERC20, Pausable, ReentrancyGuard, Ownable {
  using SafeERC20 for IERC20;

  event HaloStaked(address acct, uint256 amount, uint256 total, uint256 stakeNumber);
  event HaloUnstaked(address acct, uint256 amount, uint256 total);
  event ConfigUpdated(uint256 interestRate, uint256 stakePeriod);

  constructor() ERC20("Staked HALO Token", "sHALO") {}

  /**
   * @dev Initialize contract
   * @param details address
   */
  function initialize(StakingMessages.InstantiateMsg memory details) public initializer {
    require(details.haloToken != address(0), "Invalid address");
    state.config.interestRate = details.interestRate;
    state.config.stakePeriod = details.stakePeriod;
    state.haloToken = details.haloToken;
    state.totalStaked = 0;
  }

  /**
   * @dev Allows the contract owner to update config values, like the interest rate applied to staked tokens.
   * @param _interestRate uint256
   */
  function updateConfig(uint256 _interestRate, uint256 _stakePeriod) public nonReentrant onlyOwner {
    require(_interestRate <= LibAccounts.FEE_BASIS, "Invalid interest rate");
    state.config.interestRate = _interestRate;
    state.config.stakePeriod = _stakePeriod;
    emit ConfigUpdated(_interestRate, _stakePeriod);
  }

  /**
   * @dev Allows a user to stake their Halo token in exchange for rewards.
   * @param amount uint256
   */
  function stake(uint256 amount) public whenNotPaused nonReentrant {
    IERC20(state.haloToken).safeTransferFrom(msg.sender, address(this), amount);
    stakeIntoAcct(msg.sender, amount);
  }

  /**
   * @dev Allows the caller to stake tokens to assign credit to another address.
   * @param amount uint256
   * @param user address
   */
  function stakeFor(uint256 amount, address user) public nonReentrant whenNotPaused {
    IERC20(state.haloToken).safeTransferFrom(msg.sender, address(this), amount);
    stakeIntoAcct(user, amount);
  }

  /**
   * @dev Allows a user to unstake their tokens and receive their initial staked amount plus rewards.
   * @param amount uint256
   * @param stakeId uint256
   */
  function unstake(uint256 amount, uint256 stakeId) public nonReentrant {
    require(state.stakeInfos[msg.sender][stakeId].started, "Stake not found");
    require(state.stakeInfos[msg.sender][stakeId].endTime < block.timestamp, "Stake not ended");
    require(
      amount <=
        state.stakeInfos[msg.sender][stakeId].amount -
          state.stakeInfos[msg.sender][stakeId].claimed,
      "Invalid amount"
    );
    state.stakeInfos[msg.sender][stakeId].claimed += amount;
    // TODO: staking should be treated as a vault token would in that staked tokens are shares of
    //       total revenues (swept protocol fees collected). This is a simple amount x rate. :(
    uint256 totalTokens = amount + ((amount * state.config.interestRate) / LibAccounts.FEE_BASIS);

    require(
      IERC20(state.haloToken).balanceOf(address(this)) >= totalTokens,
      "Insufficient halo token balance in staking contract"
    );

    IERC20(state.haloToken).safeTransfer(msg.sender, totalTokens);

    // burn staking tokens
    _burn(msg.sender, amount);

    state.totalStakedFor[msg.sender] -= amount;
    state.totalStaked -= amount;

    emit HaloUnstaked(msg.sender, amount, state.totalStakedFor[msg.sender]);
  }

  /**
   * @notice Returns the storage config data
   */
  function getConfig() public view returns (StakingMessages.ConfigResponse memory config) {
    config = StakingMessages.ConfigResponse({
      interestRate: state.config.interestRate,
      stakePeriod: state.config.stakePeriod
    });
  }

  /**
   * @notice Returns the address of the Halo token being staked.
   */
  function token() public view returns (address) {
    return state.haloToken;
  }

  /**
   * @notice returns false, indicating that the contract does not support history.
   */
  function supportsHistory() public pure returns (bool) {
    return false;
  }

  /**
   * @notice Allows the contract owner to pause the contract.
   */
  function pause() public nonReentrant onlyOwner {
    _pause();
  }

  /**
   * @notice Allows the contract owner to resume the contract after it has been paused.
   */
  function unpause() public nonReentrant onlyOwner {
    _unpause();
  }

  /**
   * INTERNAL FUNCTIONS
   */
  function stakeIntoAcct(address acct, uint256 amount) internal {
    state.stakeNumber[acct]++;
    state.stakeInfos[acct][state.stakeNumber[acct]] = StakingStorage.StakeInfo({
      started: true,
      startTime: block.timestamp,
      endTime: block.timestamp + state.config.stakePeriod,
      amount: amount,
      claimed: 0
    });
    state.totalStakedFor[acct] += amount;
    state.totalStaked += amount;
    _mint(acct, amount);
    emit HaloStaked(acct, amount, state.totalStakedFor[acct], state.stakeNumber[acct]);
  }
}
