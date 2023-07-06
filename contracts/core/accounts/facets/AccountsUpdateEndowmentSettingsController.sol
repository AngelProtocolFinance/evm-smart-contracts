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

/**
 * @title AccountsUpdateEndowmentSettingsController
 * @notice This contract facet is used to manage updates via the endowment settings controller
 * @dev This contract facet is used to manage updates via the endowment settings controller
 */
contract AccountsUpdateEndowmentSettingsController is
  IAccountsUpdateEndowmentSettingsController,
  ReentrancyGuardFacet,
  IAccountsEvents
{
  /**
    @dev Updates the settings of an endowment.
    @param details Object containing the updated details of the endowment settings.
    @param details.id The ID of the endowment to update.
    @param details.allowlistedBeneficiaries The updated list of allowlisted beneficiaries.
    @param details.allowlistedContributors The updated list of allowlisted contributors.
    @param details.maturity_allowlist_add The addresses to add to the maturity allowlist.
    @param details.maturity_allowlist_remove The addresses to remove from the maturity allowlist.
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");

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
      if (tempEndowment.maturityTime <= 0 || tempEndowment.maturityTime > block.timestamp) {
        if (
          Validator.canChange(
            tempEndowment.settingsController.allowlistedBeneficiaries,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          tempEndowment.allowlistedBeneficiaries = details.allowlistedBeneficiaries;
          // IS EMITTING THIS EVENT FOR EACH UPDATED FIELD A GENERAL PRACTICE?
          // I SEE THE BENEFIT, JUST NOT SURE ABOUT GAS EFFICIENCY AND USEFULNESS
          // from: Nenad -> does it even make sense to log every individual field that's changed
          // when we still emit `EndowmentUpdated(endowId)` at the end of the func?
          emit EndowmentSettingUpdated(details.id, "allowlistedBeneficiaries");
        }

        if (
          Validator.canChange(
            tempEndowment.settingsController.allowlistedContributors,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          tempEndowment.allowlistedContributors = details.allowlistedContributors;
          emit EndowmentSettingUpdated(details.id, "allowlistedContributors");
        }
        if (
          Validator.canChange(
            tempEndowment.settingsController.maturityAllowlist,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          for (uint256 i = 0; i < details.maturity_allowlist_add.length; i++) {
            // should this check be performed in other places where an address is being added to a list
            require(Validator.addressChecker(details.maturity_allowlist_add[i]), "InvalidAddress");
            (, bool found) = AddressArray.indexOf(
              tempEndowment.maturityAllowlist,
              details.maturity_allowlist_add[i]
            );
            if (!found) tempEndowment.maturityAllowlist.push(details.maturity_allowlist_add[i]);
          }
          for (uint256 i = 0; i < details.maturity_allowlist_remove.length; i++) {
            (uint256 index, bool found) = AddressArray.indexOf(
              tempEndowment.maturityAllowlist,
              details.maturity_allowlist_remove[i]
            );
            if (found)
              tempEndowment.maturityAllowlist = AddressArray.remove(
                tempEndowment.maturityAllowlist,
                index
              );
          }
          emit EndowmentSettingUpdated(details.id, "maturityAllowlist");
        }
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
    state.ENDOWMENTS[details.id] = tempEndowment;
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");
    require(msg.sender == tempEndowment.owner, "Unauthorized");

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
        tempEndowment.settingsController.withdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.withdrawFee = details.settingsController.withdrawFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.depositFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      tempEndowment.settingsController.depositFee = details.settingsController.depositFee;
    }
    if (
      Validator.canChange(
        tempEndowment.settingsController.balanceFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
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
    state.ENDOWMENTS[details.id] = tempEndowment;
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
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    require(
      tempEndowment.endowType != LibAccounts.EndowmentType.Charity,
      "Charity Endowments may not change endowment fees"
    );
    require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");

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

    state.ENDOWMENTS[details.id] = tempEndowment;
    emit EndowmentUpdated(details.id);
  }
}
