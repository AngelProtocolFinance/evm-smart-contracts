// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {LocalRegistrarLib} from "../../registrar/lib/LocalRegistrarLib.sol";
// import {Cw3EndowmentMessages, CW3Endowment} from "./../../../normalized_endowment/cw3-endowment/CW3Endowment.sol";
import {SubDao, subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";
import {ISubDao} from "./../../../normalized_endowment/subdao/Isubdao.sol";
import {IAccountDeployContract} from "./../interface/IAccountDeployContract.sol";
import {IEndowmentMultiSigFactory} from "./../../../normalized_endowment/endowment-multisig/interface/IEndowmentMultiSigFactory.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsCreateEndowment
 * @dev This contract facet manages the creation of endowments
 */
contract AccountsCreateEndowment is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice This function creates an endowment
     * @dev creates an endowment based on parameters and setups a dao if required
     * @param details The details of the endowment
     */
    function createEndowment(
        AccountMessages.CreateEndowmentRequest memory details
    ) public nonReentrant returns (uint32) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        address registrarAddress = state.config.registrarContract;

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            registrarAddress
        ).queryConfig();

        if (AngelCoreStruct.EndowmentType.Charity == details.endow_type) {
            require(
                msg.sender == registrar_config.charityProposal,
                "Unauthorized"
            );
        }

        if (details.cw4_members.length == 0) {
            details.cw4_members = new address[](1);
            details.cw4_members[0] = details.owner;
        }

        require(details.threshold > 0, "Threshold must be a positive number");

        if (AngelCoreStruct.EndowmentType.Normal == details.endow_type) {
            require(
                details.threshold <= details.cw4_members.length,
                "Threshold greater than member count"
            );
        }

        AngelCoreStruct.SplitDetails memory splitSettings;
        bool ignoreUserSplit;

        if (AngelCoreStruct.EndowmentType.Charity == details.endow_type) {
            ignoreUserSplit = false;
        } else {
            splitSettings = details.splitToLiquid;
            ignoreUserSplit = details.ignoreUserSplits;
        }

        address donationMatchContract = address(0);
        if (AngelCoreStruct.EndowmentType.Charity == details.endow_type) {
            donationMatchContract = registrar_config
                .donationMatchCharitesContract;
        }

        if (details.categories.general.length > 0) {
            uint256 max = details.categories.general[0];
            for (uint256 i = 1; i < details.categories.general.length; i++) {
                if (max < details.categories.general[i]) {
                    max = details.categories.general[i];
                }
            }

            require(max < state.config.maxGeneralCategoryId, "Invalid inputs");
        }

        require(
            Validator.addressChecker(details.owner),
            "Invalid owner address"
        );

        state.ENDOWMENTS[state.config.nextAccountId] = AccountStorage
            .Endowment({
                owner: details.owner,
                name: details.name,
                categories: details.categories,
                endow_type: details.endow_type,
                maturityTime: details.maturityTime,
                strategies: AngelCoreStruct.accountStrategiesDefaut(),
                oneoffVaults: AngelCoreStruct.oneOffVaultsDefault(),
                rebalance: IRegistrar(registrarAddress).getRebalanceParams(),
                kycDonorsOnly: details.kycDonorsOnly,
                pendingRedemptions: 0,
                multisig: details.owner,
                dao: address(0),
                daoToken: address(0),
                donationMatchActive: false,
                donationMatchContract: donationMatchContract,
                allowlistedBeneficiaries: details.allowlistedBeneficiaries,
                allowlistedContributors: details.allowlistedContributors,
                withdrawFee: details.withdrawFee,
                depositFee: details.depositFee,
                balanceFee: details.balanceFee,
                maturityAllowlist: details.maturityAllowlist,
                tier: details.tier,
                logo: details.logo,
                image: details.image,
                proposalLink: details.proposalLink,
                settingsController: details.settingsController,
                parent: details.parent,
                ignoreUserSplits: ignoreUserSplit,
                splitToLiquid: splitSettings,
                referralId: details.referralId
            });

        // state.STATES[state.config.nextAccountId] = AccountStorage
        //     .EndowmentState({
        //         donationsReceived: AngelCoreStruct.donationsReceivedDefault(),
        //         closingEndowment: false,
        //         closingBeneficiary: AngelCoreStruct.beneficiaryDefault(),
        //         balances: AngelCoreStruct.BalanceInfo({
        //             locked: AngelCoreStruct.GenericBalance,
        //             liquid: AngelCoreStruct.GenericBalance
        //         }),
        //         lockedForever: false
        //     });
        state.STATES[state.config.nextAccountId].closingEndowment = false;
        state.STATES[state.config.nextAccountId].lockedForever = false;

        // emit UpdateEndowmentState(
        //     state.config.nextAccountId,
        //     state.STATES[state.config.nextAccountId]
        // );

        state.ENDOWMENTS[state.config.nextAccountId].owner = IEndowmentMultiSigFactory(registrar_config.multisigFactory)
            .create(
                state.config.nextAccountId,
                registrar_config.multisigEmitter,
                details.cw4_members,
                details.threshold
            );
        state.ENDOWMENTS[state.config.nextAccountId].multisig = state.ENDOWMENTS[state.config.nextAccountId].owner;

        if (details.createDao) {
            subDaoMessage.InstantiateMsg memory createDaoMessage = subDaoMessage
                .InstantiateMsg({
                    id: state.config.nextAccountId,
                    quorum: details.dao.quorum,
                    owner: state.ENDOWMENTS[state.config.nextAccountId].owner,
                    threshold: details.dao.threshold,
                    votingPeriod: details.dao.votingPeriod,
                    timelockPeriod: details.dao.timelockPeriod,
                    expirationPeriod: details.dao.expirationPeriod,
                    proposalDeposit: details.dao.proposalDeposit,
                    snapshotPeriod: details.dao.snapshotPeriod,
                    token: details.dao.token,
                    endow_type: state
                        .ENDOWMENTS[state.config.nextAccountId]
                        .endow_type,
                    endowOwner: state
                        .ENDOWMENTS[state.config.nextAccountId]
                        .owner,
                    registrarContract: registrarAddress
                });

            address daoAddress = IAccountDeployContract(address(this))
                .createDaoContract(createDaoMessage);
            state.ENDOWMENTS[state.config.nextAccountId].dao = daoAddress;

            subDaoMessage.QueryConfigResponse memory subDaoConfid = ISubDao(
                daoAddress
            ).queryConfig();

            state.ENDOWMENTS[state.config.nextAccountId].daoToken = subDaoConfid
                .daoToken;
        }

        state.config.nextAccountId += 1;

        emit EndowmentCreated(
            state.config.nextAccountId - 1,
            state.ENDOWMENTS[state.config.nextAccountId - 1]
        );
        return state.config.nextAccountId - 1;
    }
}
