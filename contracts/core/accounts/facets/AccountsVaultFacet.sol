// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {Utils} from "../../../lib/utils.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {IAxelarGateway} from "./../interface/IAxelarGateway.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {ISwappingV3} from "./../../swap-router/Interface/ISwappingV3.sol";
import {IVault} from "./../interface/IVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";

/**
 * @title AccountsVaultFacet
 * @dev This contract manages the vaults for endowments
 */
contract AccountsVaultFacet is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice This function that allows users to invest in a yield vault using tokens from their locked or liquid account in an endowment.
     * @dev Allows the owner of an endowment to invest tokens into specified yield vaults.
     * @param curId The endowment id
     * @param curAccountType The account type
     * @param curVaults The vaults to withdraw from
     * @param curTokens The tokens to withdraw
     * @param curAmount The amount to withdraw
     */
    function vaultsInvest(
        uint32 curId,
        AngelCoreStruct.AccountType curAccountType,
        string[] memory curVaults,
        address[] memory curTokens,
        uint256[] memory curAmount
    ) public payable nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];

        AngelCoreStruct.GenericBalance memory current_bal;

        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            current_bal = state.STATES[curId].balances.locked;
        } else {
            current_bal = state.STATES[curId].balances.liquid;
        }

        require(tempEndowment.owner == msg.sender, "Unauthorized");

        require(
            (curTokens.length == curAmount.length) &&
                (curVaults.length == curAmount.length),
            "Invalid params"
        );
        require(curTokens.length > 0, "Invalid params");

        AngelCoreStruct.YieldVault memory vault_config;
        uint256 lockedAmount;
        uint256 liquidAmount;

        for (uint8 i = 0; i < curTokens.length; i++) {
            vault_config = IRegistrar(
                state.config.registrarContract
            ).queryVaultDetails(curVaults[i]);
            require(
                vault_config.approved,
                "Vault is not approved to accept deposits"
            );

            require(
                vault_config.acctType == curAccountType,
                "Vault and Endowment AccountTypes do not match"
            );
            
            lockedAmount = 0;
            liquidAmount = 0;

            
            (lockedAmount, liquidAmount) = processCheck(
                curId,
                curVaults[i],
                curAmount[i],
                curAccountType,
                tempEndowment.oneoffVaults
            );
            console.log("LiquidIncest",tempEndowment.oneoffVaults.liquid.length);

            current_bal = processDeduct(
                curTokens[i],
                current_bal,
                curAmount[i]
            );

            (curTokens[i], curAmount[i]) = processInvest(
                state.config.registrarContract,
                curTokens[i],
                curAmount[i]
            );

            {
                string memory curTemp = vault_config.addr;
                state.stratagyId[bytes4(keccak256(bytes(curTemp)))] = curTemp;
                uint32[] memory curIds = new uint32[](1);
                curIds[0] = curId;
                //Create VaultActionData
                IAxelarGateway.VaultActionData
                    memory payloadObject = IAxelarGateway.VaultActionData({
                        strategyId: bytes4(keccak256(bytes(curTemp))),
                        selector: IVault.deposit.selector,
                        accountIds: curIds,
                        token: vault_config.inputDenom,
                        lockAmt: lockedAmount,
                        liqAmt: liquidAmount
                    });

                executeCallsWithToken(
                    payloadObject,
                    state.config.registrarContract,
                    curAmount[i],
                    vault_config.network
                );
            }
        }

        {
            state.ENDOWMENTS[curId] = tempEndowment;
            emit UpdateEndowment(curId, tempEndowment);
            if (curAccountType == AngelCoreStruct.AccountType.Locked) {
                state.STATES[curId].balances.locked = current_bal;
            } else {
                state.STATES[curId].balances.liquid = current_bal;
            }
            emit UpdateEndowmentState(curId, state.STATES[curId]);
        }
    }

    function processDeduct(
        address currentToken,
        AngelCoreStruct.GenericBalance memory currentBalance,
        uint256 currentInputAmount
    ) internal pure returns (AngelCoreStruct.GenericBalance memory){
        uint256 currentAmount = 0;
        uint8 atIndex = 0;
        for (
            uint8 j = 0;
            j < currentBalance.Cw20CoinVerified_addr.length;
            j++
        ) {
            if (currentBalance.Cw20CoinVerified_addr[j] == currentToken) {
                currentAmount = currentBalance.Cw20CoinVerified_amount[j];
                atIndex = j;
                break;
            }
        }
        require(currentInputAmount < currentAmount, "InsufficientFunds");
        currentBalance.Cw20CoinVerified_amount[atIndex] -= currentInputAmount;

        return currentBalance;
    }

    function processCheck(
        uint256 currentId, 
        string memory currentVault, 
        uint256 currentAmount, 
        AngelCoreStruct.AccountType currentAccountType,
        AngelCoreStruct.OneOffVaults storage currentObject
    ) internal returns (uint256, uint256){

        AccountStorage.State storage state = LibAccounts.diamondStorage();

        uint256 lockedAmount = 0;
        uint256 liquidAmount = 0;

        if (currentAccountType == AngelCoreStruct.AccountType.Locked) {
            AngelCoreStruct.checkTokenInOffVault(
                currentObject.locked,
                currentObject.lockedAmount,
                currentVault
            );
            lockedAmount = currentAmount;
            
            state.vaultBalance[currentId][AngelCoreStruct.AccountType.Locked][
            currentVault] += lockedAmount;
                
        } else if (currentAccountType == AngelCoreStruct.AccountType.Liquid) {
            AngelCoreStruct.checkTokenInOffVault(
                currentObject.liquid,
                currentObject.liquidAmount,
                currentVault
            );
            liquidAmount = currentAmount;
                
            state.vaultBalance[currentId][AngelCoreStruct.AccountType.Liquid][
            currentVault] += liquidAmount;    
        }

        return (lockedAmount, liquidAmount);
    }

    /**
     * @notice This function allows to process an investment
     * @dev Processes an investment in a specified token by swapping it for USDC using a specified swaps router.
     * @param registrarContract The registrar contract
     * @param token The token to invest
     * @param amount The amount to invest
     * @return The token and amount to invest
     */
    function processInvest(
        address registrarContract,
        address token,
        uint256 amount
    ) internal returns (address, uint256) {
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            registrarContract
        ).queryConfig();

        if (token == registrar_config.usdcAddress) {
            return (token, amount);
        }

        bool isValid = AngelCoreStruct.cw20Valid(
            registrar_config.acceptedTokens.cw20,
            token
        );

        require(isValid, "Invalid Token");
        IERC20(token).approve(registrar_config.swapsRouter, amount);

        uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
            .swapTokenToUsdc(token, amount);

        token = registrar_config.usdcAddress;
        amount = usdcAmount;

        return (token, amount);
    }

    /**
     * @notice Allows an endowment owner to redeem their funds from multiple yield vaults.
     * @param curId  The endowment ID
     * @param curAccountType The account type
     * @param curVaults The vaults to redeem from
     */
    function vaultsRedeem(
        uint32 curId,
        AngelCoreStruct.AccountType curAccountType,
        string[] memory curVaults
    ) public payable nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        // AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];

        require(
            curVaults.length > 0,
            "Invalid"
        );

        require(tempEndowment.owner == msg.sender, "Unauthorized");
        require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");

        for (uint256 i = 0; i < curVaults.length; i++) {
            AngelCoreStruct.YieldVault memory vault_config = IRegistrar(
                state.config.registrarContract
            ).queryVaultDetails(curVaults[i]);

            require(
                vault_config.acctType == curAccountType,
                "Vault and Endowment AccountTypes do not match"
            );

            uint256 lockedAmount = 0;
            uint256 liquidAmount = 0;

            if (curAccountType == AngelCoreStruct.AccountType.Locked) {
                AngelCoreStruct.removeLast(
                    tempEndowment.oneoffVaults.locked,
                    curVaults[i]
                );
                lockedAmount =  state.vaultBalance[curId][AngelCoreStruct.AccountType.Locked][curVaults[i]];
            }
            if (curAccountType == AngelCoreStruct.AccountType.Liquid) {
                AngelCoreStruct.removeLast(
                    tempEndowment.oneoffVaults.liquid,
                    curVaults[i]
                );
                liquidAmount = state.vaultBalance[curId][AngelCoreStruct.AccountType.Liquid][curVaults[i]];
            }

            uint32[] memory curIds = new uint32[](1);
            curIds[0] = curId;

            // string memory curTemp = vault_config.addr;

            IAxelarGateway.VaultActionData memory payloadObject = IAxelarGateway
                .VaultActionData({
                    strategyId: bytes4(keccak256(bytes(vault_config.addr))),
                    selector: IVault.redeem.selector,
                    accountIds: curIds,
                    token: vault_config.inputDenom,
                    lockAmt: lockedAmount,
                    liqAmt: liquidAmount
                });

            executeCalls(
                payloadObject,
                state.config.registrarContract,
                vault_config.network
            );
        }
        state.ENDOWMENTS[curId] = tempEndowment;
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

    /**
     * @notice Sends token to the different chain with the message
     * @param payloadObject message object
     * @param registrarContract registrar contract address
     * @param network The network you want to transfer token
     */
    function executeCalls(
        IAxelarGateway.VaultActionData memory payloadObject,
        address registrarContract,
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
            IAxelarGateway(senderInfo.gasReceiver).payNativeGasForContractCall{
                value: curEth
            }(
                address(this),
                recieverInfo.name,
                StringArray.addressToString(recieverInfo.router),
                Encodedpayload,
                msg.sender
            );
        }
        //Call the contract
        IAxelarGateway(senderInfo.axelerGateway).callContract({
            destinationChain: recieverInfo.name,
            contractAddress: StringArray.addressToString(recieverInfo.router),
            payload: Encodedpayload
        });
    }
}
