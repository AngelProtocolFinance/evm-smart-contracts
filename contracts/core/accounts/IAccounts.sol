// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AccountStorage} from "./storage.sol";
import {Validator} from "./lib/validator.sol";
import {AccountMessages} from "./message.sol";
import {AngelCoreStruct} from "../struct.sol";
import {Array} from "../../lib/array.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

//Storage
import "./storage.sol";

//Interface
// import "../../interfaces/swapping.sol";

interface IAccounts {
    function createEndowment(
        AccountMessages.CreateEndowmentRequest memory details
    ) external returns (bool response);

    function updateOwner(address newOwner) external returns (bool);

    function updateConfig(
        address newRegistrar,
        uint256 maxGeneralCategoryId
    ) external returns (bool);

    function closeEndowment(
        uint32 id,
        AngelCoreStruct.Beneficiary memory beneficiary
    ) external returns (bool response);

    function updateEndowmentDetails(
        AccountMessages.UpdateEndowmentDetailsRequest memory details
    ) external returns (bool);

    function updateDelegate(
        uint32 id,
        string memory setting,
        string memory action,
        address delegateAddress,
        uint256 delegateExpiry
    ) external returns (bool);

    function updateAcceptedToken(
        uint32 endowId,
        address tokenAddr,
        bool tokenStatus
    ) external returns (bool);

    //TODO: Complete This contract once swap-router is completed.
    function swapToken(
        uint32 id,
        AngelCoreStruct.AccountType,
        uint128 amount,
        address tokenin,
        address tokenout
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
        AccountMessages.DepositRequest memory details,
        address tokenaddress,
        uint256 amount
    ) external returns (bool);

    function vaultsInvest(
        uint32 id,
        AngelCoreStruct.AccountType accountType,
        address[] memory tokens,
        uint256[] memory amount
    ) external returns (bool);

    // function vaultsRedeem(){

    // }

    // function withdraw(){

    // }

    // function closeEndowment(){

    // }

    // function updateFeeSettings(){

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

    function queryState(uint32 id)
        external
        view
        returns (AccountMessages.StateResponse memory);

    function queryEndowmentDetails(uint32 id)
        external
        view
        returns (AccountStorage.Endowment memory);
}
