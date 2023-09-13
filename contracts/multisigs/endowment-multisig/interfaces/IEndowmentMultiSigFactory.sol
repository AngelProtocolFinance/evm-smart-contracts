// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IEndowmentMultiSigFactory {
  /*
   *  Events
   */
  event ContractInstantiated(address sender, address instantiation);
  event Initialized(address implementation, address proxyAdmin, address registrar);
  event ImplementationUpdated(address implementationAddress);
  event ProxyAdminUpdated(address admin);
  event RegistrarUpdated(address registrar);

  /*
   * Errors
   */
  error InvalidAddress(string param);
  error OnlyAccountsContract();

  function create(
    uint256 endowmentId,
    address emitterAddress,
    address[] memory owners,
    uint256 required,
    uint256 transactionExpiry
  ) external returns (address);

  function updateImplementation(address implementationAddress) external;

  function updateProxyAdmin(address proxyAdminAddress) external;

  function updateRegistrar(address registrarAddress) external;

  function getInstantiationCount(address creator) external view returns (uint256);

  function getRegistrarAddress() external view returns (address);
}
