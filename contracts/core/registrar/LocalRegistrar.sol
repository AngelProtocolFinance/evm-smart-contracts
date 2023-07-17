// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {ILocalRegistrar} from "./interfaces/ILocalRegistrar.sol";
import {LocalRegistrarLib} from "./lib/LocalRegistrarLib.sol";
import {IVault} from "../vault/interfaces/IVault.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {IAccountsStrategy} from "../accounts/interfaces/IAccountsStrategy.sol";

contract LocalRegistrar is ILocalRegistrar, Initializable, OwnableUpgradeable {
  /*////////////////////////////////////////////////
                    PROXY INIT
    */ ////////////////////////////////////////////////

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function __LocalRegistrar_init() internal onlyInitializing {
    __Ownable_init();
    __LocalRegistrar_init_unchained();
  }

  function __LocalRegistrar_init_unchained() internal onlyInitializing {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.rebalanceParams = LocalRegistrarLib.RebalanceParams(
      LocalRegistrarLib.REBALANCE_LIQUID_PROFITS,
      LocalRegistrarLib.LOCKED_REBALANCE_TO_LIQUID,
      LocalRegistrarLib.INTEREST_DISTRIBUTION,
      LocalRegistrarLib.LOCKED_PRINCIPLE_TO_LIQUID,
      LocalRegistrarLib.PRINCIPLE_DISTRIBUTION,
      LocalRegistrarLib.BASIS
    );

    lrs.angelProtocolParams = LocalRegistrarLib.AngelProtocolParams(
      LocalRegistrarLib.ROUTER_ADDRESS,
      LocalRegistrarLib.REFUND_ADDRESS
    );
  }

  function initialize() public initializer {
    __LocalRegistrar_init();
  }

  /*////////////////////////////////////////////////
                    GETTER VIEW METHODS
    */ ////////////////////////////////////////////////
  function getRebalanceParams()
    external
    view
    override
    returns (LocalRegistrarLib.RebalanceParams memory)
  {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.rebalanceParams;
  }

  function getAngelProtocolParams()
    external
    view
    override
    returns (LocalRegistrarLib.AngelProtocolParams memory)
  {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.angelProtocolParams;
  }

  function getAccountsContractAddressByChain(
    string calldata _targetChain
  ) external view returns (string memory) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.AccountsContractByChain[keccak256(bytes(_targetChain))];
  }

  function getStrategyParamsById(
    bytes4 _strategyId
  ) external view override returns (LocalRegistrarLib.StrategyParams memory) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.VaultsByStrategyId[_strategyId];
  }

  function isTokenAccepted(address _tokenAddr) external view returns (bool) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.AcceptedTokens[_tokenAddr];
  }

  function getStrategyApprovalState(
    bytes4 _strategyId
  ) external view override returns (LocalRegistrarLib.StrategyApprovalState) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.VaultsByStrategyId[_strategyId].approvalState;
  }

  function getGasByToken(address _tokenAddr) external view returns (uint256) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.GasFeeByToken[_tokenAddr];
  }

  function getVaultOperatorApproved(address _operator) external view override returns (bool) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.ApprovedVaultOperators[_operator];
  }

  function getFeeSettingsByFeeType(
    LibAccounts.FeeTypes _feeType
  ) external view returns (LibAccounts.FeeSetting memory) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.FeeSettingsByFeeType[_feeType];
  }

  function getUniswapFactoryAddress() public view returns (address) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.uniswapFactory;
  }

  function getUniswapRouterAddress() public view returns (address) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    return lrs.uniswapRouter;
  }

    /**
   * @dev Query the network connection in registrar
   * @param networkName The chain name to query
   * @return response The network connection
   */
  function queryNetworkConnection(
    string memory networkName
  ) public view returns (IAccountsStrategy.NetworkInfo memory response) {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    response = lrs.NetworkConnections[networkName];
  }


  /*////////////////////////////////////////////////
                    RESTRICTED SETTERS
    */ ////////////////////////////////////////////////
  function setRebalanceParams(
    LocalRegistrarLib.RebalanceParams calldata _rebalanceParams
  ) external override onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.rebalanceParams = _rebalanceParams;
    emit RebalanceParamsUpdated();
  }

  function setAngelProtocolParams(
    LocalRegistrarLib.AngelProtocolParams calldata _angelProtocolParams
  ) external override onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.angelProtocolParams = _angelProtocolParams;
    emit AngelProtocolParamsUpdated();
  }

  function setAccountsContractAddressByChain(
    string calldata _chainName,
    string calldata _accountsContractAddress
  ) external onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.AccountsContractByChain[keccak256(bytes(_chainName))] = _accountsContractAddress;
    emit AccountsContractStorageUpdated(_chainName, _accountsContractAddress);
  }

  function setTokenAccepted(address _tokenAddr, bool _isAccepted) external onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.AcceptedTokens[_tokenAddr] = _isAccepted;
    emit TokenAcceptanceUpdated(_tokenAddr, _isAccepted);
  }

  function setGasByToken(address _tokenAddr, uint256 _gasFee) external onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.GasFeeByToken[_tokenAddr] = _gasFee;
    emit GasFeeUpdated(_tokenAddr, _gasFee);
  }

  function setStrategyApprovalState(
    bytes4 _strategyId,
    LocalRegistrarLib.StrategyApprovalState _approvalState
  ) public virtual override onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    lrs.VaultsByStrategyId[_strategyId].approvalState = _approvalState;
    emit StrategyApprovalUpdated(_strategyId, _approvalState);
  }

  function setStrategyParams(
    bytes4 _strategyId,
    string memory _network,
    address _lockAddr,
    address _liqAddr,
    LocalRegistrarLib.StrategyApprovalState _approvalState
  ) public virtual onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();

    LocalRegistrarLib.VaultParams memory lockedParams = LocalRegistrarLib.VaultParams(
      IVault.VaultType.LOCKED,
      _lockAddr
    );
    LocalRegistrarLib.VaultParams memory liquidParams = LocalRegistrarLib.VaultParams(
      IVault.VaultType.LIQUID,
      _liqAddr
    );

    lrs.VaultsByStrategyId[_strategyId] = LocalRegistrarLib.StrategyParams(
      _approvalState,
      _network,
      lockedParams,
      liquidParams
    );
    emit StrategyParamsUpdated(_strategyId, _network, _lockAddr, _liqAddr, _approvalState);
  }

  function setVaultOperatorApproved(address _operator, bool _isApproved) external override {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    lrs.ApprovedVaultOperators[_operator] = _isApproved;
  }

  function setFeeSettingsByFeesType(
    LibAccounts.FeeTypes _feeType,
    uint256 _rate,
    address _payout
  ) external {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    lrs.FeeSettingsByFeeType[_feeType] = LibAccounts.FeeSetting({
      payoutAddress: _payout,
      bps: _rate
    });
    emit FeeSettingsUpdated(_feeType, _rate, _payout);
  }

  function setUniswapAddresses(address _uniswapRouter, address _uniswapFactory) external onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    lrs.uniswapRouter = _uniswapRouter;
    lrs.uniswapFactory = _uniswapFactory;
  }

    /**
   * @dev update network connections in the registrar
   * @param networkInfo The network info to update
   * @param action The action to perform (POST or DELETE)
   */
  function updateNetworkConnections(
    string memory networkName,
    IAccountsStrategy.NetworkInfo memory networkInfo,
    LocalRegistrarLib.NetworkConnectionAction action
  ) public onlyOwner {
    LocalRegistrarLib.LocalRegistrarStorage storage lrs = LocalRegistrarLib.localRegistrarStorage();
    if (action == LocalRegistrarLib.NetworkConnectionAction.POST) {
      lrs.NetworkConnections[networkName] = networkInfo;
      emit NetworkConnectionPosted(networkInfo.chainId);
    } else if (action == LocalRegistrarLib.NetworkConnectionAction.DELETE) {
      delete lrs.NetworkConnections[networkName];
      emit NetworkConnectionRemoved(networkInfo.chainId);
    } else {
      revert("Invalid inputs");
    }
  }
}
