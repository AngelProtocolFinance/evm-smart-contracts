// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {SubDaoMessages} from "../../../normalized_endowment/subdao/message.sol";
import {AccountStorage} from "../storage.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";
import {ProxyContract} from "../../proxy.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {ISubDaoEmitter} from "../../../normalized_endowment/subdao/ISubDaoEmitter.sol";
import {ISubDao} from "../../../normalized_endowment/subdao/ISubDao.sol";
import {IAccountsDeployContract} from "../interfaces/IAccountsDeployContract.sol";

/**
 * @title AccountsDeployContract
 * @notice This contract is used to deploy contracts from accounts diamond
 * @dev Created so that deploying facets (which call this) don't have size conflicts
 * @dev Is always going to be called by address(this)
 */
contract AccountsDeployContract is IAccountsDeployContract, ReentrancyGuardFacet, IAccountsEvents {
  /**
   * @notice Create a new Dao for endowment
   * @param createDaoMessage Dao creation message with initial configuration
   */
  function createDaoContract(
    SubDaoMessages.InstantiateMsg memory createDaoMessage
  ) public nonReentrant returns (address daoAddress) {
    // will be called by self, as this is deployment facet
    require(msg.sender == address(this), "Unauthorized");
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    address implementation = registrar_config.subdaoGovContract;
    address admin = registrar_config.proxyAdmin;

    bytes memory subDaoData = abi.encodeWithSignature(
      "initializeSubDao(address)",
      registrar_config.subdaoEmitter
    );

    // TODO: create a ProxyFactory contract that instantiates proxy contracts
    // Reason: will make the contract more easily testable (factory could be mocked)
    daoAddress = address(new ProxyContract(implementation, admin, subDaoData));

    ISubDaoEmitter(registrar_config.subdaoEmitter).initializeSubDao(daoAddress);

    ISubDao(daoAddress).buildDaoTokenMesage(createDaoMessage);
    emit DaoContractCreated(createDaoMessage.id, daoAddress);
  }
}
