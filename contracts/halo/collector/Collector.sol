// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {CollectorMessage} from "./message.sol";
import "./storage.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {ISwappingV3} from "../../core/swap-router/Interface/ISwappingV3.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 *@title Collector
 * @dev Collector contract
 * 1) The `Collector` contract  has functions to initialize the contract with the necessary details and to
 * 2) Update the configuration.
 * 3) It also has a sweep function to swap asset tokens to HALO tokens and distribute the result HALO tokens to the gov contract.
 * 4) Lastly, there is a queryConfig function to return the configuration details.
 */
contract Collector is Storage {
    event CollecterInitialized(CollectorMessage.InstantiateMsg details);
    event CollectedConfigUpdated(CollectorStorage.Config config);
    event CollectorSweeped(uint256 amount);
    IERC20Upgradeable token;
    bool initialized = false;
    uint256 constant SWEEP_REPLY_ID = 1;

    /**
     * @dev Initialize contract
     * @param curDetails CollectorMessage.InstantiateMsg used to initialize contract
     */
    function initialize(
        CollectorMessage.InstantiateMsg memory curDetails
    ) public {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
        state.config = CollectorStorage.Config({
            owner: msg.sender,
            rewardFactor: curDetails.rewardFactor,
            timelockContract: curDetails.timelockContract,
            govContract: curDetails.govContract,
            swapFactory: curDetails.swapFactory,
            distributorContract: curDetails.distributorContract,
            haloToken: curDetails.haloToken
        });
        token = IERC20Upgradeable(curDetails.haloToken);
        emit CollecterInitialized(curDetails);
    }

    /**
     * @dev Update config for collector contract
     * @param rewardFactor uint256
     * @param timelockContract address
     * @param govContract address
     * @param swapFactory address
     */
    function updateConfig(
        uint256 rewardFactor,
        address timelockContract,
        address govContract,
        address swapFactory
    ) public returns (bool) {
        require(
            timelockContract != address(0),
            "Invalid timelockContract address given"
        );
        require(swapFactory != address(0), "Invalid swapFactory address given");
        require(govContract != address(0), "Invalid govContract address given");
        require(
            msg.sender == state.config.timelockContract ||
                msg.sender == state.config.owner,
            "Unauthorized"
        );

        require(
            state.config.rewardFactor <= 100,
            "Invalid reward factor input given"
        );

        state.config.rewardFactor = rewardFactor;
        state.config.timelockContract = timelockContract;
        state.config.swapFactory = swapFactory;
        state.config.govContract = govContract;
        emit CollectedConfigUpdated(state.config);
        return true;
    }

    /**
     * @dev swaps asset tokens to HALO tokens and distributes the result HALO tokens to the gov contract.
     */

    function sweep() public payable {
        require(msg.value > 0, "Invalid amount given");
        // swap native token to HALO token
        uint256 amountOut = ISwappingV3(state.config.swapFactory)
            .swapEthToAnyToken{value: msg.value}(state.config.haloToken);
        // distribute HALO token to gov contract
        uint256 distributeAmount = (amountOut * state.config.rewardFactor) /
            100;
        uint256 remainingAmount = amountOut - distributeAmount;

        if (distributeAmount != 0) {
            require(
                token.transfer(state.config.govContract, distributeAmount),
                "Transfer failed"
            );
        }
        if (remainingAmount != 0) {
            require(
                token.transfer(
                    state.config.distributorContract,
                    remainingAmount
                ),
                "Transfer failed"
            );
        }
        emit CollectorSweeped(msg.value);
    }

    /**
     * @notice Query the config of Collector
     */
    function queryConfig()
        public
        view
        returns (CollectorMessage.ConfigResponse memory)
    {
        return
            CollectorMessage.ConfigResponse({
                owner: state.config.owner,
                rewardFactor: state.config.rewardFactor,
                timelockContract: state.config.timelockContract,
                govContract: state.config.govContract,
                swapFactory: state.config.swapFactory,
                distributorContract: state.config.distributorContract,
                haloToken: state.config.haloToken
            });
    }
}
