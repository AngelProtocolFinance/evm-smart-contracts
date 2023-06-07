// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {CollectorMessage} from "./message.sol";
import "./storage.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {ISwappingV3} from "../../core/swap-router/interfaces/ISwappingV3.sol";
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
  event CollectorSweeped(address tokenSwept, uint256 amountSwept, uint256 haloOut);
  IERC20Upgradeable token;
  bool initialized = false;
  uint256 constant SWEEP_REPLY_ID = 1;

  /**
   * @dev Initialize contract
   * @param details CollectorMessage.InstantiateMsg used to initialize contract
   */
  function initialize(CollectorMessage.InstantiateMsg memory details) public {
    require(!initialized, "Contract instance has already been initialized");
    initialized = true;
    state.config = CollectorStorage.Config({
      owner: msg.sender,
      registrarContract: details.registrarContract,
      rewardFactor: details.rewardFactor,
      timelockContract: details.timelockContract,
      govContract: details.govContract,
      swapFactory: details.swapFactory,
      distributorContract: details.distributorContract,
      haloToken: details.haloToken
    });
    token = IERC20Upgradeable(details.haloToken);
    emit CollecterInitialized(details);
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
    address swapFactory,
    address registrarContract
  ) public returns (bool) {
    require(timelockContract != address(0), "Invalid timelockContract address given");
    require(swapFactory != address(0), "Invalid swapFactory address given");
    require(govContract != address(0), "Invalid govContract address given");
    require(msg.sender == state.config.owner, "Unauthorized");
    require(state.config.rewardFactor <= 100, "Invalid reward factor input given");
    state.config.registrarContract = registrarContract;
    state.config.rewardFactor = rewardFactor;
    state.config.timelockContract = timelockContract;
    state.config.swapFactory = swapFactory;
    state.config.govContract = govContract;
    emit CollectedConfigUpdated(state.config);
    return true;
  }

  /**
   * @dev swaps asset tokens to HALO tokens and distributes the result HALO tokens to the Governance contract.
   * @param sweepToken address of the token to be swept
   */
  function sweep(address sweepToken) public {
    uint256 sweepAmount = 0;
    // swap token to HALO token
    uint256 amountOut = ISwappingV3(state.config.swapFactory).executeSwaps(
      sweepToken,
      sweepAmount,
      state.config.haloToken,
      0
    );

    // distribute HALO token to gov contract
    uint256 distributeAmount = (amountOut * state.config.rewardFactor) / 100;
    if (distributeAmount > 0) {
      require(token.transfer(state.config.govContract, distributeAmount), "Transfer failed");
      if ((amountOut - distributeAmount) > 0) {
        require(
          token.transfer(state.config.distributorContract, amountOut - distributeAmount),
          "Transfer failed"
        );
      }
      emit CollectorSweeped(sweepToken, sweepAmount, amountOut);
    } else {
      revert("No HALO available to distribute after sweep");
    }
  }

  /**
   * @notice Query the config of Collector
   */
  function queryConfig() public view returns (CollectorMessage.ConfigResponse memory) {
    return
      CollectorMessage.ConfigResponse({
        owner: state.config.owner,
        registrarContract: state.config.registrarContract,
        rewardFactor: state.config.rewardFactor,
        timelockContract: state.config.timelockContract,
        govContract: state.config.govContract,
        swapFactory: state.config.swapFactory,
        distributorContract: state.config.distributorContract,
        haloToken: state.config.haloToken
      });
  }
}
