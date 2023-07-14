// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import "./storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IndexFundMessage} from "./message.sol";
import {IIndexFund} from "./IIndexFund.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {Array, Array32} from "../../lib/array.sol";
import {Utils} from "../../lib/utils.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import {AccountMessages} from "../accounts/message.sol";

/**
 * @title IndexFund
 * @notice User can deposit/donate to a collection of endowments (ie. funds) through this contract
 * @dev IndexFund is a contract that manages the funds of the angelcore platform
 * It is responsible for creating new funds, adding endowments to funds, and
 * distributing funds to the endowment members
 */
contract IndexFund is IIndexFund, Storage, ReentrancyGuard, Initializable {
  event IndexFundInstantiated();
  event ConfigUpdated();
  event FundCreated(uint256 id);
  event FundRemoved(uint256 id);
  event MemberRemoved(uint256 fundId, uint32 endowmentId);
  event MembersUpdated(uint256 fundId, uint32[] endowments);
  event DonationProcessed(uint256 fundId);
  event ActiveFundUpdated(uint256 fundId);
  event StateUpdated();

  using SafeMath for uint256;

  /**
   * @notice Initializer function for index fund contract, to be called when proxy is deployed
   * @dev This function is called by deployer only once at the time of initialization
   * @param details IndexFundMessage.InstantiateMessage
   */
  function initialize(IndexFundMessage.InstantiateMessage memory details) external initializer {
    require(details.registrarContract != address(0), "invalid registrar address");
    require(details.fundMemberLimit > 0, "Fund endowment limit must be greater than zero");
    state.config = IndexFundStorage.Config({
      owner: msg.sender,
      registrarContract: details.registrarContract,
      fundRotation: details.fundRotation,
      fundMemberLimit: details.fundMemberLimit,
      fundingGoal: details.fundingGoal
    });

    state.totalFunds = 0;
    state.activeFund = 0;
    state.nextFundId = 1;
    state.roundDonations = 0;
    state.nextRotationBlock = block.number + state.config.fundRotation;

    emit IndexFundInstantiated();
  }

  /**
   * @notice function to update config of index fund
   * @dev can be called by owner to set new config
   * @param details IndexFundMessage.UpdateConfigMessage
   */
  function updateConfig(IndexFundMessage.UpdateConfigMessage memory details) external nonReentrant {
    require(msg.sender == state.config.owner, "Unauthorized");
    require(details.fundMemberLimit > 0, "Fund endowment limit must be greater than zero");

    if (details.registrarContract != state.config.registrarContract) {
      require(details.registrarContract != address(0), "Invalid Registrar address");
      state.config.registrarContract = details.registrarContract;
    }

    if (details.owner != state.config.owner) {
      require(details.owner != address(0), "Invalid owner address");
      state.config.owner = details.owner;
    }

    if (details.fundingGoal != 0) {
      if (details.fundingGoal < state.roundDonations) {
        revert("Invalid Inputs");
      }
      state.config.fundingGoal = details.fundingGoal;
    } else {
      state.config.fundingGoal = 0;
    }

    state.config.fundRotation = details.fundRotation;
    state.config.fundMemberLimit = details.fundMemberLimit;

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
  ) external nonReentrant {
    require(msg.sender == state.config.owner, "Unauthorized");
    require(endowments.length > 0, "Fund must have one or more endowment members");
    require(
      endowments.length <= state.config.fundMemberLimit,
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
      state.FundsActiveEndowments[state.nextFundId][endowments[i]] = true;
    }

    // If there are no funds created or no active funds yet, set the new
    // fund being created now to be the active fund
    if (state.totalFunds == 0 || state.activeFund == 0) {
      state.activeFund = state.nextFundId;
      emit ActiveFundUpdated(state.activeFund);
    }

    if (rotatingFund) {
      state.rotatingFunds.push(state.nextFundId);
    }

    emit FundCreated(state.nextFundId);
    state.totalFunds += 1;
    state.nextFundId += 1;
  }

  /**
   * @notice function to remove index fund
   * @dev can be called by owner to remove an index fund
   * @param fundId id of index fund to be removed
   */
  function removeIndexFund(uint256 fundId) external nonReentrant {
    require(msg.sender != state.config.owner, "Unauthorized");
    removeFund(fundId);
  }

  /**
   *  @notice function to remove endowment member from all Funds globally. Used by Accounts contract when an Endowment closes down.
   *  @dev can be called by owner to remove a endowment from all the index funds
   *  @param endowment endowment to be removed from index fund
   */
  function removeMember(uint32 endowment) external nonReentrant {
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
      if (state.FundsActiveEndowments[fundId][endowment]) {
        state.FundsActiveEndowments[fundId][endowment] = false;
        (index, found) = Array32.indexOf(state.Funds[fundId].endowments, endowment);
        Array32.remove(state.Funds[fundId].endowments, index);
        emit MemberRemoved(fundId, endowment);
        // if endowment removal results in a fund having zero endowment members left, close out the fund
        if (state.Funds[fundId].endowments.length == 0) {
          removeFund(fundId);
        }
      }
    }
    delete state.FundsByEndowment[endowment];
  }

  /**
   *  @notice Function to update a Fund's endowment members
   *  @dev Can be called by owner to add/remove endowments to a Fund
   *  @param fundId The id of the Fund to be updated
   *  @param endowments An array of endowments to be set for a Fund
   */
  function updateFundMembers(uint256 fundId, uint32[] memory endowments) external nonReentrant {
    require(msg.sender == state.config.owner, "Unauthorized");
    require(endowments.length > 0, "Must pass at least one endowment member to add to the Fund");
    require(
      endowments.length <= state.config.fundMemberLimit,
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
        state.FundsActiveEndowments[fundId][endowments[i]] = true;
      }
    }

    // sort out which of the current endowments need to be removed from a Fund
    for (uint32 i = 0; i < currEndowments.length; i++) {
      (index, found) = Array32.indexOf(endowments, currEndowments[i]);
      // if found in new Endowments, there's nothing we need to do
      // if NOT in new Endowments list, we need to remove it
      if (!found) {
        state.FundsActiveEndowments[fundId][currEndowments[i]] = false;
        // remove fund from the endowment's involved funds list
        uint256[] memory involvedFunds = state.FundsByEndowment[currEndowments[i]];
        (fundIndex, found) = Array.indexOf(involvedFunds, fundId);
        Array.remove(state.FundsByEndowment[currEndowments[i]], fundIndex);
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
    require(
      IERC20(token).transferFrom(msg.sender, address(this), amount),
      "Failed to transfer funds"
    );

    uint256 depositAmount = amount;
    // check if time limit is reached
    if (state.config.fundRotation != 0) {
      if (block.number >= state.nextRotationBlock) {
        uint256 newFundId = rotateFund(state.activeFund, block.timestamp);
        state.activeFund = newFundId;
        emit ActiveFundUpdated(state.activeFund);
        state.roundDonations = 0;

        while (block.number >= state.nextRotationBlock) {
          state.nextRotationBlock += state.config.fundRotation;
        }
      }
    }

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    if (fundId != 0) {
      // Depositor has chosen a specific fund to send tokens to. Send 100% to that fund.
      updateDonationMessages(
        fundId,
        calculateSplit(
          registrar_config.splitToLiquid,
          state.Funds[fundId].splitToLiquid,
          splitToLiquid
        ),
        amount,
        state.donationMessages
      );
    } else {
      // No explicit fund ID specifed. Send the tokens to current active fund, rotating
      // the active fund as funding goals are hit until all deposited tokens have been exhausted
      if (state.config.fundingGoal != 0) {
        uint256 loopDonation = 0;
        while (depositAmount > 0) {
          uint256 activeFund = state.activeFund;
          uint256 goalLeftover = state.config.fundingGoal - state.roundDonations;
          if (depositAmount >= goalLeftover) {
            state.roundDonations = 0;
            // set state active fund to next fund for next loop iteration
            state.activeFund = rotateFund(state.activeFund, block.timestamp);
            emit ActiveFundUpdated(state.activeFund);
            loopDonation = goalLeftover;
          } else {
            state.roundDonations += depositAmount;
            loopDonation = depositAmount;
          }
          updateDonationMessages(
            activeFund,
            calculateSplit(
              registrar_config.splitToLiquid,
              state.Funds[activeFund].splitToLiquid,
              splitToLiquid
            ),
            loopDonation,
            state.donationMessages
          );
          // deduct donated amount in this round from total donation amt
          depositAmount -= loopDonation;
        }
      } else {
        updateDonationMessages(
          state.activeFund,
          calculateSplit(
            registrar_config.splitToLiquid,
            state.Funds[state.activeFund].splitToLiquid,
            splitToLiquid
          ),
          amount,
          state.donationMessages
        );
      }
    }

    // give allowance to accounts contract
    require(
      IERC20(token).approve(registrar_config.accountsContract, amount),
      "Failed to approve funds"
    );

    (
      address[] memory target,
      uint256[] memory value,
      bytes[] memory callData
    ) = buildDonationMessages(registrar_config.accountsContract, state.donationMessages, token);

    Utils._execute(target[0], value[0], callData[0]);

    // Clean up storage for next call
    delete state.donationMessages.endowmentIds;
    delete state.donationMessages.lockedDonationAmount;
    delete state.donationMessages.liquidDonationAmount;
    delete state.donationMessages.lockedSplit;
    delete state.donationMessages.liquidSplit;

    emit StateUpdated();
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
  function queryState() external view returns (IndexFundMessage.StateResponseMessage memory) {
    return
      IndexFundMessage.StateResponseMessage({
        totalFunds: state.totalFunds,
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
    if (state.activeFund == fundId) {
      state.activeFund = rotateFund(fundId, block.timestamp);
      emit ActiveFundUpdated(state.activeFund);
    }

    // remove from rotating funds list
    bool found;
    uint256 index;
    (index, found) = Array.indexOf(state.rotatingFunds, fundId);
    if (found) {
      Array.remove(state.rotatingFunds, index);
    }

    state.totalFunds -= 1;
    delete state.Funds[fundId];
    emit FundRemoved(fundId);
  }

  /**
   * @dev Update donation messages
   * @param fundId index fund ID
   * @param liquidSplit Split to liquid
   * @param balance Balance of fund
   * @param donationMessages Donation messages
   */
  function updateDonationMessages(
    uint256 fundId,
    uint256 liquidSplit,
    uint256 balance,
    IndexFundStorage.DonationMessages storage donationMessages
  ) internal {
    require(!fundIsExpired(state.Funds[fundId], block.timestamp), "Expired Fund");
    uint256 endowmentPortion = balance;
    uint32[] memory endowments = state.Funds[fundId].endowments;
    if (endowments.length > 0) {
      endowmentPortion = endowmentPortion.div(endowments.length);
    }

    uint256 lockSplit = 100 - liquidSplit;

    for (uint256 i = 0; i < endowments.length; i++) {
      // check if endowment is in endowmentsidsm, then modify, else push
      bool alreadyExists = false;
      uint256 index = 0;

      for (uint256 j = 0; j < donationMessages.endowmentIds.length; j++) {
        if (donationMessages.endowmentIds[j] == endowments[i]) {
          alreadyExists = true;
          index = j;
          break;
        }
      }

      if (alreadyExists) {
        donationMessages.lockedSplit[index] = lockSplit;
        donationMessages.liquidSplit[index] = liquidSplit;
        donationMessages.lockedDonationAmount[index] += (endowmentPortion * lockSplit) / 100;
        // avoid any over and under flows
        donationMessages.liquidDonationAmount[index] += (
          (endowmentPortion - ((endowmentPortion * lockSplit) / 100))
        );
      } else {
        donationMessages.endowmentIds.push(endowments[i]);
        donationMessages.lockedSplit.push(lockSplit);
        donationMessages.liquidSplit.push(liquidSplit);
        donationMessages.lockedDonationAmount.push((endowmentPortion * lockSplit) / 100);
        // avoid any over and under flows
        donationMessages.liquidDonationAmount.push(
          (endowmentPortion - ((endowmentPortion * lockSplit) / 100))
        );
      }
    }
    emit DonationProcessed(fundId);
  }

  /**
   * @dev Build donation messages
   * @param accountscontract Accounts contract address
   * @param donationMessages Donation messages
   * @param tokenaddress Token address
   */
  function buildDonationMessages(
    address accountscontract,
    IndexFundStorage.DonationMessages storage donationMessages,
    address tokenaddress
  )
    internal
    view
    returns (address[] memory target, uint256[] memory value, bytes[] memory callData)
  {
    target = new address[](donationMessages.endowmentIds.length);
    value = new uint256[](donationMessages.endowmentIds.length);
    callData = new bytes[](donationMessages.endowmentIds.length);

    for (uint256 i = 0; i < donationMessages.endowmentIds.length; i++) {
      target[i] = accountscontract;
      value[i] = 0;
      callData[i] = abi.encodeWithSignature(
        "depositERC20((uint256,uint256,uint256),address,uint256)",
        AccountMessages.DepositRequest({
          id: donationMessages.endowmentIds[i],
          lockedPercentage: donationMessages.lockedSplit[i],
          liquidPercentage: donationMessages.liquidSplit[i]
        }),
        tokenaddress,
        donationMessages.lockedDonationAmount[i] + donationMessages.liquidDonationAmount[i]
      );
    }
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
   * @param envTime rent block time
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
   * @param rFund rent Active fund
   * @param envTime rent block time
   * @return New active fund
   */
  function rotateFund(uint256 rFund, uint256 envTime) internal view returns (uint256) {
    IndexFundStorage.Fund[] memory activeFunds = new IndexFundStorage.Fund[](
      state.rotatingFunds.length
    );

    for (uint256 i = 0; i < state.rotatingFunds.length; i++) {
      if (!fundIsExpired(state.Funds[state.rotatingFunds[i]], envTime)) {
        activeFunds[i] = state.Funds[state.rotatingFunds[i]];
      }
    }

    // check if the rent active fund is in the rotation and not expired
    bool found;
    uint256 index;
    (index, found) = Array.indexOf(state.rotatingFunds, rFund);
    if (!found || index == activeFunds.length - 1) {
      // set to the first fund in the list
      return activeFunds[0].id;
    } else {
      return activeFunds[index + 1].id;
    }
  }
}
