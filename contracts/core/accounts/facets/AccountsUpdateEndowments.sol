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
    @dev This function allows the Endowment owner to update the endowment details like owner & rebalance and allows them or their Delegate(s) to update name, categories, logo, and image.
    @param curDetails UpdateEndowmentDetailsRequest struct containing the updated endowment details.
    */
    function updateEndowmentDetails(
        AccountMessages.UpdateEndowmentDetailsRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        require(!state.STATES[curDetails.id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[curDetails.id].lockedForever, "Settings are locked forever");

        // there are several fields that are restricted to changing only by the Endowment Owner
        if (msg.sender == tempEndowment.owner) {
            // An Endowment's owner can be set as the gov dao OR the endowment multisig contract
            if (curDetails.owner != address(0) &&
                (curDetails.owner == tempEndowment.dao || curDetails.owner == tempEndowment.multisig)
            ) {
                tempEndowment.owner = curDetails.owner;
            }

            if (tempEndowment.endow_type != AngelCoreStruct.EndowmentType.Charity) {
                tempEndowment.rebalance = curDetails.rebalance;
            }
        }

        if (
            AngelCoreStruct.canChange(
                tempEndowment.settingsController.name,
                msg.sender,
                tempEndowment.owner,
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
        uint32 id,
        string memory setting,
        string memory action,
        address delegateAddress,
        uint256 delegateExpiry
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

        require(!state.STATES[id].closingEndowment, "UpdatesAfterClosed");
        require(!state.STATES[id].lockedForever, "Settings are locked forever");
        require(AngelCoreStruct.controllerSettingValid(setting), "Invalid setting input");

        AngelCoreStruct.Delegate memory newDelegate = AngelCoreStruct.Delegate({addr: address(0), expires: 0});
        if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("set"))) {
            newDelegate = AngelCoreStruct.Delegate({addr: delegateAddress, expires: delegateExpiry});
        }

        bytes32 _setting = keccak256(abi.encodePacked(setting));
        if (_setting == keccak256(abi.encodePacked("strategies"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.strategies, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.strategies = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("allowlistedBeneficiaries"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.allowlistedBeneficiaries, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.allowlistedBeneficiaries = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("allowlistedContributors"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.allowlistedContributors, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.allowlistedContributors = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("maturityAllowlist"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.maturityAllowlist, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.maturityAllowlist = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("maturityTime"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.maturityTime, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.maturityTime = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("withdrawFee"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.withdrawFee, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.withdrawFee = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("depositFee"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.depositFee, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.depositFee = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("balanceFee"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.balanceFee, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.balanceFee = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("name"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.name, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.name = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("image"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.image, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.image = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("logo"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.logo, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.logo = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("categories"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.categories, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.categories = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("splitToLiquid"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.splitToLiquid, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.splitToLiquid = newDelegate;
        } else if (_setting == keccak256(abi.encodePacked("ignoreUserSplits"))) {
           require(AngelCoreStruct.canChange(tempEndowment.settingsController.ignoreUserSplits, msg.sender, tempEndowment.owner, block.timestamp), "Unauthorized");
           tempEndowment.settingsController.ignoreUserSplits = newDelegate;
        } else {
            revert("Input setting was not found");
        }

        emit UpdateEndowment(id, tempEndowment);
    }
}
