// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;

// import "./message.sol";
// import "./storage.sol";
// import {AngelCoreStruct} from "../../core/struct.sol";
// import {RegistrarStorage} from "../../core/registrar/storage.sol";
// import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";
// import {IAccountsDepositWithdrawEndowments} from "../../core/accounts/interface/IAccountsDepositWithdrawEndowments.sol";
// import {AccountMessages} from "../../core/accounts/message.sol";
// import {GiftCardsStorage} from "./storage.sol";
// import {AngelCoreStruct} from "../../core/struct.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// /**
//  * @title GiftCards
//  * @dev This contract is used to manage gift cards
//  * 1) Deposit for a gift card
//  * 2) Claim a gift card
//  * 3) Spend a gift card
//  */
// contract GiftCards is Storage {
//     // init only once
//     bool initFlag = false;

//     event GiftCardsUpdateConfig(GiftCardsStorage.Config config);
//     event GiftCardsUpdateBalances(
//         address addr,
//         address token, 
//         uint256 amt
//     );
//     event GiftCardsUpdateDeposit(
//         uint256 depositId,
//         GiftCardsStorage.Deposit deposit
//     );

//     // Initialise the contract
//     function initialize(
//         GiftCardsMessage.InstantiateMsg memory details
//     ) public {
//         require(!initFlag, "Already initialised");
//         initFlag = true;
//         state.config.owner = msg.sender;
//         state.config.registrarContract = details.registrarContract;
//         state.config.keeper = details.keeper;
//         state.config.nextDeposit = 1;
//         emit GiftCardsUpdateConfig(state.config);
//     }

//     /**
//      * @dev deposit native money to create a gift card (deposit)
//      * @param sender the sender of the deposit
//      * @param toAddress the address to send the gift card to
//      */
//     function executeDeposit(address sender, address toAddress) public payable {
//         require(msg.value > 0, "Invalid amount");
//         uint256 depositId = state.config.nextDeposit;
//         GiftCardsStorage.Deposit memory deposit = GiftCardsStorage.Deposit(
//             sender,
//             AngelCoreStruct.AssetBase({
//                 info: AngelCoreStruct.AssetInfoBase.Native,
//                 amount: msg.value,
//                 addr: address(0),
//                 name: "Mattic"
//             }),
//             false
//         );
//         // auto claim if toAddress is not zero
//         if (toAddress != address(0)) {
//             deposit.claimed = true;
//             state.BALANCES[toAddress].coinNativeAmount += deposit.token.amount;

//             emit GiftCardsUpdateBalances(toAddress, state.BALANCES[toAddress]);

//             state.DEPOSITS[depositId] = deposit;
//         } else {
//             state.DEPOSITS[depositId] = deposit;
//         }

//         emit GiftCardsUpdateDeposit(depositId, deposit);

//         state.config.nextDeposit += 1;
//         emit GiftCardsUpdateConfig(state.config);
//     }

//     /**
//      * @dev deposit ERC20 token to create a gift card (deposit)
//      * @param sender the sender of the deposit
//      * @param toAddress the address to send the gift card to
//      * @param fund the fund to deposit
//      */
//     function executeDepositERC20(
//         address sender,
//         address toAddress,
//         AngelCoreStruct.AssetBase memory fund
//     ) public {
//         uint256 depositId = state.config.nextDeposit;

//         validateDepositFund(
//             fund.addr,
//             fund.amount
//         );

//         GiftCardsStorage.Deposit memory deposit = GiftCardsStorage.Deposit(
//             sender,
//             fund,
//             false
//         );

//         require(
//             fund.info != AngelCoreStruct.AssetInfoBase.Native,
//             "Cannot add native"
//         );

//         // fund amount cannot be zero
//         require(fund.amount != 0, "Invalid amount");

//         if (toAddress != address(0)) {
//             deposit.claimed = true;
//             AngelCoreStruct.addToken(
//                 state.BALANCES[toAddress],
//                 deposit.token.addr,
//                 deposit.token.amount
//             );
//             emit GiftCardsUpdateBalances(toAddress, state.BALANCES[toAddress]);

//             state.DEPOSITS[depositId] = deposit;
//         } else {
//             state.DEPOSITS[depositId] = deposit;
//         }

//         state.config.nextDeposit += 1;
//         emit GiftCardsUpdateDeposit(depositId, deposit);
//         emit GiftCardsUpdateConfig(state.config);
//         // transfer fund to this contract
//         require(
//             IERC20(fund.addr).transferFrom(sender, address(this), fund.amount),
//             "TransferFrom failed"
//         );
//     }

//     /**
//      * @dev claim a gift card
//      * @param depositId the deposit id
//      * @param recipient the recipient of the gift card
//      */
//     function executeClaim(uint256 depositId, address recipient) public {
//         require(
//             msg.sender == state.config.keeper,
//             "Only keeper can execute claim"
//         );

//         if (state.DEPOSITS[depositId].claimed) {
//             revert("Deposit already claimed");
//         }

//         state.DEPOSITS[depositId].claimed = true;

