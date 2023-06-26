// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;
import {RegistrarStorage} from "../storage.sol";
import {RegistrarMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {ILocalRegistrar} from "./ILocalRegistrar.sol";
import {IAccountsVaultFacet} from "../../accounts/interfaces/IAccountsVaultFacet.sol";

interface IRegistrar is ILocalRegistrar {
  function updateConfig(RegistrarMessages.UpdateConfigRequest memory details) external;

  function updateOwner(address newOwner) external;

  function updateTokenPriceFeed(address token, address priceFeed) external;

  function vaultAdd(RegistrarMessages.VaultAddRequest memory details) external;

  function vaultRemove(string memory _stratagyName) external;

  function vaultUpdate(
    string memory _stratagyName,
    bool approved,
    AngelCoreStruct.EndowmentType[] memory restrictedfrom
  ) external;

  function updateNetworkConnections(
    AngelCoreStruct.NetworkInfo memory networkInfo,
    string memory action
  ) external;

  // Query functions for contract

  function queryConfig() external view returns (RegistrarStorage.Config memory);

  function queryTokenPriceFeed(address token) external view returns (address);

  function queryAllStrategies() external view returns (bytes4[] memory allStrategies);

  function queryNetworkConnection(
    uint256 chainId
  ) external view returns (IAccountsVaultFacet.NetworkInfo memory response);

  function owner() external view returns (address);
}
