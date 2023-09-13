// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IEndowmentMultiSigFactory {
  /*
   *  Events
   */
  event ContractInstantiated(address sender, address instantiation);
  event ImplementationUpdated(address implementationAddress);
  event ProxyAdminUpdated(address admin);

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

  function endowmentIdToMultisig(uint256 endowmentId) external returns (address);
}
