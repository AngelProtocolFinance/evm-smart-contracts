// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IAccountsQueryEndowments} from "../interfaces/IAccountsQueryEndowments.sol";

/**
 * @title AccountsQueryEndowments
 * @notice This contract facet queries for endowment and accounts config
 * @dev This contract facet queries for endowment and accounts config
 */
contract AccountsQueryEndowments is IAccountsQueryEndowments {
  /**
   * @notice This function queries the balance of a token for an endowment
   * @dev This function queries the balance of a token for an endowment based on its type and address
   * @param id The id of the endowment
   * @param accountType The account type
   * @param tokenAddress The address of the token
   * @return tokenAmount balance of token
   */
  function queryTokenAmount(
    uint32 id,
    AngelCoreStruct.AccountType accountType,
    address tokenAddress
  ) public view returns (uint256 tokenAmount) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(address(0) != tokenAddress, "Invalid token address");

    if (accountType == AngelCoreStruct.AccountType.Locked) {
      tokenAmount = state.STATES[id].balances.locked.balancesByToken[tokenAddress];
    } else {
      tokenAmount = state.STATES[id].balances.liquid.balancesByToken[tokenAddress];
    }
  }

  /**
   * @notice queries the endowment details
   * @dev queries the endowment details
   * @param id The id of the endowment
   * @return endowment The endowment details
   */
  function queryEndowmentDetails(
    uint32 id
  ) public view returns (AccountStorage.Endowment memory endowment) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    endowment = state.ENDOWMENTS[id];
  }

  /**
   * @notice queries the accounts contract config
   * @dev queries the accounts contract config
   * @return config The accounts contract config
   */
  function queryConfig() public view returns (AccountMessages.ConfigResponse memory config) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    config = AccountMessages.ConfigResponse({
      owner: state.config.owner,
      version: state.config.version,
      registrarContract: state.config.registrarContract,
      nextAccountId: state.config.nextAccountId,
      maxGeneralCategoryId: state.config.maxGeneralCategoryId,
      subDao: state.config.subDao,
      gateway: state.config.gateway,
      gasReceiver: state.config.gasReceiver,
      earlyLockedWithdrawFee: state.config.earlyLockedWithdrawFee
    });
  }

  /**
   * @notice queries the endowment donations state
   * @dev queries the endowment state
   * @param id The id of the endowment
   * @return stateResponse The endowment state
   */
  function queryState(
    uint32 id
  ) public view returns (AccountMessages.StateResponse memory stateResponse) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    stateResponse = AccountMessages.StateResponse({
      closingEndowment: state.STATES[id].closingEndowment,
      closingBeneficiary: state.STATES[id].closingBeneficiary
    });
  }
}
