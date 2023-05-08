// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
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
     * @param curDetails The details of the endowment
     */
    function createEndowment(
        AccountMessages.CreateEndowmentRequest memory curDetails
    ) public nonReentrant returns (uint256) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        address registrarAddress = state.config.registrarContract;

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            registrarAddress
        ).queryConfig();

        if (AngelCoreStruct.EndowmentType.Charity == curDetails.endow_type) {
            require(
                msg.sender == registrar_config.charityProposal,
                "Unauthorized"
            );
        }

        AngelCoreStruct.SplitDetails memory splitSettings;
        bool ignoreUserSplit;

        if (AngelCoreStruct.EndowmentType.Charity == curDetails.endow_type) {
            ignoreUserSplit = false;
        } else {
            splitSettings = curDetails.splitToLiquid;
            ignoreUserSplit = curDetails.ignoreUserSplits;
        }

        address donationMatchContract = address(0);
        if (AngelCoreStruct.EndowmentType.Charity == curDetails.endow_type) {
            donationMatchContract = registrar_config
                .donationMatchCharitesContract;
        }

        if (curDetails.categories.general.length > 0) {
            uint256 max = curDetails.categories.general[0];
            for (uint256 i = 1; i < curDetails.categories.general.length; i++) {
                if (max < curDetails.categories.general[i]) {
                    max = curDetails.categories.general[i];
                }
            }

            require(max < state.config.maxGeneralCategoryId, "Invalid inputs");
        }

        require(
            Validator.addressChecker(curDetails.owner),
            "Invalid owner address"
        );

        state.ENDOWMENTS[state.config.nextAccountId] = AccountStorage
            .Endowment({
                owner: curDetails.owner,
                name: curDetails.name,
                categories: curDetails.categories,
                endow_type: curDetails.endow_type,
                status: AngelCoreStruct.EndowmentStatus.Approved,
                depositApproved: true,
                withdrawApproved: true,
                maturityTime: curDetails.maturityTime,
                strategies: AngelCoreStruct.accountStrategiesDefaut(),
                oneoffVaults: AngelCoreStruct.oneOffVaultsDefault(),
                rebalance: AngelCoreStruct.rebalanceDetailsDefaut(),
                pendingRedemptions: 0,
                copycatStrategy: 0,
                dao: address(0),
                daoToken: address(0),
                donationMatchActive: false,
                donationMatchContract: donationMatchContract,
                allowlistedBeneficiaries: curDetails.allowlistedBeneficiaries,
                allowlistedContributors: curDetails.allowlistedContributors,
                earningsFee: curDetails.earningsFee,
                withdrawFee: curDetails.withdrawFee,
                depositFee: curDetails.depositFee,
                balanceFee: curDetails.balanceFee,
                maturityAllowlist: curDetails.maturityAllowlist,
                tier: curDetails.tier,
                logo: curDetails.logo,
                image: curDetails.image,
                proposalLink: curDetails.proposalLink,
                settingsController: curDetails.settingsController,
                parent: curDetails.parent,
                ignoreUserSplits: ignoreUserSplit,
                splitToLiquid: splitSettings
            });

        state.STATES[state.config.nextAccountId] = AccountStorage
            .EndowmentState({
                donationsReceived: AngelCoreStruct.donationsReceivedDefault(),
                closingEndowment: false,
                closingBeneficiary: AngelCoreStruct.beneficiaryDefault(),
                balances: AngelCoreStruct.BalanceInfo({
                    locked: AngelCoreStruct.genericBalanceDefault(),
                    liquid: AngelCoreStruct.genericBalanceDefault()
                }),
                lockedForever: false
            });
        emit UpdateEndowmentState(
            state.config.nextAccountId,
            state.STATES[state.config.nextAccountId]
        );
        if (curDetails.cw4_members.length == 0) {
            curDetails.cw4_members = new address[](1);
            curDetails.cw4_members[0] = curDetails.owner;
        }

        // by default required signatures is 50% of members (cw4_members.length / 2 + 1)
        state
            .ENDOWMENTS[state.config.nextAccountId]
            .owner = IEndowmentMultiSigFactory(registrar_config.multisigFactory)
            .create(
                state.config.nextAccountId,
                registrar_config.multisigEmitter,
                curDetails.cw4_members,
                curDetails.cw4_members.length / 2 + 1
            );

        if (curDetails.createDao) {
            subDaoMessage.InstantiateMsg memory createDaoMessage = subDaoMessage
                .InstantiateMsg({
                    id: state.config.nextAccountId,
                    quorum: curDetails.dao.quorum,
                    owner: state.ENDOWMENTS[state.config.nextAccountId].owner,
                    threshold: curDetails.dao.threshold,
                    votingPeriod: curDetails.dao.votingPeriod,
                    timelockPeriod: curDetails.dao.timelockPeriod,
                    expirationPeriod: curDetails.dao.expirationPeriod,
                    proposalDeposit: curDetails.dao.proposalDeposit,
                    snapshotPeriod: curDetails.dao.snapshotPeriod,
                    token: curDetails.dao.token,
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
