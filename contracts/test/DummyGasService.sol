// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract DummyGasService is IAxelarGasService {
  event GasPaid(address, string, string, bytes,address, uint256, address);
  event GasPaidWithToken(address, string, string, bytes, string, uint256, address, uint256, address);
  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payGasForContractCall(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    address gasToken,
    uint256 gasFeeAmount,
    address refundAddress
  ) external {
    emit GasPaid(sender, destinationChain, destinationAddress, payload, gasToken, gasFeeAmount, refundAddress);
  }

  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payGasForContractCallWithToken(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    string memory symbol,
    uint256 amount,
    address gasToken,
    uint256 gasFeeAmount,
    address refundAddress
  ) external {
    emit GasPaidWithToken(sender, destinationChain, destinationAddress, payload, symbol, amount, gasToken, gasFeeAmount, refundAddress);
  }

  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payNativeGasForContractCall(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    address refundAddress
  ) external payable {}

  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payNativeGasForContractCallWithToken(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    string calldata symbol,
    uint256 amount,
    address refundAddress
  ) external payable {}

  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payGasForExpressCallWithToken(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    string calldata symbol,
    uint256 amount,
    address gasToken,
    uint256 gasFeeAmount,
    address refundAddress
  ) external {}

  // This is called on the source chain before calling the gateway to execute a remote contract.
  function payNativeGasForExpressCallWithToken(
    address sender,
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes calldata payload,
    string calldata symbol,
    uint256 amount,
    address refundAddress
  ) external payable {}

  function addGas(
    bytes32 txHash,
    uint256 txIndex,
    address gasToken,
    uint256 gasFeeAmount,
    address refundAddress
  ) external {}

  function addNativeGas(bytes32 txHash, uint256 logIndex, address refundAddress) external payable {}

  function addExpressGas(
    bytes32 txHash,
    uint256 txIndex,
    address gasToken,
    uint256 gasFeeAmount,
    address refundAddress
  ) external {}

  function addNativeExpressGas(
    bytes32 txHash,
    uint256 logIndex,
    address refundAddress
  ) external payable {}

  function collectFees(
    address payable receiver,
    address[] calldata tokens,
    uint256[] calldata amounts
  ) external {}

  function refund(address payable receiver, address token, uint256 amount) external {}

  function gasCollector() external view returns (address) {
    return address(this);
  }
}
