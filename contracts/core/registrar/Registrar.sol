// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Validator} from "../validator.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {RegistrarMessages} from "./message.sol";
import "./storage.sol";
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
    __LocalRegistrar_init();
    state.config = RegistrarStorage.Config({
      indexFundContract: address(0),
      accountsContract: address(0),
      treasury: details.treasury,
      subdaoGovContract: address(0), // Sub dao implementation
      subdaoTokenContract: address(0), // NewERC20 implementation
      subdaoBondingTokenContract: address(0), // Continous Token implementation
      subdaoCw900Contract: address(0),
      subdaoDistributorContract: address(0),
      subdaoEmitter: address(0),
      donationMatchContract: address(0),
      splitToLiquid: details.splitToLiquid,
      haloToken: address(0),
      haloTokenLpContract: address(0),
      govContract: address(0),
      donationMatchCharitesContract: address(0),
      donationMatchEmitter: address(0),
      collectorShare: COLLECTOR_DEFAULT_SHARE,
      charitySharesContract: address(0),
      fundraisingContract: address(0),
      uniswapRouter: address(0),
      uniswapFactory: address(0),
      multisigFactory: address(0),
      multisigEmitter: address(0),
      charityApplications: address(0),
      lockedWithdrawal: address(0),
      proxyAdmin: address(0),
      usdcAddress: address(0),
      wMaticAddress: address(0),
      cw900lvAddress: address(0),
      gasFwdFactory: address(0)
    });
    emit ConfigUpdated();

    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    lrs.NetworkConnections[details.networkName] = IAccountsStrategy.NetworkInfo({
      chainId: block.chainid,
      router: details.router,
      axelarGateway: details.axelarGateway,
      ibcChannel: "",
      transferChannel: "",
      gasReceiver: details.axelarGasService,
      gasLimit: 0
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

    if (Validator.addressChecker(details.uniswapRouter)) {
      state.config.uniswapRouter = details.uniswapRouter;
    }

    if (Validator.addressChecker(details.uniswapFactory)) {
      state.config.uniswapFactory = details.uniswapFactory;
    }

    if (Validator.addressChecker(details.charitySharesContract)) {
      state.config.charitySharesContract = details.charitySharesContract;
    }

    if (Validator.addressChecker(details.indexFundContract)) {
      state.config.indexFundContract = details.indexFundContract;
    }

    if (Validator.addressChecker(details.treasury)) {
      state.config.treasury = details.treasury;
    }

    // require(details.taxRate <= 100, "E06"); //Invalid tax rate input
    // // change taxRate from optional to required field because theres no way to map default value to tax rate
    // // since this is an update call, frontend will always send rebalance details
    // state.config.rebalance = details.rebalance;

    // check splits
    LibAccounts.SplitDetails memory split_details = LibAccounts.SplitDetails({
      max: details.splitMax,
      min: details.splitMin,
      defaultSplit: details.splitDefault
    });

    require(Validator.splitChecker(split_details), "Invalid Splits");
    state.config.splitToLiquid = split_details;

    if (Validator.addressChecker(details.donationMatchCharitesContract)) {
      state.config.donationMatchCharitesContract = details.donationMatchCharitesContract;
    }
    if (Validator.addressChecker(details.donationMatchEmitter)) {
      state.config.donationMatchEmitter = details.donationMatchEmitter;
    }

    // state.config.acceptedTokens = details.acceptedTokens;

    if (Validator.addressChecker(details.fundraisingContract)) {
      state.config.fundraisingContract = details.fundraisingContract;
    }

    // TODO update decimal logic
    if (details.collectorShare != 0) {
      state.config.collectorShare = details.collectorShare;
    }

    if (Validator.addressChecker(details.govContract)) {
      state.config.govContract = details.govContract;
    }

    if (Validator.addressChecker(details.subdaoGovContract)) {
      state.config.subdaoGovContract = details.subdaoGovContract;
    }

    if (Validator.addressChecker(details.subdaoBondingTokenContract)) {
      state.config.subdaoBondingTokenContract = details.subdaoBondingTokenContract;
    }

    if (Validator.addressChecker(details.subdaoTokenContract)) {
      state.config.subdaoTokenContract = details.subdaoTokenContract;
    }

    if (Validator.addressChecker(details.subdaoCw900Contract)) {
      state.config.subdaoCw900Contract = details.subdaoCw900Contract;
    }

    if (Validator.addressChecker(details.subdaoDistributorContract)) {
      state.config.subdaoDistributorContract = details.subdaoDistributorContract;
    }
    if (Validator.addressChecker(details.subdaoEmitter)) {
      state.config.subdaoEmitter = details.subdaoEmitter;
    }

    if (Validator.addressChecker(details.donationMatchContract)) {
      state.config.donationMatchContract = details.donationMatchContract;
    }

    if (Validator.addressChecker(details.haloToken)) {
      state.config.haloToken = details.haloToken;
    }

    if (Validator.addressChecker(details.haloTokenLpContract)) {
      state.config.haloTokenLpContract = details.haloTokenLpContract;
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

    if (Validator.addressChecker(details.lockedWithdrawal)) {
      state.config.lockedWithdrawal = details.lockedWithdrawal;
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

    if (Validator.addressChecker(details.cw900lvAddress)) {
      state.config.cw900lvAddress = details.cw900lvAddress;
    }

    if (Validator.addressChecker(details.gasFwdFactory)) {
      state.config.gasFwdFactory = details.gasFwdFactory;
    }
    // state.config.acceptedTokens = LibAccounts.AcceptedTokens({
    //     native: details.accepted_tokens_native,
    //     cw20: details.accepted_tokens_cw20
    // });
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

  // STRATEGY ARRAY HANDLING
  function queryAllStrategies() external view returns (bytes4[] memory allStrategies) {
    allStrategies = new bytes4[](state.STRATEGIES.length);
    for (uint256 i; i < allStrategies.length; i++) {
      allStrategies[i] = state.STRATEGIES[i];
    }
  }

  function setStrategyParams(
    bytes4 _strategyId,
    string memory _network,
    address _lockAddr,
    address _liqAddr,
    LocalRegistrarLib.StrategyApprovalState _approvalState
  ) public override onlyOwner {
    if (_approvalState == LocalRegistrarLib.StrategyApprovalState.DEPRECATED) {
      _removeStrategy(_strategyId);
    } else {
      _maybeAddStrategy(_strategyId);
    }
    super.setStrategyParams(_strategyId, _network, _lockAddr, _liqAddr, _approvalState);
  }

  function setStrategyApprovalState(
    bytes4 _strategyId,
    LocalRegistrarLib.StrategyApprovalState _approvalState
  ) public override onlyOwner {
    if (_approvalState == LocalRegistrarLib.StrategyApprovalState.DEPRECATED) {
      _removeStrategy(_strategyId);
    }
    super.setStrategyApprovalState(_strategyId, _approvalState);
  }

  function _maybeAddStrategy(bytes4 _strategyId) internal {
    bool inList;
    for (uint256 i = 0; i < state.STRATEGIES.length; i++) {
      if (state.STRATEGIES[i] == _strategyId) {
        inList = true;
      }
    }
    if (!inList) {
      state.STRATEGIES.push(_strategyId);
    }
  }

  function _removeStrategy(bytes4 _strategyId) internal {
    uint256 delIndex;
    bool indexFound;
    for (uint256 i = 0; i < state.STRATEGIES.length; i++) {
      if (state.STRATEGIES[i] == _strategyId) {
        delIndex = i;
        indexFound = true;
        break;
      }
    }
    if (indexFound) {
      state.STRATEGIES[delIndex] = state.STRATEGIES[state.STRATEGIES.length - 1];
      state.STRATEGIES.pop();
    }
  }
}
