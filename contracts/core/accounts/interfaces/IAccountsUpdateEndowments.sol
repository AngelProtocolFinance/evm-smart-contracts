// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccountMessages} from "../message.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";

/**
 * @title AccountsUpdateEndowments
 * @notice This contract facet updates the endowments
 * @dev This contract facet updates the endowments, updates rights are with owner of accounts contracts (AP Team Multisig) and the endowment owner
 */
interface IAccountsUpdateEndowments {
  enum ControllerSettingOption {
    AcceptedTokens,
    LockedInvestmentManagement,
    LiquidInvestmentManagement,
    AllowlistedBeneficiaries,
    AllowlistedContributors,
    MaturityAllowlist,
    EarlyLockedWithdrawFee,
    MaturityTime,
    WithdrawFee,
    DepositFee,
    BalanceFee,
    Name,
    Image,
    Logo,
    Sdgs,
    SplitToLiquid,
    IgnoreUserSplits
  }

  /**
    @notice Updates the endowment details.
    @dev This function allows the Endowment owner to update the endowment details like owner & rebalance and allows them or their Delegate(s) to update name, sdgs, logo, and image.
    @param details UpdateEndowmentDetailsRequest struct containing the updated endowment details.
    */
  function updateEndowmentDetails(
    AccountMessages.UpdateEndowmentDetailsRequest memory details
  ) external;

  /**
    @notice Sets the delegate for a specific endowment setting
    @param id The ID of the endowment
    @param setting The setting for which to update the delegate
    @param delegateAddress The address of the delegate to add/revoke
    @param delegateExpiry The timestamp at which the delegate's permission expires
    */
  function setDelegate(
    uint32 id,
    ControllerSettingOption setting,
    address delegateAddress,
    uint256 delegateExpiry
  ) external;

  /**
    @notice Revokes the delegate for a specific endowment setting
    @param id The ID of the endowment
    @param setting The setting for which to update the delegate
    */
  function revokeDelegate(uint32 id, ControllerSettingOption setting) external;

  /**
    @notice Updates the endowment-level list of accepted tokens with a status for the given ERC20 Token address & Chainlink Price Feed contract address.
    @dev This function allows the Endowment owner, or a valid delegate, to add/update accepted tokens for an Endowment's Deposits & Withdrawals.
    * @param endowId Endowment ID
    * @param tokenAddr Token address to add/update in AcceptedTokens
    * @param priceFeedAddr Chainlink Price Feed contract address for accepted token to fetch USD price data
    * @param tokenStatus Boolean status to set for the token Address in AcceptedTokens
    */
  function updateAcceptedToken(
    uint32 endowId,
    address tokenAddr,
    address priceFeedAddr,
    bool tokenStatus
  ) external;
}
