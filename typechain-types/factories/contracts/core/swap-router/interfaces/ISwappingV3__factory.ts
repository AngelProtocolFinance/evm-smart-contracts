/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISwappingV3,
  ISwappingV3Interface,
} from "../../../../../contracts/core/swap-router/interfaces/ISwappingV3";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "executeSwapOperations",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "swapEthToAnyToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapEthToToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokena",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountin",
        type: "uint256",
      },
    ],
    name: "swapTokenToUsdc",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ISwappingV3__factory {
  static readonly abi = _abi;
  static createInterface(): ISwappingV3Interface {
    return new utils.Interface(_abi) as ISwappingV3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISwappingV3 {
    return new Contract(address, _abi, signerOrProvider) as ISwappingV3;
  }
}
