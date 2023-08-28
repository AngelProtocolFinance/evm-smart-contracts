// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";
import {ProxyContract} from "../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";

/// @title Multisignature wallet factory - Allows creation of multisigs wallet.
/// @author Stefan George - <stefan.george@consensys.net>
contract EndowmentMultiSigFactory is Ownable {
  /*
   *  Events
   */
  event ContractInstantiated(address sender, address instantiation);
  event ImplementationUpdated(address implementationAddress);
  event ProxyAdminUpdated(address admin);

  /*
   *  Storage
   */
  mapping(address => bool) public isInstantiation;
  mapping(address => address[]) public instantiations;
  mapping(uint256 => address) public endowmentIdToMultisig;

  address public implementationAddress;
  address public proxyAdmin;
  IRegistrar registrar;

  constructor(address _implementationAddress, address _proxyAdmin, address _registrar) {
    require(_implementationAddress != address(0), "Invalid Address");
    require(_proxyAdmin != address(0), "Invalid Address");
    require(_registrar != address(0), "Invalid Address");

    registrar = IRegistrar(_registrar);
    implementationAddress = _implementationAddress;
    emit ImplementationUpdated(_implementationAddress);

    proxyAdmin = _proxyAdmin;
    emit ProxyAdminUpdated(_proxyAdmin);
  }

  modifier onlyAccountsContract() {
    RegistrarStorage.Config memory registrarConfig = registrar.queryConfig();
    require(msg.sender == registrarConfig.accountsContract, "Only Accounts Contract");
    _;
  }

  /*
   * Public functions
   */
  /// @dev Returns number of instantiations by creator.
  /// @param creator Contract creator.
  /// @return Returns number of instantiations by creator.
  function getInstantiationCount(address creator) public view returns (uint256) {
    return instantiations[creator].length;
  }

  /**
   * @dev Updates the implementation address
   * @param _implementationAddress The address of the new implementation
   */
  function updateImplementation(address _implementationAddress) public onlyOwner {
    require(_implementationAddress != address(0), "Invalid Address");
    implementationAddress = _implementationAddress;
    emit ImplementationUpdated(_implementationAddress);
  }

  /**
   * @dev Updates the proxy admin address
   * @param _proxyAdmin The address of the new proxy admin
   */
  function updateProxyAdmin(address _proxyAdmin) public onlyOwner {
    require(_proxyAdmin != address(0), "Invalid Address");
    proxyAdmin = _proxyAdmin;
    emit ProxyAdminUpdated(_proxyAdmin);
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
    // also store address of multisig in endowmentIdToMultisig
    endowmentIdToMultisig[endowmentId] = wallet;
  }

  /*
   * Internal functions
   */
  /// @dev Registers contract in factory registry.
  /// @param instantiation Address of contract instantiation.
  function register(address instantiation) internal {
    isInstantiation[instantiation] = true;
    instantiations[msg.sender].push(instantiation);
    emit ContractInstantiated(msg.sender, instantiation);
  }
}
