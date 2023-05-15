// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountStorage} from "../storage.sol";
import {SubDao, subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {AccountMessages} from "../message.sol";

abstract contract AccountsEvents {
    event DaoContractCreated(
        subDaoMessage.InstantiateMsg curCreatedaomessage,
        address daoAddress
    );
    event DonationDeposited(uint256 curId, uint256 curAmount);
    event DonationWithdrawn(uint256 id, address recipient, uint256 amount);
    event RemoveAllowance(
        address sender,
        address spender,
        address tokenAddress
    );
    event AllowanceStateUpdatedTo(
        address sender,
        address spender,
        address tokenAddress,
        AccountStorage.AllowanceData allowance
    );
    event EndowmentCreated(uint256 id, AccountStorage.Endowment endowment);
    event UpdateEndowment(uint256 id, AccountStorage.Endowment endowment);
    event UpdateConfig(AccountStorage.Config config);
    event DonationMatchSetup(uint256 id, address donationMatchContract);
    event SwapToken(
        uint256 curId,
        AngelCoreStruct.AccountType curAccountType,
        uint256 curAmount,
        address curTokenin,
        address curTokenout,
        uint256 curAmountout
    );
    event EndowmentSettingUpdated(uint256 id, string setting);
    // event UpdateEndowmentState(uint256 id, AccountStorage.EndowmentState state);
}
