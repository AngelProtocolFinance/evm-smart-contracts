// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {IRouter} from "../../router/IRouter.sol";
import {IAxelarGateway} from "./../interface/IAxelarGateway.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {IDonationMatching} from "./../../../normalized_endowment/donation-match/IDonationMatching.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {ISwappingV3} from "./../../swap-router/Interface/ISwappingV3.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IVault} from "./../../../interfaces/IVault.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IAccountsDepositWithdrawEndowments} from "../interface/IAccountsDepositWithdrawEndowments.sol";

/**
 * @title AccountDepositWithdrawEndowments
 * @notice This facet manages the deposits and withdrawals for accounts
 * @dev This facet manages the deposits and withdrawals for accounts
 */

contract AccountDepositWithdrawEndowments is
    ReentrancyGuardFacet,
    AccountsEvents,
    IAccountsDepositWithdrawEndowments
{
    using SafeMath for uint256;
    event SwappedToken(uint256 amountOut);

    // /**
    //  * @dev Processes liquid vault investment for an endowment account.
    //  * @param curId ID of the current endowment account.
    //  * @param tempEndowment Storage reference of the current endowment account.
    //  * @param liquidAmount Amount of tokens to invest in liquid vaults.
    //  * @param registrarContract Address of the registrar contract.
    //  * @return uint256 Amount of leftover tokens after investing in liquid vaults.
    //  * @return AccountStorage.Endowment Storage reference of the updated endowment account.
    //  */
    // function processLiquidVault(
    //     uint256 curId,
    //     AccountStorage.Endowment storage tempEndowment,
    //     uint256 liquidAmount,
    //     address registrarContract
    // ) internal returns (uint256, AccountStorage.Endowment storage) {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();
    //     // string[] memory liquidStratageAddress = tempEndowment.strategies.liquid_vault;
    //     // uint256[] memory tempEndowment.strategies.liquidPercentage = tempEndowment.strategies.liquidPercentage;

    //     AngelCoreStruct.accountStratagyLiquidCheck(
    //         tempEndowment.strategies,
    //         tempEndowment.oneoffVaults
    //     );

    //     uint256 leftoversLiquid = liquidAmount;

    //     for (
    //         uint256 i = 0;
    //         i < tempEndowment.strategies.liquidPercentage.length;
    //         i++
    //     ) {
    //         if (
    //             liquidAmount.mul(tempEndowment.strategies.liquidPercentage[i]) <
    //             100
    //         ) {
    //             continue;
    //         }
    //         leftoversLiquid -= liquidAmount
    //             .mul(tempEndowment.strategies.liquidPercentage[i])
    //             .div(100);

    //         AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
    //             registrarContract
    //         ).queryVaultDetails(tempEndowment.strategies.liquid_vault[i]);

    //         require(
    //             vault_config.approved,
    //             "Vault is not approved to accept deposits"
    //         );

    //         uint32[] memory curIds = new uint32[](1);
    //         curIds[0] = uint32(curId);

    //         uint256 tempAmount = liquidAmount
    //             .mul(tempEndowment.strategies.liquidPercentage[i])
    //             .div(100);

    //         //Updating balance of vault
    //         state.vaultBalance[curId][AngelCoreStruct.AccountType.Liquid][
    //             vault_config.addr
    //         ] += tempAmount;
    //         state.stratagyId[bytes4(keccak256(bytes(vault_config.addr)))] = vault_config.addr;
    //         IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
    //             .VaultActionData({
    //                 strategyId: bytes4(keccak256(bytes(vault_config.addr))),
    //                 selector: IVault.deposit.selector,
    //                 accountIds: curIds,
    //                 token: vault_config.inputDenom,
    //                 lockAmt: 0,
    //                 liqAmt: tempAmount
    //             });
    //         executeCallsWithToken(
    //             payloadObject,
    //             registrarContract,
    //             tempAmount,
    //             vault_config.network
    //         );
    //     }
    //     emit UpdateEndowment(curId, tempEndowment);
    //     return (leftoversLiquid, tempEndowment);
    // }

    // /**
    //  * @dev Processes locked vault investment for an endowment account.
    //  * @param curId ID of the current endowment account.
    //  * @param tempEndowment Storage reference of the current endowment account.
    //  * @param lockedAmount Amount of tokens to invest in locked vaults.
    //  * @param registrarContract Address of the registrar contract.
    //  * @return uint256 Amount of leftover tokens after investing in locked vaults.
    //  * @return AccountStorage.Endowment Storage reference of the updated endowment account.
    //  */
    // function processLockedVault(
    //     uint256 curId,
    //     AccountStorage.Endowment storage tempEndowment,
    //     uint256 lockedAmount,
    //     address registrarContract
    // ) internal returns (uint256, AccountStorage.Endowment storage) {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     AngelCoreStruct.accountStratagyLockedCheck(
    //         tempEndowment.strategies,
    //         tempEndowment.oneoffVaults
    //     );

    //     uint256 leftoversLocked = lockedAmount;

    //     for (
    //         uint256 i = 0;
    //         i < tempEndowment.strategies.lockedPercentage.length;
    //         i++
    //     ) {
    //         if (
    //             lockedAmount.mul(tempEndowment.strategies.lockedPercentage[i]) <
    //             100
    //         ) {
    //             continue;
    //         }
    //         leftoversLocked -= lockedAmount
    //             .mul(tempEndowment.strategies.lockedPercentage[i])
    //             .div(100);

    //         AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
    //             registrarContract
    //         ).queryVaultDetails(tempEndowment.strategies.locked_vault[i]);

    //         require(
    //             vault_config.approved,
    //             "Vault is not approved to accept deposits"
    //         );

    //         uint32[] memory curIds = new uint32[](1);
    //         curIds[0] = uint32(curId);
    //         uint256 tempAmount = lockedAmount
    //             .mul(tempEndowment.strategies.lockedPercentage[i])
    //             .div(100);
    //         //Updating balance of vault
    //         state.vaultBalance[curId][AngelCoreStruct.AccountType.Locked][
    //             vault_config.addr
    //         ] += tempAmount;
    //         state.stratagyId[bytes4(keccak256(bytes(vault_config.addr)))] = vault_config.addr;
    //         IRouter.VaultActionData memory payloadObject = IRouter
    //             .VaultActionData({
    //                 strategyId: bytes4(keccak256(bytes(vault_config.addr))),
    //                 selector: IVault.deposit.selector,
    //                 accountIds: curIds,
    //                 token: vault_config.inputDenom,
    //                 lockAmt: tempAmount,
    //                 liqAmt: 0
    //             });
    //         executeCallsWithToken(
    //             payloadObject,
    //             registrarContract,
    //             tempAmount,
    //             vault_config.network
    //         );
    //     }
    //     emit UpdateEndowment(curId, tempEndowment);
    //     return (leftoversLocked, tempEndowment);
    // }

    /**
     * @notice Deposit MATIC into the account (later swaps into USDC and then deposits into the account)
     * @param curDetails The details of the deposit
     */
    function depositMatic(
        AccountMessages.DepositRequest memory curDetails
    ) public payable nonReentrant {
        require(msg.value > 0, "Invalid Amount");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            curDetails.id
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            tempConfig.registrarContract
        ).queryConfig();

        // Swap ETH to USDC
        uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
            .swapEthToToken{value: msg.value}();
        emit SwappedToken(usdcAmount);
        processToken(curDetails, registrar_config.usdcAddress, usdcAmount);
    }

    // @TODO need implementation requirements for this method
    /**
     * @notice Donation match deposit
     * @param curId The details of the deposit
     * @param curTokenAddress The address of the token to deposit
     * @param curAmount The amount of the token to deposit
     */
    function depositDonationMatchErC20(
        uint256 curId,
        address curTokenAddress,
        uint256 curAmount
    ) external {}


    /**
     * @notice Deposit ERC20 into the account (later swaps into USDC and then deposits into the account)
     * @param curDetails The details of the deposit
     * @param curTokenAddress The address of the token to deposit
     * @param curAmount The amount of the token to deposit
     */
    function depositERC20(
        AccountMessages.DepositRequest memory curDetails,
        address curTokenAddress,
        uint256 curAmount
    ) public nonReentrant {
        require(curTokenAddress != address(0), "Invalid Token Address");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Config memory tempConfig = state.config;

        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            curDetails.id
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");
        require(
            IRegistrar(state.config.registrarContract)
                .isTokenAccepted(curTokenAddress), 
            "Invalid Token");

        RegistrarStorage.Config memory registrar_config = 
            IRegistrar(state.config.registrarContract)
            .queryConfig();

        require(IERC20(curTokenAddress).transferFrom(
            msg.sender,
            address(this),
            curAmount),
        "Transfer failed"); 

        require(IERC20(curTokenAddress).approve(
            registrar_config.swapsRouter,
            curAmount),
            "Approval failed");

        if (curTokenAddress == registrar_config.usdcAddress) {
            processToken(curDetails, curTokenAddress, curAmount);
            return;
        } 
        else {
            uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
                .swapTokenToUsdc(curTokenAddress, curAmount);

            processToken(curDetails, registrar_config.usdcAddress, usdcAmount);
            emit SwappedToken(usdcAmount);
        }
    }

    /**
     * @notice Deposit ERC20 (USDC) into the account
     * @dev manages vaults deposit and keeps leftover funds after vaults deposit on accounts diamond
     * @param curDetails The details of the deposit
     * @param curTokenAddress The address of the token to deposit (only called with USDC address)
     * @param curAmount The amount of the token to deposit (in USDC)
     */
    function processToken(
        AccountMessages.DepositRequest memory curDetails,
        address curTokenAddress,
        uint256 curAmount
    ) internal {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curDetails.id
        ];

        require(
            tempEndowment.depositApproved,
            "Deposits are not approved for this endowment"
        );
        require(curTokenAddress != address(0), "Invalid ERC20 token");

        require(
            curDetails.lockedPercentage + curDetails.liquidPercentage == 100,
            "InvalidSplit"
        );

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        if (
            tempEndowment.depositFee.active &&
            tempEndowment.depositFee.feePercentage != 0 &&
            tempEndowment.depositFee.payoutAddress != address(0)
        ) {
            uint256 depositFeeAmount = (curAmount
                .mul(tempEndowment.depositFee.feePercentage))
                .div(AngelCoreStruct.FEE_BASIS);
            curAmount = curAmount.sub(depositFeeAmount);

            require(
                IERC20(curTokenAddress).transfer(
                    tempEndowment.depositFee.payoutAddress,
                    depositFeeAmount
                ),
                "Transfer Failed"
            );
        }

        uint256 lockedSplitPercent = curDetails.lockedPercentage;
        uint256 liquidSplitPercent = curDetails.liquidPercentage;

        AngelCoreStruct.SplitDetails memory registrar_split_configs = 
            registrar_config.splitToLiquid;

        require(
            registrar_config.indexFundContract != address(0),
            "No Index Fund"
        );

        if (msg.sender != registrar_config.indexFundContract) {
            if (
                tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Charity ||
                (tempEndowment.splitToLiquid.min == 0 &&
                    tempEndowment.splitToLiquid.max == 0)
            ) {
                (lockedSplitPercent, liquidSplitPercent) = AngelCoreStruct.checkSplits(
                    registrar_split_configs,
                    lockedSplitPercent,
                    liquidSplitPercent,
                    tempEndowment.ignoreUserSplits
                );
            } else {
                (lockedSplitPercent, liquidSplitPercent) = AngelCoreStruct.checkSplits(
                    tempEndowment.splitToLiquid,
                    lockedSplitPercent,
                    liquidSplitPercent,
                    tempEndowment.ignoreUserSplits
                );
            }
        }

        uint256 lockedAmount = (curAmount.mul(lockedSplitPercent))
                                .div(AngelCoreStruct.PERCENT_BASIS);
        uint256 liquidAmount = (curAmount.mul(liquidSplitPercent))
                                .div(AngelCoreStruct.PERCENT_BASIS);

        state.STATES[curDetails.id].donationsReceived.locked += lockedAmount;
        state.STATES[curDetails.id].donationsReceived.liquid += liquidAmount;

        //donation matching flow
        //execute donor match will always be called on an EOA
        if (lockedAmount > 0) {
            if (tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Charity &&
                registrar_config.donationMatchCharitesContract != address(0)
            ) {
                IDonationMatching(
                    registrar_config.donationMatchCharitesContract
                ).executeDonorMatch(
                        curDetails.id,
                        lockedAmount,
                        tx.origin,
                        registrar_config.haloToken
                    );
            } else if (
                tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Normal &&
                tempEndowment.donationMatchContract != address(0)
            ) {
                IDonationMatching(tempEndowment.donationMatchContract)
                    .executeDonorMatch(
                        curDetails.id,
                        lockedAmount,
                        tx.origin,
                        tempEndowment.daoToken
                    );
            }
        }

        AngelCoreStruct.addToken(
            state.STATES[curDetails.id].balances.locked,
            curTokenAddress,
            lockedAmount
        );
        AngelCoreStruct.addToken(
            state.STATES[curDetails.id].balances.liquid,
            curTokenAddress,
            liquidAmount
        );
        emit UpdateEndowmentState(curDetails.id, state.STATES[curDetails.id]);

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }

    /**
     * @notice Withdraws funds from an endowment
     * @dev Withdraws funds available on the accounts diamond after checking certain conditions
     * @param curId The endowment id
     * @param acctType The account type to withdraw from
     * @param curBeneficiaryAddress The address to send funds to
     * @param curBeneficiaryEndowId The endowment to send funds to
     * @param curTokenAddress The token address to withdraw
     * @param curAmount The amount to withdraw
     */
    function withdraw(
        uint256 curId,
        AngelCoreStruct.AccountType acctType,
        address curBeneficiaryAddress,
        uint256 curBeneficiaryEndowId,
        address curTokenAddress,
        uint256 curAmount
    ) public nonReentrant {
        require(curAmount > 0, "InvalidZeroAmount");
        require(
            (curBeneficiaryAddress != address(0) && curBeneficiaryEndowId == 0) ||
            (curBeneficiaryAddress == address(0) && curBeneficiaryEndowId != 0),
            "Must provide Beneficiary Address xor Endowment ID"
        );

        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];
        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            curId
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");

        // fetch regisrar config
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        // ** SHARED LOCKED WITHDRAWAL RULES **
        // LOCKED: Msg must come from the locked withdraw contract if NOT mature yet
        // Charities never mature & Normal endowments optionally mature
        // Check if maturity has been reached for the endowment (0 == no maturity date)
        bool mature = (
            tempEndowment.maturityTime != 0 &&
            block.timestamp >= tempEndowment.maturityTime
        );
        // Cannot withdraw from locked before maturity unless via early locked withdraw approval contract
        if (acctType == AngelCoreStruct.AccountType.Locked && !mature) {
            require(msg.sender == registrar_config.lockedWithdrawal, "Cannot withdraw before maturity time is reached unless via early withdraw approval.");
            // A/N: We ensure that locked withdraw requests always go to the requesting endowment's
            // LIQUID account to prevent the AP Multisig from sending Locked withdraws to a random address.
            curBeneficiaryAddress = address(0);
            curBeneficiaryEndowId = curId;
        } else {
            require(msg.sender == tempEndowment.owner, "Unauthorized");
        }

        // ** NORMAL TYPE WITHDRAWAL RULES **
        // In both balance types:
        //      The endowment multisig OR beneficiaries allowlist addresses [if populated] can withdraw. After 
        //      maturity has been reached, only addresses in Maturity Allowlist may withdraw. If the Maturity
        //      Allowlist is not populated, then only the endowment multisig is allowed to withdraw.
        // LIQUID & LOCKED(after Maturity): Only the endowment multisig can withdraw
        if (tempEndowment.endow_type == AngelCoreStruct.EndowmentType.Normal) {
            // determine if msg sender is allowed to withdraw based on rules and maturity status
            bool senderAllowed = false;
            if (mature) {
                if (tempEndowment.maturityAllowlist.length > 0) {
                    for (
                        uint256 i = 0;
                        i < tempEndowment.maturityAllowlist.length;
                        i++
                    ) {
                        if (tempEndowment.maturityAllowlist[i] == msg.sender) {
                            senderAllowed = true;
                        }
                    }
                    require(senderAllowed, "Sender address is not listed in maturityAllowlist.");
                } else {
                    require(msg.sender == tempEndowment.owner, "Sender address is not the Endowment Multisig.");
                }
            } else {
                if (tempEndowment.allowlistedBeneficiaries.length > 0) {
                    for (
                        uint256 i = 0;
                        i < tempEndowment.allowlistedBeneficiaries.length;
                        i++
                    ) {
                        if (tempEndowment.allowlistedBeneficiaries[i] == msg.sender) {
                            senderAllowed = true;
                        }
                    }
                    require(senderAllowed || msg.sender == tempEndowment.owner, "Sender address is not listed in allowlistedBeneficiaries or the Endowment Multisig.");
                }
            }
        }

        uint256 withdrawFeeRateAp;
        if (tempEndowment.endow_type == AngelCoreStruct.EndowmentType.Charity) {
            withdrawFeeRateAp = IRegistrar(state.config.registrarContract).queryFee(
                "accounts_withdraw_charity"
            );
        } else {
            withdrawFeeRateAp = IRegistrar(state.config.registrarContract).queryFee(
                "accounts_withdraw_normal"
            );
        }

        AngelCoreStruct.GenericBalance memory state_bal;

        uint256 current_bal;
        if (acctType == AngelCoreStruct.AccountType.Locked) {
            current_bal = state.STATES[curId].balances.locked.balancesByToken[curTokenAddress];
        } else {
            current_bal = state.STATES[curId].balances.liquid.balancesByToken[curTokenAddress];
        }

        // ensure balance of tokens can cover the requested withdraw amount
        require(current_bal > curAmount, "InsufficientFunds");
        
        // calculate AP Protocol fee owed on withdrawn token amount
        uint256 withdrawFeeAp = (curAmount.mul(withdrawFeeRateAp))
                                .div(AngelCoreStruct.FEE_BASIS);

        // transfer AP Protocol fee to treasury
        require(
            IERC20(curTokenAddress).transfer(
                registrar_config.treasury,
                withdrawFeeAp
            ),
            "Transfer failed"
        );

        // calculate Endowment specific withdraw fee if needed
        uint256 withdrawFeeEndow = 0;
        if (
            tempEndowment.withdrawFee.active &&
            tempEndowment.withdrawFee.feePercentage != 0 &&
            tempEndowment.withdrawFee.payoutAddress != address(0)
        ) {
            withdrawFeeEndow = (curAmount.mul(tempEndowment.withdrawFee.feePercentage))
                                .div(AngelCoreStruct.PERCENT_BASIS);

            // transfer endowment withdraw fee to beneficiary address
            require(
                IERC20(curTokenAddress).transfer(
                    tempEndowment.withdrawFee.payoutAddress,
                    withdrawFeeEndow
                ),
                "Insufficient Funds"
            );
        }

        // send all tokens (less fees) to the ultimate beneficiary address/endowment
        if (curBeneficiaryAddress != address(0)) {
            require(
                IERC20(curTokenAddress).transfer(
                    curBeneficiaryAddress,
                    (curAmount - withdrawFeeAp - withdrawFeeEndow)
                ),
                "Transfer failed"
            );
        } else {
            // check endowment specified is not closed
            require(!state.STATES[curBeneficiaryEndowId].closingEndowment, "Beneficiary endowment is closed");
            // Send deposit message to 100% Liquid account of an endowment
            processToken(
                AccountMessages.DepositRequest { id: curId, lockedPercentage: 0, liquidPercentage: 100 },
                curTokenAddress,
                (curAmount - withdrawFeeAp - withdrawFeeEndow)
            );
        }

        // reduce the orgs balance by the withdrawn token amount
        if (acctType == AngelCoreStruct.AccountType.Locked) {
            state.STATES[curId].balances.locked.balancesByToken[curTokenAddress] -= curAmount;
        } else {
            state.STATES[curId].balances.liquid.balancesByToken[curTokenAddress] -= curAmount;
        }
        
        emit UpdateEndowmentState(curId, state.STATES[curId]);
    }
}