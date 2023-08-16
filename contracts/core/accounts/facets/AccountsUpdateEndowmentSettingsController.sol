// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../../validator.sol";
import {AddressArray} from "../../../lib/address/array.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsUpdateEndowmentSettingsController} from "../interfaces/IAccountsUpdateEndowmentSettingsController.sol";
import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";

/**
 * @title AccountsUpdateEndowmentSettingsController
 * @notice This contract facet is used to manage updates via the endowment settings controller
 * @dev This contract facet is used to manage updates via the endowment settings controller
 */
contract AccountsUpdateEndowmentSettingsController is
  IAccountsUpdateEndowmentSettingsController,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMappingAddr
{
  /**
   * @notice Updates an allowlist of an endowment, adding and/or removing addresses.
   * @dev Emits a EndowmentAllowlistUpdated event after the endowment has been updated.
   * @dev Throws an error if the endowment is closing.
   * @param id The ID of the endowment to updated
   * @param allowlistType AllowlistType to be updated
   * @param add The addresses to add to the allowlist
   * @param remove The addresses to remove from the allowlist
   */
  function updateEndowmentAllowlist(
    uint32 id,
    LibAccounts.AllowlistType allowlistType,
    address[] memory add,
    address[] memory remove
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];

    require(!state.States[id].closingEndowment, "UpdatesAfterClosed");
    require(
      tempEndowment.maturityTime == 0 || tempEndowment.maturityTime > block.timestamp,
      "Updates cannot be done after maturity has been reached"
    );
    require(tempEndowment.endowType != LibAccounts.EndowmentType.Charity, "Unauthorized");

    if (allowlistType == LibAccounts.AllowlistType.AllowlistedBeneficiaries) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.allowlistedBeneficiaries,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else if (allowlistType == LibAccounts.AllowlistType.AllowlistedContributors) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.allowlistedContributors,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else if (allowlistType == LibAccounts.AllowlistType.MaturityAllowlist) {
      require(
        Validator.canChange(
          tempEndowment.settingsController.maturityAllowlist,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else {
      revert("Invalid AllowlistType");
    }

    for (uint256 i = 0; i < add.length; i++) {
      require(add[i] != address(0), "Zero address passed");
      IterableMappingAddr.set(state.Allowlists[id][allowlistType], add[i], 1);
    }

    for (uint256 i = 0; i < remove.length; i++) {
      require(add[i] != address(0), "Zero address passed");
      IterableMappingAddr.remove(state.Allowlists[id][allowlistType], remove[i]);
    }

    emit EndowmentAllowlistUpdated(id, allowlistType, add, remove);
  }

  /**
    @dev Updates the settings of an endowment.
    @param details Object containing the updated details of the endowment settings.
    @param details.id The ID of the endowment to update.
    @param details.splitToLiquid The updated split to liquid ratio.
    @param details.ignoreUserSplits Whether or not to ignore user splits.
    Emits a EndowmentSettingUpdated event for each setting that has been updated.
    Emits an EndowmentUpdated event after the endowment has been updated.
    Throws an error if the endowment is closing.
    */
  function updateEndowmentSettings(
    AccountMessages.UpdateEndowmentSettingsRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[details.id];

    require(!state.States[details.id].closingEndowment, "UpdatesAfterClosed");

    if (tempEndowment.endowType != LibAccounts.EndowmentType.Charity) {
      if (
        Validator.canChange(
          tempEndowment.settingsController.maturityTime,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        )
      ) {
        tempEndowment.maturityTime = details.maturityTime;
        emit EndowmentSettingUpdated(details.id, "maturityTime");
      }
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.splitToLiquid,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.splitToLiquid = details.splitToLiquid;
      emit EndowmentSettingUpdated(details.id, "splitToLiquid");
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.ignoreUserSplits,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.ignoreUserSplits = details.ignoreUserSplits;
      emit EndowmentSettingUpdated(details.id, "ignoreUserSplits");
    }
    emit EndowmentUpdated(details.id);
  }

  /**
    @notice Updates the controller of the specified endowment
    @dev Only the endowment owner can call this function
    @param details The updated details of the endowment controller
    @param details.id The ID of the endowment
    */
  function updateEndowmentController(
    AccountMessages.UpdateEndowmentControllerRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[details.id];

    require(!state.States[details.id].closingEndowment, "UpdatesAfterClosed");

    if (
      Validator.canChange(
        tempEndowment.settingsController.lockedInvestmentManagement,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.lockedInvestmentManagement = details
        .settingsController
        .lockedInvestmentManagement;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.liquidInvestmentManagement,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.liquidInvestmentManagement = details
        .settingsController
        .liquidInvestmentManagement;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.acceptedTokens,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.acceptedTokens = details.settingsController.acceptedTokens;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.allowlistedBeneficiaries,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.allowlistedBeneficiaries = details
        .settingsController
        .allowlistedBeneficiaries;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.allowlistedContributors,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.allowlistedContributors = details
        .settingsController
        .allowlistedContributors;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.maturityAllowlist,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.maturityAllowlist = details
        .settingsController
        .maturityAllowlist;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.maturityTime,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.maturityTime = details.settingsController.maturityTime;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.earlyLockedWithdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ) && tempEndowment.endowType != LibAccounts.EndowmentType.Charity
    ) {
      tempEndowment.settingsController.earlyLockedWithdrawFee = details
        .settingsController
        .earlyLockedWithdrawFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.withdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ) && tempEndowment.endowType != LibAccounts.EndowmentType.Charity
    ) {
      tempEndowment.settingsController.withdrawFee = details.settingsController.withdrawFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.depositFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ) && tempEndowment.endowType != LibAccounts.EndowmentType.Charity
    ) {
      tempEndowment.settingsController.depositFee = details.settingsController.depositFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.balanceFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      ) && tempEndowment.endowType != LibAccounts.EndowmentType.Charity
    ) {
      tempEndowment.settingsController.balanceFee = details.settingsController.balanceFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.name,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.name = details.settingsController.name;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.image,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.image = details.settingsController.image;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.logo,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.logo = details.settingsController.logo;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.sdgs,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.sdgs = details.settingsController.sdgs;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.splitToLiquid,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.splitToLiquid = details.settingsController.splitToLiquid;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.ignoreUserSplits,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.ignoreUserSplits = details
        .settingsController
        .ignoreUserSplits;
    }
    emit EndowmentSettingUpdated(details.id, "endowmentController");
    emit EndowmentUpdated(details.id);
  }

  /**
    @notice Allows the owner or DAO to update the fees for a given endowment.
    @dev Only the fees that the caller is authorized to update will be updated.
    @param details The details of the fee update request, including the endowment ID, new fees, and the caller's signature.
    @dev Emits an EndowmentUpdated event containing the updated endowment details.
    @dev Reverts if the endowment is of type Charity, as charity endowments may not change fees.
    */
  function updateFeeSettings(
    AccountMessages.UpdateFeeSettingRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.Endowments[details.id];

    require(
      tempEndowment.endowType != LibAccounts.EndowmentType.Charity,
      "Charity Endowments may not change endowment fees"
    );
    require(!state.States[details.id].closingEndowment, "UpdatesAfterClosed");

    if (
      Validator.canChange(
        tempEndowment.settingsController.earlyLockedWithdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      Validator.validateFee(details.earlyLockedWithdrawFee);
      tempEndowment.earlyLockedWithdrawFee = details.earlyLockedWithdrawFee;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.depositFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      Validator.validateFee(details.depositFee);
      tempEndowment.depositFee = details.depositFee;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.withdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      Validator.validateFee(details.withdrawFee);
      tempEndowment.withdrawFee = details.withdrawFee;
    }

    if (
      Validator.canChange(
        tempEndowment.settingsController.balanceFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      Validator.validateFee(details.balanceFee);
      tempEndowment.balanceFee = details.balanceFee;
    }

    // check that combined Endowment-level Withdraw Fees do not exceed 100%
    require(
      (tempEndowment.withdrawFee.bps + tempEndowment.earlyLockedWithdrawFee.bps) <=
        LibAccounts.FEE_BASIS,
      "Combined Withdraw Fees exceed 100%"
    );

    emit EndowmentUpdated(details.id);
  }
}
