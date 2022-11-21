// SPDX-License-Identifier: MIT
// Modifications by @stevieraykatz to make compatible with OZ Upgradable Proxy 

pragma solidity ^0.8.0;

import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AxelarExecutable is IAxelarExecutable, Initializable {
    IAxelarGateway public gateway;

    // We want this to be intializeable by an OZ upgradable pattern so move the constructor logic to _init_ methods 
    // constructor(address gateway_) {
    //     if (gateway_ == address(0)) revert InvalidAddress();

    //     gateway = IAxelarGateway(gateway_);
    // }

    function __AxelarExecutable_init(address gateway_) internal onlyInitializing {
        __AxelarExecutable_init_unchained(gateway_);
    }

    function __AxelarExecutable_init_unchained(address gateway_) internal onlyInitializing {
        if (gateway_ == address(0)) revert InvalidAddress();
        gateway = IAxelarGateway(gateway_);
    }

    function execute(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) external override {
        bytes32 payloadHash = keccak256(payload);
        if (!gateway.validateContractCall(commandId, sourceChain, sourceAddress, payloadHash))
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
    ) external override {
        bytes32 payloadHash = keccak256(payload);
        if (
            !gateway.validateContractCallAndMint(
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
    ) internal virtual {}

    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal virtual {}
}
