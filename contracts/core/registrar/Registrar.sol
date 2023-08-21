// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Validator} from "../validator.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {RegistrarMessages} from "./message.sol";
import {RegistrarStorage, Storage} from "./storage.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {LocalRegistrar} from "./LocalRegistrar.sol";
import {LocalRegistrarLib} from "./lib/LocalRegistrarLib.sol";

uint256 constant COLLECTOR_DEFAULT_SHARE = 50;

/**
 * @title Registrar Contract
 * @dev Contract for Registrar
 */
contract Registrar is LocalRegistrar, Storage, ReentrancyGuard {
  event ConfigUpdated();

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice intialize function for the contract
   * @dev initialize function for the contract only called once at the time of deployment
   * @param details details for the contract
   */
  function initialize(RegistrarMessages.InstantiateRequest memory details) public initializer {
    __LocalRegistrar_init(details.networkName);
    state.config = RegistrarStorage.Config({
      accountsContract: address(0),
      apTeamMultisig: details.apTeamMultisig,
      treasury: details.treasury,
      indexFundContract: address(0),
      haloToken: address(0),
      govContract: address(0),
      fundraisingContract: address(0),
      uniswapRouter: address(0),
      uniswapFactory: address(0),
      multisigFactory: address(0),
      multisigEmitter: address(0),
      charityApplications: address(0),
      proxyAdmin: address(0),
      usdcAddress: address(0),
      wMaticAddress: address(0),
      gasFwdFactory: address(0)
    });
    emit ConfigUpdated();

    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    lrs.NetworkConnections[details.networkName] = LocalRegistrarLib.NetworkInfo({
      chainId: block.chainid,
      router: details.router,
      axelarGateway: details.axelarGateway,
      gasReceiver: details.axelarGasService,
      refundAddr: details.refundAddr
    });
    emit NetworkConnectionPosted(block.chainid);
  }

  // Executor functions for registrar

  /**
   * @notice update config function for the contract
   * @dev update config function for the contract
   * @param details details for the contract
   */
  function updateConfig(
    RegistrarMessages.UpdateConfigRequest memory details
  ) public onlyOwner nonReentrant {
    if (Validator.addressChecker(details.accountsContract)) {
      state.config.accountsContract = details.accountsContract;
    }

    if (Validator.addressChecker(details.apTeamMultisig)) {
      state.config.apTeamMultisig = details.apTeamMultisig;
    }

    if (Validator.addressChecker(details.treasury)) {
      state.config.treasury = details.treasury;
    }

    if (Validator.addressChecker(details.indexFundContract)) {
      state.config.indexFundContract = details.indexFundContract;
    }

    if (Validator.addressChecker(details.haloToken)) {
      state.config.haloToken = details.haloToken;
    }

    if (Validator.addressChecker(details.govContract)) {
      state.config.govContract = details.govContract;
    }

    if (Validator.addressChecker(details.fundraisingContract)) {
      state.config.fundraisingContract = details.fundraisingContract;
    }

    if (Validator.addressChecker(details.uniswapRouter)) {
      state.config.uniswapRouter = details.uniswapRouter;
    }

    if (Validator.addressChecker(details.uniswapFactory)) {
      state.config.uniswapFactory = details.uniswapFactory;
    }

    if (Validator.addressChecker(details.multisigEmitter)) {
      state.config.multisigEmitter = details.multisigEmitter;
    }

    if (Validator.addressChecker(details.multisigFactory)) {
      state.config.multisigFactory = details.multisigFactory;
    }

    if (Validator.addressChecker(details.charityApplications)) {
      state.config.charityApplications = details.charityApplications;
    }

    if (Validator.addressChecker(details.proxyAdmin)) {
      state.config.proxyAdmin = details.proxyAdmin;
    }

    if (Validator.addressChecker(details.usdcAddress)) {
      state.config.usdcAddress = details.usdcAddress;
    }

    if (Validator.addressChecker(details.wMaticAddress)) {
      state.config.wMaticAddress = details.wMaticAddress;
    }

    if (Validator.addressChecker(details.gasFwdFactory)) {
      state.config.gasFwdFactory = details.gasFwdFactory;
    }
    emit ConfigUpdated();
  }

  /**
   * @dev This function updates a Registrar-Level Accepted Token's Price Feed contract address in storage.
   * @param token address
   * @param priceFeed address
   */
  function updateTokenPriceFeed(address token, address priceFeed) public onlyOwner {
    require(priceFeed != address(0), "Must pass valid price feed contract address");
    state.PriceFeeds[token] = priceFeed;
  }

  /**
   * @dev Query the Price Feed contract set for an Accepted Token in the Registrar
   * @param token The address of token
   * @return address of Price Feed contract set (zero-address if not set)
   */
  function queryTokenPriceFeed(address token) public view returns (address) {
    return state.PriceFeeds[token];
  }

  // Query functions for contract

  /**
   * @dev Query the registrar config
   * @return The registrar config
   */
  function queryConfig() public view returns (RegistrarStorage.Config memory) {
    return state.config;
  }
}