//         if (
//             state.DEPOSITS[depositId].token.info ==
//             AngelCoreStruct.AssetInfoBase.Native
//         ) {
//             state.BALANCES[recipient].coinNativeAmount += state
//                 .DEPOSITS[depositId]
//                 .token
//                 .amount;
//         } else {
//             AngelCoreStruct.addToken(
//                 state.BALANCES[recipient],
//                 state.DEPOSITS[depositId].token.addr,
//                 state.DEPOSITS[depositId].token.amount
//             );
//         }
//         emit GiftCardsUpdateBalances(recipient, state.BALANCES[recipient]);
//         emit GiftCardsUpdateDeposit(depositId, state.DEPOSITS[depositId]);
//     }

//     /**
//      * @dev spend a gift card
//      * @param fund the fund to spend
//      * @param endowmentId the endowment id
//      * @param lockedPercentage the locked percentage
//      * @param liquidPercentage the liquid percentage
//      */
//     function executeSpend(
//         AngelCoreStruct.AssetBase memory fund,
//         uint256 endowmentId,
//         uint256 lockedPercentage,
//         uint256 liquidPercentage
//     ) public {
//         require(
//             lockedPercentage + liquidPercentage == 100,
//             "Invalid percentages"
//         );

//         AngelCoreStruct.AssetInfoBase info = fund.info;

//         uint256 spendableAmount = 0;

//         // check if spending native or erc20 (ported from cw20)
//         if (info == AngelCoreStruct.AssetInfoBase.Native) {
//             spendableAmount = state.BALANCES[msg.sender].coinNativeAmount;
//         } else {
//             spendableAmount = AngelCoreStruct.getTokenAmount(
//                 state.BALANCES[msg.sender].Cw20CoinVerified_addr,
//                 state.BALANCES[msg.sender].Cw20CoinVerified_amount,
//                 fund.addr
//             );
//         }

//         require(spendableAmount != 0, "No spendable amount in balance");
//         require(
//             spendableAmount >= fund.amount,
//             "Not enough spendable amount in balance"
//         );

//         if (info == AngelCoreStruct.AssetInfoBase.Native) {
//             state.BALANCES[msg.sender].coinNativeAmount -= fund.amount;
//         } else {
//             AngelCoreStruct.subToken(
//                 state.BALANCES[msg.sender],
//                 fund.addr,
//                 fund.amount
//             );
//         }

//         RegistrarStorage.Config memory registrar_config = IRegistrar(
//             state.config.registrarContract
//         ).queryConfig();

//         // call proper function on accounts contract
//         if (info == AngelCoreStruct.AssetInfoBase.Native) {
//             IAccountsDepositWithdrawEndowments(
//                 registrar_config.accountsContract
//             ).depositEth{value: fund.amount}(
//                 AccountMessages.DepositRequest({
//                     id: endowmentId,
//                     lockedPercentage: lockedPercentage,
//                     liquidPercentage: liquidPercentage
//                 })
//             );
//         } else {
//             // give allowance
//             require(
//                 IERC20(fund.addr).approve(
//                     registrar_config.accountsContract,
//                     fund.amount
//                 ),
//                 "Approve failed"
//             );

//             IAccountsDepositWithdrawEndowments(
//                 registrar_config.accountsContract
//             ).depositERC20(
//                     AccountMessages.DepositRequest({
//                         id: endowmentId,
//                         lockedPercentage: lockedPercentage,
//                         liquidPercentage: liquidPercentage
//                     }),
//                     fund.addr,
//                     fund.amount
//                 );
//         }
//         emit GiftCardsUpdateBalances(msg.sender, state.BALANCES[msg.sender]);
//     }

//     /**
//      * @dev update config
//      * @param owner the owner
//      * @param keeper the keeper
//      * @param registrarContract the registrar contract
//      */
//     function updateConfig(
//         address owner,
//         address keeper,
//         address registrarContract
//     ) public {
//         require(
//             msg.sender == state.config.owner,
//             "Only owner can update config"
//         );

//         if (owner != address(0)) {
//             state.config.owner = owner;
//         }

//         if (keeper != address(0)) {
//             state.config.keeper = keeper;
//         }
//         if (registrarContract != address(0)) {
//             state.config.registrarContract = registrarContract;
//         }
//         emit GiftCardsUpdateConfig(state.config);
//     }

//     function queryConfig()
//         public
//         view
//         returns (GiftCardsStorage.Config memory)
//     {
//         return state.config;
//     }

//     function queryDeposit(
//         uint256 depositId
//     ) public view returns (GiftCardsStorage.Deposit memory) {
//         return state.DEPOSITS[depositId];
//     }

//     function queryBalance(
//         address addr
//     ) public view returns (AngelCoreStruct.GenericBalance memory) {
//         return state.BALANCES[addr];
//     }

//     /**
//      * @dev Validate deposit fund: checks if the fund is accepted by querying registrar contract
//      * @param tokenAddress the token address
//      * @param amount the amount
//      */
//     function validateDepositFund(
//         address tokenAddress,
//         uint256 amount
//     ) internal view returns (bool) {
//         require(IRegistrar(state.config.registrarContract).isTokenAccepted(tokenAddress));
//         require(amount > 0, "InvalidZeroAmount");
//         return true;
//     }
// }
