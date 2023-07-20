// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import "./storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IIndexFund} from "./IIndexFund.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {Array, Array32} from "../../lib/array.sol";
import {Utils} from "../../lib/utils.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import {AccountMessages} from "../accounts/message.sol";

uint256 constant MAX_ENDOWMENT_MEMBERS = 10;

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

    require(registrarContract != address(0), "invalid registrar address");
    state.config = IndexFundStorage.Config({
      registrarContract: registrarContract,
      fundRotation: fundRotation,
      fundingGoal: fundingGoal
    });

    state.activeFund = 0;
    state.nextFundId = 1;
    state.roundDonations = 0;
    state.nextRotationBlock = block.number + state.config.fundRotation;
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
    require(registrarContract != address(0), "Invalid Registrar address");

    state.config.registrarContract = registrarContract;
    state.config.fundRotation = fundRotation;

    if (fundingGoal != 0) {
      if (fundingGoal < state.roundDonations) {
        revert("Invalid Inputs");
      }
      state.config.fundingGoal = fundingGoal;
    } else {
      state.config.fundingGoal = 0;
    }

    emit ConfigUpdated();
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

    // If there are no funds created or no active funds yet, set the new
    // fund being created now to be the active fund
    if (state.activeFund == 0) {
      state.activeFund = state.nextFundId;
      emit ActiveFundUpdated(state.activeFund);
    }

    if (rotatingFund) {
      state.rotatingFunds.push(state.nextFundId);
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
    require(!fundIsExpired(state.Funds[fundId], block.timestamp), "Fund Expired");
    removeFund(fundId);
  }

  /**
   *  @notice function to remove endowment member from all Funds globally.
   *  Used by Accounts contract when an Endowment closes down.
   *  @dev can be called by owner to remove a endowment from all the index funds
   *  @param endowment endowment to be removed from index fund
   */
  function removeMember(uint32 endowment) external {
    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      address(0) != registrar_config.accountsContract,
      "Accounts contract not configured in Registrar"
    );
    require(msg.sender == registrar_config.accountsContract, "Unauthorized");

    bool found;
    uint32 index;
    // remove endowment from all involved funds if in their endowments array
    for (uint32 i = 0; i < state.FundsByEndowment[endowment].length; i++) {
      uint256 fundId = state.FundsByEndowment[endowment][i];
      (index, found) = Array32.indexOf(state.Funds[fundId].endowments, endowment);
      if (found) {
        Array32.remove(state.Funds[fundId].endowments, index);
        emit MemberRemoved(fundId, endowment);
      }
      // if endowment removal results in a fund having zero endowment members left, close out the fund
      if (state.Funds[fundId].endowments.length == 0) {
        removeFund(fundId);
      }
    }
    // wipe involved funds for the target endowment member ID
    uint256[] memory empty;
    state.FundsByEndowment[endowment] = empty;
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
    require(!fundIsExpired(state.Funds[fundId], block.timestamp), "Fund Expired");

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
   * @param splitToLiquid integer % of deposit to be split to liquid balance
   */
  function depositERC20(
    uint256 fundId,
    address token,
    uint256 amount,
    uint256 splitToLiquid
  ) external nonReentrant {
    require(amount > 0, "Amount to donate must be greater than zero");
    require(splitToLiquid <= 100, "Invalid liquid split");

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();
    require(
      address(0) != registrar_config.accountsContract,
      "Accounts contract not configured in Registrar"
    );

    // tokens must be transfered from the senter to this contract
    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    // we give allowance to accounts contract
    IERC20(token).safeApprove(registrar_config.accountsContract, amount);

    uint256 split;
    if (fundId != 0) {
      // Depositor has chosen a specific fund to send tokens to. Send 100% to that fund.
      require(!fundIsExpired(state.Funds[fundId], block.timestamp), "Expired Fund");
      split = calculateSplit(
        registrar_config.splitToLiquid,
        state.Funds[fundId].splitToLiquid,
        splitToLiquid
      );
      processDonations(registrar_config.accountsContract, fundId, split, token, amount);
    } else {
      // No explicit fund ID specifed. Send the tokens to current active fund, rotating to a new active
      // fund each time the funding goal is hit, until all deposited tokens have been exhausted

      // first pass clean up: start by removing all expired funds from rotating funds list
      for (uint256 i = 0; i < state.rotatingFunds.length - 1; i++) {
        if (fundIsExpired(state.Funds[state.rotatingFunds[i]], block.timestamp)) {
          Array.remove(state.rotatingFunds, i);
        }
      }
      require(
        state.rotatingFunds.length > 0,
        "Must have rotating funds active to pass a Fund ID of 0"
      );

      // if block based fund rotations are turned on...
      if (state.config.fundRotation != 0) {
        // check if block limit has been reached/exceeded since last contract call
        // and that there are actually active rotating funds to rotate
        if (state.rotatingFunds.length > 0 && block.number >= state.nextRotationBlock) {
          state.activeFund = rotateFund(state.activeFund);
          emit ActiveFundUpdated(state.activeFund);
          state.roundDonations = 0;

          while (block.number >= state.nextRotationBlock) {
            state.nextRotationBlock += state.config.fundRotation;
          }
        }
      }

      // Send all funds to the Active Fund since there's no funding goal to hit to trigger a rotation
      if (state.config.fundingGoal == 0) {
        split = calculateSplit(
          registrar_config.splitToLiquid,
          state.Funds[state.activeFund].splitToLiquid,
          splitToLiquid
        );
        processDonations(registrar_config.accountsContract, state.activeFund, split, token, amount);
      } else {
        // Check if funding goal is met for current active fund and rotate funds until all tokens are depleted
        uint256 loopDonation = 0;
        uint256 goalLeftover = state.config.fundingGoal - state.roundDonations;
        while (amount > 0) {
          if (amount >= goalLeftover) {
            state.roundDonations = 0;
            // set state active fund to next fund for next loop iteration
            state.activeFund = rotateFund(state.activeFund);
            emit ActiveFundUpdated(state.activeFund);
            loopDonation = goalLeftover;
          } else {
            state.roundDonations += amount;
            loopDonation = amount;
          }
          split = calculateSplit(
            registrar_config.splitToLiquid,
            state.Funds[state.activeFund].splitToLiquid,
            splitToLiquid
          );
          processDonations(
            registrar_config.accountsContract,
            state.activeFund,
            split,
            token,
            loopDonation
          );
          // deduct donated amount in this round from total donation amt
          amount -= loopDonation;
        }
      }
    }
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~
   *     Queries
   * ~~~~~~~~~~~~~~~~~~~
   */

  // TODO: Edit Query functions with start and limit to optimise the size of data being returned

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

    if (state.activeFund == fundId) {
      state.activeFund = rotateFund(fundId);
      emit ActiveFundUpdated(state.activeFund);
    }

    // remove from rotating funds list
    bool found;
    uint256 index;
    (index, found) = Array.indexOf(state.rotatingFunds, fundId);
    if (found) {
      Array.remove(state.rotatingFunds, index);
    }

    emit FundRemoved(fundId);
  }

  /**
   * @dev Process and execute donation messages for a Fund, Split and Amount
   * @param fundId index fund ID
   * @param liquidSplit Split to liquid
   * @param amount Balance of fund
   */
  function processDonations(
    address accountsContract,
    uint256 fundId,
    uint256 liquidSplit,
    address token,
    uint256 amount
  ) internal {
    uint32[] memory endowments = state.Funds[fundId].endowments;
    require(endowments.length > 0, "Fund must have endowment members");
    require(!fundIsExpired(state.Funds[fundId], block.timestamp), "Expired Fund");
    require(amount > 0, "Amount cannot be zero");

    uint256 lockedSplit = 100 - liquidSplit;
    uint256 endowmentPortion = amount.div(endowments.length);

    // execute donation messages for each endowment in the fund
    bytes memory callData;
    for (uint256 i = 0; i < endowments.length; i++) {
      callData = abi.encodeWithSignature(
        "depositERC20((uint256,uint256,uint256),address,uint256)",
        AccountMessages.DepositRequest({
          id: endowments[i],
          lockedPercentage: lockedSplit,
          liquidPercentage: liquidSplit
        }),
        token,
        endowmentPortion
      );
      Utils._execute(accountsContract, 0, callData);
    }

    emit DonationProcessed(fundId);
  }

  /**
   * @dev Calculate split
   * @param registrar_split Registrar split
   * @param fundSplit Fund split (set on index fund contract)
   * @param userSplit User split
   */

  function calculateSplit(
    LibAccounts.SplitDetails memory registrar_split,
    uint256 fundSplit,
    uint256 userSplit
  ) internal pure returns (uint256) {
    uint256 split = 0;

    if (fundSplit == 0) {
      if (userSplit == 0) {
        split = registrar_split.defaultSplit;
      } else {
        if (userSplit > registrar_split.min && userSplit < registrar_split.max) {
          split = userSplit;
        }
      }
    } else {
      split = fundSplit;
    }

    return split;
  }

  /**
   * @dev Check if fund is expired
   * @param fund Fund
   * @param envTime block time
   * @return True if fund is expired
   */
  function fundIsExpired(
    IndexFundStorage.Fund memory fund,
    uint256 envTime
  ) internal pure returns (bool) {
    return (fund.expiryTime != 0 && envTime >= fund.expiryTime);
  }

  /**
   * @dev rotate active based if investment goal is fulfilled
   * @param rFund Active fund
   * @return New active fund
   */
  function rotateFund(uint256 rFund) internal view returns (uint256) {
    require(state.rotatingFunds.length > 0, "No rotating Funds");

    bool found;
    uint256 index;
    (index, found) = Array.indexOf(state.rotatingFunds, rFund);
    // If the current active fund is not found in the rotating funds list (for whatever reason)
    // OR the current active fund is the last item in the rotating funds list...
    if (!found || index == state.rotatingFunds.length - 1) {
      // set to the first fund in the rotating funds list
      return state.Funds[state.rotatingFunds[0]].id;
    } else {
      // otherwise set the next fund in rotating funds list
      return state.Funds[state.rotatingFunds[index + 1]].id;
    }
  }
}
