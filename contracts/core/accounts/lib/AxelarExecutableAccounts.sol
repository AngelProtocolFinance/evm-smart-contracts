// SPDX-License-Identifier: MIT
// Modifications by @stevieraykatz to make compatible with OZ Upgradable Proxy
pragma solidity ^0.8.21;

import {IVault} from "../../vault/interfaces/IVault.sol";
import {AccountStorage} from "../storage.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";
import {IAccountsStrategy} from "../interfaces/IAccountsStrategy.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";

abstract contract AxelarExecutableAccounts is IAxelarExecutable {
  function gateway() public view returns (IAxelarGateway) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    IAccountsStrategy.NetworkInfo memory thisNetwork = IRegistrar(state.config.registrarContract)
      .queryNetworkConnection(state.config.networkName);
    return IAxelarGateway(thisNetwork.axelarGateway);
  }

  function execute(
    bytes32 commandId,
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) public virtual override {
    IAxelarGateway _gateway = gateway();
    bytes32 payloadHash = keccak256(payload);
    if (!_gateway.validateContractCall(commandId, sourceChain, sourceAddress, payloadHash))
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
    IAxelarGateway _gateway = gateway();
    if (
      !_gateway.validateContractCallAndMint(
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
  ) internal virtual returns (IVault.VaultActionData memory) {}

  function _executeWithToken(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) internal virtual returns (IVault.VaultActionData memory) {}
}
