// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC20Upgrade} from "../ERC20Upgrade.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./storage.sol";
import {GovHodlerMessage} from "./message.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 *@title GovHodler
 * @dev GovHodler contract
 * The `GovHodler` contract allows to configure the contract by setting its owner and government contract
 * address, and provides a method to claim Halo tokens.
 */
contract GovHodler is Storage, Initializable, ReentrancyGuard {
  event GovHolderConfigUpdated(GovHodlerStorage.Config config);
  event GovHolderHaloClaimed(address recipient, uint amount);

  /**
   * @dev Initialize contract
   * @param details GovHodlerMessage.InstantiateMsg used to initialize contract
   */
  function initialiaze(GovHodlerMessage.InstantiateMsg memory details) public initializer {
    state.config = GovHodlerStorage.Config({
      owner: details.owner,
      timelockContract: details.timelockContract,
      haloToken: details.haloToken
    });
    emit GovHolderConfigUpdated(state.config);
  }

  /**
   * @dev Update config for govHodler contract
   * @param timelockContract address
   */
  function updateConfig(address timelockContract) public nonReentrant {
    require(
      msg.sender == state.config.timelockContract || msg.sender == state.config.owner,
      "Unauthorized"
    );

    state.config.timelockContract = timelockContract;
    emit GovHolderConfigUpdated(state.config);
  }

  /**
   * @dev Claims `amount` of Halo tokens and transfers them to `recipient`. The caller of this function must be the rent government contract.
   * @param amount uint
   * @param recipient address
   */
  function claimHalo(address payable recipient, uint amount) public nonReentrant {
    require(msg.sender == state.config.timelockContract, "Unauthorized");
    require(
      IERC20Upgradeable(state.config.haloToken).transfer(recipient, amount),
      "Transfer failed"
    );
    emit GovHolderHaloClaimed(recipient, amount);
  }
}
