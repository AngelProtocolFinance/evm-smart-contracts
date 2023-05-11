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
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol";
import {IDonationMatchEmitter} from "./IDonationMatchEmitter.sol";
import {IAccountsDepositWithdrawEndowments} from "./../../core/accounts/interface/IAccountsDepositWithdrawEndowments.sol";

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

/**
 *@title DonationMatch
 * @dev DonationMatch contract
 * The `DonationMatch` contract implements a donation matching mechanism for charity endowments and normal endowments.
 */
contract DonationMatch is Storage, Initializable {
    address emitterAddress;

    /**
     * @dev Initialize contract
     * @param curDetails DonationMatchMessages.InstantiateMsg used to initialize contract
     * @param curEmitteraddress address
     */
    function initialize(
        DonationMatchMessages.InstantiateMessage memory curDetails,
        address curEmitteraddress
    ) public initializer {
        require(curEmitteraddress != address(0), "Invalid Address");
        emitterAddress = curEmitteraddress;
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
    }

    /**
     * @dev Implements the donation matching logic
     * @param endowmentId uint256
     * @param amount uint256
     * @param donor address
     * @param token address
     */
    function executeDonorMatch(
        uint256 endowmentId,
        uint256 amount,
        address donor,
        address token
    ) public {
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

        // determine how much reserve token is equivivalent to usdc donated
        uint256 reserveTokenAmount = queryUniswapPrice(
            state.config.usdcAddress,
            amount,
            state.config.reserveToken
        );

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

        IDonationMatchEmitter(emitterAddress).giveApprovalErC20(
            endowmentId,
            token,
            state.config.reserveToken,
            reserveTokenAmount
        );

        if (token == state.config.reserveToken) {
            uint256 donorAmount = (reserveTokenAmount * 40) / 100;
            uint256 endowmentAmount = (reserveTokenAmount * 40) / (100);

            //NO need to do anything autometically it is counted as burned
            uint256 burnAmount = reserveTokenAmount -
                (donorAmount + endowmentAmount);

            require(
                IERC20Burnable(token).transfer(donor, donorAmount),
                "Transfer failed"
            );
            IDonationMatchEmitter(emitterAddress).transferErC20(
                endowmentId,
                token,
                donor,
                donorAmount
            );
            // IERC20Burnable(token).transfer(
            //     registrar_config.accountsContract,
            //     endowmentAmount
            // );

            require(
                IERC20(token).approve(
                    registrar_config.accountsContract,
                    endowmentAmount
                ),
                "Approve failed"
            );

            IAccountsDepositWithdrawEndowments(
                registrar_config.accountsContract
            ).depositDonationMatchErC20(endowmentId, token, endowmentAmount);

            IDonationMatchEmitter(emitterAddress).transferErC20(
                endowmentId,
                token,
                registrar_config.accountsContract,
                endowmentAmount
            );
            IERC20Burnable(token).burn(burnAmount);
            IDonationMatchEmitter(emitterAddress).burnErC20(
                endowmentId,
                token,
                burnAmount
            );
        } else {
            // call execute donor match on dao token contract

            // approve reserve currency to dao token contract [GIVE approval]

            require(
                IERC20(state.config.reserveToken).approve(
                    token,
                    reserveTokenAmount
                ),
                "Approve failed"
            );

            SubdaoToken(token).executeDonorMatch(
                reserveTokenAmount,
                registrar_config.accountsContract,
                endowmentId,
                donor
            );
            IDonationMatchEmitter(emitterAddress).executeDonorMatch(
                token,
                reserveTokenAmount,
                registrar_config.accountsContract,
                endowmentId,
                donor
            );
        }
    }

    /**
     * @notice Query the config of Donation match
     */
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
