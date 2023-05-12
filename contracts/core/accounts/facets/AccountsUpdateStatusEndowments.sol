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
     * @notice Updates the endowment status.
     * @dev This function allows authorized users to update the endowment status like inactive, approved, frozen, and closed.
     * @param curDetails UpdateEndowmentStatusRequest struct containing the updated endowment status.
     */
    function updateEndowmentStatus(
        AccountMessages.UpdateEndowmentStatusRequest memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[
            curDetails.endowmentId
        ];

        require(
            tempEndowment.status != AngelCoreStruct.EndowmentStatus.Closed,
            "Account closed"
        );

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        AngelCoreStruct.EndowmentStatus _newStatus;

        if (curDetails.status == AngelCoreStruct.EndowmentStatus.Approved) {
            // only the Accounts owner (ex. AP Team Multisig || AP Gov) can freeze/unfreeze
            require(msg.sender == state.config.owner, "Unauthorized");
            tempEndowment.depositApproved = true;
            tempEndowment.withdrawApproved = true;
        } else if (curDetails.status == AngelCoreStruct.EndowmentStatus.Frozen) {
            // only the Accounts owner (ex. AP Team Multisig || AP Gov) can freeze/unfreeze
            require(msg.sender == state.config.owner, "Unauthorized");
            tempEndowment.depositApproved = true;
            tempEndowment.withdrawApproved = false;
        } else if (curDetails.status == AngelCoreStruct.EndowmentStatus.Closed) {
            // only endowment owner can close their accounts
            require(msg.sender == state.config.owner, "Unauthorized");
            tempEndowment.depositApproved = false;
            tempEndowment.withdrawApproved = false;

            AngelCoreStruct.Beneficiary memory _tempBeneficiary;
            if (
                curDetails.beneficiary.enumData !=
                AngelCoreStruct.BeneficiaryEnum.None
            ) {
                _tempBeneficiary = curDetails.beneficiary;
            } else {
                require(
                    registrar_config.indexFundContract != address(0),
                    "Index Fund Contract is not configured in Registrar"
                );

                AngelCoreStruct.IndexFund[] memory funds = IIndexFund(
                    registrar_config.indexFundContract
                ).queryInvolvedFunds(curDetails.endowmentId);

                if (funds.length == 0) {
                    _tempBeneficiary = AngelCoreStruct.Beneficiary({
                        data: AngelCoreStruct.BeneficiaryData({
                            id: 0,
                            addr: registrar_config.treasury
                        }),
                        enumData: AngelCoreStruct.BeneficiaryEnum.Wallet
                    });
                } else {
                    _tempBeneficiary = AngelCoreStruct.Beneficiary({
                        data: AngelCoreStruct.BeneficiaryData({
                            id: funds[0].id,
                            addr: address(0)
                        }),
                        enumData: AngelCoreStruct.BeneficiaryEnum.IndexFund
                    });
                }
            }

            curTarget = new address[](2);
            curValue = new uint256[](2);
            curCalldata = new bytes[](2);

            curTarget[0] = registrar_config.indexFundContract;
            curValue[0] = 0;
            curCalldata[0] = abi.encodeWithSignature(
                "removeMember(uint256)",
                curDetails.endowmentId
            );

            curTarget[1] = address(this);
            curValue[1] = 0;
            curCalldata[1] = abi.encodeWithSignature(
                "closeEndowment(uint256,((uint256,address),uint8))",
                curDetails.endowmentId,
                _tempBeneficiary
            );
        } else {
            revert("Invalid EndowmentStatus input");
        }

        require(
            tempEndowment.status != _newStatus,
            "New status similar to current status"
        );

        address[] memory curTarget = new address[](0);
        uint256[] memory curValue = new uint256[](0);
        bytes[] memory curCalldata = new bytes[](0);

        tempEndowment.status = _newStatus;
        state.ENDOWMENTS[curDetails.endowmentId] = tempEndowment;
        Utils._execute(curTarget, curValue, curCalldata);
        emit UpdateEndowment(curDetails.endowmentId, tempEndowment);
    }

    /**
     * @notice Closes an endowment, setting the endowment state to "closingEndowment" and the closing beneficiary to the provided beneficiary.
     * @param curId The ID of the endowment to be closed.
     * @param curBeneficiary The beneficiary that will receive any remaining funds in the endowment.
     * @dev The function will revert if a redemption is currently in progress.
     * @dev Emits an `UpdateEndowmentState` event with the updated state of the endowment.
     */
    function closeEndowment(
        uint256 curId,
        AngelCoreStruct.Beneficiary memory curBeneficiary
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[curId];

        require(address(this) == msg.sender, "Unauthorized");
        require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");
        
        state.STATES[curId].closingEndowment = true;
        state.STATES[curId].closingBeneficiary = curBeneficiary;

        redeemAllFromVault(uint32(curId), tempEndowment.oneoffVaults);
        console.log("tempEndowment.oneoffVaults.locked.length",tempEndowment.oneoffVaults.liquid.length, tempEndowment.oneoffVaults.locked.length);
        uint256 redemtion = uint256(tempEndowment.oneoffVaults.liquid.length) + uint256(tempEndowment.oneoffVaults.locked.length);
        tempEndowment.pendingRedemptions = redemtion;
        console.log("pendingRedemptions",redemtion);
        tempEndowment.depositApproved = false;

        emit UpdateEndowmentState(curId, state.STATES[curId]);
    }

    function redeemAllFromVault(uint32 curId, AngelCoreStruct.OneOffVaults memory allVaults) internal {

        AccountStorage.State storage state = LibAccounts.diamondStorage();
        address registrarContract = state.config.registrarContract;
        
        for(uint i=0;i<allVaults.liquid.length;i++){
            AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
                registrarContract
            ).queryVaultDetails(allVaults.liquid[i]);

            uint32[] memory curIds = new uint32[](1);
            curIds[0] = curId;
            uint256 amount = state.vaultBalance[curId][AngelCoreStruct.AccountType.Liquid][allVaults.liquid[i]];
            console.log("redeemAllFromVault", amount);
            IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
                .VaultActionData({
                    strategyId: bytes4(keccak256(bytes(vault_config.addr))),
                    selector: IVault.redeemAll.selector,
                    accountIds: curIds,
                    token: vault_config.inputDenom,
                    lockAmt: 0,
                    liqAmt: amount
                });

            executeCalls(
                payloadObject,
                state.config.registrarContract,
                vault_config.network
            );
        }

        for(uint i=0;i<allVaults.locked.length;i++){
            AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
                registrarContract
            ).queryVaultDetails(allVaults.locked[i]);

            uint32[] memory curIds = new uint32[](1);
            curIds[0] = curId;
            uint256 amount = state.vaultBalance[curId][AngelCoreStruct.AccountType.Locked][allVaults.liquid[i]];
            IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
                .VaultActionData({
                    strategyId: bytes4(keccak256(bytes(vault_config.addr))),
                    selector: IVault.redeemAll.selector,
                    accountIds: curIds,
                    token: vault_config.inputDenom,
                    lockAmt: amount,
                    liqAmt: 0
                });

            executeCalls(
                payloadObject,
                state.config.registrarContract,
                vault_config.network
            );
        }

    }

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
