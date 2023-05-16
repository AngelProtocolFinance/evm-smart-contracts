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
 * @title AccountsUpdateEndowments
 * @notice This contract facet updates the endowments
 * @dev This contract facet updates the endowments, updates rights are with owner of accounts contracts (AP Team Multisig) and the endowment owner
 */
contract AccountsUpdateEndowments is ReentrancyGuardFacet, AccountsEvents {
    /**
    @notice Updates the endowment details.
    @dev This function allows authorized users to update the endowment details like owner, tier, endowment type, rebalance, kycDonorsOnly, name, categories, logo, and image.
    @param curDetails UpdateEndowmentDetailsRequest struct containing the updated endowment details.
    */
    function updateEndowmentDetails(
        AccountMessages.UpdateEndowmentDetailsRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];
        // AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.EndowmentState memory tempEndowmentState = state.STATES[
            curDetails.id
        ];

        require(!tempEndowmentState.closingEndowment, "UpdatesAfterClosed");

        if (
            !(msg.sender == state.config.owner ||
                msg.sender == tempEndowment.owner)
        ) {
            if (
                tempEndowment.dao == address(0) ||
                msg.sender != tempEndowment.dao
            ) {
                revert("Unauthorized");
            }
        }

        // only config owner can update owner, tier and endowment type fields
        if (msg.sender == state.config.owner) {
            tempEndowment.tier = curDetails.tier;
            if (curDetails.owner != address(0)) {
                tempEndowment.owner = curDetails.owner;
            }
            tempEndowment.endow_type = curDetails.endow_type;
            require(
                curDetails.endow_type != AngelCoreStruct.EndowmentType.None,
                "InvalidInputs"
            );
        }

        if (tempEndowment.endow_type != AngelCoreStruct.EndowmentType.Charity) {
            tempEndowment.rebalance = curDetails.rebalance;
        }

        // if(tempEndowment.settingsController.kycDonorsOnly)
        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.kycDonorsOnly,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.kycDonorsOnly = curDetails.kycDonorsOnly;
        }
        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.name,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.name = curDetails.name;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.categories,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            if (
                tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Charity
            ) {
                if (curDetails.categories.sdgs.length == 0) {
                    revert("InvalidInputs");
                }
                curDetails.categories.sdgs = Array.sort(
                    curDetails.categories.sdgs
                );
                for (
                    uint256 i = 0;
                    i < curDetails.categories.sdgs.length;
                    i++
                ) {
                    if (
                        curDetails.categories.sdgs[i] > 17 ||
                        curDetails.categories.sdgs[i] == 0
                    ) {
                        revert("InvalidInputs");
                    }
                }
            }
            if (curDetails.categories.general.length > 0) {
                curDetails.categories.general = Array.sort(
                    curDetails.categories.general
                );
                uint256 length = curDetails.categories.general.length;
                if (
                    curDetails.categories.general[length - 1] >
                    state.config.maxGeneralCategoryId
                ) {
                    revert("InvalidInputs");
                }
            }
            tempEndowment.categories = curDetails.categories;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.logo,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.logo = curDetails.logo;
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.image,
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            )
        ) {
            tempEndowment.image = curDetails.image;
        }

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
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
        uint256 id,
        string memory setting,
        string memory action,
        address delegateAddress,
        uint256 delegateExpiry
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[id];
        // AngelCoreStruct.SettingsPermission memory tempSettings = AngelCoreStruct.getPermissions(state.ENDOWMENTS[id].settingsController,setting);

        require(msg.sender == tempEndowment.owner, "Unauthorized");

        if (
            keccak256(abi.encodePacked(action)) ==
            keccak256(abi.encodePacked("set"))
        ) {
            AngelCoreStruct.setDelegate(
                AngelCoreStruct.getPermissions(
                    state.ENDOWMENTS[id].settingsController,
                    setting
                ),
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                delegateAddress,
                delegateExpiry
            );
        } else if (
            keccak256(abi.encodePacked(action)) ==
            keccak256(abi.encodePacked("revoke"))
        ) {
            AngelCoreStruct.revokeDelegate(
                AngelCoreStruct.getPermissions(
                    state.ENDOWMENTS[id].settingsController,
                    setting
                ),
                msg.sender,
                tempEndowment.owner,
                tempEndowment.dao,
                block.timestamp
            );
        } else {
            revert("Invalid Input");
        }

        emit UpdateEndowment(id, tempEndowment);
    }
}
