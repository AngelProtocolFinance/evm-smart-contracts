// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {LibAccounts} from "../../core/accounts/lib/LibAccounts.sol";
import {AccountStorage} from "../../core/accounts/storage.sol";
import {IterableMapping} from "../../lib/IterableMappingAddr.sol";

/**
 * @dev This contract implements a proxy that is upgradeable by an admin.
 *
 * To avoid https://medium.com/nomic-labs-blog/malicious-backdoors-in-ethereum-proxies-62629adf3357[proxy selector
 * clashing], which can potentially be used in an attack, this contract uses the
 * https://blog.openzeppelin.com/the-transparent-proxy-pattern/[transparent proxy pattern]. This pattern implies two
 * things that go hand in hand:
 *
 * 1. If any account other than the admin calls the proxy, the call will be forwarded to the implementation, even if
 * that call matches one of the admin functions exposed by the proxy itself.
 * 2. If the admin calls the proxy, it can access the admin functions, but its calls will never be forwarded to the
 * implementation. If the admin tries to call a function on the implementation it will fail with an error that says
 * "admin cannot fallback to proxy target".
 *
 * These properties mean that the admin account can only be used for admin actions like upgrading the proxy or changing
 * the admin, so it's best if it's a dedicated account that is not used for anything else. This will avoid headaches due
 * to sudden errors when trying to call a function from the proxy implementation.
 *
 * Our recommendation is for the dedicated account to be an instance of the {ProxyAdmin} contract. If set up this way,
 * you should think of the `ProxyAdmin` instance as the real administrative interface of your proxy.
 */

contract TestFacetProxyContract is TransparentUpgradeableProxy, IterableMapping {
  constructor(
    address implementation,
    address admin,
    bytes memory _data
  ) TransparentUpgradeableProxy(implementation, admin, _data) {}

  function getAdmin() external view returns (address adm) {
    bytes32 slot = _ADMIN_SLOT;
    assembly {
      adm := sload(slot)
    }
  }

  function getImplementation() external view returns (address impl) {
    bytes32 slot = _IMPLEMENTATION_SLOT;
    assembly {
      impl := sload(slot)
    }
  }

  function getDaoTokenBalance(uint32 accountId) external view returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.DAOTOKENBALANCE[accountId];
  }

  function setDaoTokenBalance(uint32 accountId, uint256 _tokenBal) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.DAOTOKENBALANCE[accountId] = _tokenBal;
  }

  // This doesn't work since it contains a nested mapping, to set endowment state, we need some field specific methods
  // function setEndowmentState(uint32 accountId, AccountStorage.EndowmentState memory _endowmentState) external {
  //   AccountStorage.State storage state = LibAccounts.diamondStorage();
  //   state.STATES[accountId] = _endowmentState;
  // }

  function setEndowmentTokenBalance(
    uint32 accountId,
    address _token,
    uint256 _lockBal,
    uint256 _liqBal
  ) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    IterableMapping.set(state.STATES[accountId].balances.locked, _token, _lockBal);
    IterableMapping.set(state.STATES[accountId].balances.liquid, _token, _liqBal);
  }

  function getEndowmentTokenBalance(
    uint32 accountId,
    address _token
  ) external view returns (uint256, uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return (
      IterableMapping.get(state.STATES[accountId].balances.locked, _token),
      IterableMapping.get(state.STATES[accountId].balances.liquid, _token)
    );
  }

  function setClosingEndowmentState(
    uint32 accountId,
    bool _closing,
    LibAccounts.Beneficiary memory _closingBeneficiary
  ) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.STATES[accountId].closingEndowment = _closing;
    state.STATES[accountId].closingBeneficiary = _closingBeneficiary;
  }

  function getClosingEndowmentState(
    uint32 accountId
  ) external view returns (bool, LibAccounts.Beneficiary memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return (state.STATES[accountId].closingEndowment, state.STATES[accountId].closingBeneficiary);
  }

  function setActiveStrategyEndowmentState(
    uint32 accountId,
    bytes4 _strategy,
    bool _accepted
  ) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.STATES[accountId].activeStrategies[_strategy] = _accepted;
  }

  function getActiveStrategyEndowmentState(
    uint32 accountId,
    bytes4 _strategy
  ) external view returns (bool) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.STATES[accountId].activeStrategies[_strategy];
  }

  function setEndowmentDetails(
    uint32 accountId,
    AccountStorage.Endowment memory _endowment
  ) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.ENDOWMENTS[accountId] = _endowment;
  }

  function getEndowmentDetails(
    uint32 accountId
  ) external view returns (AccountStorage.Endowment memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.ENDOWMENTS[accountId];
  }

  function setTokenAllowance(
    uint32 accountId,
    address _spender,
    address _token,
    uint256 _spenderAllowance,
    uint256 _totalAllowance
  ) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.ALLOWANCES[accountId][_token].bySpender[_spender] = _spenderAllowance;
    state.ALLOWANCES[accountId][_token].totalOutstanding = _totalAllowance;
  }

  function getTokenAllowance(
    uint32 accountId,
    address _spender,
    address _token
  ) external view returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.ALLOWANCES[accountId][_token].bySpender[_spender];
  }

  function setTokenAccepted(uint32 accountId, address _token, bool _accepted) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.AcceptedTokens[accountId][_token] = _accepted;
  }

  function getTokenAccepted(uint32 accountId, address _token) external view returns (bool) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.AcceptedTokens[accountId][_token];
  }

  function setPriceFeed(uint32 accountId, address _token, address _feed) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.PriceFeeds[accountId][_token] = _feed;
  }

  function getPriceFeed(uint32 accountId, address _token) external view returns (address) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.PriceFeeds[accountId][_token];
  }

  function setConfig(AccountStorage.Config memory _config) external {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    state.config = _config;
  }

  function getConfig() external view returns (AccountStorage.Config memory) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.config;
  }
}
