// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../../registrar/lib/LocalRegistrarLib.sol";
import {IRouter} from "../../router/IRouter.sol";
import {RouterLib} from "../../router/RouterLib.sol";
import {Utils} from "../../../lib/utils.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {IAxelarGateway} from "./../interfaces/IAxelarGateway.sol";
import {StringArray} from "./../../../lib/Strings/string.sol";
import {AddressToString} from "../../../lib/StringAddressUtils.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {ISwappingV3} from "./../../swap-router/interfaces/ISwappingV3.sol";
import {IVault} from "./../../../interfaces/IVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";

/**
 * @title AccountsVaultFacet
 * @dev This contract manages the vaults for endowments
 */
contract AccountsVaultFacet is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice This function that allows users to deposit into a yield strategy using tokens from their locked or liquid account in an endowment.
     * @dev Allows the owner of an endowment to invest tokens into specified yield vaults.
     * @param id The endowment id
     * @param strategy The strategies to invest into
     * @param token The tokens to withdraw
     * @param lockAmt The amount to deposit lock 
     * @param liquidAmt The amount to deposit liquid
     */
    function strategyInvest(
        uint32 id,
        bytes4 strategy,
        string memory token,
        uint256 lockAmt,
        uint256 liquidAmt
    ) public payable nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            id
        ];

        // check if the msg sender is either the owner or their delegate address and
        // that they have the power to manage the investments for an account balance
        if (lockAmt > 0) {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.lockedInvestmentManagement.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            ), "Unauthorized");
        }
        if (liquidAmt > 0) {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.liquidInvestmentManagement.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            ), "Unauthorized");
        }

        require(
            IRegistrar(state.config.registrarContract).getStrategyApprovalState(
                strategy
            ) == LocalRegistrarLib.StrategyApprovalState.APPROVED,
            "Vault is not approved"
        );

        AngelCoreStruct.NetworkInfo memory network = 
            IRegistrar(state.config.registrarContract)
            .queryNetworkConnection(block.chainid);

        address tokenAddress = IAxelarGateway(network.axelarGateway)
            .tokenAddresses(token);

        require(
            state.STATES[id].balances.locked.balancesByToken[tokenAddress] >= lockAmt, 
            "Insufficient Balance");
        require(state.STATES[id].balances.liquid.balancesByToken[tokenAddress] >= liquidAmt, 
            "Insufficient Balance");

        require(IRegistrar(state.config.registrarContract)
            .isTokenAccepted(tokenAddress),
            "Token not approved");

        uint32[] memory accts = new uint32[](1);
        accts[0] = id;

        IRouter.VaultActionData memory payload = IRouter
            .VaultActionData({
                destinationChain: network.name,
                strategyId: strategy,
                selector: IVault.deposit.selector,
                accountIds: accts,
                token: tokenAddress,
                lockAmt: lockAmt,
                liqAmt: liquidAmt,
                status: IRouter.VaultActionStatus.UNPROCESSED
            });
        bytes memory packedPayload = RouterLib.packCallData(payload);

        IRouter.VaultActionData memory response = 
            IRouter(network.router)
            .executeWithTokenLocal(
                network.name, 
                AddressToString.toString(address(this)), 
                packedPayload,
                token,
                (lockAmt + liquidAmt)
            );
        
        if (response.status == IRouter.VaultActionStatus.SUCCESS ||
            response.status == IRouter.VaultActionStatus.FAIL_TOKENS_FALLBACK) {
            state.STATES[id].balances.locked.balancesByToken[tokenAddress] -= response.lockAmt;
            state.STATES[id].balances.liquid.balancesByToken[tokenAddress] -= response.liqAmt;
            state.STATES[id].activeStrategies[strategy] == true;
            // emit UpdateEndowmentState(id, state.STATES[id]);
        }
    }

    /**
     * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
     * @param id  The endowment ID
     * @param strategy The strategy to redeem from
     * @param token The vaults to redeem from
     * @param lockAmt The amt to remdeem from the locked component
     * @param liquidAmt The amt to redeem from the liquid component
     */
    function strategyRedeem(
        uint32 id,
        bytes4 strategy,
        string memory token,
        uint256 lockAmt,
        uint256 liquidAmt
    ) public payable nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            id
        ];

        // check if the msg sender is either the owner or their delegate address and
        // that they have the power to manage the investments for an account balance
        if (lockAmt > 0) {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.lockedInvestmentManagement.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            ), "Unauthorized");
        }
        if (liquidAmt > 0) {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.liquidInvestmentManagement.delegate,
                msg.sender,
                tempEndowment.owner,
                block.timestamp
            ), "Unauthorized");
        }

        require(tempEndowment.owner == msg.sender, "Unauthorized");
        require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");
        require(
            IRegistrar(state.config.registrarContract).getStrategyApprovalState(
                strategy
            ) == LocalRegistrarLib.StrategyApprovalState.APPROVED,
            "Vault is not approved"
        );
        AngelCoreStruct.NetworkInfo memory network = 
            IRegistrar(state.config.registrarContract)
            .queryNetworkConnection(block.chainid);

        address tokenAddress = IAxelarGateway(network.axelarGateway)
            .tokenAddresses(token);


        uint32[] memory accts = new uint32[](1);
        accts[0] = id;
        IRouter.VaultActionData memory payload = IRouter
            .VaultActionData({
                destinationChain: network.name,
                strategyId: strategy,
                selector: IVault.redeem.selector,
                accountIds: accts,
                token: tokenAddress,
                lockAmt: lockAmt,
                liqAmt: liquidAmt,
                status: IRouter.VaultActionStatus.UNPROCESSED
            });

        bytes memory packedPayload = RouterLib.packCallData(payload);

        IRouter.VaultActionData memory response = 
            IRouter(network.router)
            .executeLocal(
                network.name, 
                AddressToString.toString(address(this)), 
                packedPayload
            );
        if (response.status == IRouter.VaultActionStatus.SUCCESS) {
            state.STATES[id].balances.locked.balancesByToken[tokenAddress] += response.lockAmt;
            state.STATES[id].balances.liquid.balancesByToken[tokenAddress] += response.liqAmt;
            // emit UpdateEndowmentState(id, state.STATES[id]);
        }
        if (response.status == IRouter.VaultActionStatus.POSITION_EXITED) {
            state.STATES[id].activeStrategies[strategy] == false;
        }
    }

    /**
     * @notice Allows an endowment owner to redeem their funds from multiple yield strategies.
     * @param id  The endowment ID
     * @param strategy The strategy to redeem from
     * @param token The vaults to redeem from
     */
    function strategyRedeemAll(
        uint32 id,
        bytes4 strategy,
        string memory token
    ) public payable nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            id
        ];
        require(tempEndowment.owner == msg.sender, "Unauthorized");
        require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");
        require(
            IRegistrar(state.config.registrarContract).getStrategyApprovalState(
                strategy
            ) == LocalRegistrarLib.StrategyApprovalState.APPROVED,
            "Vault is not approved"
        );
        AngelCoreStruct.NetworkInfo memory network = 
            IRegistrar(state.config.registrarContract)
            .queryNetworkConnection(block.chainid);
        
        address tokenAddress = IAxelarGateway(network.axelarGateway)
            .tokenAddresses(token);

        uint32[] memory accts = new uint32[](1);
        accts[0] = id;
        IRouter.VaultActionData memory payload = IRouter
            .VaultActionData({
                destinationChain: network.name,
                strategyId: strategy,
                selector: IVault.redeemAll.selector,
                accountIds: accts,
                token: tokenAddress,
                lockAmt: 0,
                liqAmt: 0,
                status: IRouter.VaultActionStatus.UNPROCESSED
            });
        bytes memory packedPayload = RouterLib.packCallData(payload);

        IRouter.VaultActionData memory response = 
            IRouter(network.router)
            .executeLocal(
                network.name, 
                AddressToString.toString(address(this)), 
                packedPayload
            );
        
        if (response.status == IRouter.VaultActionStatus.SUCCESS) {
            state.STATES[id].balances.locked.balancesByToken[tokenAddress] += response.lockAmt;
            state.STATES[id].balances.liquid.balancesByToken[tokenAddress] += response.liqAmt;
            // emit UpdateEndowmentState(id, state.STATES[id]);
        }
        if (response.status == IRouter.VaultActionStatus.POSITION_EXITED) {
            state.STATES[id].activeStrategies[strategy] == false;
        }
    }

    // function processDeduct(
    //     address rentToken,
    //     AngelCoreStruct.GenericBalance memory rentBalance,
    //     uint256 rentInputAmount
    // ) internal pure returns (AngelCoreStruct.GenericBalance memory) {
    //     uint256 rentAmount = 0;
    //     uint8 atIndex = 0;
    //     for (
    //         uint8 j = 0;
    //         j < rentBalance.Cw20CoinVerified_addr.length;
    //         j++
    //     ) {
    //         if (rentBalance.Cw20CoinVerified_addr[j] == rentToken) {
    //             rentAmount = rentBalance.Cw20CoinVerified_amount[j];
    //             atIndex = j;
    //             break;
    //         }
    //     }
    //     require(rentInputAmount < rentAmount, "InsufficientFunds");
    //     rentBalance.Cw20CoinVerified_amount[atIndex] -= rentInputAmount;

    //     return rentBalance;
    // }

    // function processCheck(
    //     uint256 rentId,
    //     string memory rentVault,
    //     uint256 rentAmount,
    //     AngelCoreStruct.AccountType rentAccountType,
    //     AngelCoreStruct.OneOffVaults storage rentObject
    // ) internal returns (uint256, uint256) {
    //     AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     uint256 lockedAmount = 0;
    //     uint256 liquidAmount = 0;

    //     if (rentAccountType == AngelCoreStruct.AccountType.Locked) {
    //         AngelCoreStruct.checkTokenInOffVault(
    //             rentObject.locked,
    //             rentObject.lockedAmount,
    //             rentVault
    //         );
    //         lockedAmount = rentAmount;

    //         state.vaultBalance[rentId][AngelCoreStruct.AccountType.Locked][
    //             rentVault
    //         ] += lockedAmount;
    //     } else if (rentAccountType == AngelCoreStruct.AccountType.Liquid) {
    //         AngelCoreStruct.checkTokenInOffVault(
    //             rentObject.liquid,
    //             rentObject.liquidAmount,
    //             rentVault
    //         );
    //         liquidAmount = rentAmount;

    //         state.vaultBalance[rentId][AngelCoreStruct.AccountType.Liquid][
    //             rentVault
    //         ] += liquidAmount;
    //     }

    //     return (lockedAmount, liquidAmount);
    // }

    // /**
    //  * @notice This function allows to process an investment
    //  * @dev Processes an investment in a specified token by swapping it for USDC using a specified swaps router.
    //  * @param registrarContract The registrar contract
    //  * @param token The token to invest
    //  * @param amount The amount to invest
    //  * @return The token and amount to invest
    //  */
    // function _processInvest(
    //     address registrarContract,
    //     address token,
    //     uint256 amount
    // ) internal returns (address, uint256) {
    //     RegistrarStorage.Config memory registrar_config = IRegistrar(
    //         registrarContract
    //     ).queryConfig();

    //     if (token == registrar_config.usdcAddress) {
    //         return (token, amount);
    //     }

    //     bool isValid = AngelCoreStruct.cw20Valid(
    //         registrar_config.acceptedTokens.cw20,
    //         token
    //     );

    //     require(isValid, "Invalid Token");
    //     IERC20(token).approve(registrar_config.swapsRouter, amount);

    //     uint256 usdcAmount = ISwappingV3(registrar_config.swapsRouter)
    //         .swapTokenToUsdc(token, amount);

    //     token = registrar_config.usdcAddress;
    //     amount = usdcAmount;

    //     return (token, amount);
    // }
    // /**
    //  * @notice Sends token to the different chain with the message
    //  * @param payloadObject message object
    //  * @param registrarContract registrar contract address
    //  * @param amount Amount of funds to be transfered
    //  * @param network The network you want to transfer token
    //  */
    // function executeCallsWithToken(
    //     IRouter.VaultActionData memory payloadObject,
    //     address registrarContract,
    //     uint256 amount,
    //     uint256 network
    // ) internal {
    //     // TODO: check if event has to be emitted
    //     // AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     // Encode Valts action Data
    //     bytes memory Encodedpayload = abi.encode(payloadObject);

    //     AngelCoreStruct.NetworkInfo memory senderInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     AngelCoreStruct.NetworkInfo memory recieverInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(network);
    //     uint256 eth = recieverInfo.gasLimit;
    //     if (eth > 0) {
    //         IAxelarGateway(senderInfo.gasReceiver)
    //             .payNativeGasForContractCallWithToken{value: eth}(
    //             address(this),
    //             recieverInfo.name,
    //             StringArray.addressToString(recieverInfo.router),
    //             Encodedpayload,
    //             IERC20Metadata(payloadObject.token).symbol(),
    //             amount,
    //             msg.sender
    //         );
    //     }

    //     IERC20(payloadObject.token).approve(senderInfo.axelerGateway, amount);
    //     //Call the contract
    //     IAxelarGateway(senderInfo.axelerGateway).callContractWithToken({
    //         destinationChain: recieverInfo.name,
    //         contractAddress: StringArray.addressToString(recieverInfo.router),
    //         payload: Encodedpayload,
    //         symbol: IERC20Metadata(payloadObject.token).symbol(),
    //         amount: amount
    //     });
    // }

    // /**
    //  * @notice Sends token to the different chain with the message
    //  * @param payloadObject message object
    //  * @param registrarContract registrar contract address
    //  * @param network The network you want to transfer token
    //  */
    // function executeCalls(
    //     IRouter.VaultActionData memory payloadObject,
    //     address registrarContract,
    //     uint256 network
    // ) internal {
    //     // TODO: check if event has to be emitted
    //     // AccountStorage.State storage state = LibAccounts.diamondStorage();

    //     // Encode Valts action Data
    //     bytes memory Encodedpayload = abi.encode(payloadObject);

    //     AngelCoreStruct.NetworkInfo memory senderInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(block.chainid);

    //     AngelCoreStruct.NetworkInfo memory recieverInfo = IRegistrar(
    //         registrarContract
    //     ).queryNetworkConnection(network);
    //     uint256 eth = recieverInfo.gasLimit;
    //     if (eth > 0) {
    //         IAxelarGateway(senderInfo.gasReceiver).payNativeGasForContractCall{
    //             value: eth
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
