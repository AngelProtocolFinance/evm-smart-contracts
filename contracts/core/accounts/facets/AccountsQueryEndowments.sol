// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";

/**
 * @title AccountsQueryEndowments
 * @notice This contract facet queries for endowment and accounts config
 * @dev This contract facet queries for endowment and accounts config
 */
contract AccountsQueryEndowments {
    /**
     * @notice This function queries the balance of a token for an endowment
     * @dev This function queries the balance of a token for an endowment based on its type and address
     * @param curId The id of the endowment
     * @param curAccountType The account type
     * @param curTokenAddress The address of the token
     * @return tokenAmount balance of token
     */
    function queryTokenAmount(
        uint256 curId,
        AngelCoreStruct.AccountType curAccountType,
        address curTokenAddress
    ) public view returns (uint256 tokenAmount) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        require(address(0) != curTokenAddress, "Invalid token address");

        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            tokenAmount = state.STATES[curId].balances.locked.balancesByToken[curTokenAddress];
        } 
        else {
            tokenAmount = state.STATES[curId].balances.liquid.balancesByToken[curTokenAddress];
        }
    }

    /**
     * @notice queries the endowment details
     * @dev queries the endowment details
     * @param curId The id of the endowment
     * @return endowment The endowment details
     */
    function queryEndowmentDetails(
        uint256 curId
    ) public view returns (AccountStorage.Endowment memory endowment) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        endowment = state.ENDOWMENTS[curId];
    }

    /**
     * @notice queries the accounts contract config
     * @dev queries the accounts contract config
     * @return config The accounts contract config
     */
    function queryConfig()
        public
        view
        returns (AccountMessages.ConfigResponse memory config)
    {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        config = AccountMessages.ConfigResponse({
            owner: state.config.owner,
            version: state.config.version,
            registrarContract: state.config.registrarContract,
            nextAccountId: state.config.nextAccountId,
            maxGeneralCategoryId: state.config.maxGeneralCategoryId,
            subDao: state.config.subDao,
            gateway: state.config.gateway,
            gasReceiver: state.config.gasReceiver
        });
    }

    /**
     * @notice queries the endowment donations state
     * @dev queries the endowment state
     * @param curId The id of the endowment
     * @return stateResponse The endowment state
     */
    function queryState(
        uint256 curId
    ) public view returns (AccountMessages.StateResponse memory stateResponse) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        stateResponse = AccountMessages.StateResponse({
            donationsReceived: state.STATES[curId].donationsReceived,
            closingEndowment: state.STATES[curId].closingEndowment,
            closingBeneficiary: state.STATES[curId].closingBeneficiary
        });
    }

    // /**
    //  * @dev Queries the balance of a specific vault for an endowment account.
    //  * @param curId ID of the endowment account.
    //  * @param vaultType Type of the vault account.
    //  * @param vault Address of the vault contract.
    //  * @return vaultBalance Balance of the specified vault.
    //  */
    // function queryVaultBalance(
    //     uint256 curId,
    //     AngelCoreStruct.AccountType vaultType,
    //     string memory vault
    // ) public view returns (uint256 vaultBalance) {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     vaultBalance = state.vaultBalance[curId][vaultType][vault];
    // }
}
