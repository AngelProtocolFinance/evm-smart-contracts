/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  APVault_V1,
  APVault_V1Interface,
} from "../../../../contracts/core/vault/APVault_V1";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenDeposited",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtDeposited",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "Harvest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenRedeemed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtRedeemed",
        type: "uint256",
      },
    ],
    name: "Redemption",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
    ],
    name: "getTokenIdByAccountId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultType",
    outputs: [
      {
        internalType: "enum IVault.VaultType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "harvest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "redeem",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
    ],
    name: "redeemAll",
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
] as const;

export class APVault_V1__factory {
  static readonly abi = _abi;
  static createInterface(): APVault_V1Interface {
    return new utils.Interface(_abi) as APVault_V1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): APVault_V1 {
    return new Contract(address, _abi, signerOrProvider) as APVault_V1;
  }
}
