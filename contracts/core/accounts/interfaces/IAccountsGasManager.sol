// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IVault} from "../../vault/interfaces/IVault.sol";

interface IAccountsGasManager {
  error OnlyAccountsContract();
  error OnlyAdmin();
  error Unauthorized();
  error InsufficientFunds();
  error TransferFailed();

  function sweepForClosure(uint32 id, address token) external returns (uint256);

  function sweepForEndowment(
    uint32 id,
    IVault.VaultType vault,
    address token
  ) external returns (uint256 funds);

  function addGas(uint32 id, IVault.VaultType vault, address token, uint256 amount) external;
}
