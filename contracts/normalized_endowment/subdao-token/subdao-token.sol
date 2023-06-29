// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {IAccountsDonationMatch} from "../../core/accounts/interfaces/IAccountsDonationMatch.sol";
import {SubDaoTokenMessage} from "./message.sol";
import {subDaoTokenStorage} from "./storage.sol";
// import {ISubDaoTokenEmitter} from "./ISubDaoTokenEmitter.sol";
import {ContinuousToken} from "./Token/Continous.sol";

/**
 *@title SubDaoToken
 * @dev SubDaoToken contract
 */
contract SubDaoToken is Storage, ContinuousToken {
  using SafeMath for uint256;

  // bool initFlag = false;
  address emitterAddress;

  /**
   * @dev Initialize contract
   * @param message SubDaoTokenMessage.InstantiateMsg used to initialize contract
   * @param emitteraddress address
   */
  function continuosToken(
    SubDaoTokenMessage.InstantiateMsg memory message,
    address emitteraddress
  ) public initializer {
    require(emitteraddress != address(0), "Invalid Address");
    emitterAddress = emitteraddress;
    initveToken(
      message.name,
      message.symbol,
      subDaoTokenStorage.getReserveRatio(message.ve_type),
      message.reserveDenom
    );

    tokenInfo.name = message.name;
    tokenInfo.symbol = message.symbol;
    tokenInfo.decimals = 18; //Equivalue to message.decimals
    tokenInfo.mint = subDaoTokenStorage.MinterData({minter: address(this), cap: 0, hasCap: false});

    reserveDenom = message.reserveDenom;

    config.unbondingPeriod = message.unbondingPeriod;
    // ISubDaoTokenEmitter(emitterAddress).initializeSubDaoToken(msg);
  }

  //TODO: check we have a un used parameter
  /**
   * @dev This function is used to transfer an amount from the sender to the contract and divide it into four parts: donor's share, endowment's share, burn and the deposit in an endowment contract.
   * @param amount uint256
   * @param accountscontract address
   * @param endowmentId uint256
   * @param donor address
   */
  function executeDonorMatch(
    uint256 amount,
    address accountscontract,
    uint32 endowmentId,
    address donor
  ) public {
    require(amount > 100, "InvalidZeroAmount");

    //  changing flow as each mint operation changes the amount of tokens that are minted

    // total possible subdao mint for amount  (give 40 % to donor, 40% to endowment, rest burn)
    uint256 totalMinted = mint(amount, address(this));

    uint256 donorAmount = (totalMinted.mul(40)).div(100);
    uint256 endowmentAmount = (totalMinted.mul(40)).div(100);
    uint256 burnAmount = totalMinted.sub(donorAmount).sub(endowmentAmount);

    require(IERC20(address(this)).transfer(donor, donorAmount), "Transfer failed"); // 40% to donor

    burn(burnAmount, address(this)); // 20% burn

    require(IERC20(address(this)).approve(accountscontract, endowmentAmount), "Approve failed");

    IAccountsDonationMatch(accountscontract).depositDonationMatchErC20(
      endowmentId,
      address(this),
      endowmentAmount
    );

    // transfer reserve token from sender to this contract
    require(
      IERC20(reserveDenom).transferFrom(msg.sender, address(this), amount),
      "TransferFrom failed"
    );
  }

  /**
   * @dev This function is used to transfer an amount from the sender to the contract and mint the same amount for the sender.
   * @param amount uint256
   */
  function executeBuyCw20(uint256 amount) public {
    require(amount > 100, "InvalidZeroAmount");
    require(
      IERC20(reserveDenom).transferFrom(msg.sender, address(this), amount),
      "TransferFrom failed"
    );
    // ISubDaoTokenEmitter(emitterAddress).transferFromSt(
    //     reserveDenom,
    //     msg.sender,
    //     address(this),
    //     amount
    // );

    mint(amount, msg.sender);
    // ISubDaoTokenEmitter(emitterAddress).mintSt(
    //     address(this),
    //     amount,
    //     msg.sender
    // );
  }

  /**
   * @dev This function is used to transfer an amount from the contract to the given `reciver` and burn the same amount from the sender.
   * @param amount uint256
   * @param reciver address
   */
  function executeSell(address reciver, uint256 amount) public {
    doSell(reciver, amount);
  }

  /**
   * @dev This function is an internal function used by the `executeSell` function to perform the actual transfer and burn operations.
   * @param amount uint256
   * @param reciver address
   */
  function doSell(address reciver, uint256 amount) internal {
    uint256 burnedAmount = burn(amount, reciver);
    // ISubDaoTokenEmitter(emitterAddress).burnSt(
    //     address(this),
    //     burnedAmount
    // );

    CLAIM_AMOUNT[msg.sender].details.push(
      subDaoTokenStorage.claimInfo({
        releaseTime: (config.unbondingPeriod + block.timestamp),
        amount: burnedAmount,
        isClaimed: false
      })
    );

    // emit event
    // ISubDaoTokenEmitter(emitterAddress).addClaimSt(
    //     msg.sender,
    //     subDaoTokenStorage.claimInfo({
    //         releaseTime: (config.unbondingPeriod +
    //             block.timestamp),
    //         amount: burnedAmount,
    //         isClaimed: false
    //     })
    // );
  }

  /**
   * @notice This function is used to check and claim the token release from the unbonding period.
   */
  function claimTokens() public {
    uint256 amount = claimTokensCheck(msg.sender);

    require(amount > 0, "NothingToClaim");

    require(IERC20(reserveDenom).transfer(msg.sender, amount), "Transfer failed");
    // ISubDaoTokenEmitter(emitterAddress).transferSt(
    //     reserveDenom,
    //     msg.sender,
    //     amount
    // );
  }

  /**
   * @notice This function is used to check if the release time of the token has passed and if the token can be claimed.
   * @param sender address
   * @return amount Amount of claimable tokens
   */
  function claimTokensCheck(address sender) internal returns (uint256) {
    uint256 amount = 0;

    for (uint256 i = 0; i < CLAIM_AMOUNT[sender].details.length; i++) {
      if (
        CLAIM_AMOUNT[sender].details[i].releaseTime < block.timestamp &&
        !CLAIM_AMOUNT[sender].details[i].isClaimed
      ) {
        amount += CLAIM_AMOUNT[sender].details[i].amount;
        CLAIM_AMOUNT[sender].details[i].isClaimed = true;
        // ISubDaoTokenEmitter(emitterAddress).claimSt(sender, i);
      }
    }

    return amount;
  }

  /**
   * @notice This function is used to check if the token can be claimed.
   * @return amount Amount of claimable tokens
   */
  function checkClaimableTokens() public view returns (uint256) {
    uint256 amount = 0;

    for (uint256 i = 0; i < CLAIM_AMOUNT[msg.sender].details.length; i++) {
      if (
        CLAIM_AMOUNT[msg.sender].details[i].releaseTime < block.timestamp &&
        !CLAIM_AMOUNT[msg.sender].details[i].isClaimed
      ) {
        amount += CLAIM_AMOUNT[msg.sender].details[i].amount;
      }
    }

    return amount;
  }
}
