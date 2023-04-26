// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AccountStorage} from "./storage.sol";
import {Validator} from "./lib/validator.sol";
import {AccountMessages} from "./message.sol";
import {AngelCoreStruct} from "../struct.sol";
import {Array} from "../../lib/array.sol";
import {IRegistrar} from "../registrar/interface/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

//Storage
import "./storage.sol";

//Interface
// import "../../interface/swapping.sol";

interface IAccounts {
    function createEndowment(
        AccountMessages.CreateEndowmentRequest memory curDetails
    ) external returns (bool response);

    function updateOwner(address newOwner) external returns (bool);

    function updateConfig(
        address newRegistrar,
        uint256 maxGeneralCategoryId
    ) external returns (bool);

    function updateEndowmentStatusMsg(
        AccountMessages.UpdateEndowmentStatusRequest memory curDetails
    ) external returns (bool response);

    function updateEndowmentDetails(
        AccountMessages.UpdateEndowmentDetailsRequest memory curDetails
    ) external returns (bool);

    function updateDelegate(
        uint256 id,
        string memory setting,
        string memory action,
        address delegateAddress,
        uint256 delegateExpiry
    ) external returns (bool);

    function updateStrategies(
        uint256 id,
        AngelCoreStruct.AccountType acctType,
        AccountMessages.Strategy[] memory strategies
    ) external returns (bool);

    function copycatStrategies(
        uint256 id,
        AngelCoreStruct.AccountType acctType,
        uint256 idToCopy
    ) external returns (bool);

    //TODO: Complete This contract once swap-router is completed.
    function swapToken(
        uint256 curId,
        AngelCoreStruct.AccountType,
        uint128 curAmount,
        address curTokenin,
        address curTokenout
    ) external returns (bool);

    // function swapReceipt(){

    // }

    // function distributeToBeneficiary(){

    // }

    // function vaultReceipt(){

    // }

    // function reinvestToLocked(){

    // }

    function depositERC20(
        address senderAddr,
        AccountMessages.DepositRequest memory curDetails,
        address curTokenaddress,
        uint256 curAmount
    ) external returns (bool);

    function vaultsInvest(
        uint32 curId,
        AngelCoreStruct.AccountType curAccountType,
        address[] memory curTokens,
        uint256[] memory curAmount
    ) external returns (bool);

    // function vaultsRedeem(){

    // }

    // function withdraw(){

    // }

    // function closeEndowment(){

    // }

    // function updateEndowmentFees(){

    // }

    // function harvest(){

    // }

    // function setupDao(){

    // }

    // function setupDonationMatch(){

    // }

    // function manageAllowances(){

    // }

    // function spendAllowance(){

    // }

    ///QUERY FUNCTION
    function queryConfig()
        external
        view
        returns (AccountMessages.ConfigResponse memory);

    function queryState(uint256 curId)
        external
        view
        returns (AccountMessages.StateResponse memory);

    function queryEndowmentDetails(uint256 curId)
        external
        view
        returns (AccountStorage.Endowment memory);
}
