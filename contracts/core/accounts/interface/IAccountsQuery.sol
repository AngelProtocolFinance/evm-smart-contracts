// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";
import {AccountStorage} from "../storage.sol";
import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsQuery {
    function queryTokenAmount(
        uint256 curId,
        AngelCoreStruct.AccountType curAccountType,
        address curTokenaddress
    ) external view returns (uint256 tokenAmount);

    function queryEndowmentDetails(
        uint256 curId
    ) external view returns (AccountStorage.Endowment memory endowment);

    function queryConfig()
        external
        view
        returns (AccountMessages.ConfigResponse memory config);

    function queryState(
        uint256 curId
    )
        external
        view
        returns (AccountMessages.StateResponse memory stateResponse);
}
