// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";
import {IEndowmentMultiSigFactory} from "./interfaces/IEndowmentMultiSigFactory.sol";
import {ProxyContract} from "../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Validator} from "../../core/validator.sol";
import {IterableMappingAddr} from "../../lib/IterableMappingAddr.sol";

/// @title Multisignature wallet factory - Allows creation of multisigs wallet.
/// @author Stefan George - <stefan.george@consensys.net>
contract EndowmentMultiSigFactory is IEndowmentMultiSigFactory, Ownable, IterableMappingAddr {
  /*
   *  Storage
   */
  IterableMappingAddr.Map endowmentMultiSigs;

  address public implementationAddress;
  address public proxyAdmin;
  IRegistrar registrar;

  constructor(address _implementationAddress, address _proxyAdmin, address _registrar) {
    if (!Validator.addressChecker(_implementationAddress)) {
      revert InvalidAddress("_implementationAddress");
    }
    if (!Validator.addressChecker(_proxyAdmin)) {
      revert InvalidAddress("_proxyAdmin");
    }
    if (!Validator.addressChecker(_registrar)) {
      revert InvalidAddress("_registrar");
    }

    implementationAddress = _implementationAddress;
    proxyAdmin = _proxyAdmin;
    registrar = IRegistrar(_registrar);

    emit Initialized(_implementationAddress, _proxyAdmin, _registrar);
  }

  modifier onlyAccountsContract() {
    RegistrarStorage.Config memory registrarConfig = registrar.queryConfig();
    if (msg.sender != registrarConfig.accountsContract) {
      revert OnlyAccountsContract();
    }
    _;
  }

  /*
   * Public functions
   */

  /// @notice Returns the stored registrar address.
  /// @return address registrar address.
  function getRegistrarAddress() external view returns (address) {
    return address(registrar);
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

    register(wallet);
  }

  /*
   * Internal functions
   */
  /// @dev Registers contract in factory registry.
  /// @param endowmentMultiSigProxy Address of EndowmentMultiSig proxy contract instantiation.
  function register(address endowmentMultiSigProxy) internal {
    IterableMappingAddr.set(endowmentMultiSigs, endowmentMultiSigProxy, true);
    emit ContractInstantiated(msg.sender, endowmentMultiSigProxy);
  }
}
