// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {AccountStorage} from "../storage.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {AccountMessages} from "../message.sol";
import {IDonationMatchEmitter} from "./../../../normalized_endowment/donation-match/IDonationMatchEmitter.sol";
import {DonationMatchStorage} from "./../../../normalized_endowment/donation-match/storage.sol";
import {DonationMatchMessages} from "./../../../normalized_endowment/donation-match/message.sol";
import {ProxyContract} from "../../proxy.sol";
import "hardhat/console.sol";

/**
 * @title AccountDeployContract
 * @notice This contract is used to deploy contracts from accounts diamond
 * @dev Created so that deploying facets (which call this) don't have size conflicts
 * @dev Is always going to be called by address(this)
 */
contract AccountDonationMatch is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice Deposit DAOToken(or Halo) to the endowment and store its balance
     * @dev Function manages reserve token sent by donation matching contract
     * @param curId Endowment ID
     * @param curAmount Amount of DAOToken to deposit
     */
    function depositDonationMatchErC20(
        uint256 curId,
        address curToken,
        uint256 curAmount
    ) public {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            (registrar_config.haloToken == curToken ||
                tempEndowment.daoToken == curToken),
            "Invalid Token"
        );

        require(
            IERC20(curToken).transferFrom(msg.sender, address(this), curAmount),
            "TransferFrom failed"
        );

        state.DAOTOKENBALANCE[curId] += curAmount;
        emit DonationDeposited(curId, curAmount);
    }

    /**
     * @notice Withdraw DAOToken(or Halo) from the endowment
     * @dev Function manages reserve token sent by donation matching contract
     * @param curId Endowment ID
     * @param curRecipient Recipient address
     * @param curAmount Amount of DAOToken to withdraw
     */
    function withdrawDonationMatchErC20(
        uint256 curId,
        address curRecipient,
        uint256 curAmount
    ) public {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[
            curId
        ];

        require(curAmount > 0, "amount should be grater than 0");

        require(msg.sender == tempEndowment.owner, "UnAuthorized");

        require(
            state.DAOTOKENBALANCE[curId] >= curAmount,
            "Insufficient amount"
        );

        state.DAOTOKENBALANCE[curId] -= curAmount;

        require(
            IERC20(tempEndowment.daoToken).transfer(curRecipient, curAmount),
            "Transfer failed"
        );
        emit DonationWithdrawn(curId, curRecipient, curAmount);
    }

    /**
     * @notice This function creates a donation match contract for an endowment
     * @dev creates a donation match contract for an endowment based on parameters (performs donation matching for contract against USDC)
     * @param curId The id of the endowment
     * @param curDetails The details of the donation match contract
     */
    function setupDonationMatch(
        uint256 curId,
        AccountMessages.DonationMatch memory curDetails
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[curId];
        AccountStorage.Config memory tempConfig = state.config;

        require(msg.sender == tempEndowment.owner, "Unauthorized");

        require(tempEndowment.owner != address(0), "AD E02"); //A DAO does not exist yet for this Endowment. Please set that up first.

        require(tempEndowment.donationMatchContract == address(0), "AD E03"); // A Donation Match contract already exists for this Endowment

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            tempConfig.registrarContract
        ).queryConfig();

        require(registrar_config.donationMatchCode != address(0), "AD E04"); // No implementation for donation matching contract

        require(curDetails.data.uniswapFactory != address(0), "Invalid Data");

        require(registrar_config.usdcAddress != address(0), "AD E05"); // Invalid Registrar Data
        require(curDetails.data.poolFee != 0, "Invalid Data");

        address curInputtoken;

        if (
            curDetails.enumData ==
            AccountMessages.DonationMatchEnum.HaloTokenReserve
        ) {
            require(registrar_config.haloToken != address(0), "AD E05"); // Invalid Registrar Data

            curInputtoken = registrar_config.haloToken;
        } else {
            require(
                curDetails.data.reserveToken != address(0),
                "Invalid  Data"
            );
            curInputtoken = curDetails.data.reserveToken;
        }

        DonationMatchMessages.InstantiateMessage
            memory _inputParam = DonationMatchMessages.InstantiateMessage({
                reserveToken: curInputtoken,
                uniswapFactory: curDetails.data.uniswapFactory,
                registrarContract: tempConfig.registrarContract,
                poolFee: curDetails.data.poolFee,
                usdcAddress: registrar_config.usdcAddress
            });

        bytes memory data = abi.encodeWithSignature(
            "initialize((address,address,address,uint24,address),address)",
            _inputParam,
            registrar_config.donationMatchEmitter
        );

        address donationMatch = address(
            new ProxyContract(
                registrar_config.donationMatchCode,
                registrar_config.proxyAdmin,
                data
            )
        );
        // TODO: add donation match address?? :
        state.ENDOWMENTS[curId].donationMatchContract = donationMatch;

        {
            IDonationMatchEmitter(registrar_config.donationMatchEmitter)
                .initializeDonationMatch(
                    curId,
                    donationMatch,
                    DonationMatchStorage.Config({
                        reserveToken: curInputtoken,
                        uniswapFactory: curDetails.data.uniswapFactory,
                        registrarContract: tempConfig.registrarContract,
                        poolFee: curDetails.data.poolFee,
                        usdcAddress: registrar_config.usdcAddress
                    })
                );
            emit DonationMatchSetup(
                curId,
                state.ENDOWMENTS[curId].donationMatchContract
            );
        }
    }
}
