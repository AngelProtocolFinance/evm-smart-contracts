// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {Validator} from "../../validator.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {Array} from "../../../lib/array.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import {IAccountsUpdateEndowments} from "../interfaces/IAccountsUpdateEndowments.sol";

/**
 * @title AccountsUpdateEndowments
 * @notice This contract facet updates the endowments
 * @dev This contract facet updates the endowments, updates rights are with owner of accounts contracts (AP Team Multisig) and the endowment owner
 */
contract AccountsUpdateEndowments is
  IAccountsUpdateEndowments,
  ReentrancyGuardFacet,
  IAccountsEvents
{
  /**
    @notice Updates the endowment details.
    @dev This function allows the Endowment owner to update the endowment details like owner & rebalance and allows them or their Delegate(s) to update name, sdgs, logo, and image.
    @param details UpdateEndowmentDetailsRequest struct containing the updated endowment details.
    */
  function updateEndowmentDetails(
    AccountMessages.UpdateEndowmentDetailsRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[details.id];

    require(!state.States[details.id].closingEndowment, "UpdatesAfterClosed");

    if (
      Validator.canChange(
        tempEndowment.settingsController.name,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.name = details.name;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.sdgs,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      if (
        details.sdgs.length == 0 && tempEndowment.endowType == LibAccounts.EndowmentType.Charity
      ) {
        revert("InvalidInputs");
      }
      if (details.sdgs.length != 0) {
        details.sdgs = Array.sort(details.sdgs);
        for (uint256 i = 0; i < details.sdgs.length; i++) {
          if (
            details.sdgs[i] > LibAccounts.MAX_SDGS_NUM || details.sdgs[i] < LibAccounts.MIN_SDGS_NUM
          ) {
            revert("InvalidInputs");
          }
        }
      }
      tempEndowment.sdgs = details.sdgs;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.logo,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.logo = details.logo;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.image,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.image = details.image;
    }

    // there are several fields that are restricted to changing only by the Endowment Owner
    if (msg.sender == tempEndowment.owner) {
      // Field `owner` MUST be updated *last*, as otherwise no other endowment field would be updateable due to following:
      // 1. Current owner (multisig) sends request to update endowment owner to DAO address and let's say it
      // also wants to update `image`
      // 2. Field `image` has no delegate and is unlocked, so only `owner` can update it
      // 3. Owner update check passes and is updated to DAO address
      // 4. Contract gets to updating `image`, but first needs to check whether the field can be updated
      // 5. It sees that the current sender (previous owner, Multisig) is NOT the current owner of the endowment
      //    (as it was updated in the previous step to DAO address)
      // 6. Check for `image` fails and the update is skipped
      if (
        details.owner != address(0) &&
        (details.owner == tempEndowment.dao || details.owner == tempEndowment.multisig)
      ) {
        tempEndowment.owner = details.owner;
      }

      if (tempEndowment.endowType != LibAccounts.EndowmentType.Charity) {
        tempEndowment.rebalance = details.rebalance;
      }
    }

    state.Endowments[details.id] = tempEndowment;
    emit EndowmentUpdated(details.id);
  }

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
  ) public nonReentrant {
    LibAccounts.Delegate memory delegate = LibAccounts.Delegate({
      addr: delegateAddress,
      expires: delegateExpiry
    });
    updateDelegate(id, setting, delegate);
  }

  /**
    @notice Revokes the delegate for a specific endowment setting
    @param id The ID of the endowment
    @param setting The setting for which to update the delegate
    */
  function revokeDelegate(uint32 id, ControllerSettingOption setting) public nonReentrant {
    LibAccounts.Delegate memory delegate = LibAccounts.Delegate({addr: address(0), expires: 0});
    updateDelegate(id, setting, delegate);
  }

  /**
    @notice Updates the delegate for a specific endowment setting
    @param id The ID of the endowment
    @param setting The setting for which to update the delegate
    @param delegate The address & expiry of the delegate being updated
    */
  function updateDelegate(
    uint32 id,
    ControllerSettingOption setting,
    LibAccounts.Delegate memory delegate
  ) internal {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];
    require(!state.States[id].closingEndowment, "UpdatesAfterClosed");

    if (setting == ControllerSettingOption.LockedInvestmentManagement) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.lockedInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.lockedInvestmentManagement.delegate = delegate;
    } else if (setting == ControllerSettingOption.LiquidInvestmentManagement) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.liquidInvestmentManagement,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.liquidInvestmentManagement.delegate = delegate;
    } else if (setting == ControllerSettingOption.AcceptedTokens) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.acceptedTokens,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.acceptedTokens.delegate = delegate;
    } else if (setting == ControllerSettingOption.AllowlistedBeneficiaries) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.allowlistedBeneficiaries,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.allowlistedBeneficiaries.delegate = delegate;
    } else if (setting == ControllerSettingOption.AllowlistedContributors) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.allowlistedContributors,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.allowlistedContributors.delegate = delegate;
    } else if (setting == ControllerSettingOption.MaturityAllowlist) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.maturityAllowlist,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.maturityAllowlist.delegate = delegate;
    } else if (setting == ControllerSettingOption.MaturityTime) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.maturityTime,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.maturityTime.delegate = delegate;
    } else if (setting == ControllerSettingOption.WithdrawFee) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.withdrawFee,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.withdrawFee.delegate = delegate;
    } else if (setting == ControllerSettingOption.EarlyLockedWithdrawFee) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.earlyLockedWithdrawFee,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.earlyLockedWithdrawFee.delegate = delegate;
    } else if (setting == ControllerSettingOption.DepositFee) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.depositFee,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.depositFee.delegate = delegate;
    } else if (setting == ControllerSettingOption.BalanceFee) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.balanceFee,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.balanceFee.delegate = delegate;
    } else if (setting == ControllerSettingOption.Name) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.name,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.name.delegate = delegate;
    } else if (setting == ControllerSettingOption.Image) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.image,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.image.delegate = delegate;
    } else if (setting == ControllerSettingOption.Logo) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.logo,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.logo.delegate = delegate;
    } else if (setting == ControllerSettingOption.Sdgs) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.sdgs,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.sdgs.delegate = delegate;
    } else if (setting == ControllerSettingOption.SplitToLiquid) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.splitToLiquid,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.splitToLiquid.delegate = delegate;
    } else if (setting == ControllerSettingOption.IgnoreUserSplits) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.ignoreUserSplits,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      tempEndowment.settingsController.ignoreUserSplits.delegate = delegate;
    } else {
      revert("Invalid setting input");
    }
    state.Endowments[id] = tempEndowment;
    emit EndowmentUpdated(id);
  }

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
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[endowId];

    require(tokenAddr != address(0), "Invalid token address passed");
    require(priceFeedAddr != address(0), "Invalid priceFeed address passed");
    require(!state.States[endowId].closingEndowment, "UpdatesAfterClosed");
    require(
      Validator.canChange(
        tempEndowment.settingsController.acceptedTokens,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ),
      "Unauthorized"
    );
    // Check that the deposited token is NOT in the protocol-level accepted tokens list in the Registrar Contract
    // These are globally set and cannot be modified/overridden by endowments
    require(
      !IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddr),
      "Cannot add tokens already in the Registrar AcceptedTokens list"
    );
    // check that the price feed contract address supports ERC-165
    require(
      ERC165Checker.supportsInterface(priceFeedAddr, LibAccounts.InterfaceId_ERC165),
      "Price Feed contract is not a valid ERC-165 interface"
    );
    state.PriceFeeds[endowId][tokenAddr] = priceFeedAddr;
    state.AcceptedTokens[endowId][tokenAddr] = tokenStatus;
  }
}
