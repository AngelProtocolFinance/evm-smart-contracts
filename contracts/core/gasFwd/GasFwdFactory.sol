// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {ProxyContract} from "../proxy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IGasFwdFactory} from "./IGasFwdFactory.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";

contract GasFwdFactory is IGasFwdFactory, Ownable {
  address impl;
  address admin;
  address registrar;

  constructor(address _impl, address _admin, address _registrar) {
    if (_impl == address(0)) {
      revert InvalidAddress("_impl");
    }
    if (_admin == address(0)) {
      revert InvalidAddress("_admin");
    }
    if (_registrar == address(0)) {
      revert InvalidAddress("_registrar");
    }
    impl = _impl;
    admin = _admin;
    registrar = _registrar;
  }

  function create() public returns (address) {
    RegistrarStorage.Config memory registrarConfig = IRegistrar(registrar).queryConfig();
    bytes memory data = abi.encodeWithSignature(
      "initialize(address)",
      registrarConfig.accountsContract
    );
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
