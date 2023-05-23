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
import {IAccountsQuery} from "../interfaces/IAccountsQuery.sol";

/**
 * @title AccountsUpdateEndowments
 * @notice This contract facet updates the endowments
 * @dev This contract facet updates the endowments, updates rights are with owner of accounts contracts (AP Team Multisig) and the endowment owner
 */
contract AccountsUpdateEndowments is ReentrancyGuardFacet, AccountsEvents {
    /**
    @notice Updates the endowment details.
    @dev This function allows the Endowment owner to update the endowment details like owner & rebalance and allows them or their Delegate(s) to update name, categories, logo, and image.
    @param details UpdateEndowmentDetailsRequest struct containing the updated endowment details.
    */
    function updateEndowmentDetails(
        AccountMessages.UpdateEndowmentDetailsRequest memory details
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            details.id
        ];

        require(!state.STATES[details.id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[details.id].lockedForever, "Settings are locked forever");

        // there are several fields that are restricted to changing only by the Endowment Owner
        if (msg.sender == tempEndowment.owner) {
            // An Endowment's owner can be set as the gov dao OR the endowment multisig contract
            if (details.owner != address(0) &&
                (details.owner == tempEndowment.dao || details.owner == tempEndowment.multisig)
            ) {
                tempEndowment.owner = details.owner;
            }

            if (tempEndowment.endowType != AngelCoreStruct.EndowmentType.Charity) {
                tempEndowment.rebalance = details.rebalance;
            }
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.name.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.name = details.name;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.categories.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            if (
                tempEndowment.endowType ==
                AngelCoreStruct.EndowmentType.Charity
            ) {
                if (details.categories.sdgs.length == 0) {
                    revert("InvalidInputs");
                }
                details.categories.sdgs = Array.sort(
                    details.categories.sdgs
                );
                for (
                    uint256 i = 0;
                    i < details.categories.sdgs.length;
                    i++
                ) {
                    if (
                        details.categories.sdgs[i] > 17 ||
                        details.categories.sdgs[i] == 0
                    ) {
                        revert("InvalidInputs");
                    }
                }
            }
            if (details.categories.general.length > 0) {
                details.categories.general = Array.sort(
                    details.categories.general
                );
                uint256 length = details.categories.general.length;
                if (
                    details.categories.general[length - 1] >
                    state.config.maxGeneralCategoryId
                ) {
                    revert("InvalidInputs");
                }
            }
            tempEndowment.categories = details.categories;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.logo.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.logo = details.logo;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.image.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            )
        ) {
            tempEndowment.image = details.image;
        }

        state.ENDOWMENTS[details.id] = tempEndowment;
        emit UpdateEndowment(details.id, tempEndowment);
    }

    /**
    @notice Updates the delegate for a specific endowment setting
    @dev This function allows authorized users to update the delegate for a specific endowment setting
    @param id The ID of the endowment
    @param setting The setting for which to update the delegate
    @param action The action to perform (set/revoke)
    @param delegateAddress The address of the delegate to add/revoke
    @param delegateExpiry The timestamp at which the delegate's permission expires
    */
    function updateDelegate(
        uint32 id,
        AngelCoreStruct.ControllerSettingOption setting,
        AngelCoreStruct.DelegateAction action,
        address delegateAddress,
        uint256 delegateExpiry
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

        require(!state.STATES[id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[id].lockedForever, "Settings are locked forever");

        AngelCoreStruct.Delegate memory newDelegate;
        if (action == AngelCoreStruct.DelegateAction.Set) {
            newDelegate = AngelCoreStruct.Delegate({addr: delegateAddress, expires: delegateExpiry});
        } else if (action == AngelCoreStruct.DelegateAction.Revoke) {
            newDelegate = AngelCoreStruct.Delegate({addr: address(0), expires: 0});
        } else {
            revert("Invalid action passed");
        }

        if (setting == AngelCoreStruct.ControllerSettingOption.Strategies) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.strategies.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.strategies.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.AllowlistedBeneficiaries) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.allowlistedBeneficiaries.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.allowlistedBeneficiaries.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.AllowlistedContributors) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.allowlistedContributors.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.allowlistedContributors.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.MaturityAllowlist) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.maturityAllowlist.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.maturityAllowlist.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.MaturityTime) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.maturityTime.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.maturityTime.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.WithdrawFee) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.withdrawFee.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.withdrawFee.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.DepositFee) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.depositFee.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.depositFee.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.BalanceFee) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.balanceFee.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.balanceFee.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.Name) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.name.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.name.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.Image) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.image.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.image.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.Logo) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.logo.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.logo.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.Categories) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.categories.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.categories.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.SplitToLiquid) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.splitToLiquid.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.splitToLiquid.delegate = newDelegate;
        } else if (setting == AngelCoreStruct.ControllerSettingOption.IgnoreUserSplits) {
           require(
                AngelCoreStruct.canChange(
                    tempEndowment.settingsController.ignoreUserSplits.delegate,
                    msg.sender,
                    tempEndowment.owner,
                    block.timestamp
                ), "Unauthorized"
            );
           tempEndowment.settingsController.ignoreUserSplits.delegate = newDelegate;
        } else {
            revert("Invalid setting input");
        }

        emit UpdateEndowment(id, tempEndowment);
    }
}
