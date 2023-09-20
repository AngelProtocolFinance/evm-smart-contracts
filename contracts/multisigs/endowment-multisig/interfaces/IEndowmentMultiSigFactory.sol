// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IEndowmentMultiSigFactory {
  /*////////////////////////////////////////////////
                        EVENTS
  */ ///////////////////////////////////////////////
  event ContractInstantiated(address sender, address instantiation);
  event ImplementationUpdated(address implementationAddress);
  event ProxyAdminUpdated(address admin);
  event RegistrarUpdated(address registrar);

  /*////////////////////////////////////////////////
                        ERRORS
  */ ///////////////////////////////////////////////
  error InvalidAddress(string param);
  error OnlyAccountsContract();

  /*////////////////////////////////////////////////
                    EXTERNAL FUNCTIONS
  */ ////////////////////////////////////////////////
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

  /// @notice Get stored registrar address.
  /// @return address of the stored registrar.
  function getRegistrar() external view returns (address);

  /// @notice Get proxy admin address.
  /// @return address of the proxy admin.
  function getProxyAdmin() external view returns (address);
}
