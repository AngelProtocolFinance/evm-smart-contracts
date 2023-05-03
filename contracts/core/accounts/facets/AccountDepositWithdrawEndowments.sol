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
import {StringArray} from "./../../../lib/Strings/string.sol";
import {IDonationMatching} from "./../../../normalized_endowment/donation-match/IDonationMatching.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {ISwappingV3} from "./../../swap-router/Interface/ISwappingV3.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {IVault} from "./../interface/IVault.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/**
 * @title AccountDepositWithdrawEndowments
 * @notice This facet manages the deposits and withdrawals for accounts
 * @dev This facet manages the deposits and withdrawals for accounts
 */

contract AccountDepositWithdrawEndowments is
    ReentrancyGuardFacet,
    AccountsEvents
{
    using SafeMath for uint256;
    event SwappedToken(uint256 amountOut);

    /**
     * @dev Processes liquid vault investment for an endowment account.
     * @param curId ID of the current endowment account.
     * @param tempEndowment Storage reference of the current endowment account.
     * @param liquidAmount Amount of tokens to invest in liquid vaults.
     * @param registrarContract Address of the registrar contract.
     * @return uint256 Amount of leftover tokens after investing in liquid vaults.
     * @return AccountStorage.Endowment Storage reference of the updated endowment account.
     */
    function processLiquidVault(
        uint256 curId,
        AccountStorage.Endowment storage tempEndowment,
        uint256 liquidAmount,
        address registrarContract
    ) internal returns (uint256, AccountStorage.Endowment storage) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        // string[] memory liquidStratageAddress = tempEndowment.strategies.liquid_vault;
        // uint256[] memory tempEndowment.strategies.liquidPercentage = tempEndowment.strategies.liquidPercentage;

        AngelCoreStruct.accountStratagyLiquidCheck(
            tempEndowment.strategies,
            tempEndowment.oneoffVaults
        );

        uint256 leftoversLiquid = liquidAmount;

        for (
            uint256 i = 0;
            i < tempEndowment.strategies.liquidPercentage.length;
            i++
        ) {
            if (
                liquidAmount.mul(tempEndowment.strategies.liquidPercentage[i]) <
                100
            ) {
                continue;
            }
            leftoversLiquid -= liquidAmount
                .mul(tempEndowment.strategies.liquidPercentage[i])
                .div(100);

            AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
                registrarContract
            ).queryVaultDetails(tempEndowment.strategies.liquid_vault[i]);

            require(
                vault_config.approved,
                "Vault is not approved to accept deposits"
            );

            uint32[] memory curIds = new uint32[](1);
            curIds[0] = uint32(curId);

            uint256 tempAmount = liquidAmount
                .mul(tempEndowment.strategies.liquidPercentage[i])
                .div(100);

            //Updating balance of vault
            state.vaultBalance[curId][AngelCoreStruct.AccountType.Liquid][
                vault_config.addr
            ] += tempAmount;
            state.stratagyId[bytes4(keccak256(bytes(vault_config.addr)))] = vault_config.addr;
            IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
                .VaultActionData({
                    strategyId: bytes4(keccak256(bytes(vault_config.addr))),
                    selector: IVault.deposit.selector,
                    accountIds: curIds,
                    token: vault_config.inputDenom,
                    lockAmt: 0,
                    liqAmt: tempAmount
                });
            executeCallsWithToken(
                payloadObject,
                registrarContract,
                tempAmount,
                vault_config.network
            );
        }
        emit UpdateEndowment(curId, tempEndowment);
        return (leftoversLiquid, tempEndowment);
    }

    /**
     * @dev Processes locked vault investment for an endowment account.
     * @param curId ID of the current endowment account.
     * @param tempEndowment Storage reference of the current endowment account.
     * @param lockedAmount Amount of tokens to invest in locked vaults.
     * @param registrarContract Address of the registrar contract.
     * @return uint256 Amount of leftover tokens after investing in locked vaults.
     * @return AccountStorage.Endowment Storage reference of the updated endowment account.
     */
    function processLockedVault(
        uint256 curId,
        AccountStorage.Endowment storage tempEndowment,
        uint256 lockedAmount,
        address registrarContract
    ) internal returns (uint256, AccountStorage.Endowment storage) {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AngelCoreStruct.accountStratagyLockedCheck(
            tempEndowment.strategies,
            tempEndowment.oneoffVaults
        );

        uint256 leftoversLocked = lockedAmount;

        for (
            uint256 i = 0;
            i < tempEndowment.strategies.lockedPercentage.length;
            i++
        ) {
            if (
                lockedAmount.mul(tempEndowment.strategies.lockedPercentage[i]) <
                100
            ) {
                continue;
            }
            leftoversLocked -= lockedAmount
                .mul(tempEndowment.strategies.lockedPercentage[i])
                .div(100);

            AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
                registrarContract
            ).queryVaultDetails(tempEndowment.strategies.locked_vault[i]);

            require(
                vault_config.approved,
                "Vault is not approved to accept deposits"
            );

            uint32[] memory curIds = new uint32[](1);
            curIds[0] = uint32(curId);
            uint256 tempAmount = lockedAmount
                .mul(tempEndowment.strategies.lockedPercentage[i])
                .div(100);
            //Updating balance of vault
            state.vaultBalance[curId][AngelCoreStruct.AccountType.Locked][
                vault_config.addr
            ] += tempAmount;
            state.stratagyId[bytes4(keccak256(bytes(vault_config.addr)))] = vault_config.addr;
            IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
                .VaultActionData({
                    strategyId: bytes4(keccak256(bytes(vault_config.addr))),
                    selector: IVault.deposit.selector,
                    accountIds: curIds,
                    token: vault_config.inputDenom,
                    lockAmt: tempAmount,
                    liqAmt: 0
                });
            executeCallsWithToken(
                payloadObject,
                registrarContract,
                tempAmount,
                vault_config.network
            );
        }
        emit UpdateEndowment(curId, tempEndowment);
        return (leftoversLocked, tempEndowment);
    }

    /**
     * @notice Deposit ETH into the account (later swaps into USDC and then deposits into the account)
     * @param curDetails The details of the deposit
     */
    function depositEth(
        AccountMessages.DepositRequest memory curDetails
    ) public payable nonReentrant {
        require(msg.value > 0, "Invalid Amount");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Config memory tempConfig = state.config;

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            tempConfig.registrarContract
        ).queryConfig();

        // Swap ETH to USDC
        uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
            .swapEthToToken{value: msg.value}();
        emit SwappedToken(usdcAmount);
        processToken(curDetails, registrar_config.usdcAddress, usdcAmount);
    }

    /**
     * @notice Deposit ERC20 into the account (later swaps into USDC and then deposits into the account)
     * @param curDetails The details of the deposit
     * @param curTokenaddress The address of the token to deposit
     * @param curAmount The amount of the token to deposit
     */
    function depositERC20(
        AccountMessages.DepositRequest memory curDetails,
        address curTokenaddress,
        uint256 curAmount
    ) public payable nonReentrant {
        require(curTokenaddress != address(0), "Invalid Token Address");
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Config memory tempConfig = state.config;

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            tempConfig.registrarContract
        ).queryConfig();

        bool isValid = AngelCoreStruct.cw20Valid(
            registrar_config.acceptedTokens.cw20,
            curTokenaddress
        );

        require(isValid, "Invalid Token");

        bool curSuccess = IERC20(curTokenaddress).transferFrom(
            msg.sender,
            address(this),
            curAmount
        );
        require(curSuccess, "Transfer failed");
        curSuccess = IERC20(curTokenaddress).approve(
            registrar_config.swapsRouter,
            curAmount
        );
        require(curSuccess, "Approval failed");

        if (curTokenaddress == registrar_config.usdcAddress) {
            processToken(curDetails, curTokenaddress, curAmount);
            return;
        } else {
            uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
                .swapTokenToUsdc(curTokenaddress, curAmount);

            processToken(curDetails, registrar_config.usdcAddress, usdcAmount);
            emit SwappedToken(usdcAmount);
            return;
        }
    }

    /**
     * @notice Deposit ERC20 (USDC) into the account
     * @dev manages vaults deposit and keeps leftover funds after vaults deposit on accounts diamond
     * @param curDetails The details of the deposit
     * @param curTokenaddress The address of the token to deposit (only called with USDC address)
     * @param curAmount The amount of the token to deposit (in USDC)
     */
    function processToken(
        AccountMessages.DepositRequest memory curDetails,
        address curTokenaddress,
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
        require(curTokenaddress != address(0), "Invalid ERC20 token");

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
            uint256 depositFeeAmount = (
                curAmount.mul(tempEndowment.depositFee.feePercentage)
            ).div(100);
            curAmount = curAmount.sub(depositFeeAmount);

            require(
                IERC20(curTokenaddress).transfer(
                    tempEndowment.depositFee.payoutAddress,
                    depositFeeAmount
                ),
                "Insufficient Funds"
            );
        }

        uint256 lockedSplit = curDetails.lockedPercentage;
        uint256 liquidSplit = curDetails.liquidPercentage;

        AngelCoreStruct.SplitDetails
            memory registrar_split_configs = registrar_config.splitToLiquid;

        require(
            registrar_config.indexFundContract != address(0),
            "ContractNotConfigured"
        );

        if (msg.sender != registrar_config.indexFundContract) {
            if (
                tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Charity ||
                (tempEndowment.splitToLiquid.min == 0 &&
                    tempEndowment.splitToLiquid.max == 0)
            ) {
                (lockedSplit, liquidSplit) = AngelCoreStruct.checkSplits(
                    registrar_split_configs,
                    lockedSplit,
                    liquidSplit,
                    tempEndowment.ignoreUserSplits
                );
            } else {
                (lockedSplit, liquidSplit) = AngelCoreStruct.checkSplits(
                    tempEndowment.splitToLiquid,
                    lockedSplit,
                    liquidSplit,
                    tempEndowment.ignoreUserSplits
                );
            }
        }

        uint256 lockedAmount = (curAmount.mul(lockedSplit)).div(100);
        uint256 liquidAmount = (curAmount.mul(liquidSplit)).div(100);

        state.STATES[curDetails.id].donationsReceived.locked += lockedAmount;
        state.STATES[curDetails.id].donationsReceived.liquid += liquidAmount;

        //donation matching flow
        //execute donor match will always be called on an EOA
        {
            if (
                tempEndowment.endow_type ==
                AngelCoreStruct.EndowmentType.Charity &&
                lockedAmount > 0 &&
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
                tempEndowment.donationMatchContract != address(0) &&
                lockedAmount > 0
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

        {
            uint256 leftoversLocked;
            (leftoversLocked, tempEndowment) = processLockedVault(
                curDetails.id,
                tempEndowment,
                lockedAmount,
                state.config.registrarContract
            );
            AngelCoreStruct.addToken(
                state.STATES[curDetails.id].balances.locked,
                curTokenaddress,
                leftoversLocked
            );
        }

        {
            uint256 leftoversLiquid;
            (leftoversLiquid, tempEndowment) = processLiquidVault(
                curDetails.id,
                tempEndowment,
                liquidAmount,
                state.config.registrarContract
            );
            AngelCoreStruct.addToken(
                state.STATES[curDetails.id].balances.liquid,
                curTokenaddress,
                leftoversLiquid
            );
        }
        emit UpdateEndowmentState(curDetails.id, state.STATES[curDetails.id]);

        state.ENDOWMENTS[curDetails.id] = tempEndowment;
        emit UpdateEndowment(curDetails.id, tempEndowment);
    }

    /**
     * @notice Withdraws funds from an endowment
     * @dev Withdraws funds available on the accounts diamond after checking certain conditions
     * @param curId The endowment id
     * @param acctType The account type to withdraw from
     * @param curBeneficiary The address to send the funds to
     * @param curTokenaddress The token address to withdraw
     * @param curAmount The amount to withdraw
     */
    function withdraw(
        uint256 curId,
        AngelCoreStruct.AccountType acctType,
        address curBeneficiary,
        address[] memory curTokenaddress,
        uint256[] memory curAmount
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        // AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];
        AccountStorage.EndowmentState memory tempState = state.STATES[curId];

        require(
            tempEndowment.withdrawApproved,
            "Withdraws are not approved for this endowment"
        );

        // fetch regisrar config
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        // ** CHARITY TYPE WITHDRAWAL RULES **
        // LIQUID: Only the endowment multisig can withdraw
        // LOCKED: Msg must come from the locked withdraw contract
        if (tempEndowment.endow_type == AngelCoreStruct.EndowmentType.Charity) {
            if (acctType == AngelCoreStruct.AccountType.Locked) {
                require(
                    msg.sender == registrar_config.lockedWithdrawal,
                    "Unauthorized"
                );
            } else if (acctType == AngelCoreStruct.AccountType.Liquid) {
                require(msg.sender == tempEndowment.owner, "Unauthorized");
            }
        }

        // ** NORMAL TYPE WITHDRAWAL RULES **
        // In both balance types:
        //      The endowment multisig OR beneficiaries whitelist addresses [if populated] can withdraw. After 
        //      maturity has been reached, only addresses in Maturity Whitelist may withdraw. If the Maturity
        //      Whitelist is not populated, then only the endowment multisig is allowed to withdraw.
        // LIQUID: Same as above shared logic. 
        // LOCKED: There is NO way to withdraw locked funds from an endowment before maturity!
        if (tempEndowment.endow_type == AngelCoreStruct.EndowmentType.Normal) {
            // Check if maturity has been reached for the endowment
            // 0 == no maturity date
            bool mature = (
                tempEndowment.maturityTime != 0 &&
                block.timestamp >= tempEndowment.maturityTime
            );
            
            // can't withdraw before maturity
            if (acctType == AngelCoreStruct.AccountType.Locked && !mature) {
                revert(
                    "Endowment is not mature. Cannot withdraw before maturity time is reached."
                );
            }

            // determine if msg sender is allowed to withdraw based on rules and maturity status
            bool senderAllowed = false;
            if (mature) {
                if (tempEndowment.maturityWhitelist.length > 0) {
                    bool inList = false;
                    for (
                        uint256 i = 0;
                        i < tempEndowment.maturityWhitelist.length;
                        i++
                    ) {
                        if (tempEndowment.maturityWhitelist[i] == msg.sender) {
                            inList = true;
                        }
                    }
                    require(inList, "Sender address is not listed in maturityWhitelist.");
                } else {
                    require(msg.sender == tempEndowment.owner, "Sender address is not the Endowment Multisig.");
                }
            } else {
                if (tempEndowment.whitelistedBeneficiaries.length > 0) {
                    bool inList = false;
                    for (
                        uint256 i = 0;
                        i < tempEndowment.whitelistedBeneficiaries.length;
                        i++
                    ) {
                        if (tempEndowment.whitelistedBeneficiaries[i] == msg.sender) {
                            inList = true;
                        }
                    }
                    require(inList || msg.sender == tempEndowment.owner, "Sender address is not listed in whitelistedBeneficiaries or the Endowment Multisig.");
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

        if (acctType == AngelCoreStruct.AccountType.Locked) {
            state_bal = tempState.balances.locked;
        } else {
            state_bal = tempState.balances.liquid;
        }

        for (uint8 i = 0; i < curTokenaddress.length; i++) {
            uint256 balance = 0;

            // ensure more than zero tokens requested
            require(curAmount[i] > 0, "InvalidZeroAmount");
    
            for (uint8 j = 0; j < state_bal.Cw20CoinVerified_addr.length; j++) {
                if (curTokenaddress[i] == state_bal.Cw20CoinVerified_addr[j]) {
                    balance = state_bal.Cw20CoinVerified_amount[j];
    
                    // ensure balance of tokens can cover the requested withdraw amount
                    require(balance > curAmount[i], "InsufficientFunds");
                    
                    // calculate AP Protocol fee owed on withdrawn token amount
                    uint256 withdrawFeeAp = curAmount[i].mul(withdrawFeeRateAp).div(100);

                    // TO DO: calculate endowment specific withdraw fee, if set. Only for Normal type.
                    // Should be transfered to the Endowment Multisig.

                    require(
                        IERC20(curTokenaddress[i]).transfer(
                            curBeneficiary,
                            curAmount[i] - withdrawFeeAp
                        ),
                        "Transfer failed"
                    );

                    require(
                        IERC20(curTokenaddress[i]).transfer(
                            registrar_config.treasury,
                            withdrawFeeAp
                        ),
                        "Transfer failed"
                    );

                    // reduce the temp state's balance by withdrawn token amount
                    if (acctType == AngelCoreStruct.AccountType.Locked) {
                        tempState.balances.locked.Cw20CoinVerified_amount[j] -= curAmount[i];
                    } else {
                        tempState.balances.liquid.Cw20CoinVerified_amount[j] -= curAmount[i];
                    }
                }
            }
        }

        // update contract state with final temp state
        state.STATES[curId] = tempState;
        emit UpdateEndowmentState(curId, tempState);
    }

    /**
     * @notice Sends token to the different chain with the message
     * @param payloadObject message object
     * @param registrarContract registrar contract address
     * @param amount Amount of funds to be transfered
     * @param network The network you want to transfer token
     */
    function executeCallsWithToken(
        IAxelarGateway.VaultActionData memory payloadObject,
        address registrarContract,
        uint256 amount,
        uint256 network
    ) internal {
        // TODO: check if event has to be emitted
        // AccountStorage.State storage state = LibAccounts.diamondStorage();

        // Encode Valts action Data
        bytes memory Encodedpayload = abi.encode(payloadObject);

        AngelCoreStruct.NetworkInfo memory senderInfo = IRegistrar(
            registrarContract
        ).queryNetworkConnection(block.chainid);

        AngelCoreStruct.NetworkInfo memory recieverInfo = IRegistrar(
            registrarContract
        ).queryNetworkConnection(network);
        uint256 curEth = recieverInfo.gasLimit;
        if (curEth > 0) {
            IAxelarGateway(senderInfo.gasReceiver)
                .payNativeGasForContractCallWithToken{value: curEth}(
                address(this),
                recieverInfo.name,
                StringArray.addressToString(recieverInfo.router),
                Encodedpayload,
                IERC20Metadata(payloadObject.token).symbol(),
                amount,
                msg.sender
            );
        }
        //print network it
        console.log(block.chainid);
        //print amount
        console.log(amount);
        console.log("Calling contract", senderInfo.axelerGateway);

        IERC20(payloadObject.token).approve(senderInfo.axelerGateway, amount);
        //Call the contract
        IAxelarGateway(senderInfo.axelerGateway).callContractWithToken({
            destinationChain: recieverInfo.name,
            contractAddress: StringArray.addressToString(recieverInfo.router),
            payload: Encodedpayload,
            symbol: IERC20Metadata(payloadObject.token).symbol(),
            amount: amount
        });
    }
}
