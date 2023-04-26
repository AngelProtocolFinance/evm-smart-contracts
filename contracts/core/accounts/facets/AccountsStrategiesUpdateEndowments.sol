// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsStrategiesUpdateEndowments
 * @notice This contract facet updates strategies for an endowment
 * @dev This contract facet updates strategies for an endowment
 */
contract AccountsStrategiesUpdateEndowments is
    ReentrancyGuardFacet,
    AccountsEvents
{
    /**
     * @notice This function updates strategies for an endowment
     * @dev This function updates strategies for an endowment
     * @param curId The id of the endowment
     * @param curAccountType The account type
     * @param curStrategies The strategies to update
     */
    function updateStrategies(
        uint256 curId,
        AngelCoreStruct.AccountType curAccountType,
        AccountMessages.Strategy[] memory curStrategies
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        address registrarAddress = state.config.registrarContract;

        require(msg.sender == state.ENDOWMENTS[curId].owner, "Unauthorized");
        require(!state.STATES[curId].closingEndowment, "UpdatesAfterClosed");
        require(
            state.ENDOWMENTS[curId].pendingRedemptions == 0,
            "RedemptionInProgress"
        );

        for (uint256 i = 0; i < curStrategies.length - 1; i += 1) {
            for (uint256 j = i + 1; j < curStrategies.length; j += 1) {
                if (
                    StringArray.stringCompare(
                        curStrategies[i].vault,
                        curStrategies[j].vault
                    )
                ) {
                    revert("StrategyComponentsNotUnique");
                }
            }
        }

        AngelCoreStruct.YieldVault[] memory allowed = IRegistrar(
            registrarAddress
        ).queryVaultList(
                0,
                state.ENDOWMENTS[curId].endow_type,
                curAccountType,
                AngelCoreStruct.VaultType.None,
                AngelCoreStruct.BoolOptional.True,
                0,
                0
            );

        uint256 percentagesSum = 0;

        string[] memory vaultAddr = new string[](curStrategies.length);
        uint256[] memory vaultPercentage = new uint256[](curStrategies.length);
        for (uint256 i = 0; i < curStrategies.length; i += 1) {
            bool flag = false;
            for (uint256 j = 0; j < allowed.length; j += 1) {
                if (
                    StringArray.stringCompare(
                        curStrategies[i].vault,
                        allowed[j].addr
                    )
                ) {
                    flag = true;
                    percentagesSum += curStrategies[i].percentage;

                    vaultAddr[i] = curStrategies[i].vault;
                    vaultPercentage[i] = curStrategies[i].percentage;
                }
            }
            require(flag, "InvalidInputs");
        }

        require(percentagesSum <= 100, "InvalidStrategyAllocation");

        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            state.ENDOWMENTS[curId].strategies.locked_vault = vaultAddr;
            state
                .ENDOWMENTS[curId]
                .strategies
                .lockedPercentage = vaultPercentage;
        } else if (curAccountType == AngelCoreStruct.AccountType.Liquid) {
            state.ENDOWMENTS[curId].strategies.liquid_vault = vaultAddr;
            state
                .ENDOWMENTS[curId]
                .strategies
                .liquidPercentage = vaultPercentage;
        }
        emit UpdateEndowment(curId, state.ENDOWMENTS[curId]);
    }
}
