/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  ISwappingV3,
  ISwappingV3Interface,
} from "../../../../../contracts/core/swap-router/interfaces/ISwappingV3";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
    ],
    name: "executeSwaps",
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
