// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ProxyContract} from "../../core/proxy.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";

// >> THIS CONTRACT CAN BE MERGED WITH `MultiSigWalletFactory`
contract Factory {
  /*
   *  Events
   */
  event ContractInstantiated(address sender, address instantiation);

  /*
   *  Storage
   */
  mapping(address => bool) public isInstantiation;
  mapping(address => address[]) public instantiations;
  mapping(uint256 => address) public endowmentIdToMultisig;

  /*
   * Public functions
   */
  /// @dev Returns number of instantiations by creator.
  /// @param creator Contract creator.
  /// @return Returns number of instantiations by creator.
  function getInstantiationCount(address creator) public view returns (uint256) {
    return instantiations[creator].length;
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

/// @title Multisignature wallet factory - Allows creation of multisigs wallet.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigWalletFactory is Factory, Ownable {
  address IMPLEMENTATION_ADDRESS;
  address PROXY_ADMIN;

  event ImplementationUpdated(address oldImplementation, address newImplementation);
  event ProxyAdminUpdated(address oldAdmin, address newAdmin);

  constructor(address implementationAddress, address proxyAdmin) {
    require(implementationAddress != address(0), "Invalid Address");
    require(proxyAdmin != address(0), "Invalid Address");
    IMPLEMENTATION_ADDRESS = implementationAddress;
    PROXY_ADMIN = proxyAdmin;
  }

  /**
   * @dev Updates the implementation address
   * @param implementationAddress The address of the new implementation
   */
  function updateImplementation(address implementationAddress) public onlyOwner {
    address oldAddress = IMPLEMENTATION_ADDRESS;
    IMPLEMENTATION_ADDRESS = implementationAddress;
    emit ImplementationUpdated(oldAddress, implementationAddress);
  }

  /**
   * @dev Updates the proxy admin address
   * @param proxyAdmin The address of the new proxy admin
   */
  function updateProxyAdmin(address proxyAdmin) public onlyOwner {
    address oldAdmin = PROXY_ADMIN;
    PROXY_ADMIN = proxyAdmin;
    emit ProxyAdminUpdated(oldAdmin, proxyAdmin);
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
  ) public returns (address wallet) {
    bytes memory EndowmentData = abi.encodeWithSignature(
      "initialize(uint256,address,address[],uint256,bool,uint256)",
      endowmentId,
      emitterAddress,
      owners,
      required,
      false,
      transactionExpiry
    );
    wallet = address(new ProxyContract(IMPLEMENTATION_ADDRESS, PROXY_ADMIN, EndowmentData));

    // >> A BETTER PLACE TO CALL THIS MIGHT BE INSIDE `EndowmentMultiSig > initialize` FUNCTION
    IEndowmentMultiSigEmitter(emitterAddress).createMultisig(
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
}
