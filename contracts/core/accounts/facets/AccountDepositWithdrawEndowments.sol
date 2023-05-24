// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IRouter} from "../../router/IRouter.sol";
import {IAxelarGateway} from "./../interfaces/IAxelarGateway.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {IDonationMatching} from "./../../../normalized_endowment/donation-match/IDonationMatching.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {ISwappingV3} from "./../../swap-router/interfaces/ISwappingV3.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IVault} from "./../../../interfaces/IVault.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IAccountsDepositWithdrawEndowments} from "../interfaces/IAccountsDepositWithdrawEndowments.sol";

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

    /**
     * @notice Deposit MATIC into the account (later swaps into USDC and then deposits into the account)
     * @param details The details of the deposit
     */
    function depositMatic(
        AccountMessages.DepositRequest memory details
    ) public payable nonReentrant {
        require(msg.value > 0, "Invalid Amount");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            details.id
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            tempConfig.registrarContract
        ).queryConfig();

        // Swap ETH to USDC
        uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
            .swapEthToToken{value: msg.value}();
        emit SwappedToken(usdcAmount);
        processToken(details, registrar_config.usdcAddress, usdcAmount);
    }

    /**
     * @notice Deposit ERC20 into the account (later swaps into USDC and then deposits into the account)
     * @param details The details of the deposit
     * @param tokenAddress The address of the token to deposit
     * @param amount The amount of the token to deposit
     */
    function depositERC20(
        AccountMessages.DepositRequest memory details,
        address tokenAddress,
        uint256 amount
    ) public nonReentrant {
        require(tokenAddress != address(0), "Invalid Token Address");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        // AccountStorage.Config memory tempConfig = state.config;

        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            details.id
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");
        require(
            IRegistrar(state.config.registrarContract)
                .isTokenAccepted(tokenAddress), 
            "Invalid Token");

        RegistrarStorage.Config memory registrar_config = 
            IRegistrar(state.config.registrarContract)
            .queryConfig();

        require(IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            amount),
        "Transfer failed"); 

        require(IERC20(tokenAddress).approve(
            registrar_config.swapsRouter,
            amount),
            "Approval failed");

        if (tokenAddress == registrar_config.usdcAddress) {
            processToken(details, tokenAddress, amount);
            return;
        } 
        else {
            uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
                .swapTokenToUsdc(tokenAddress, amount);

            processToken(details, registrar_config.usdcAddress, usdcAmount);
            emit SwappedToken(usdcAmount);
        }
    }

    /**
     * @notice Deposit ERC20 (USDC) into the account
     * @dev manages vaults deposit and keeps leftover funds after vaults deposit on accounts diamond
     * @param details The details of the deposit
     * @param tokenAddress The address of the token to deposit (only called with USDC address)
     * @param amount The amount of the token to deposit (in USDC)
     */
    function processToken(
        AccountMessages.DepositRequest memory details,
        address tokenAddress,
        uint256 amount
    ) internal {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            details.id
        ];

        require(tokenAddress != address(0), "Invalid ERC20 token");
        require(
            details.lockedPercentage + details.liquidPercentage == 100,
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
            uint256 depositFeeAmount = (amount
                .mul(tempEndowment.depositFee.feePercentage))
                .div(AngelCoreStruct.FEE_BASIS);
            amount = amount.sub(depositFeeAmount);

            require(
                IERC20(tokenAddress).transfer(
                    tempEndowment.depositFee.payoutAddress,
                    depositFeeAmount
                ),
                "Transfer Failed"
            );
        }

        uint256 lockedSplitPercent = details.lockedPercentage;
        uint256 liquidSplitPercent = details.liquidPercentage;

        AngelCoreStruct.SplitDetails memory registrar_split_configs = 
            registrar_config.splitToLiquid;

        require(
            registrar_config.indexFundContract != address(0),
            "No Index Fund"
        );

        if (msg.sender != registrar_config.indexFundContract) {
            if (tempEndowment.endowType == AngelCoreStruct.EndowmentType.Charity) {
                // use the Registrar default split for Charities
                (lockedSplitPercent, liquidSplitPercent) = AngelCoreStruct.checkSplits(
                    registrar_split_configs,
                    lockedSplitPercent,
                    liquidSplitPercent,
                    tempEndowment.ignoreUserSplits
                );
            } else {
                // use the Endowment's SplitDetails for ASTs
                (lockedSplitPercent, liquidSplitPercent) = AngelCoreStruct.checkSplits(
                    tempEndowment.splitToLiquid,
                    lockedSplitPercent,
                    liquidSplitPercent,
                    tempEndowment.ignoreUserSplits
                );
            }
        }

        uint256 lockedAmount = (amount.mul(lockedSplitPercent))
                                .div(AngelCoreStruct.PERCENT_BASIS);
        uint256 liquidAmount = (amount.mul(liquidSplitPercent))
                                .div(AngelCoreStruct.PERCENT_BASIS);

        state.STATES[details.id].donationsReceived.locked += lockedAmount;
        state.STATES[details.id].donationsReceived.liquid += liquidAmount;

        //donation matching flow
        //execute donor match will always be called on an EOA
        if (lockedAmount > 0) {
            if (tempEndowment.endowType ==
                AngelCoreStruct.EndowmentType.Charity &&
                registrar_config.donationMatchCharitesContract != address(0)
            ) {
                IDonationMatching(
                    registrar_config.donationMatchCharitesContract
                ).executeDonorMatch(
                        details.id,
                        lockedAmount,
                        tx.origin,
                        registrar_config.haloToken
                    );
            } else if (
                tempEndowment.endowType ==
                AngelCoreStruct.EndowmentType.Normal &&
                tempEndowment.donationMatchContract != address(0)
            ) {
                IDonationMatching(tempEndowment.donationMatchContract)
                    .executeDonorMatch(
                        details.id,
                        lockedAmount,
                        tx.origin,
                        tempEndowment.daoToken
                    );
            }
        }

        AngelCoreStruct.addToken(
            state.STATES[details.id].balances.locked,
            tokenAddress,
            lockedAmount
        );
        AngelCoreStruct.addToken(
            state.STATES[details.id].balances.liquid,
            tokenAddress,
            liquidAmount
        );
        // emit UpdateEndowmentState(details.id, state.STATES[details.id]);

        state.ENDOWMENTS[details.id] = tempEndowment;
        emit UpdateEndowment(details.id, tempEndowment);
    }

    /**
     * @notice Withdraws funds from an endowment
     * @dev Withdraws funds available on the accounts diamond after checking certain conditions
     * @param id The endowment id
     * @param acctType The account type to withdraw from
     * @param beneficiaryAddress The address to send funds to
     * @param beneficiaryEndowId The endowment to send funds to
     * @param tokenAddress The token address to withdraw
     * @param amount The amount to withdraw
     */
    function withdraw(
        uint32 id,
        AngelCoreStruct.AccountType acctType,
        address beneficiaryAddress,
        uint32 beneficiaryEndowId,
        address tokenAddress,
        uint256 amount
    ) public nonReentrant {
        require(amount > 0, "InvalidZeroAmount");
        require(
            (beneficiaryAddress != address(0) && beneficiaryEndowId == 0) ||
            (beneficiaryAddress == address(0) && beneficiaryEndowId != 0),
            "Must provide Beneficiary Address xor Endowment ID"
        );

        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            id
        ];
        AccountStorage.EndowmentState storage tempEndowmentState = state.STATES[
            id
        ];
        require(!tempEndowmentState.closingEndowment, "Endowment is closed");

        // fetch regisrar config
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        // Charities never mature & Normal endowments optionally mature
        // Check if maturity has been reached for the endowment (0 == no maturity date)
        bool mature = (
            tempEndowment.maturityTime != 0 &&
            block.timestamp >= tempEndowment.maturityTime
        );

        // ** SHARED LOCKED WITHDRAWAL RULES **
        // Can withdraw early for a (possible) penalty fee
        uint256 earlyLockedWithdrawPenalty = 0;
        if (acctType == AngelCoreStruct.AccountType.Locked && !mature) {
            // Calculate the early withdraw penalty based on the earlyLockedWithdrawFee setting
            // Normal: Endowment specific setting that owners can (optionally) set
            // Charity: Registrar based setting for all Charity Endowments
            if (tempEndowment.endowType == AngelCoreStruct.EndowmentType.Normal) {
                earlyLockedWithdrawPenalty = (amount.mul(tempEndowment.earlyLockedWithdrawFee.feePercentage))
                    .div(AngelCoreStruct.FEE_BASIS);
            } else {
                earlyLockedWithdrawPenalty = (amount.mul(
                    IRegistrar(state.config.registrarContract).queryFee(
                        "accounts_early_locked_withdraw"
                    )
                )).div(AngelCoreStruct.FEE_BASIS);
            }
        }

        // ** NORMAL TYPE WITHDRAWAL RULES **
        // In both balance types:
        //      The endowment multisig OR beneficiaries allowlist addresses [if populated] can withdraw. After 
        //      maturity has been reached, only addresses in Maturity Allowlist may withdraw. If the Maturity
        //      Allowlist is not populated, then only the endowment multisig is allowed to withdraw.
        if (tempEndowment.endowType == AngelCoreStruct.EndowmentType.Normal) {
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
        if (tempEndowment.endowType == AngelCoreStruct.EndowmentType.Charity) {
            withdrawFeeRateAp = IRegistrar(state.config.registrarContract).queryFee(
                "accounts_withdraw_charity"
            );
        } else {
            withdrawFeeRateAp = IRegistrar(state.config.registrarContract).queryFee(
                "accounts_withdraw_normal"
            );
        }

        uint256 rent_bal;
        if (acctType == AngelCoreStruct.AccountType.Locked) {
            rent_bal = state.STATES[id].balances.locked.balancesByToken[tokenAddress];
        } else {
            rent_bal = state.STATES[id].balances.liquid.balancesByToken[tokenAddress];
        }

        // ensure balance of tokens can cover the requested withdraw amount
        require(rent_bal > amount, "InsufficientFunds");
        
        // calculate AP Protocol fee owed on withdrawn token amount
        uint256 withdrawFeeAp = (amount.mul(withdrawFeeRateAp))
                                .div(AngelCoreStruct.FEE_BASIS);

        // Transfer AP Protocol fee to treasury
        // (ie. standard Withdraw Fee + any early Locked Withdraw Penalty)
        require(
            IERC20(tokenAddress).transfer(
                registrar_config.treasury,
                withdrawFeeAp + earlyLockedWithdrawPenalty
            ),
            "Transfer failed"
        );

        // ** Endowment specific withdraw fee **
        // Endowment specific withdraw fee needs to be calculated against the amount
        // leftover after all AP withdraw fees are subtracted. Otherwise we risk having
        // negative amounts due to collective fees being greater than 100%
        uint256 amountLeftover = amount - withdrawFeeAp - earlyLockedWithdrawPenalty;
        uint256 withdrawFeeEndow = 0;
        if (
            amountLeftover > 0 &&
            tempEndowment.withdrawFee.active &&
            tempEndowment.withdrawFee.feePercentage != 0 &&
            tempEndowment.withdrawFee.payoutAddress != address(0)
        ) {
            withdrawFeeEndow = (amountLeftover.mul(tempEndowment.withdrawFee.feePercentage))
                                .div(AngelCoreStruct.PERCENT_BASIS);

            // transfer endowment withdraw fee to beneficiary address
            require(
                IERC20(tokenAddress).transfer(
                    tempEndowment.withdrawFee.payoutAddress,
                    withdrawFeeEndow
                ),
                "Insufficient Funds"
            );
        }

        // send all tokens (less fees) to the ultimate beneficiary address/endowment
        if (beneficiaryAddress != address(0)) {
            require(
                IERC20(tokenAddress).transfer(
                    beneficiaryAddress,
                    (amountLeftover - withdrawFeeEndow)
                ),
                "Transfer failed"
            );
        } else {
            // check endowment specified is not closed
            require(!state.STATES[beneficiaryEndowId].closingEndowment, "Beneficiary endowment is closed");
            // Send deposit message to 100% Liquid account of an endowment
            processToken(
                AccountMessages.DepositRequest({ id: id, lockedPercentage: 0, liquidPercentage: 100 }),
                tokenAddress,
                (amountLeftover - withdrawFeeEndow)
            );
        }

        // reduce the orgs balance by the withdrawn token amount
        if (acctType == AngelCoreStruct.AccountType.Locked) {
            state.STATES[id].balances.locked.balancesByToken[tokenAddress] -= amount;
        } else {
            state.STATES[id].balances.liquid.balancesByToken[tokenAddress] -= amount;
        }
    }
}