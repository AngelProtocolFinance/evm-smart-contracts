// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {DonationMatchMessages} from "./message.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";
import {AccountMessages} from "../../core/accounts/message.sol";
import {AccountStorage} from "../../core/accounts/storage.sol";
import {IAccounts} from "../../core/accounts/IAccounts.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IDonationMatchEmitter} from "./IDonationMatchEmitter.sol";
import {IAccountsDepositWithdrawEndowments} from "./../../core/accounts/interface/IAccountsDepositWithdrawEndowments.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface SubdaoToken {
    function executeDonorMatch(
        uint256 curAmount,
        address curAccountscontract,
        uint256 curEndowmentid,
        address curDonor
    ) external;
}

interface IERC20Burnable is IERC20 {
    function burn(uint256 amount) external;
}

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DonationMatchCharity is Storage, Initializable, ReentrancyGuard {
    event DonationMatchCharityInitialized(
        address donationMatch,
        DonationMatchStorage.Config config
    );
    event DonationMatchCharityErc20ApprovalGiven(
        uint256 endowmentId,
        address tokenAddress,
        address spender,
        uint256 amount
    );
    event DonationMatchCharityErc20Transfer(
        uint256 endowmentId,
        address tokenAddress,
        address recipient,
        uint256 amount
    );
    event DonationMatchCharityErc20Burned(
        uint256 endowmentId,
        address tokenAddress,
        uint256 amount
    );
    event DonationMatchCharityExecuted(
        address donationMatch,
        address tokenAddress,
        uint256 amount,
        address accountsContract,
        uint256 endowmentId,
        address donor
    );

    function initialize(
        DonationMatchMessages.InstantiateMessage memory curDetails
    ) public initializer {
        require(curDetails.reserveToken != address(0), "Invalid Address");
        state.config.reserveToken = curDetails.reserveToken;

        require(curDetails.uniswapFactory != address(0), "Invalid Address");
        state.config.uniswapFactory = curDetails.uniswapFactory;

        require(curDetails.registrarContract != address(0), "Invalid Address");
        state.config.registrarContract = curDetails.registrarContract;

        require(curDetails.poolFee > 0, "Invalid Fee");
        state.config.poolFee = curDetails.poolFee;

        require(curDetails.usdcAddress != address(0), "Invalid Address");
        state.config.usdcAddress = curDetails.usdcAddress;

        emit DonationMatchCharityInitialized(address(this), state.config);
    }

    function executeDonorMatch(
        uint256 endowmentId,
        uint256 amount,
        address donor,
        address token
    ) public nonReentrant {
        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            registrar_config.accountsContract != address(0),
            "Accounts Not Configured"
        );

        require(
            registrar_config.accountsContract == msg.sender,
            "Unauthorized"
        );

        AccountStorage.Endowment memory endow_detail = IAccounts(
            registrar_config.accountsContract
        ).queryEndowmentDetails(endowmentId);

        if (endow_detail.endow_type == AngelCoreStruct.EndowmentType.Charity) {
            require(
                address(this) == registrar_config.donationMatchCharitesContract,
                "Unauthorized"
            );
        } else if (endow_detail.endow_type == AngelCoreStruct.EndowmentType.Normal) {
            require(
                address(this) == endow_detail.donationMatchContract,
                "Unauthorized"
            );
        }

        // amount donated and the amount supplied to this contract (transferFrom from the sender)
        // TODO: Check if this transfer is required
        // bool sent = IERC20(state.config.usdcAddress).transferFrom(
        //     msg.sender,
        //     address(this),
        //     amount
        // );
        // require(sent, "Token transfer failed");

        // determine how much halo/reserve token is equivivalent to usdc donated
        uint256 reserveTokenAmount = queryUniswapPrice(
            state.config.usdcAddress,
            amount,
            state.config.reserveToken
        );

        // handle decimals for reserve token
        // reserveTokenAmount =
        //     (reserveTokenAmount *
        //         10**IERC20Metadata(state.config.reserveToken).decimals()) /
        //     (10**IERC20Metadata(state.config.usdcAddress).decimals());

        uint256 reserveBal = IERC20(state.config.reserveToken).balanceOf(
            address(this)
        );

        require(reserveBal >= reserveTokenAmount, "Insufficient Reserve Token");

        // give allowance to dao token contract

        bool success = IERC20(token).approve(
            state.config.reserveToken,
            reserveTokenAmount
        );

        require(success, "Token transfer failed");

        emit DonationMatchCharityErc20ApprovalGiven(
            endowmentId,
            token,
            state.config.reserveToken,
            reserveTokenAmount
        );

        if (token == state.config.reserveToken) {
            uint256 donorAmount = (reserveTokenAmount * 40) / (100);
            uint256 endowmentAmount = (reserveTokenAmount * 40) / (100);

            //NO need to do anything autometically it is counted as burned
            uint256 burnAmount = reserveTokenAmount -
                (donorAmount + endowmentAmount);

            IERC20Burnable(token).transfer(donor, donorAmount);

            emit DonationMatchCharityErc20Transfer(
                endowmentId,
                token,
                donor,
                donorAmount
            );

            success = IERC20(token).approve(
                registrar_config.accountsContract,
                endowmentAmount
            );
            require(success, "Approve failed");

            IAccountsDepositWithdrawEndowments(
                registrar_config.accountsContract
            ).depositDonationMatchErC20(endowmentId, token, endowmentAmount);

            emit DonationMatchCharityErc20Transfer(
                endowmentId,
                token,
                registrar_config.accountsContract,
                endowmentAmount
            );

            IERC20Burnable(token).burn(burnAmount);
            emit DonationMatchCharityErc20Burned(
                endowmentId,
                token,
                burnAmount
            );
        } else {
            // approve reserve currency to dao token contract [GIvE approval]

            success = IERC20(state.config.reserveToken).approve(
                token,
                reserveTokenAmount
            );
            require(success, "Approve failed");

            // call execute donor match on dao token contract
            SubdaoToken(token).executeDonorMatch(
                reserveTokenAmount,
                registrar_config.accountsContract,
                endowmentId,
                donor
            );
            emit DonationMatchCharityExecuted(
                address(this),
                token,
                reserveTokenAmount,
                registrar_config.accountsContract,
                endowmentId,
                donor
            );
        }
    }

    function queryConfig()
        public
        view
        returns (DonationMatchStorage.Config memory)
    {
        return state.config;
    }

    function queryUniswapPrice(
        address curTokenin,
        uint256 curAmountin,
        address curTokenout
    ) internal view returns (uint256) {
        if (curTokenin == curTokenout) {
            return curAmountin;
        }
        address pool = IUniswapV3Factory(state.config.uniswapFactory).getPool(
            curTokenin,
            curTokenout,
            state.config.poolFee
        );
        if (pool == address(0)) {
            return 0;
        }

        (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3PoolState(pool).slot0();

        if (curTokenin < curTokenout) {
            return
                (((curAmountin * sqrtPriceX96) / 2 ** 96) * sqrtPriceX96) /
                2 ** 96;
        } else {
            return
                (((curAmountin * 2 ** 96) / sqrtPriceX96) * 2 ** 96) /
                sqrtPriceX96;
        }
    }
}
