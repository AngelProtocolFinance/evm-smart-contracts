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

    // /**
    //  * @notice Executes a contract call
    //  * @dev Executes a cross-chain action by validating the payload and then calling the internal _execute function.
    //  * @param commandId  The command id
    //  * @param sourceChain  The source chain
    //  * @param sourceAddress  The source address
    //  * @param payload  The payload
    //  */
    // function execute(
    //     bytes32 commandId,
    //     string calldata sourceChain,
    //     string calldata sourceAddress,
    //     bytes calldata payload
    // ) external nonReentrant {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     AngelCoreStruct.NetworkInfo memory networkInfo = IRegistrar(
    //         state.config.registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     address gateway = networkInfo.axelarGateway;

    //     bytes32 payloadHash = keccak256(payload);
    //     if (
    //         !IAxelarGateway(gateway).validateContractCall(
    //             commandId,
    //             sourceChain,
    //             sourceAddress,
    //             payloadHash
    //         )
    //     ) revert NotApprovedByGateway();

    //     _execute(sourceChain, sourceAddress, payload);
    // }

    // /**
    //  * @notice Executes a contract call with token
    //  * @param commandId  The command id
    //  * @param sourceChain The source chain
    //  * @param sourceAddress  The source address
    //  * @param payload  The payload
    //  * @param tokenSymbol  The token symbol
    //  * @param amount  The amount
    //  */
    // function executeWithToken(
    //     bytes32 commandId,
    //     string calldata sourceChain,
    //     string calldata sourceAddress,
    //     bytes calldata payload,
    //     string calldata tokenSymbol,
    //     uint256 amount
    // ) external nonReentrant {

    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     AngelCoreStruct.NetworkInfo memory networkInfo = IRegistrar(
    //         state.config.registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     address gateway = networkInfo.axelerGateway;

    //     bytes32 payloadHash = keccak256(payload);

    //     if (
    //         !IAxelarGateway(gateway).validateContractCallAndMint(
    //             commandId,
    //             sourceChain,
    //             sourceAddress,
    //             payloadHash,
    //             tokenSymbol,
    //             amount
    //         )
    //     ) revert NotApprovedByGateway();

    //     _executeWithToken(
    //         payload,
    //         tokenSymbol,
    //         amount
    //     );
    // }

    // /**
    //  * @notice Executes a contract call. It contains business logic for execute function
    //  * @param sourceChain  The source chain
    //  * @param sourceAddress  The source address
    //  * @param payload  The payload
    //  */
    // function _execute(
    //     string calldata sourceChain,
    //     string calldata sourceAddress,
    //     bytes calldata payload
    // ) internal {
    //     // TODO: we are not listning to this event for now
    // }

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

    // /**
    //  * @notice Distributes the locked and liquid balances of an endowment to its closing beneficiary, according to their specified type.
    //  * @param id The ID of the endowment being distributed.
    //  * @dev This function should only be called by other internal functions in the contract.
    //  */
    // function distributeToBeneficiary(uint256 id) internal {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();
    //     // AccountStorage.Config memory tempConfig = state.config;
    //     AccountStorage.EndowmentState storage tempState = state.STATES[id];

    //     if (
    //         tempState.closingBeneficiary.enumData ==
    //         AngelCoreStruct.BeneficiaryEnum.None
    //     ) {} else if (
    //         tempState.closingBeneficiary.enumData ==
    //         AngelCoreStruct.BeneficiaryEnum.Wallet
    //     ) {
    //         uint256 size = tempState
    //             .balances
    //             .liquid
    //             .Cw20CoinVerified_addr
    //             .length +
    //             tempState.balances.locked.Cw20CoinVerified_addr.length;
    //         address[] memory finalTarget = new address[](size);
    //         uint256[] memory finalValue = new uint256[](size);
    //         bytes[] memory finalCallData = new bytes[](size);

    //         for (
    //             uint8 i = 0;
    //             i < tempState.balances.liquid.Cw20CoinVerified_addr.length;
    //             i++
    //         ) {
    //             address target = tempState
    //                 .balances
    //                 .liquid
    //                 .Cw20CoinVerified_addr[i];
    //             uint256 value = 0;
    //             bytes memory callData = abi.encodeWithSignature(
    //                 "transfer(address,uint256)",
    //                 tempState.closingBeneficiary.data.addr,
    //                 tempState.balances.liquid.Cw20CoinVerified_amount[i]
    //             );

    //             finalTarget[i] = target;
    //             finalValue[i] = value;
    //             finalCallData[i] = callData;
    //         }

    //         uint256 count = tempState
    //             .balances
    //             .liquid
    //             .Cw20CoinVerified_addr
    //             .length;
    //         for (
    //             uint256 i = 0;
    //             i < tempState.balances.locked.Cw20CoinVerified_addr.length;
    //             i++
    //         ) {
    //             address target = tempState
    //                 .balances
    //                 .locked
    //                 .Cw20CoinVerified_addr[i];
    //             uint256 value = 0;
    //             bytes memory callData = abi.encodeWithSignature(
    //                 "transfer(address,uint256)",
    //                 tempState.closingBeneficiary.data.addr,
    //                 tempState.balances.locked.Cw20CoinVerified_amount[i]
    //             );

    //             finalTarget[count + i] = target;
    //             finalValue[count + i] = value;
    //             finalCallData[count + i] = callData;
    //         }

    //         Utils._execute(finalTarget, finalValue, finalCallData);
    //     } else if (
    //         tempState.closingBeneficiary.enumData ==
    //         AngelCoreStruct.BeneficiaryEnum.IndexFund
    //     ) {
    //         RegistrarStorage.Config memory registrar_config = IRegistrar(
    //             state.config.registrarContract
    //         ).queryConfig();

    //         AngelCoreStruct.IndexFund memory temp_fund = IIndexFund(
    //             registrar_config.indexFundContract
    //         ).queryFundDetails(tempState.closingBeneficiary.data.id);

    //         uint256[] memory members = temp_fund.members;
    //         uint256 membersCount = members.length;

    //         uint256[] memory splitLiquid = AngelCoreStruct.splitBalance(
    //             tempState.balances.liquid.Cw20CoinVerified_amount,
    //             membersCount
    //         );
    //         uint256[] memory splitLocked = AngelCoreStruct.splitBalance(
    //             tempState.balances.locked.Cw20CoinVerified_amount,
    //             membersCount
    //         );

    //         for (uint8 i = 0; i < membersCount; i++) {
    //             AccountStorage.EndowmentState storage rcv_endow = state.STATES[
    //                 members[i]
    //             ];
    //             AngelCoreStruct.receiveGenericBalanceModified(
    //                 rcv_endow.balances.locked.Cw20CoinVerified_addr,
    //                 rcv_endow.balances.locked.Cw20CoinVerified_amount,
    //                 tempState.balances.locked.Cw20CoinVerified_addr,
    //                 splitLocked
    //             );
    //             AngelCoreStruct.receiveGenericBalanceModified(
    //                 rcv_endow.balances.liquid.Cw20CoinVerified_addr,
    //                 rcv_endow.balances.liquid.Cw20CoinVerified_amount,
    //                 tempState.balances.liquid.Cw20CoinVerified_addr,
    //                 splitLiquid
    //             );

    //             state.STATES[members[i]] = rcv_endow;
    //         }
    //     } else if (
    //         tempState.closingBeneficiary.enumData ==
    //         AngelCoreStruct.BeneficiaryEnum.EndowmentId
    //     ) {
    //         AccountStorage.EndowmentState storage recivingEndowment = state
    //             .STATES[tempState.closingBeneficiary.data.id];

    //         AngelCoreStruct.receiveGenericBalance(
    //             recivingEndowment.balances.locked.Cw20CoinVerified_addr,
    //             recivingEndowment.balances.locked.Cw20CoinVerified_amount,
    //             tempState.balances.locked.Cw20CoinVerified_addr,
    //             tempState.balances.locked.Cw20CoinVerified_amount
    //         );

    //         AngelCoreStruct.receiveGenericBalance(
    //             recivingEndowment.balances.liquid.Cw20CoinVerified_addr,
    //             recivingEndowment.balances.liquid.Cw20CoinVerified_amount,
    //             tempState.balances.liquid.Cw20CoinVerified_addr,
    //             tempState.balances.liquid.Cw20CoinVerified_amount
    //         );

    //         state.STATES[
    //             tempState.closingBeneficiary.data.id
    //         ] = recivingEndowment;
    //     }

    //     tempState.balances.locked = AngelCoreStruct.genericBalanceDefault();
    //     tempState.balances.liquid = AngelCoreStruct.genericBalanceDefault();

    //     state.STATES[id] = tempState;
    //     // emit UpdateEndowmentState(id, tempState);
    // }

    // /**
    //  * @notice Execute a token transfer with a specified amount
    //  * @param payload Payload data
    //  * @param tokenSymbol Token symbol
    //  * @param amount Amount of tokens
    //  */
    // function _executeWithToken(
    //     bytes calldata payload,
    //     string calldata tokenSymbol,
    //     uint256 amount
    // ) internal {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     // decode payload
    //     IRouter.VaultActionData memory action = _unpackCalldata(payload);

    //     AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[
    //         action.accountIds[0]
    //     ];
    //     // AccountStorage.Config memory tempConfig = state.config;
    //     AccountStorage.EndowmentState storage tempState = state.STATES[
    //         action.accountIds[0]
    //     ];

    //     AngelCoreStruct.NetworkInfo memory networkInfo = IRegistrar(
    //         state.config.registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     address token = IAxelarGateway(networkInfo.axelerGateway).tokenAddresses(tokenSymbol);

    //     require(
    //         validateDepositFund(state.config.registrarContract, token, amount),
    //         "Invalid Asset"
    //     );
    //     string memory result = state.stratagyId[action.strategyId];

    //     if (action.lockAmt > 0) {
    //         state.vaultBalance[action.accountIds[0]][
    //             AngelCoreStruct.AccountType.Locked
    //         ][result] -= action.lockAmt;
    //         AngelCoreStruct.addToken(
    //             tempState.balances.locked,
    //             token,
    //             action.lockAmt
    //         );
    //     }
    //     if (action.liqAmt > 0) {
    //         state.vaultBalance[action.accountIds[0]][
    //             AngelCoreStruct.AccountType.Liquid
    //         ][result] -= action.liqAmt;
    //         AngelCoreStruct.addToken(
    //             tempState.balances.liquid,
    //             token,
    //             action.liqAmt
    //         );
    //     }

    //     state.STATES[action.accountIds[0]] = tempState;
    //     if (tempEndowment.pendingRedemptions == 0) {} else if (
    //         tempEndowment.pendingRedemptions == 1
    //     ) {
    //         tempEndowment.pendingRedemptions = 0;

    //         if (tempState.closingEndowment) {
    //             distributeToBeneficiary(action.accountIds[0]);
    //         }
    //     } else {
    //         tempEndowment.pendingRedemptions -= 1;
    //     }

    //     state.ENDOWMENTS[action.accountIds[0]] = tempEndowment;

    //     emit UpdateEndowment(action.accountIds[0], tempEndowment);
    //     // emit UpdateEndowmentState(action.accountIds[0], tempState);
    // }
}
