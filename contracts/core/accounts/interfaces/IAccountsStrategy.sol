// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IVault} from "../../vault/interfaces/IVault.sol";
import {AccountMessages} from "../message.sol";

/**
 * @title AccountsStrategy
 */
interface IAccountsStrategy {
  error InvestFailed(IVault.VaultActionStatus);
  error RedeemFailed(IVault.VaultActionStatus);
  error RedeemAllFailed(IVault.VaultActionStatus);
  error UnexpectedResponse(IVault.VaultActionData);
  error UnexpectedCaller(IVault.VaultActionData, string, string);

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
   */
  function strategyInvest(uint32 id, AccountMessages.InvestRequest memory investRequest) external;

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   */
  function strategyRedeem(uint32 id, AccountMessages.RedeemRequest memory redeemRequest) external;

  /**
   * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
   * @param id  The endowment ID
   */
  function strategyRedeemAll(
    uint32 id,
    AccountMessages.RedeemAllRequest memory redeemAllRequest
  ) external;
}