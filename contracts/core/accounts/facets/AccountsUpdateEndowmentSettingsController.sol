// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AddressArray} from "../../../lib/address/array.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {Array} from "../../../lib/array.sol";
import {Utils} from "../../../lib/utils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsUpdateEndowmentSettingsController
 * @notice This contract facet is used to manage updates via the endowment settings controller
 * @dev This contract facet is used to manage updates via the endowment settings controller
 */
contract AccountsUpdateEndowmentSettingsController is ReentrancyGuardFacet, AccountsEvents {
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
    Emits an UpdateEndowment event after the endowment has been updated.
    Throws an error if the endowment is closing.
    */
  function updateEndowmentSettings(
    AccountMessages.UpdateEndowmentSettingsRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");

    if (tempEndowment.endowType != AngelCoreStruct.EndowmentType.Charity) {
      // when maturity time is <= 0 it means it's not set, i.e. the AST is perpetual
      if (tempEndowment.maturityTime <= 0 || tempEndowment.maturityTime > block.timestamp) {
        if (
          AngelCoreStruct.canChange(
            tempEndowment.settingsController.maturityTime,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          // Changes must be to a future time OR changing to a perpetual maturity
          require(
            details.maturityTime > block.timestamp || details.maturityTime == 0,
            "Invalid maturity time input"
          );
          tempEndowment.maturityTime = details.maturityTime;
          emit EndowmentSettingUpdated(details.id, "maturityTime");
        }
        if (
          AngelCoreStruct.canChange(
            tempEndowment.settingsController.allowlistedBeneficiaries,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          tempEndowment.allowlistedBeneficiaries = details.allowlistedBeneficiaries;
          emit EndowmentSettingUpdated(details.id, "allowlistedBeneficiaries");
        }

        if (
          AngelCoreStruct.canChange(
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
          AngelCoreStruct.canChange(
            tempEndowment.settingsController.maturityAllowlist,
            msg.sender,
            tempEndowment.owner,
            block.timestamp
          )
        ) {
          for (uint256 i = 0; i < details.maturity_allowlist_add.length; i++) {
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
      AngelCoreStruct.canChange(
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
      AngelCoreStruct.canChange(
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
    emit UpdateEndowment(details.id, tempEndowment);
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

    tempEndowment.settingsController = details.settingsController;

    emit EndowmentSettingUpdated(details.id, "endowmentController");
    emit UpdateEndowment(details.id, tempEndowment);
  }

  /**
    @notice Allows the owner or DAO to update the fees for a given endowment.
    @dev Only the fees that the caller is authorized to update will be updated.
    @param details The details of the fee update request, including the endowment ID, new fees, and the caller's signature.
    @dev Emits an UpdateEndowment event containing the updated endowment details.
    @dev Reverts if the endowment is of type Charity, as charity endowments may not change fees.
    */
  function updateFeeSettings(
    AccountMessages.UpdateFeeSettingRequest memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[details.id];

    require(
      tempEndowment.endowType != AngelCoreStruct.EndowmentType.Charity,
      "Charity Endowments may not change endowment fees"
    );
    require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");

    if (
      AngelCoreStruct.canChange(
        tempEndowment.settingsController.earlyLockedWithdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      AngelCoreStruct.validateFee(details.earlyLockedWithdrawFee);
      tempEndowment.earlyLockedWithdrawFee = details.earlyLockedWithdrawFee;
    }

    if (
      AngelCoreStruct.canChange(
        tempEndowment.settingsController.depositFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      AngelCoreStruct.validateFee(details.depositFee);
      tempEndowment.depositFee = details.depositFee;
    }

    if (
      AngelCoreStruct.canChange(
        tempEndowment.settingsController.withdrawFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      AngelCoreStruct.validateFee(details.withdrawFee);
      tempEndowment.withdrawFee = details.withdrawFee;
    }

    if (
      AngelCoreStruct.canChange(
        tempEndowment.settingsController.balanceFee,
        msg.sender,
        tempEndowment.owner,
        block.timestamp
      )
    ) {
      AngelCoreStruct.validateFee(details.balanceFee);
      tempEndowment.balanceFee = details.balanceFee;
    }

    state.ENDOWMENTS[details.id] = tempEndowment;
    emit UpdateEndowment(details.id, tempEndowment);
  }
}
