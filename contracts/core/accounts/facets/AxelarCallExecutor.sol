// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IRouter} from "../../router/IRouter.sol";
import {Utils} from "../../../lib/utils.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {IAxelarGateway} from "./../interfaces/IAxelarGateway.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AxelarCallExecutor
 * @notice This contract facet executes cross-chain calls
 * @dev This contract facet executes cross-chain calls
 */
contract AxelarExecutionContract is ReentrancyGuardFacet, AccountsEvents {
    error NotApprovedByGateway();

    /**
     * @notice This function validates the deposit fund
     * @param registrar  The registrar address
     * @param tokenaddress  The token address
     * @param amount  The amount
     */
    function validateDepositFund(
        address registrar,
        address tokenaddress,
        uint256 amount
    ) public view returns (bool) {
        require(IRegistrar(
            registrar
        ).isTokenAccepted(tokenaddress), "Not accepted token");

        require(amount > 0, "InvalidZeroAmount");

        return true;
    }
}
