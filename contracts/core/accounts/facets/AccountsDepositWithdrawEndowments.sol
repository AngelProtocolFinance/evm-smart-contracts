// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

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
import {IDonationMatching} from "../../../normalized_endowment/donation-match/IDonationMatching.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsDepositWithdrawEndowments} from "../interfaces/IAccountsDepositWithdrawEndowments.sol";
import {Utils} from "../../../lib/utils.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";

import "hardhat/console.sol";

/**
 * @title AccountsDepositWithdrawEndowments
 * @notice This facet manages the deposits and withdrawals for accounts
 * @dev This facet manages the deposits and withdrawals for accounts
 */

contract AccountsDepositWithdrawEndowments is
  ReentrancyGuardFacet,
  IAccountsEvents,
  IAccountsDepositWithdrawEndowments
{
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  /**
   * @notice Deposit MATIC into the endowment. Wraps first to ERC20 before processing.
   * @param details The details of the deposit
   */
  function depositMatic(AccountMessages.DepositRequest memory details) public payable nonReentrant {
    require(msg.value > 0, "Invalid Amount");
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Config memory tempConfig = state.config;
    AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[details.id];
    require(!tempEndowmentState.closingEndowment, "Endowment is closed");

    RegistrarStorage.Config memory registrar_config = IRegistrar(tempConfig.registrarContract)
      .queryConfig();

    // Wrap MATIC >> wMATIC by calling the deposit() endpoint on wMATIC contract
    Utils._execute(registrar_config.wMaticAddress, msg.value, abi.encodeWithSignature("deposit()"));

    // finish donation process with the newly wrapped MATIC
    processTokenDeposit(details, registrar_config.wMaticAddress, msg.value);
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
  ) public nonReentrant {
    require(tokenAddress != address(0), "Invalid Token Address");
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[details.id];
    require(!tempEndowmentState.closingEndowment, "Endowment is closed");
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    // is it possible to have tokenAddress == address(0)
    require(tokenAddress != address(0), "Invalid ERC20 token");
    require(details.lockedPercentage + details.liquidPercentage == 100, "InvalidSplit");

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    if (tempEndowment.depositFee.bps != 0) {
      uint256 depositFeeAmount = (amount.mul(tempEndowment.depositFee.bps)).div(
        LibAccounts.FEE_BASIS
      );

      amount = amount.sub(depositFeeAmount);


      IERC20(tokenAddress).safeTransfer(tempEndowment.depositFee.payoutAddress, depositFeeAmount);
    }

    uint256 lockedSplitPercent = details.lockedPercentage;
    uint256 liquidSplitPercent = details.liquidPercentage;

    require(registrar_config.indexFundContract != address(0), "No Index Fund");

    if (msg.sender != registrar_config.indexFundContract) {
      if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
        // use the Registrar default split for Charities
        (lockedSplitPercent, liquidSplitPercent) = Validator.checkSplits(
          registrar_config.splitToLiquid,
          lockedSplitPercent,
          liquidSplitPercent,
          tempEndowment.ignoreUserSplits
        );
      } else {
        // use the Endowment's SplitDetails for ASTs
        (lockedSplitPercent, liquidSplitPercent) = Validator.checkSplits(
          tempEndowment.splitToLiquid,
          lockedSplitPercent,
          liquidSplitPercent,
          tempEndowment.ignoreUserSplits
        );
      }
    }

    uint256 lockedAmount = (amount.mul(lockedSplitPercent)).div(LibAccounts.PERCENT_BASIS);
    uint256 liquidAmount = (amount.mul(liquidSplitPercent)).div(LibAccounts.PERCENT_BASIS);

    //donation matching flow
    //execute donor match will always be called on an EOA
    if (lockedAmount > 0) {
      if (
        tempEndowment.endowType == LibAccounts.EndowmentType.Charity &&
        registrar_config.donationMatchCharitesContract != address(0)
      ) {
        IDonationMatching(registrar_config.donationMatchCharitesContract).executeDonorMatch(
          details.id,
          lockedAmount,
          tx.origin,
          registrar_config.haloToken
        );
      } else if (
        tempEndowment.endowType == LibAccounts.EndowmentType.Normal &&
        tempEndowment.donationMatchContract != address(0)
      ) {
        IDonationMatching(tempEndowment.donationMatchContract).executeDonorMatch(
          details.id,
          lockedAmount,
          tx.origin,
          tempEndowment.daoToken
        );
      }
    }

    state.STATES[details.id].balances.locked[tokenAddress] += lockedAmount;
    state.STATES[details.id].balances.liquid[tokenAddress] += liquidAmount;

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
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];
    AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[id];
    require(!tempEndowmentState.closingEndowment, "Endowment is closed");

    // place an arbitrary cap on the qty of different tokens per withdraw to limit gas use
    require(tokens.length > 0, "No tokens provided");
    require(tokens.length <= 10, "Upper-limit is ten(10) unique ERC20 tokens per withdraw");
    // quick check that all passed tokens address & amount values are non-zero to avoid gas waste
    for (uint256 i = 0; i < tokens.length; i++) {
      require(tokens[i].addr != address(0), "Invalid withdraw token passed: zero address");
      require(tokens[i].amnt > 0, "Invalid withdraw token passed: zero amount");
    }

    // fetch registrar config
    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    // Charities never mature & Normal endowments optionally mature
    // Check if maturity has been reached for the endowment (0 == no maturity date)
    bool mature = (tempEndowment.maturityTime != 0 &&
      block.timestamp >= tempEndowment.maturityTime);

    // ** NORMAL TYPE WITHDRAWAL RULES **
    // In both balance types:
    //      The endowment multisig OR beneficiaries allowlist addresses [if populated] can withdraw. After
    //      maturity has been reached, only addresses in Maturity Allowlist may withdraw. If the Maturity
    //      Allowlist is not populated, then only the endowment multisig is allowed to withdraw.
    // ** CHARITY TYPE WITHDRAW RULES **
    // Since charity endowments do not mature, they can be treated the same as Normal endowments
    bool senderAllowed = false;
    // determine if msg sender is allowed to withdraw based on rules and maturity status
    if (mature) {
      if (tempEndowment.maturityAllowlist.length > 0) {
        for (uint256 i = 0; i < tempEndowment.maturityAllowlist.length; i++) {
          if (tempEndowment.maturityAllowlist[i] == msg.sender) {
            senderAllowed = true;
          }
        }
        require(senderAllowed, "Sender address is not listed in maturityAllowlist.");
      }
    } else {
      if (tempEndowment.allowlistedBeneficiaries.length > 0) {
        for (uint256 i = 0; i < tempEndowment.allowlistedBeneficiaries.length; i++) {
          if (tempEndowment.allowlistedBeneficiaries[i] == msg.sender) {
            senderAllowed = true;
          }
        }
      }
      require(
        senderAllowed || msg.sender == tempEndowment.owner,
        "Sender address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner."
      );
    }

    for (uint256 t = 0; t < tokens.length; t++) {
      // ** SHARED LOCKED WITHDRAWAL RULES **
      // Can withdraw early for a (possible) penalty fee
      uint256 earlyLockedWithdrawPenalty = 0;
      if (acctType == IVault.VaultType.LOCKED && !mature) {
        // Calculate the early withdraw penalty based on the earlyLockedWithdrawFee setting
        // Normal: Endowment specific setting that owners can (optionally) set
        // Charity: Registrar based setting for all Charity Endowments
        if (tempEndowment.endowType == LibAccounts.EndowmentType.Normal) {
          earlyLockedWithdrawPenalty = (
            tokens[t].amnt.mul(tempEndowment.earlyLockedWithdrawFee.bps)
          ).div(LibAccounts.FEE_BASIS);
        } else {
          earlyLockedWithdrawPenalty = (
            tokens[t].amnt.mul(
              IRegistrar(state.config.registrarContract)
                .getFeeSettingsByFeeType(LibAccounts.FeeTypes.EarlyLockedWithdrawCharity)
                .bps
            )
          ).div(LibAccounts.FEE_BASIS);
        }
      }

      uint256 withdrawFeeRateAp;
      if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
        withdrawFeeRateAp = IRegistrar(state.config.registrarContract)
          .getFeeSettingsByFeeType(LibAccounts.FeeTypes.WithdrawCharity)
          .bps;
      } else {
        withdrawFeeRateAp = IRegistrar(state.config.registrarContract)
          .getFeeSettingsByFeeType(LibAccounts.FeeTypes.WithdrawNormal)
          .bps;
      }

      uint256 current_bal;
      if (acctType == IVault.VaultType.LOCKED) {
        current_bal = state.STATES[id].balances.locked[tokens[t].addr];
      } else {
        current_bal = state.STATES[id].balances.liquid[tokens[t].addr];
      }

      // ensure balance of tokens can cover the requested withdraw amount
      require(current_bal > tokens[t].amnt, "InsufficientFunds");

      // calculate AP Protocol fee owed on withdrawn token amount
      uint256 withdrawFeeAp = (tokens[t].amnt.mul(withdrawFeeRateAp)).div(LibAccounts.FEE_BASIS);

      // Transfer AP Protocol fee to treasury
      // (ie. standard Withdraw Fee + any early Locked Withdraw Penalty)
      IERC20(tokens[t].addr).safeTransfer(
        registrar_config.treasury,
        withdrawFeeAp + earlyLockedWithdrawPenalty
      );

      // ** Endowment specific withdraw fee **
      // Endowment specific withdraw fee needs to be calculated against the amount
      // leftover after all AP withdraw fees are subtracted.
      uint256 amountLeftover = tokens[t].amnt - withdrawFeeAp - earlyLockedWithdrawPenalty;
      uint256 withdrawFeeEndow = 0;
      if (amountLeftover > 0 && tempEndowment.withdrawFee.bps != 0) {
        withdrawFeeEndow = (amountLeftover.mul(tempEndowment.withdrawFee.bps)).div(
          LibAccounts.FEE_BASIS
        );

        // transfer endowment withdraw fee to payout address
        IERC20(tokens[t].addr).safeTransfer(
          tempEndowment.withdrawFee.payoutAddress,
          withdrawFeeEndow
        );
      }

      // send all tokens (less fees) to the ultimate beneficiary address/endowment
      if (beneficiaryAddress != address(0)) {
          IERC20(tokens[t].addr).safeTransfer(beneficiaryAddress, (amountLeftover - withdrawFeeEndow));
      } else {
        // check endowment specified is not closed
        require(
          !state.STATES[beneficiaryEndowId].closingEndowment,
          "Beneficiary endowment is closed"
        );
        // Send deposit message to 100% Liquid account of an endowment
        processTokenDeposit(
          AccountMessages.DepositRequest({
            id: beneficiaryEndowId,
            lockedPercentage: 0,
            liquidPercentage: 100
          }),
          tokens[t].addr,
          (amountLeftover - withdrawFeeEndow)
        );
      }

      // reduce the orgs balance by the withdrawn token amount
      if (acctType == IVault.VaultType.LOCKED) {
        state.STATES[id].balances.locked[tokens[t].addr] -= tokens[t].amnt;
      } else {
        state.STATES[id].balances.liquid[tokens[t].addr] -= tokens[t].amnt;
      }
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
}
