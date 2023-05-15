// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {Array} from "../../../lib/array.sol";
import {Utils} from "../../../lib/utils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IAxelarGateway} from "./../interface/IAxelarGateway.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {IVault} from "../../../interfaces/IVault.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
contract AccountsUpdateStatusEndowments is
    ReentrancyGuardFacet,
    AccountsEvents
{
    /**
     * @notice Closes an endowment, setting the endowment state to "closingEndowment" and the closing beneficiary to the provided beneficiary.
     * @param curId The ID of the endowment to be closed.
     * @param curBeneficiary The beneficiary that will receive any remaining funds in the endowment.
     * @dev The function will revert if a redemption is currently in progress.
     * @dev Emits an `UpdateEndowmentState` event with the updated state of the endowment.
     */
    function closeEndowment(
        uint32 curId,
        AngelCoreStruct.Beneficiary memory curBeneficiary
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[curId];
        AccountStorage.EndowmentState memory tempEndowmentState = state.STATES[curId];

        require(msg.sender == tempEndowment.owner, "Unauthorized");
        require(!tempEndowmentState.closingEndowment,"Endowment is closed");
        require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            curBeneficiary.enumData != AngelCoreStruct.BeneficiaryEnum.None ||
            registrar_config.indexFundContract != address(0),
            "Beneficiary is NONE & Index Fund Contract is not configured in Registrar"
        );

        // If NONE was passed for beneficiary, send balance to the AP Treasury (if not in any funds)
        // or send to the first index fund if it is in one.
        AngelCoreStruct.IndexFund[] memory funds = IIndexFund(
            registrar_config.indexFundContract
        ).queryInvolvedFunds(curId);
        if (curBeneficiary.enumData == AngelCoreStruct.BeneficiaryEnum.None) {
            if (funds.length == 0) {
                curBeneficiary = AngelCoreStruct.Beneficiary({
                    data: AngelCoreStruct.BeneficiaryData({
                        id: 0,
                        addr: registrar_config.treasury
                    }),
                    enumData: AngelCoreStruct.BeneficiaryEnum.Wallet
                });
            } else {
                curBeneficiary = AngelCoreStruct.Beneficiary({
                    data: AngelCoreStruct.BeneficiaryData({
                        id: funds[0].id,
                        addr: address(0)
                    }),
                    enumData: AngelCoreStruct.BeneficiaryEnum.IndexFund
                });
            }
        }

        state.STATES[curId].closingEndowment = true;
        state.STATES[curId].closingBeneficiary = curBeneficiary;

        require(checkFullyExited(uint32(curId)),"Not fully exited");
        uint256 redemption = uint256(tempEndowment.oneoffVaults.liquid.length) + uint256(tempEndowment.oneoffVaults.locked.length);
        tempEndowment.pendingRedemptions = redemption;
        tempEndowment.depositApproved = false;
        state.ENDOWMENTS[curId] = tempEndowment;

        emit UpdateEndowment(curId, state.ENDOWMENTS[curId]);
        emit UpdateEndowmentState(curId, state.STATES[curId]);

        // remove closing endowment from all Index Funds that it is in
        if (funds.length > 0) {
            Utils._execute(
                [registrar_config.indexFundContract],
                [0],
                [abi.encodeWithSignature("removeMember(uint256)", curId)]
            );
        }
    }

    function checkFullyExited(uint32 curId) internal view returns (bool) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        bytes4[] memory allStrategies = IRegistrar(state.config.registrarContract).queryAllStrategies();
        for (uint256 i; i < allStrategies.length; i++) {
            if(state.STATES[curId].activeStrategies[allStrategies[i]]) {
                return false;
            }
        }
        return true;
    }

    // function redeemAllFromVault(uint32 curId, AngelCoreStruct.OneOffVaults memory allVaults) internal {

    //     AccountStorage.State storage state = LibAccounts.diamondStorage();
    //     address registrarContract = state.config.registrarContract;

    //     for(uint i=0;i<allVaults.liquid.length;i++){
    //         AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
    //             registrarContract
    //         ).queryVaultDetails(allVaults.liquid[i]);

    //         uint32[] memory curIds = new uint32[](1);
    //         curIds[0] = curId;
    //         uint256 amount = state.vaultBalance[curId][AngelCoreStruct.AccountType.Liquid][allVaults.liquid[i]];
    //         console.log("redeemAllFromVault", amount);
    //         IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
    //             .VaultActionData({
    //                 strategyId: bytes4(keccak256(bytes(vault_config.addr))),
    //                 selector: IVault.redeemAll.selector,
    //                 accountIds: curIds,
    //                 token: vault_config.inputDenom,
    //                 lockAmt: 0,
    //                 liqAmt: amount
    //             });

    //         executeCalls(
    //             payloadObject,
    //             state.config.registrarContract,
    //             vault_config.network
    //         );
    //     }

    //     for(uint i=0;i<allVaults.locked.length;i++){
    //         AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
    //             registrarContract
    //         ).queryVaultDetails(allVaults.locked[i]);

    //         uint32[] memory curIds = new uint32[](1);
    //         curIds[0] = curId;
    //         uint256 amount = state.vaultBalance[curId][AngelCoreStruct.AccountType.Locked][allVaults.liquid[i]];
    //         IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
    //             .VaultActionData({
    //                 strategyId: bytes4(keccak256(bytes(vault_config.addr))),
    //                 selector: IVault.redeemAll.selector,
    //                 accountIds: curIds,
    //                 token: vault_config.inputDenom,
    //                 lockAmt: amount,
    //                 liqAmt: 0
    //             });

    //         executeCalls(
    //             payloadObject,
    //             state.config.registrarContract,
    //             vault_config.network
    //         );
    //     }

    // }

    // /**
    //  * @notice Sends token to the different chain with the message
    //  * @param payloadObject message object
    //  * @param network The network you want to transfer token
    //  */
    // function executeCalls(
    //     IAxelarGateway.VaultActionData memory payloadObject,
    //     address registrarContract,
    //     uint256 network
    // ) internal {

    //     // Encode Valts action Data
    //     bytes memory Encodedpayload = abi.encode(payloadObject);

    //     AngelCoreStruct.NetworkInfo memory senderInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     AngelCoreStruct.NetworkInfo memory recieverInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(network);
    //     uint256 curEth = recieverInfo.gasLimit;
    //     if (curEth > 0) {
    //         IAxelarGateway(senderInfo.gasReceiver).payNativeGasForContractCall{
    //             value: curEth
    //         }(
    //             address(this),
    //             recieverInfo.name,
    //             StringArray.addressToString(recieverInfo.router),
    //             Encodedpayload,
    //             msg.sender
    //         );
    //     }
    //     //Call the contract
    //     IAxelarGateway(senderInfo.axelerGateway).callContract({
    //         destinationChain: recieverInfo.name,
    //         contractAddress: StringArray.addressToString(recieverInfo.router),
    //         payload: Encodedpayload
    //     });
    // }
}
