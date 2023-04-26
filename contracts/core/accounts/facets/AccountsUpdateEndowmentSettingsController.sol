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
    @param curDetails.whitelistedBeneficiaries The updated list of whitelisted beneficiaries.
    @param curDetails.whitelistedContributors The updated list of whitelisted contributors.
    @param curDetails.maturity_whitelist_add The addresses to add to the maturity whitelist.
    @param curDetails.maturity_whitelist_remove The addresses to remove from the maturity whitelist.
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
        AccountStorage.EndowmentState memory tempEndowmentState = state.STATES[
            curDetails.id
        ];
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        if (tempEndowmentState.closingEndowment) {
            revert("UpdatesAfterClosed");
        }

        if (tempEndowment.endow_type != AngelCoreStruct.EndowmentType.Charity) {
            if (tempEndowment.maturityTime > block.timestamp) {
                if (
                    AngelCoreStruct.canChange(
                        tempEndowment
                            .settingsController
                            .whitelistedBeneficiaries,
                        msg.sender,
                        tempEndowment.owner,
                        tempEndowment.dao,
                        block.timestamp
                    )
                ) {
                    tempEndowment.whitelistedBeneficiaries = curDetails
                        .whitelistedBeneficiaries;
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "whitelistedBeneficiaries"
                    );
                }

                if (
                    AngelCoreStruct.canChange(
                        tempEndowment
                            .settingsController
                            .whitelistedContributors,
                        msg.sender,
                        tempEndowment.owner,
                        tempEndowment.dao,
                        block.timestamp
                    )
                ) {
                    tempEndowment.whitelistedContributors = curDetails
                        .whitelistedContributors;
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "whitelistedContributors"
                    );
                }

                if (
                    AngelCoreStruct.canChange(
                        tempEndowment.settingsController.maturityWhitelist,
                        msg.sender,
                        tempEndowment.owner,
                        tempEndowment.dao,
                        block.timestamp
                    )
                ) {
                    for (
                        uint256 i = 0;
                        i < curDetails.maturity_whitelist_add.length;
                        i++
                    ) {
                        require(
                            Validator.addressChecker(
                                curDetails.maturity_whitelist_add[i]
                            ),
                            "InvalidAddress"
                        );
                        (, bool found) = AddressArray.indexOf(
                            tempEndowment.maturityWhitelist,
                            curDetails.maturity_whitelist_add[i]
                        );
                        if (!found)
                            tempEndowment.maturityWhitelist.push(
                                curDetails.maturity_whitelist_add[i]
                            );
                    }
                    for (
                        uint256 i = 0;
                        i < curDetails.maturity_whitelist_remove.length;
                        i++
                    ) {
                        (uint256 index, bool found) = AddressArray.indexOf(
                            tempEndowment.maturityWhitelist,
                            curDetails.maturity_whitelist_remove[i]
                        );
                        if (found)
                            tempEndowment.maturityWhitelist = AddressArray
                                .remove(tempEndowment.maturityWhitelist, index);
                    }
                    emit EndowmentSettingUpdated(
                        curDetails.id,
                        "maturityWhitelist"
                    );
                }
            }
        }
        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.splitToLiquid,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
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
                tempEndowment.dao,
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
    @dev Only the current controller of the endowment or the owner or DAO can call this function
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
        AccountStorage.EndowmentState memory tempEndowmentState = state.STATES[
            curDetails.id
        ];

        if (tempEndowmentState.closingEndowment) {
            revert("UpdatesAfterClosed");
        }

        if (
            !AngelCoreStruct.canChange(
                tempEndowment.settingsController.endowmentController,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            revert("Unauthorized");
        }
        tempEndowment.settingsController.endowmentController = curDetails
            .endowmentController;
        tempEndowment.settingsController.name = curDetails.name;
        tempEndowment.settingsController.image = curDetails.image;
        tempEndowment.settingsController.logo = curDetails.logo;
        tempEndowment.settingsController.categories = curDetails.categories;
        tempEndowment.settingsController.kycDonorsOnly = curDetails
            .kycDonorsOnly;
        tempEndowment.settingsController.splitToLiquid = curDetails
            .splitToLiquid;
        tempEndowment.settingsController.ignoreUserSplits = curDetails
            .ignoreUserSplits;
        tempEndowment.settingsController.whitelistedBeneficiaries = curDetails
            .whitelistedBeneficiaries;
        tempEndowment.settingsController.whitelistedContributors = curDetails
            .whitelistedContributors;
        tempEndowment.settingsController.maturityWhitelist = curDetails
            .maturityWhitelist;
        tempEndowment.settingsController.earningsFee = curDetails.earningsFee;
        tempEndowment.settingsController.depositFee = curDetails.depositFee;
        tempEndowment.settingsController.withdrawFee = curDetails.withdrawFee;
        tempEndowment.settingsController.aumFee = curDetails.aumFee;

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

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.earningsFee,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.earningsFee = curDetails.earningsFee;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.depositFee,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
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
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.withdrawFee = curDetails.withdrawFee;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.aumFee,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.aumFee = curDetails.aumFee;
        }

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }
}
