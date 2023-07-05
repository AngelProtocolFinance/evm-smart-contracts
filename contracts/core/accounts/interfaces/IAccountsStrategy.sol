// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IVault} from "../../vault/interfaces/IVault.sol";

/**
 * @title AccountsStrategy
 */
interface IAccountsStrategy {
  error InvestFailed(IVault.VaultActionStatus);

  struct NetworkInfo {
    uint256 chainId;
    address router; //SHARED
    address axelarGateway;
    string ibcChannel; // Should be removed
    string transferChannel;
    address gasReceiver;
    uint256 gasLimit; // Should be used to set gas limit
  }

  /**
   * @notice This function that allows users to deposit into a yield strategy using tokens from their locked or liquid account in an endowment.
   * @dev Allows the owner of an endowment to invest tokens into specified yield vaults.
   * @param id The endowment id
   * @param strategy The strategies to invest into
   * @param token The tokens to withdraw
   * @param lockAmt The amount to deposit lock
   * @param liquidAmt The amount to deposit liquid
   */
  function strategyInvest(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 lockAmt,
    uint256 liquidAmt,
    uint256 gasFee
  ) external payable;

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   * @param lockAmt The amt to remdeem from the locked component
   * @param liquidAmt The amt to redeem from the liquid component
   */
  function strategyRedeem(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 lockAmt,
    uint256 liquidAmt,
    uint256 gasFee
  ) external payable;

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   * @param strategy The strategy to redeem from
   * @param token The vaults to redeem from
   */
  function strategyRedeemAll(
    uint32 id,
    bytes4 strategy,
    string memory token,
    uint256 gasFee
  ) external payable;
}
