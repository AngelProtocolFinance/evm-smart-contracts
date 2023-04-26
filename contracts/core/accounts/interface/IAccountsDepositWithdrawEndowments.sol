// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {IAxelarGateway} from "./../interface/IAxelarGateway.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IAccountsDepositWithdrawEndowments {
    function depositDonationMatchErC20(
        uint256 curId,
        address curToken,
        uint256 curAmount
    ) external;

    function depositEth(
        AccountMessages.DepositRequest memory curDetails
    ) external payable;

    //Pending
    function depositERC20(
        AccountMessages.DepositRequest memory curDetails,
        address curTokenaddress,
        uint256 curAmount
    ) external;

    function withdraw(
        uint256 curId,
        AngelCoreStruct.AccountType acctType,
        address curBeneficiary,
        address[] memory curTokenaddress,
        uint256[] memory curAmount
    ) external;

    function harvest(address vaultAddr) external returns (bool);
}
