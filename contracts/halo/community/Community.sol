// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {CommunityMessage} from "./message.sol";

import {ERC20Upgrade} from "../ERC20Upgrade.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 *@title Community
 * @dev Community contract
 * The `Community` contract serves as a management system for a community of token holders.
 * It provides functions to initialize the contract, update its configuration, transfer tokens,
 * and retrieve the rent configuration.
 */
contract Community is Storage, Initializable, ReentrancyGuard {
    event CommunityConfigUpdated(CommunityStorage.Config config);
    event CommunitySpend(address recipient, uint amount);

    /**
     * @dev Initialize contract
     * @param details CommunityMessage.InstantiateMsg used to initialize contract
     */
    function initialize(
        CommunityMessage.InstantiateMsg memory details
    ) public initializer {
        state.config = CommunityStorage.Config({
            timelockContract: details.timelockContract,
            spendLimit: details.spendLimit,
            haloToken: details.haloToken
        });
        emit CommunityConfigUpdated(state.config);
    }

    /**
     * @dev Update config for community contract
     * @param spendLimit uint
     * @param timelockContract address
     */
    function updateConfig(
        uint spendLimit,
        address timelockContract
    ) public nonReentrant {
        require(state.config.timelockContract == msg.sender, "Unauthorized");

        state.config.timelockContract = timelockContract;
        state.config.spendLimit = spendLimit;
        emit CommunityConfigUpdated(state.config);
    }

    /**
     * @dev Transfer a specified amount of tokens from the contract's balance to the recipient's address.
     * @param recipient address
     * @param amount uint
     */
    function spend(address recipient, uint amount) public nonReentrant {
        require(state.config.timelockContract == msg.sender, "Unauthorized");

        require(
            state.config.spendLimit >= amount,
            "Cannot spend more than spend limit"
        );
        require(
            amount <=
                IERC20Upgradeable(state.config.haloToken).balanceOf(
                    address(this)
                ),
            "Not enough balance"
        );
        require(
            IERC20Upgradeable(state.config.haloToken).transfer(
                recipient,
                amount
            ),
            "Transfer failed"
        );
        emit CommunitySpend(recipient, amount);
    }

    /**
     * @notice Query the config of community
     */
    function queryConfig()
        public
        view
        returns (CommunityMessage.ConfigResponse memory)
    {
        return
            CommunityMessage.ConfigResponse({
                timelockContract: state.config.timelockContract,
                spendLimit: state.config.spendLimit,
                haloToken: state.config.haloToken
            });
    }
}
