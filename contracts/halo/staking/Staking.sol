// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

interface IStakingHalo {
  function updateInterestRate(uint256 interestRate) external;

  function stake(uint256 amount, bytes memory data) external returns (uint256 stakeNumber);

  function stakeFor(
    address user,
    uint256 amount,
    bytes memory data
  ) external returns (uint256 stakeNumber);

  function unstake(uint256 amount, uint256 stakeId, bytes memory data) external;

  function totalStakedFor(address addr) external view returns (uint256);

  function totalStaked() external view returns (uint256);

  function token() external view returns (address);

  function supportsHistory() external pure returns (bool);

  // optional
  function lastStakedFor(address addr) external view returns (uint256);

  function totalStakedForAt(address addr, uint256 blockNumber) external view returns (uint256);

  function totalStakedAt(uint256 blockNumber) external view returns (uint256);
}

/**
 *@title Staking
 * @dev Staking contract
 * The `Staking` contract enables users to stake their Halo token in exchange for rewards in form of additional tokens.
 */
contract Staking is Initializable, ERC20, Pausable, ReentrancyGuard, Ownable {
  event HaloStaked(address caller, address targetUser, uint256 amount, uint256 total, bytes data);
  event HaloUnstaked(address user, uint256 amount, uint256 total, bytes data);
  event InterestRateUpdated(uint256 oldValue, uint256 newValue);

  address public haloToken;
  uint256 public interestRate;
  uint256 public totalStaked;

  struct StakeInfo {
    bool started;
    uint256 startTs;
    uint256 endTs;
    uint256 amount;
    uint256 claimed;
  }

  mapping(address => mapping(uint256 => StakeInfo)) public stakeInfos;
  mapping(address => uint256) public stakeNumber;
  mapping(address => uint256) public totalStakedFor;

  constructor() ERC20("Staked Halo Token", "SHT") {}

  struct InstantiateMsg {
    address haloToken;
    uint256 interestRate;
  }

  /**
   * @dev Initialize contract
   * @param details address
   */
  function initialize(InstantiateMsg memory details) public initializer {
    require(details.haloToken != address(0), "Invalid address");
    interestRate = details.interestRate;
    haloToken = details.haloToken;
    totalStaked = 0;
  }

  /**
   * @dev Allows the contract owner to update the interest rate applied to staked tokens.
   * @param _interestRate uint256
   */
  function updateInterestRate(uint256 _interestRate) public nonReentrant onlyOwner {
    require(0 <= _interestRate && _interestRate <= 100, "Invalid interest rate");
    uint256 oldValue = interestRate;
    interestRate = _interestRate;
    emit InterestRateUpdated(oldValue, interestRate);
  }

  // >> CAN CALL `stakeFor` INTERNALLY, REDUCES CODE DUPLICATION
  /**
   * @dev Allows a user to stake their Halo token in exchange for rewards.
   * @param data bytes
   * @param amount uint256
   * @return stakeNumber Return stakeNumber of the user
   */
  function stake(
    uint256 amount,
    bytes memory data
  ) public whenNotPaused nonReentrant returns (uint256) {
    require(IERC20(haloToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");
    stakeNumber[msg.sender]++;
    stakeInfos[msg.sender][stakeNumber[msg.sender]] = StakeInfo({
      started: true,
      startTs: block.timestamp,
      endTs: block.timestamp + 90 days,
      amount: amount,
      claimed: 0
    });

    totalStakedFor[msg.sender] += amount;
    totalStaked += amount;

    _mint(msg.sender, amount);

    emit HaloStaked(msg.sender, msg.sender, amount, totalStakedFor[msg.sender], data);
    return stakeNumber[msg.sender];
  }

  /**
   * @dev Allows the caller to stake tokens for another user.
   * @param data bytes
   * @param amount uint256
   * @param user address
   * @return stakeNumber Return stakeNumber of the user
   */
  function stakeFor(
    address user,
    uint256 amount,
    bytes memory data
  ) public nonReentrant whenNotPaused returns (uint256) {
    require(IERC20(haloToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");
    stakeNumber[user]++;
    stakeInfos[user][stakeNumber[user]] = StakeInfo({
      started: true,
      startTs: block.timestamp,
      endTs: block.timestamp + 90 days,
      amount: amount,
      claimed: 0
    });
    totalStakedFor[user] += amount;
    totalStaked += amount;
    _mint(user, amount);
    // emit Staked event

    emit HaloStaked(msg.sender, user, amount, totalStakedFor[user], data);

    return stakeNumber[user];
  }

  /**
   * @dev Allows a user to unstake their tokens and receive their initial staked amount plus rewards.
   * @param data bytes
   * @param amount uint256
   * @param stakeId uint256
   */
  function unstake(uint256 amount, uint256 stakeId, bytes memory data) public nonReentrant {
    require(stakeInfos[msg.sender][stakeId].started, "Stake not found");
    require(stakeInfos[msg.sender][stakeId].endTs < block.timestamp, "Stake not ended");
    require(
      amount <= stakeInfos[msg.sender][stakeId].amount - stakeInfos[msg.sender][stakeId].claimed,
      "Invalid amount"
    );
    stakeInfos[msg.sender][stakeId].claimed += amount;

    uint256 totalTokens = amount + ((amount * interestRate) / 100);

    require(
      IERC20(haloToken).balanceOf(address(this)) >= totalTokens,
      "Insufficient halo token balance in staking contract"
    );

    require(IERC20(haloToken).transfer(msg.sender, totalTokens), "Transfer failed");

    // burn staking tokens
    _burn(msg.sender, amount);

    totalStakedFor[msg.sender] -= amount;
    totalStaked -= amount;

    // emit Unstaked event
    emit HaloUnstaked(msg.sender, amount, totalStakedFor[msg.sender], data);
  }

  /**
   * @notice Returns the address of the Halo token being staked.
   */
  function token() public view returns (address) {
    return haloToken;
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
}
