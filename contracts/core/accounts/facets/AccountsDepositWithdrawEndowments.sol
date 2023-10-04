// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {AccountStorage} from "../storage.sol";
import {Validator} from "../../validator.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsDepositWithdrawEndowments} from "../interfaces/IAccountsDepositWithdrawEndowments.sol";
import {Utils} from "../../../lib/utils.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";
import {FixedPointMathLib} from "../../../lib/FixedPointMathLib.sol";
import {AddressArray} from "../../../lib/address/array.sol";

/**
 * @title AccountsDepositWithdrawEndowments
 * @notice This facet manages the deposits and withdrawals for accounts
 * @dev This facet manages the deposits and withdrawals for accounts
 */

contract AccountsDepositWithdrawEndowments is
  ReentrancyGuardFacet,
  IAccountsEvents,
  IAccountsDepositWithdrawEndowments,
  IterableMappingAddr
{
  using SafeERC20 for IERC20;
  using FixedPointMathLib for uint256;
  using AddressArray for address[];

  /*
   *  Modifiers
   */
  modifier validEndowId(uint32 id) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(id > 0 && id < state.config.nextAccountId, "Must pass a valid Endowment ID");
    _;
  }

  modifier validateDepositDetails(AccountMessages.DepositRequest memory details, uint256 amount) {
    require(amount > 0, "Amount must be greater than zero");
    require(details.lockedPercentage + details.liquidPercentage == 100, "InvalidSplit");
    _;
  }

  /**
   * @notice Deposit MATIC into the endowment. Wraps first to ERC20 before processing.
   * @param details The details of the deposit
   */
  function depositMatic(
    AccountMessages.DepositRequest memory details
  )
    public
    payable
    nonReentrant
    validEndowId(details.id)
    validateDepositDetails(details, msg.value)
  {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Config memory tempConfig = state.config;

    RegistrarStorage.Config memory registrarConfig = IRegistrar(tempConfig.registrarContract)
      .queryConfig();

    // Wrap MATIC >> wMATIC by calling the deposit() endpoint on wMATIC contract
    Utils._execute(registrarConfig.wMaticAddress, msg.value, abi.encodeWithSignature("deposit()"));

    // finish donation process with the newly wrapped MATIC
    processTokenDeposit(details, registrarConfig.wMaticAddress, msg.value);
  }

  /**
   * @notice Deposit ERC20s into the account
   * @param details The details of the deposit
   * @param tokenAddress The address of the token to deposit
   * @param amount The amount of the token to deposit
   */
  function depositERC20(
    AccountMessages.DepositRequest memory details,
    address tokenAddress,
    uint256 amount
  ) public nonReentrant validEndowId(details.id) validateDepositDetails(details, amount) {
    require(tokenAddress != address(0), "Invalid Token Address");
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    // Check that the deposited token is either:
    // A. In the protocol-level accepted tokens list in the Registrar Contract OR
    // B. In the endowment-level accepted tokens list
    require(
      IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddress) ||
        state.AcceptedTokens[details.id][tokenAddress],
      "Not in an Accepted Tokens List"
    );

    IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);

    processTokenDeposit(details, tokenAddress, amount);
  }

  /**
   * @notice Deposit ERC20 (USDC) into the account
   * @dev manages vaults deposit and keeps leftover funds after vaults deposit on accounts diamond
   * @param details The details of the deposit
   * @param tokenAddress The address of the token to deposit (only called with USDC address)
   * @param amount The amount of the token to deposit (in USDC)
   */
  function processTokenDeposit(
    AccountMessages.DepositRequest memory details,
    address tokenAddress,
    uint256 amount
  ) internal {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[details.id];

    require(!state.States[details.id].closingEndowment, "Endowment is closed");

    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
      .queryConfig();
    require(registrarConfig.indexFundContract != address(0), "No Index Fund");

    // Cannot receive contributions into a mature Endowment
    require(
      tempEndowment.maturityTime == 0 || tempEndowment.maturityTime > block.timestamp,
      "Mature Endowments cannot receive contributions"
    );

    // If caller is index fund, the Endowment owner or there is not a poopulated allowlist, continue
    if (
      (msg.sender != registrarConfig.indexFundContract || msg.sender != tempEndowment.owner) &&
      state.Allowlists[details.id][LibAccounts.AllowlistType.AllowlistedContributors].keys.length >
      0
    ) {
      // if there is an allowlist, check that msg.sender is in it
      if (
        !IterableMappingAddr.get(
          state.Allowlists[details.id][LibAccounts.AllowlistType.AllowlistedContributors],
          msg.sender
        )
      ) {
        // revert if they aren't
        revert("Contributor address is not listed in allowlistedContributors");
      }
    }

    // ** DEPOSIT FEE CALCULATIONS **
    // ** Protocol-level Deposit Fee **
    LibAccounts.FeeSetting memory depositFeeAp;
    if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
      depositFeeAp = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.DepositCharity
      );
    } else {
      depositFeeAp = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.Deposit
      );
    }
    uint256 amountLeftover = amount - calculateAndPayoutFee(amount, tokenAddress, depositFeeAp);

    // ** Endowment-level Deposit Fee **
    // Calculated on the amount left after Protocol-level fee is deducted
    amountLeftover -= calculateAndPayoutFee(amountLeftover, tokenAddress, tempEndowment.depositFee);

    // ** SPLIT ADJUSTMENTS AND CHECKS **
    uint256 lockedSplitPercent = details.lockedPercentage;
    uint256 liquidSplitPercent = details.liquidPercentage;
    if (msg.sender != registrarConfig.indexFundContract) {
      // adjust user passed liquid split to be in-line with endowment range (if falls outside)
      liquidSplitPercent = Validator.adjustLiquidSplit(
        tempEndowment.splitToLiquid,
        details.liquidPercentage,
        tempEndowment.ignoreUserSplits
      );
      lockedSplitPercent = 100 - liquidSplitPercent;
    }

    uint256 lockedAmount = amountLeftover.mulDivDown(lockedSplitPercent, LibAccounts.PERCENT_BASIS);
    uint256 liquidAmount = amountLeftover.mulDivDown(liquidSplitPercent, LibAccounts.PERCENT_BASIS);

    // TODO: donation matching flow completed

    state.Balances[details.id][IVault.VaultType.LOCKED][tokenAddress] += lockedAmount;
    state.Balances[details.id][IVault.VaultType.LIQUID][tokenAddress] += liquidAmount;

    emit EndowmentDeposit(details.id, tokenAddress, lockedAmount, liquidAmount);
  }

  /**
   * @notice Transfer ERC20 tokens from one Endowment to another, no fees or donation matching
   * @dev manages Token transfers between endowments when closing or withdrawing sends to another Endowment
   * @param details The details of the deposit
   * @param tokenAddress The address of the token to deposit (only called with USDC address)
   * @param amount The amount of the token to deposit (in USDC)
   */
  function processTokenTransfer(
    AccountMessages.DepositRequest memory details,
    address tokenAddress,
    uint256 amount
  ) internal {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    uint256 lockedAmount = amount.mulDivDown(details.lockedPercentage, LibAccounts.PERCENT_BASIS);
    uint256 liquidAmount = amount.mulDivDown(details.liquidPercentage, LibAccounts.PERCENT_BASIS);

    state.Balances[details.id][IVault.VaultType.LOCKED][tokenAddress] += lockedAmount;
    state.Balances[details.id][IVault.VaultType.LIQUID][tokenAddress] += liquidAmount;

    emit EndowmentDeposit(details.id, tokenAddress, lockedAmount, liquidAmount);
  }

  /**
   * @notice Withdraws funds from an endowment
   * @dev Withdraws funds available on the accounts diamond after checking certain conditions
   * @param id The endowment id
   * @param acctType The account type to withdraw from
   * @param beneficiaryAddress The address to send funds to
   * @param beneficiaryEndowId The endowment to send funds to
   * @param tokens An array of TokenInfo structs holding the address and amounts of tokens to withdraw
   */
  function withdraw(
    uint32 id,
    IVault.VaultType acctType,
    address beneficiaryAddress,
    uint32 beneficiaryEndowId,
    IAccountsDepositWithdrawEndowments.TokenInfo[] memory tokens
  ) public nonReentrant validEndowId(id) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];
    AccountStorage.EndowmentState storage tempEndowmentState = state.States[id];

    // If an Endowment is closed and a withdraw is executed for it, check that the sender is the closing
    // beneficiary on record and procees the withdraw if so ensure funds are indeed moving to that beneficiary
    if (tempEndowmentState.closingEndowment) {
      if (tempEndowmentState.closingBeneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
        require(
          msg.sender == tempEndowmentState.closingBeneficiary.data.addr,
          "Endowment is closed"
        );
        beneficiaryAddress = msg.sender;
        beneficiaryEndowId = 0;
      } else if (
        tempEndowmentState.closingBeneficiary.enumData == LibAccounts.BeneficiaryEnum.EndowmentId
      ) {
        require(
          msg.sender == state.Endowments[tempEndowmentState.closingBeneficiary.data.endowId].owner,
          "Endowment is closed"
        );
        beneficiaryAddress = address(0);
        beneficiaryEndowId = tempEndowmentState.closingBeneficiary.data.endowId;
      }
    }
    // If not closing, only owner can call 
    else {
      require(msg.sender == tempEndowment.owner, "Unauthorized");
    }

    // place an arbitrary cap on the qty of different tokens per withdraw to limit gas use
    require(tokens.length > 0, "No tokens provided");
    require(tokens.length <= 10, "Upper-limit is ten(10) unique ERC20 tokens per withdraw");
    // quick check that all passed tokens address & amount values are non-zero to avoid gas waste
    for (uint256 i = 0; i < tokens.length; i++) {
      require(tokens[i].addr != address(0), "Invalid withdraw token passed: zero address");
      require(tokens[i].amnt > 0, "Invalid withdraw token passed: zero amount");
    }

    // check endowment beneficiary, if specified, is not closed
    if (beneficiaryEndowId != 0) {
      require(
        !state.States[beneficiaryEndowId].closingEndowment,
        "Beneficiary endowment is closed"
      );
    }

    // Check if maturity has been reached for the endowment (0 == no maturity date)
    bool mature = (tempEndowment.maturityTime != 0 &&
      block.timestamp >= tempEndowment.maturityTime);

    if (tempEndowment.endowType == LibAccounts.EndowmentType.Daf) {
      require(
        beneficiaryAddress == address(0),
        "Beneficiary address is not allowed for DAF withdrawals"
      );
      require(
        state.DafApprovedEndowments[beneficiaryEndowId],
        "Endowment beneficiary must be a DAF-Approved Endowment"
      );
    }

    // look up Protocol level fees
    LibAccounts.FeeSetting memory protocolWithdrawFee;
    LibAccounts.FeeSetting memory protocolEarlyWithdrawFee;
    if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
      protocolWithdrawFee = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.WithdrawCharity
      );
      protocolEarlyWithdrawFee = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.EarlyLockedWithdrawCharity
      );
    } else {
      protocolWithdrawFee = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.Withdraw
      );
      protocolEarlyWithdrawFee = IRegistrar(state.config.registrarContract).getFeeSettingsByFeeType(
        LibAccounts.FeeTypes.EarlyLockedWithdraw
      );
    }

    for (uint256 t = 0; t < tokens.length; t++) {
      // ensure balance of tokens can cover the requested withdraw amount
      require(state.Balances[id][acctType][tokens[t].addr] >= tokens[t].amnt, "Insufficient Funds");

      // calculate all fees owed, send them to payout addresses, & return the leftover amount
      uint256 amountLeftover = tokens[t].amnt;
      // Do not apply fees for Endowment <> Endowment withdraws/transfers
      if (beneficiaryAddress != address(0)) {
        // ** FEES & PENALTIES CALCULATIONS **
        amountLeftover = processWithdrawFees(
          tokens[t].amnt,
          tokens[t].addr,
          mature,
          acctType,
          protocolWithdrawFee,
          protocolEarlyWithdrawFee,
          tempEndowment.withdrawFee,
          tempEndowment.earlyLockedWithdrawFee
        );
      }

      if (amountLeftover > 0) {
        // send leftover tokens (after all fees) to the ultimate beneficiary address/Endowment
        if (beneficiaryAddress != address(0)) {
          // determine if beneficiaryAddress can receive withdrawn funds based on allowlist and maturity status
          bool beneficiaryAllowed;
          if (mature) {
            beneficiaryAllowed = (
              IterableMappingAddr.get(
                state.Allowlists[id][LibAccounts.AllowlistType.MaturityAllowlist],
                beneficiaryAddress
              )
            );
            require(beneficiaryAllowed, "Beneficiary address is not listed in maturityAllowlist");
          } else {
            if (
              state
                .Allowlists[id][LibAccounts.AllowlistType.AllowlistedBeneficiaries]
                .keys
                .length ==
              0 ||
              beneficiaryAddress == tempEndowment.owner
            ) {
              beneficiaryAllowed = true;
            } else {
              beneficiaryAllowed = (
                IterableMappingAddr.get(
                  state.Allowlists[id][LibAccounts.AllowlistType.AllowlistedBeneficiaries],
                  beneficiaryAddress
                )
              );
            }
            require(
              beneficiaryAllowed,
              "Beneficiary address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner"
            );
          }
          IERC20(tokens[t].addr).safeTransfer(beneficiaryAddress, amountLeftover);
        } else {
          if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
            require(
              state.Endowments[beneficiaryEndowId].endowType == LibAccounts.EndowmentType.Charity,
              "Charity Endowments may only transfer funds to other Charity Endowments"
            );
          }
          // Deposit message split set for the appropriate VaultType of receiving Endowment
          if (acctType == IVault.VaultType.LOCKED) {
            processTokenTransfer(
              AccountMessages.DepositRequest({
                id: beneficiaryEndowId,
                lockedPercentage: 100,
                liquidPercentage: 0,
                donationMatch: msg.sender
              }),
              tokens[t].addr,
              amountLeftover
            );
          } else {
            processTokenTransfer(
              AccountMessages.DepositRequest({
                id: beneficiaryEndowId,
                lockedPercentage: 0,
                liquidPercentage: 100,
                donationMatch: address(this)
              }),
              tokens[t].addr,
              amountLeftover
            );
          }
        }
      }

      // reduce the org's balance by the withdrawn token amount
      state.Balances[id][acctType][tokens[t].addr] -= tokens[t].amnt;
      emit EndowmentWithdraw(
        id,
        tokens[t].addr,
        tokens[t].amnt,
        acctType,
        beneficiaryAddress,
        beneficiaryEndowId
      );
    }
  }

  // Internal function to calculate fees and disburse fees to payout addresses
  function calculateAndPayoutFee(
    uint256 tokenAmnt,
    address tokenAddr,
    LibAccounts.FeeSetting memory fee
  ) internal returns (uint256 feeAmount) {
    feeAmount = tokenAmnt.mulDivDown(fee.bps, LibAccounts.FEE_BASIS);
    if (feeAmount > 0) {
      IERC20(tokenAddr).safeTransfer(fee.payoutAddress, feeAmount);
    }
  }

  // Internal function to process all withdraw fees
  function processWithdrawFees(
    uint256 startingAmnt,
    address tokenAddr,
    bool mature,
    IVault.VaultType acctType,
    LibAccounts.FeeSetting memory protocolWithdrawFee,
    LibAccounts.FeeSetting memory protocolEarlyWithdrawFee,
    LibAccounts.FeeSetting memory endowWithdrawFee,
    LibAccounts.FeeSetting memory endowEarlyLockedWithdrawFee
  ) internal returns (uint256 amountLeftover) {
    uint256 totalEndowFees;

    // ** WITHDRAW FEE (STANDARD) **
    // Protocol-level fee calculated based on Registrar rate look-up
    amountLeftover =
      startingAmnt -
      calculateAndPayoutFee(startingAmnt, tokenAddr, protocolWithdrawFee);

    // ** EARLY LOCKED WITHDRAW FEE **
    // Can withdraw early for a (possible) penalty fee
    if (acctType == IVault.VaultType.LOCKED && !mature) {
      // Protocol-level early withdraw penalty fee
      // Deduct AP Early Locked Withdraw Fee to arrive at an amountLeftover
      // that all Endowment-level Fees hereafter can safely be calculated against
      amountLeftover -= calculateAndPayoutFee(startingAmnt, tokenAddr, protocolEarlyWithdrawFee);
      // Normal/DAF Endowment-level Early Withdraw Fee that owners can (optionally) set
      totalEndowFees = calculateAndPayoutFee(
        amountLeftover,
        tokenAddr,
        endowEarlyLockedWithdrawFee
      );
    }

    // ** WITHDRAW FEE (STANDARD): Endowment-Level fee **
    // Calculated on the amount left after all Protocol-level fees are deducted
    totalEndowFees += calculateAndPayoutFee(amountLeftover, tokenAddr, endowWithdrawFee);

    // Deduct all Endowment-level fees to get a final withdraw amount leftover
    amountLeftover -= totalEndowFees;
  }
}
