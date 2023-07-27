// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import "./storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {Validator} from "../validator.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IIndexFund} from "./IIndexFund.sol";
import {Array, Array32} from "../../lib/array.sol";
import {Utils} from "../../lib/utils.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {AccountMessages} from "../accounts/message.sol";
import {IAccounts} from "../accounts/interfaces/IAccounts.sol";

uint256 constant MAX_ENDOWMENT_MEMBERS = 10;
uint256 constant MIN_AMOUNT_PER_ENDOWMENT = 100;

/**
 * @title Index Fund
 * @notice User can deposit/donate to a collection of endowments (ie. funds) through this contract
 * @dev IndexFund is a contract that manages the funds of the angelcore platform
 * It is responsible for creating new funds, adding endowments to funds, and
 * distributing funds to the endowment members
 */
contract IndexFund is IIndexFund, Storage, OwnableUpgradeable, ReentrancyGuard {
  using SafeERC20 for IERC20;
  using SafeMath for uint256;

  /**
   * @notice Initializer function for index fund contract, to be called when proxy is deployed
   * @dev This function is called by deployer only once at the time of initialization
   * @param registrarContract Registrar Contract address
   * @param fundRotation how many blocks are in a rotation cycle for the active IndexFund
   * @param fundingGoal donation funding limit to trigger early cycle of the Active IndexFund
   */
  function initialize(
    address registrarContract,
    uint256 fundRotation,
    uint256 fundingGoal
  ) external initializer {
    __Ownable_init_unchained();

    // active fund rotations can set by either a Time-based or Amoount-based
    // or neither (wherein both are == 0)
    state.config.fundRotation = fundRotation;
    if (fundingGoal == 0 || (fundRotation == 0 && fundingGoal > 0)) {
      state.config.fundingGoal = fundingGoal;
    } else {
      revert("Invalid Fund Rotation configuration");
    }

    if (Validator.addressChecker(registrarContract)) {
      state.config = IndexFundStorage.Config({
        registrarContract: registrarContract,
        fundRotation: fundRotation,
        fundingGoal: fundingGoal
      });
    }

    state.activeFund = 0;
    state.nextFundId = 1;
    state.roundDonations = 0;
    state.nextRotationBlock = block.number + state.config.fundRotation;
    emit Instantiated(registrarContract, fundRotation, fundingGoal);
  }

  /**
   * @notice function to update config of index fund
   * @dev can be called by owner to set new config
   * @param registrarContract Registrar Contract address
   * @param fundRotation how many blocks are in a rotation cycle for the active IndexFund
   * @param fundingGoal donation funding limit to trigger early cycle of the Active IndexFund
   */
  function updateConfig(
    address registrarContract,
    uint256 fundRotation,
    uint256 fundingGoal
  ) external onlyOwner {
    if (Validator.addressChecker(registrarContract)) {
      state.config.registrarContract = registrarContract;
    }

    // active fund rotations can set by either a Time-based or Amoount-based
    // or neither (wherein both are == 0)
    state.config.fundRotation = fundRotation;
    if (fundingGoal == 0 || (fundRotation == 0 && fundingGoal > 0)) {
      state.config.fundingGoal = fundingGoal;
    } else {
      revert("Invalid Fund Rotation configuration");
    }

    emit ConfigUpdated(registrarContract, fundingGoal, fundRotation);
  }

  /**
   * @notice function to create a new Fund
   * @dev can be called by owner to create a new Fund
   * @param name name of the Fund
   * @param description description of the Fund
   * @param endowments array of endowments in the Fund
   * @param rotatingFund boolean to indicate if the Fund is rotating fund
   * @param splitToLiquid split of Fund donations to liquid portion of endowment account
   * @param expiryTime expiry time of the Fund
   */
  function createIndexFund(
    string memory name,
    string memory description,
    uint32[] memory endowments,
    bool rotatingFund,
    uint256 splitToLiquid,
    uint256 expiryTime
  ) external onlyOwner {
    require(endowments.length > 0, "Fund must have one or more endowment members");
    require(
      endowments.length <= MAX_ENDOWMENT_MEMBERS,
      "Fund endowment members exceeds upper limit"
    );
    require(splitToLiquid <= 100, "Invalid split: must be less or equal to 100");
    require(expiryTime == 0 || expiryTime > block.timestamp, "Invalid expiry time");

    state.Funds[state.nextFundId] = IndexFundStorage.Fund({
      id: state.nextFundId,
      name: name,
      description: description,
      endowments: endowments,
      splitToLiquid: splitToLiquid,
      expiryTime: expiryTime
    });

    for (uint8 i = 0; i < endowments.length; i++) {
      state.FundsByEndowment[endowments[i]].push(state.nextFundId);
    }

    if (rotatingFund) {
      state.rotatingFunds.push(state.nextFundId);
      // If there are no funds created or no active funds yet
      // or if the current active fund is expired:
      if (state.activeFund == 0 || fundIsExpired(state.activeFund, block.timestamp)) {
        // prep rotating funds list & set the next Active Fund
        prepRotatingFunds();
        state.activeFund = nextActiveFund();
      }
    }

    emit FundCreated(state.nextFundId);
    state.nextFundId += 1;
  }

  /**
   * @notice function to remove index fund
   * @dev can be called by owner to remove an index fund
   * @param fundId id of index fund to be removed
   */
  function removeIndexFund(uint256 fundId) external onlyOwner {
    require(!fundIsExpired(fundId, block.timestamp), "Fund Expired");
    removeFund(fundId);
  }

  /**
   *  @notice function to remove endowment member from all Funds globally.
   *  Used by Accounts contract when an Endowment closes down.
   *  @dev can be called by owner to remove a endowment from all the index funds
   *  @param endowment endowment to be removed from index fund
   */
  function removeMember(uint32 endowment) external {
    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(msg.sender == registrarConfig.accountsContract, "Unauthorized");

    bool found;
    uint32 index;
    // remove endowment from all involved funds if in their endowments array
    for (uint32 i = 0; i < state.FundsByEndowment[endowment].length; i++) {
      uint256 fundId = state.FundsByEndowment[endowment][i];
      (index, found) = Array32.indexOf(state.Funds[fundId].endowments, endowment);
      if (found) {
        Array32.remove(state.Funds[fundId].endowments, index);
        emit MemberRemoved(fundId, endowment);
        // if endowment removal results in a fund having zero endowment members left, close out the fund
        if (state.Funds[fundId].endowments.length == 0) {
          removeFund(fundId);
        }
      }
    }
    // wipe involved funds for the target endowment member ID
    delete state.FundsByEndowment[endowment];
  }

  /**
   *  @notice Function to update a Fund's endowment members
   *  @dev Can be called by owner to add/remove endowments to a Fund
   *  @param fundId The id of the Fund to be updated
   *  @param endowments An array of endowments to be set for a Fund
   */
  function updateFundMembers(uint256 fundId, uint32[] memory endowments) external onlyOwner {
    require(endowments.length > 0, "Must pass at least one endowment member to add to the Fund");
    require(
      endowments.length <= MAX_ENDOWMENT_MEMBERS,
      "Fund endowment members exceeds upper limit"
    );
    require(!fundIsExpired(fundId, block.timestamp), "Fund Expired");

    uint32[] memory currEndowments = state.Funds[fundId].endowments;
    bool found;
    uint32 index;
    uint256 fundIndex;

    // sort out which of the endowments passed need to be added to a Fund
    for (uint32 i = 0; i < endowments.length; i++) {
      (index, found) = Array32.indexOf(currEndowments, endowments[i]);
      // if found in current Endowments, there's nothing we need to do
      // if NOT in current Endowments, then we need to add it
      if (!found) {
        state.FundsByEndowment[endowments[i]].push(fundId);
      }
    }

    // sort out which of the current endowments need to be removed from a Fund
    for (uint32 i = 0; i < currEndowments.length; i++) {
      (index, found) = Array32.indexOf(endowments, currEndowments[i]);
      // if found in new Endowments, there's nothing we need to do
      // if NOT in new Endowments list, we need to remove it
      if (!found) {
        // remove fund from the endowment's involved funds list
        uint256[] memory involvedFunds = state.FundsByEndowment[currEndowments[i]];
        (fundIndex, found) = Array.indexOf(involvedFunds, fundId);
        Array.remove(state.FundsByEndowment[currEndowments[i]], fundIndex);
      }
      // if endowment removal results in a fund having zero endowment members left, close out the fund
      if (state.Funds[fundId].endowments.length == 0) {
        removeFund(fundId);
      }
    }
    // set array of endowment members on the Fund
    state.Funds[fundId].endowments = endowments;
    emit MembersUpdated(fundId, endowments);
  }

  /**
   * @notice deposit function which can be called by user to add funds to index fund
   * @dev converted from rust implementation, handles donations by managing limits and rotating active fund
   * @param fundId index fund ID
   * @param token address of Token being deposited
   * @param amount amount of Token being deposited
   */
  function depositERC20(uint256 fundId, address token, uint256 amount) external nonReentrant {
    require(amount > 0, "Amount to donate must be greater than zero");

    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
      .queryConfig();
    require(
      Validator.addressChecker(registrarConfig.accountsContract),
      "Accounts contract not configured in Registrar"
    );

    // tokens must be transfered from the sender to this contract
    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    // now index funds contracts gives allowance to accounts contract
    // OZ SafeERC20 bug for non-zero to non-zeo approvals (https://github.com/code-423n4/2021-09-yaxis-findings/issues/63)
    // zero out allowance first and then set allowance as amount deposited
    IERC20(token).safeApprove(registrarConfig.accountsContract, 0);
    IERC20(token).safeApprove(registrarConfig.accountsContract, amount);

    if (fundId != 0) {
      // Depositor has chosen a specific fund to send tokens to. Send 100% to that fund.
      require(!fundIsExpired(fundId, block.timestamp), "Expired Fund");
      // send donation messages to Accounts contract
      processDonations(
        registrarConfig.accountsContract,
        fundId,
        state.Funds[fundId].splitToLiquid,
        token,
        amount
      );
    } else {
      // No explicit fund ID specifed. Send the tokens to current active fund, rotating to a new active
      // fund each time the funding goal is hit, until all deposited tokens have been exhausted

      // start by removing all expired funds from rotating funds list
      prepRotatingFunds();
      require(state.rotatingFunds.length > 0, "No rotating funds");

      if (state.config.fundRotation > 0 && state.config.fundingGoal == 0) {
        // Block-based rotation of Funds
        // check if block limit has been reached/exceeded since last contract call
        // and that there are actually active rotating funds to rotate
        if (block.number >= state.nextRotationBlock) {
          state.activeFund = nextActiveFund();
          state.roundDonations = 0;
          state.nextRotationBlock = block.number + state.config.fundRotation;
        }
        // send donation messages to Accounts contract
        processDonations(
          registrarConfig.accountsContract,
          state.activeFund,
          state.Funds[state.activeFund].splitToLiquid,
          token,
          amount
        );
      } else if (state.config.fundRotation == 0 && state.config.fundingGoal > 0) {
        // Fundraising Goal-based rotation of Funds
        // Check if funding goal is met for current active fund and rotate funds
        // until all donated tokens are depleted
        uint256 rounds = 1;
        uint256 goalLeftover = state.config.fundingGoal - state.roundDonations;
        // check that the amount donated will have enough funds for the last round of donations
        if (amount > goalLeftover) {
          uint256 postFirstRoundAmnt = amount - goalLeftover;
          rounds += postFirstRoundAmnt.div(state.config.fundingGoal);
          if (postFirstRoundAmnt % state.config.fundingGoal > 0) {
            // check that the final round amount is greater than the min amount per endowment
            // multipled by the max members in a fund (assume a full final fund for safety)
            require(
              postFirstRoundAmnt % state.config.fundingGoal >=
                MIN_AMOUNT_PER_ENDOWMENT.mul(MAX_ENDOWMENT_MEMBERS),
              "Not enough funds to cover all rounds"
            );
            rounds += 1;
          }
        }

        uint256 loopDonation;
        for (uint256 round = 0; round < rounds; round++) {
          goalLeftover = state.config.fundingGoal - state.roundDonations;
          if (amount < goalLeftover) {
            loopDonation = amount;
            state.roundDonations += amount;
          } else {
            loopDonation = goalLeftover;
            state.roundDonations = 0;
          }
          // deduct donated amount in this round from total donation amt
          amount -= loopDonation;

          // send donation messages to Accounts contract
          processDonations(
            registrarConfig.accountsContract,
            state.activeFund,
            state.Funds[state.activeFund].splitToLiquid,
            token,
            loopDonation
          );

          // set state active fund to next fund for next loop iteration if goal remaining
          // was met/exceeded with the amount donated in this loop
          if (loopDonation == goalLeftover) {
            state.activeFund = nextActiveFund();
          }
        }
      } else {
        revert("Active Donation rotations are not properly configured");
      }
    }
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~
   *     Queries
   * ~~~~~~~~~~~~~~~~~~~
   */

  /**
   * @dev Query config
   * @return Config
   */
  function queryConfig() external view returns (IndexFundStorage.Config memory) {
    return state.config;
  }

  /**
   * @dev Query state
   * @return State
   */
  function queryState() external view returns (IIndexFund.StateResponse memory) {
    return
      IIndexFund.StateResponse({
        activeFund: state.activeFund,
        roundDonations: state.roundDonations,
        nextRotationBlock: state.nextRotationBlock
      });
  }

  /**
   * @dev Query rotating funds list
   * @return List of rotating fund IDs
   */
  function queryRotatingFunds() external view returns (uint256[] memory) {
    return state.rotatingFunds;
  }

  /**
   * @dev Query fund details
   * @param fundId Fund id
   * @return Fund details
   */
  function queryFundDetails(uint256 fundId) external view returns (IndexFundStorage.Fund memory) {
    require(state.Funds[fundId].endowments.length > 0, "Invalid Fund ID");
    return state.Funds[fundId];
  }

  /**
   * @dev Query in which index funds is an endowment part of
   * @param endowmentId Endowment id
   * @return Fund details
   */
  function queryInvolvedFunds(uint32 endowmentId) external view returns (uint256[] memory) {
    return state.FundsByEndowment[endowmentId];
  }

  /**
   * @dev Query active fund details
   * @return Fund details
   */
  function queryActiveFundDetails() external view returns (IndexFundStorage.Fund memory) {
    require(state.activeFund != 0, "Active fund not set");
    return state.Funds[state.activeFund];
  }

  /*
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~
   *     Internal functions
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * @dev Removes a passed fund ID, updating the active fund as well (if needed)
   * @param fundId index fund ID
   */
  function removeFund(uint256 fundId) internal {
    // "expire" the fund by updating the expire time to now
    state.Funds[fundId].expiryTime = block.timestamp;
    // clean up the rotating funds list (save users some gas later)
    prepRotatingFunds();
    // if removed Fund ID was the active Fund and we have funds left to rotate with after prep clean up,
    // try to set the next Active fund
    if (state.activeFund == fundId && state.rotatingFunds.length > 0) {
      state.activeFund = nextActiveFund();
    }
    emit FundRemoved(fundId);
  }

  /**
   * @dev Process and execute donation messages for a Fund, Split and Amount
   * @param accountsContract Accounts contract address
   * @param fundId Fund ID
   * @param liquidSplit Split to liquid percentage
   * @param token Token address of token to donate
   * @param amount Token amount to send to donate
   */
  function processDonations(
    address accountsContract,
    uint256 fundId,
    uint256 liquidSplit,
    address token,
    uint256 amount
  ) internal {
    require(state.Funds[fundId].endowments.length > 0, "Fund must have members");
    // require enough funds to allow for downstream fees calulations, etc
    require(
      amount >= MIN_AMOUNT_PER_ENDOWMENT.mul(state.Funds[fundId].endowments.length),
      "Amount must be enough to cover the minimum units per endowment for all members of a Fund"
    );

    // execute donation message for each endowment in the fund
    for (uint256 i = 0; i < state.Funds[fundId].endowments.length; i++) {
      IAccounts(accountsContract).depositERC20(
        AccountMessages.DepositRequest({
          id: state.Funds[fundId].endowments[i],
          lockedPercentage: 100 - liquidSplit,
          liquidPercentage: liquidSplit
        }),
        token,
        amount.div(state.Funds[fundId].endowments.length)
      );
    }

    emit DonationProcessed(fundId);
  }

  /**
   * @dev Check if fund is expired
   * @param fundId Fund ID to check expired status
   * @param envTime block time
   * @return True if Fund is expired
   */
  function fundIsExpired(uint256 fundId, uint256 envTime) internal view returns (bool) {
    return (state.Funds[fundId].expiryTime != 0 && envTime > state.Funds[fundId].expiryTime);
  }

  /**
   * @dev Removes all expired funds from the Rotating Funds array
   * Used before any active fund donations logic that would require rotating funds
   * to ensure that we do not ever donate to an expired fund and
   * the rotating funds has members still after the clean up process.
   */
  function prepRotatingFunds() internal {
    for (uint256 i = 0; i < state.rotatingFunds.length; i++) {
      if (fundIsExpired(state.rotatingFunds[i], block.timestamp)) {
        Array.remove(state.rotatingFunds, i);
      }
    }
  }

  /**
   * @dev Find next active fund ID from the rotating funds list
   * @return Next active fund ID
   */
  function nextActiveFund() internal returns (uint256) {
    bool found;
    uint256 index;
    (index, found) = Array.indexOf(state.rotatingFunds, state.activeFund);
    // If the current active fund is not found in the rotating funds list (for whatever reason)
    // OR the current active fund is the last item in the rotating funds list...
    if (!found || index == state.rotatingFunds.length - 1) {
      // return the first fund in the rotating funds list
      emit ActiveFundUpdated(state.rotatingFunds[0]);
      return state.rotatingFunds[0];
    } else {
      // otherwise return the next fund in rotating funds list
      emit ActiveFundUpdated(state.rotatingFunds[index + 1]);
      return state.rotatingFunds[index + 1];
    }
  }
}
