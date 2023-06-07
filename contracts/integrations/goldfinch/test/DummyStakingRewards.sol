// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IStakingRewards} from "../IStakingRewards.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyStakingRewards is ERC721, IStakingRewards {
  // Test helpers
  mapping(uint256 => uint256) public balanceByTokenId;
  mapping(uint256 => uint256) public rewardsByTokenId;
  uint256 counter;
  IERC20 rewardToken;
  IERC20 stakeToken;

  constructor(address _rewardToken, address _stakeToken) ERC721("TEST", "TEST") {
    rewardToken = IERC20(_rewardToken);
    stakeToken = IERC20(_stakeToken);
  }

  function setRewardByToken(uint256 tokenId, uint256 amount) external {
    rewardsByTokenId[tokenId] = amount;
  }

  function setBalanceByToken(uint256 tokenId, uint256 amount) external {
    balanceByTokenId[tokenId] = amount;
  }

  function setCounter(uint256 num) external {
    counter = num;
  }

  // Interface implementation
  function getPosition(uint256 tokenId) external view returns (StakedPosition memory) {
    require(tokenId > 0, "Invalid token ID");
    StakedPosition memory position;
    position.amount = balanceByTokenId[tokenId];
    return position;
  }

  function getReward(uint256 tokenId) external {
    rewardToken.transfer(msg.sender, rewardsByTokenId[tokenId]);
  }

  function unstake(uint256 tokenId, uint256 amount) external {
    balanceByTokenId[tokenId] -= amount;
    stakeToken.transfer(msg.sender, amount);
  }

  function addToStake(uint256 tokenId, uint256 amount) external {
    stakeToken.transferFrom(msg.sender, address(this), amount);
    balanceByTokenId[tokenId] += amount;
  }

  function stakedBalanceOf(uint256 tokenId) external view returns (uint256) {
    return balanceByTokenId[tokenId];
  }

  function depositToveAndStakeFrom(
    address nftRecipient,
    uint256 fiduAmount,
    uint256 usdcAmount
  ) external {}

  function kick(uint256 tokenId) external {}

  function accumulatedRewardsPerToken() external view returns (uint256) {}

  function lastUpdateTime() external view returns (uint256) {}

  function stake(uint256 amount, StakedPositionType) external returns (uint256) {
    stakeToken.transferFrom(msg.sender, address(this), amount);
    counter++;
    balanceByTokenId[counter] = amount;
    _mint(msg.sender, counter);
    return counter;
  }
}
