// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./message.sol";
import "./storage.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";
import {IAccountsDepositWithdrawEndowments} from "../../core/accounts/interface/IAccountsDepositWithdrawEndowments.sol";
import {GiftCardsStorage} from "./storage.sol";
import {AccountMessages} from "../../core/accounts/message.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GiftCards
 * @dev This contract is used to manage gift cards
 * 1) Deposit for a gift card
 * 2) Claim a gift card
 * 3) Spend a gift card
 */
contract GiftCards is Storage, Initializable, OwnableUpgradeable, ReentrancyGuard {
    event GiftCardsUpdateConfig(GiftCardsStorage.Config config);
    event GiftCardsUpdateBalances(
        address addr,
        address token,
        uint256 amt,
        AngelCoreStruct.AllowanceAction action
    );
    event GiftCardsUpdateDeposit(
        uint256 depositId,
        GiftCardsStorage.Deposit deposit
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor () {
        _disableInitializers();
    }

    function __GiftCards_init() internal onlyInitializing {
        __Ownable_init();
    }

    function initialize(
        GiftCardsMessage.InstantiateMsg memory details
    ) public initializer {
        __GiftCards_init();
        state.config.owner = msg.sender;
        state.config.registrarContract = details.registrarContract;
        state.config.keeper = details.keeper;
        state.config.nextDeposit = 1;
        emit GiftCardsUpdateConfig(state.config);
    }

    /**
     * @dev deposit native money to create a gift card (deposit)
     * @param sender the sender of the deposit
     * @param toAddress the address to send the gift card to
     */
    // function executeDeposit(address toAddress, uint256 amount) public payable {
    //     require(msg.value > 0, "Invalid amount");
    //     uint256 depositId = state.config.nextDeposit;
    //     GiftCardsStorage.Deposit memory deposit = GiftCardsStorage.Deposit(
    //         sender,
    //         AngelCoreStruct.AssetBase({
    //             info: AngelCoreStruct.AssetInfoBase.Native,
    //             amount: msg.value,
    //             addr: address(0),
    //             name: "Mattic"
    //         }),
    //         false
    //     );
    //     // auto claim if toAddress is not zero
    //     if (toAddress != address(0)) {
    //         deposit.claimed = true;
    //         state.BALANCES[toAddress].coinNativeAmount += deposit.token.amount;

    //         emit GiftCardsUpdateBalances(toAddress, state.BALANCES[toAddress]);

    //         state.DEPOSITS[depositId] = deposit;
    //     } else {
    //         state.DEPOSITS[depositId] = deposit;
    //     }

    //     state.config.nextDeposit += 1;

    //     emit GiftCardsUpdateDeposit(depositId, deposit);
    //     emit GiftCardsUpdateConfig(state.config);
    // }

    /**
     * @dev deposit ERC20 token to create a gift card (deposit)
     * @param toAddress the address to send the gift card to
     * @param tokenAddress the ERC20 token address to deposit
     * @param amount the qty of ERC20 token to deposit
     */
    function executeDepositERC20(
        address toAddress,
        address tokenAddress,
        uint256 amount
    ) public {
        GiftCardsStorage.Deposit memory deposit = GiftCardsStorage.Deposit(
            msg.sender,
            tokenAddress,
            amount,
            false
        );

        // fund amount cannot be zero
        require(amount > 0, "Invalid zero amount");
        // must be an accepted token by the registrar
        require(
            IRegistrar(state.config.registrarContract)
                .isTokenAccepted(tokenAddress),
            "Invalid Token");
        // transfer fund to this contract
        require(
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount),
            "TransferFrom failed"
        );

        // If a TO address is provided, mark deposit as claimed immediately
        // and add amount to the toAddress' balance for said token
        // When a TO address is NOT provided, this just means deposit.claimed == false
        if (toAddress != address(0)) {
            deposit.claimed = true;
            state.BALANCES[toAddress][tokenAddress] += amount;
            emit GiftCardsUpdateBalances(toAddress, tokenAddress, amount, AngelCoreStruct.AllowanceAction.Add);
        }

        // save the deposit information
        state.DEPOSITS[state.config.nextDeposit] = deposit;
        emit GiftCardsUpdateDeposit(state.config.nextDeposit, deposit);
        state.config.nextDeposit += 1;
    }

    /**
     * @dev claim a gift card
     * @param depositId the deposit id
     * @param recipient the recipient of the gift card
     */
    function executeClaim(uint256 depositId, address recipient) public {
        require(msg.sender == state.config.keeper, "Only keeper can claim deposits");
        require(!state.DEPOSITS[depositId].claimed, "Deposit already claimed");

        // mark deposit as claimed
        state.DEPOSITS[depositId].claimed = true;
        emit GiftCardsUpdateDeposit(depositId, state.DEPOSITS[depositId]);

        // add the claimed amount for the target token to the recipient's balance
        state.BALANCES[recipient][state.DEPOSITS[depositId].tokenAddress] += state.DEPOSITS[depositId].amount;
        emit GiftCardsUpdateBalances(
            recipient,
            state.DEPOSITS[depositId].tokenAddress,
            state.DEPOSITS[depositId].amount,
            AngelCoreStruct.AllowanceAction.Add);
    }

    /**
     * @dev spend a gift card
     * @param endowmentId the endowment id
     * @param tokenAddress the token address to spend from user's balance
     * @param amount the amount to spend from user's token balance
     * @param lockedPercentage the locked percentage
     * @param liquidPercentage the liquid percentage
     */
    function executeSpend(
        uint32 endowmentId,
        address tokenAddress,
        uint256 amount,
        uint256 lockedPercentage,
        uint256 liquidPercentage
    ) public {
        require(lockedPercentage + liquidPercentage == 100, "Invalid percentages");
        require(amount > 0, "Invalid zero amount");
        require(state.BALANCES[msg.sender][tokenAddress] >= amount, "Insufficient spendable balance");

        // query the Registrar config
        RegistrarStorage.Config memory registrarConfig = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        // give allowance for the ERC20 to be spent from this contract
        require(
            IERC20(tokenAddress).approve(
                registrarConfig.accountsContract,
                amount
            ),
            "Approve failed"
        );

        // call deposit endpoint on the Accounts contract for ERC20s
        IAccountsDepositWithdrawEndowments(
            registrarConfig.accountsContract
        ).depositERC20(
            AccountMessages.DepositRequest({
                id: endowmentId,
                lockedPercentage: lockedPercentage,
                liquidPercentage: liquidPercentage
            }),
            tokenAddress,
            amount
        );

        // deduct balance by amount deposited with Accounts contract
        state.BALANCES[msg.sender][tokenAddress] -= amount;
        emit GiftCardsUpdateBalances(msg.sender, tokenAddress, amount, AngelCoreStruct.AllowanceAction.Remove);
    }

    /**
     * @dev update config
     * @param owner the owner
     * @param keeper the keeper
     * @param registrarContract the registrar contract
     */
    function updateConfig(
        address owner,
        address keeper,
        address registrarContract
    ) public {
        require(msg.sender == state.config.owner, "Only owner can update config");
        if (owner != address(0)) {
            state.config.owner = owner;
        }
        if (keeper != address(0)) {
            state.config.keeper = keeper;
        }
        if (registrarContract != address(0)) {
            state.config.registrarContract = registrarContract;
        }
        emit GiftCardsUpdateConfig(state.config);
    }

    function queryConfig() public view returns (GiftCardsStorage.Config memory) {
        return state.config;
    }

    function queryDeposit(uint256 depositId) public view returns (GiftCardsStorage.Deposit memory) {
        return state.DEPOSITS[depositId];
    }

    function queryBalance(address userAddr, address tokenAddr) public view returns (uint256) {
        return state.BALANCES[userAddr][tokenAddr];
    }
}
