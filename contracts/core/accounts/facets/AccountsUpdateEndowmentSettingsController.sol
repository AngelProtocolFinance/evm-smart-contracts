// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AddressArray} from "../../../lib/address/array.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {Array} from "../../../lib/array.sol";
import {Utils} from "../../../lib/utils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IAccountsQuery} from "../interface/IAccountsQuery.sol";

/**
 * @title AccountsUpdateEndowmentSettingsController
 * @notice This contract facet is used to manage updates via the endowment settings controller
 * @dev This contract facet is used to manage updates via the endowment settings controller
 */
contract AccountsUpdateEndowmentSettingsController is
    ReentrancyGuardFacet,
    AccountsEvents
{
    /**
    @dev Updates the settings of an endowment.
    @param curDetails Object containing the updated details of the endowment settings.
    @param curDetails.id The ID of the endowment to update.
    @param curDetails.allowlistedBeneficiaries The updated list of allowlisted beneficiaries.
    @param curDetails.allowlistedContributors The updated list of allowlisted contributors.
    @param curDetails.maturity_allowlist_add The addresses to add to the maturity allowlist.
    @param curDetails.maturity_allowlist_remove The addresses to remove from the maturity allowlist.
    @param curDetails.splitToLiquid The updated split to liquid ratio.
    @param curDetails.ignoreUserSplits Whether or not to ignore user splits.
    Emits a EndowmentSettingUpdated event for each setting that has been updated.
    Emits an UpdateEndowment event after the endowment has been updated.
    Throws an error if the endowment is closing.
    */
    function updateEndowmentSettings(
        AccountMessages.UpdateEndowmentSettingsRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        require(!state.STATES[curDetails.id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[curDetails.id].lockedForever, "Settings are locked forever");

        if (tempEndowment.endow_type != AngelCoreStruct.EndowmentType.Charity) {
            if (tempEndowment.maturityTime > block.timestamp) {
                if (
                    AngelCoreStruct.canChange(
                        tempEndowment.settingsController.allowlistedBeneficiaries,
                        msg.sender,
                        tempEndowment.owner,
                        block.timestamp
                    )
                ) {
                    tempEndowment.allowlistedBeneficiaries = curDetails.allowlistedBeneficiaries;
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "allowlistedBeneficiaries"
                    );
                }

                if (
                    AngelCoreStruct.canChange(
                        tempEndowment.settingsController.allowlistedContributors,
                        msg.sender,
                        tempEndowment.owner,
                        block.timestamp
                    )
                ) {
                    tempEndowment.allowlistedContributors = curDetails.allowlistedContributors;
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "allowlistedContributors"
                    );
                }

                if (
                    AngelCoreStruct.canChange(
                        tempEndowment.settingsController.maturityAllowlist,
                        msg.sender,
                        tempEndowment.owner,
                        block.timestamp
                    )
                ) {
                    for (
                        uint256 i = 0;
                        i < curDetails.maturity_allowlist_add.length;
                        i++
                    ) {
                        require(
                            Validator.addressChecker(
                                curDetails.maturity_allowlist_add[i]
                            ),
                            "InvalidAddress"
                        );
                        (, bool found) = AddressArray.indexOf(
                            tempEndowment.maturityAllowlist,
                            curDetails.maturity_allowlist_add[i]
                        );
                        if (!found)
                            tempEndowment.maturityAllowlist.push(
                                curDetails.maturity_allowlist_add[i]
                            );
                    }
                    for (
                        uint256 i = 0;
                        i < curDetails.maturity_allowlist_remove.length;
                        i++
                    ) {
                        (uint256 index, bool found) = AddressArray.indexOf(
                            tempEndowment.maturityAllowlist,
                            curDetails.maturity_allowlist_remove[i]
                        );
                        if (found)
                            tempEndowment.maturityAllowlist = AddressArray
                                .remove(tempEndowment.maturityAllowlist, index);
                    }
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "maturityAllowlist"
                    );
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
            tempEndowment.splitToLiquid = curDetails.splitToLiquid;
            emit EndowmentSettingUpdated(curDetails.id, "splitToLiquid");
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.ignoreUserSplits,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.ignoreUserSplits = curDetails.ignoreUserSplits;
            emit EndowmentSettingUpdated(curDetails.id, "ignoreUserSplits");
        }
        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }

    /**
    @notice Updates the controller of the specified endowment
    @dev Only the endowment owner can call this function
    @param curDetails The updated details of the endowment controller
    @param curDetails.id The ID of the endowment
    */
    function updateEndowmentController(
        AccountMessages.UpdateEndowmentControllerRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        require(!state.STATES[curDetails.id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[curDetails.id].lockedForever, "Settings are locked forever");
        require(msg.sender == tempEndowment.owner, "Unauthorized");

        tempEndowment.settingsController = curDetails.settingsController;

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit EndowmentSettingUpdated(curDetails.id, "endowmentController");
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }

    /**
    @notice Allows the owner or DAO to update the fees for a given endowment.
    @dev Only the fees that the caller is authorized to update will be updated.
    @param curDetails The details of the fee update request, including the endowment ID, new fees, and the caller's signature.
    @dev Emits an UpdateEndowment event containing the updated endowment details.
    @dev Reverts if the endowment is of type Charity, as charity endowments may not change fees.
    */
    function updateEndowmentFees(
        AccountMessages.UpdateEndowmentFeeRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        require(
            tempEndowment.endow_type != AngelCoreStruct.EndowmentType.Charity,
            "Charity Endowments may not change endowment fees"
        );
        require(!state.STATES[curDetails.id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[curDetails.id].lockedForever, "Settings are locked forever");

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.depositFee,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.depositFee = curDetails.depositFee;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.withdrawFee,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.withdrawFee = curDetails.withdrawFee;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.balanceFee,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.balanceFee = curDetails.balanceFee;
        }

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }
}
