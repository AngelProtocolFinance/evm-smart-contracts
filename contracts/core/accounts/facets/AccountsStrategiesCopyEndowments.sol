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
 * @title AccountsStrategiesCopyEndowments
 * @notice This contract facet copies strategies from one endowment to another
 * @dev This contract facet copies strategies from one endowment to another
 */
contract AccountsStrategiesCopyEndowments is
    ReentrancyGuardFacet,
    AccountsEvents
{
    /**
     * @notice This function copies strategies from one endowment to another
     * @dev This function copies strategies from one endowment to another
     * @param curCopytoid The id of the endowment to copy to
     * @param curAccountType The account type
     * @param curCopyfromid The id of the endowment to copy from
     */
    function copycatStrategies(
        uint256 curCopytoid,
        AngelCoreStruct.AccountType curAccountType,
        uint256 curCopyfromid
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        require(
            msg.sender == state.ENDOWMENTS[curCopytoid].owner,
            "Unauthorized"
        );

        AccountStorage.Endowment memory copyEndowment = state.ENDOWMENTS[
            curCopyfromid
        ];

        uint256 length = 0;
        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            length = copyEndowment.strategies.locked_vault.length;
        } else if (curAccountType == AngelCoreStruct.AccountType.Liquid) {
            length = copyEndowment.strategies.liquid_vault.length;
        }

        require(
            length > 0,
            "Attempting to copy an endowment with no set strategy for that account type"
        );

        require(
            state.ENDOWMENTS[curCopytoid].copycatStrategy != curCopyfromid,
            "Attempting re-set the same copycat endowment ID"
        );

        state.ENDOWMENTS[curCopytoid].copycatStrategy = curCopyfromid;
        emit UpdateEndowment(curCopytoid, state.ENDOWMENTS[curCopytoid]);
    }
}
