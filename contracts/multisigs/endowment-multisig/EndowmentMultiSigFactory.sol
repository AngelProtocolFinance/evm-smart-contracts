// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";
import {IEndowmentMultiSigFactory} from "./interfaces/IEndowmentMultiSigFactory.sol";
import {ProxyContract} from "../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Validator} from "../../core/validator.sol";

/// @title Multisignature wallet factory - Allows creation of multisigs wallet.
contract EndowmentMultiSigFactory is IEndowmentMultiSigFactory, Initializable, OwnableUpgradeable {
  address public implementationAddress;
  address proxyAdmin;
  IRegistrar registrar;

  function initialize(
    address _implementationAddress,
    address _proxyAdmin,
    address registrarAddress,
    address owner
  ) external initializer {
    __Ownable_init();

    updateImplementation(_implementationAddress);
    updateProxyAdmin(_proxyAdmin);
    updateRegistrar(registrarAddress);

    transferOwnership(owner);
  }

  /*////////////////////////////////////////////////
                        MODIFIERS
  */ ///////////////////////////////////////////////

  modifier onlyAccountsContract() {
    RegistrarStorage.Config memory registrarConfig = registrar.queryConfig();
    if (msg.sender != registrarConfig.accountsContract) {
      revert OnlyAccountsContract();
    }
    _;
  }

  /*////////////////////////////////////////////////
                        IMPLEMENTATION
  */ ///////////////////////////////////////////////

  /// @notice Get stored registrar address.
  /// @return address of the stored registrar.
  function getRegistrar() external view returns (address) {
    return address(registrar);
  }

  /// @notice Get proxy admin address.
  /// @return address of the proxy admin.
  function getProxyAdmin() external view returns (address) {
    return proxyAdmin;
  }

  /**
   * @dev Updates the implementation address
   * @param _implementationAddress The address of the new implementation
   */
  function updateImplementation(address _implementationAddress) public onlyOwner {
    if (!Validator.addressChecker(_implementationAddress)) {
      revert InvalidAddress("_implementationAddress");
    }
    implementationAddress = _implementationAddress;
    emit ImplementationUpdated(_implementationAddress);
  }

  /**
   * @dev Updates the proxy admin address
   * @param _proxyAdmin The address of the new proxy admin
   */
  function updateProxyAdmin(address _proxyAdmin) public onlyOwner {
    if (!Validator.addressChecker(_proxyAdmin)) {
      revert InvalidAddress("_proxyAdmin");
    }
    proxyAdmin = _proxyAdmin;
    emit ProxyAdminUpdated(_proxyAdmin);
  }

  /**
   * @dev Updates the registrar address
   * @param registrarAddress The address of the new registrar
   */
  function updateRegistrar(address registrarAddress) public onlyOwner {
    if (!Validator.addressChecker(registrarAddress)) {
      revert InvalidAddress("registrarAddress");
    }
    registrar = IRegistrar(registrarAddress);
    emit RegistrarUpdated(registrarAddress);
  }

  /** @dev Create a new multisig wallet for an endowment
   * @param endowmentId the endowment id
   * @param emitterAddress the emitter of the multisig
   * @param owners the owners of the multisig
   * @param required the required number of signatures
   * @param transactionExpiry duration of validity for newly created transactions
   */
  function create(
    uint256 endowmentId,
    address emitterAddress,
    address[] memory owners,
    uint256 required,
    uint256 transactionExpiry
  ) public onlyAccountsContract returns (address wallet) {
    bytes memory EndowmentData = abi.encodeWithSignature(
      "initialize(uint256,address,address[],uint256,bool,uint256)",
      endowmentId,
      emitterAddress,
      owners,
      required,
      false,
      transactionExpiry
    );
    wallet = address(new ProxyContract(implementationAddress, proxyAdmin, EndowmentData));
    IEndowmentMultiSigEmitter(emitterAddress).createEndowmentMultisig(
      wallet,
      endowmentId,
      emitterAddress,
      owners,
      required,
      false,
      transactionExpiry
    );

    emit ContractInstantiated(msg.sender, wallet);
  }
}
