// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {DistributorMessage} from "./message.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {AddressArray} from "../../lib/address/array.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 *@title Distributor
 * @dev Distributor contract
 * The `Distributor` contract manages the distribution of the token
 */
contract Distributor is Storage, Initializable, ReentrancyGuard {
  event ConfigUpdated();
  event DistributorAdded(address distributor);
  event DistributorRemoved(address distributor);
  event HaloSpent(address recipient, uint256 amount);

  /**
   * @dev Initialize contract
   * @param details DistributorMessage.InstantiateMsg used to initialize contract
   */
  function initialize(DistributorMessage.InstantiateMsg memory details) public initializer {
    state.config = DistributorStorage.Config({
      timelockContract: details.timelockContract,
      allowlist: details.allowlist,
      spendLimit: details.spendLimit,
      haloToken: details.haloToken
    });
  }

  /**
   * @dev Update config for distributor contract
   * @param spendLimit uint
   * @param timelockContract address
   */
  function updateConfig(uint256 spendLimit, address timelockContract) public nonReentrant {
    require(state.config.timelockContract == msg.sender, "Unauthorized");
    state.config.timelockContract = timelockContract;
    state.config.spendLimit = spendLimit;
    emit ConfigUpdated();
  }

  /**
   * @dev Adds a distributor to the allowlist. Only the government contract is authorized to perform this action.
   * @param distributor address
   */
  function addDistributor(address distributor) public nonReentrant {
    require(state.config.timelockContract == msg.sender, "Unauthorized");

    // require(state.config.allowlist.length > 0 && state.config.allowlist.indexOf(distributor) != -1, "Distributor already registered");

    (, bool found) = AddressArray.indexOf(state.config.allowlist, distributor);

    if (!found) {
      state.config.allowlist.push(distributor);
      emit DistributorAdded(distributor);
    }
  }

  /**
   * @dev Removes a distributor to the allowlist. Only the government contract is authorized to perform this action.
   * @param distributor address
   */
  function removeDistributor(address distributor) public nonReentrant {
    require(state.config.timelockContract == msg.sender, "Unauthorized");
    (uint256 index, bool found) = AddressArray.indexOf(state.config.allowlist, distributor);
    if (found) {
      state.config.allowlist = AddressArray.remove(state.config.allowlist, index);
      emit DistributorRemoved(distributor);
    }
  }

  /**
   * @dev Transfers the specified amount of token from the contract to the recipient. Only the government contract is authorized to perform this action.
   * @param recipient address
   * @param amount uint
   */
  function spend(address recipient, uint256 amount) public nonReentrant {
    (, bool found) = AddressArray.indexOf(state.config.allowlist, msg.sender);
    require(found, "Unauthorized");
    require(state.config.spendLimit >= amount, "Cannot spend more than spend limit");
    require(
      IERC20Upgradeable(state.config.haloToken).transfer(recipient, amount),
      "Transfer failed"
    );
    emit HaloSpent(recipient, amount);
  }

  /**
   * @notice Query the config of distributor
   */
  function queryConfig() public view returns (DistributorMessage.ConfigResponse memory) {
    return
      DistributorMessage.ConfigResponse({
        timelockContract: state.config.timelockContract,
        allowlist: state.config.allowlist,
        spendLimit: state.config.spendLimit,
        haloToken: state.config.haloToken
      });
  }
}
