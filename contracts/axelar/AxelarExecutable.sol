// SPDX-License-Identifier: MIT
// Modifications by @stevieraykatz to make compatible with OZ Upgradable Proxy

pragma solidity ^0.8.21;

import {IVault} from "../core/vault/interfaces/IVault.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";

abstract contract AxelarExecutable is IAxelarExecutable {
  function execute(
    bytes32 commandId,
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) public virtual override {
    bytes32 payloadHash = keccak256(payload);
    if (!_gateway().validateContractCall(commandId, sourceChain, sourceAddress, payloadHash))
      revert NotApprovedByGateway();
    _execute(sourceChain, sourceAddress, payload);
  }

  function executeWithToken(
    bytes32 commandId,
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) public virtual override {
    bytes32 payloadHash = keccak256(payload);
    if (
      !_gateway().validateContractCallAndMint(
        commandId,
        sourceChain,
        sourceAddress,
        payloadHash,
        tokenSymbol,
        amount
      )
    ) revert NotApprovedByGateway();

    _executeWithToken(sourceChain, sourceAddress, payload, tokenSymbol, amount);
  }

  function _execute(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) internal virtual returns (IVault.VaultActionData memory);

  function _executeWithToken(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) internal virtual returns (IVault.VaultActionData memory);

  function gateway() external view returns (IAxelarGateway) {
    return _gateway();
  }

  function _gateway() internal view virtual returns (IAxelarGateway);
}
