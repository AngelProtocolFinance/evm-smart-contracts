// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {ProxyContract} from "../proxy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IGasFwdFactory} from "./IGasFwdFactory.sol";

contract GasFwdFactory is IGasFwdFactory, Ownable {
  address impl;
  address admin;
  address accounts;

  constructor(address _impl, address _admin, address _accounts) {
    if (_impl == address(0)) {
      revert InvalidAddress("_impl");
    }
    if (_admin == address(0)) {
      revert InvalidAddress("_admin");
    }
    if (_accounts == address(0)) {
      revert InvalidAddress("_accounts");
    }
    impl = _impl;
    admin = _admin;
    accounts = _accounts;
  }

  function create() public returns (address) {
    bytes memory data = abi.encodeWithSignature("initialize(address)", accounts);
    address newContract = address(new ProxyContract(impl, admin, data));
    emit GasFwdCreated(newContract);
    return newContract;
  }

  function updateImplementation(address _impl) external onlyOwner {
    if (_impl == address(0)) {
      revert InvalidAddress("_impl");
    }
    impl = _impl;
  }
}