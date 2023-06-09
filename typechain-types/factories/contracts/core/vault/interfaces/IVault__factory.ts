/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IVault,
  IVaultInterface,
} from "../../../../../contracts/core/vault/interfaces/IVault";

const _abi = [
  {
    inputs: [],
    name: "ApproveFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyBaseToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyNotPaused",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyRouter",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
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
    inputs: [],
    name: "getVaultConfig",
    outputs: [
      {
        components: [
          {
            internalType: "enum IVault.VaultType",
            name: "vaultType",
            type: "uint8",
          },
          {
            internalType: "bytes4",
            name: "strategySelector",
            type: "bytes4",
          },
          {
            internalType: "address",
            name: "strategy",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrar",
            type: "address",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "yieldToken",
            type: "address",
          },
          {
            internalType: "string",
            name: "apTokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "apTokenSymbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
        ],
        internalType: "struct IVault.VaultConfig",
        name: "",
        type: "tuple",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IVault.VaultActionStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IVault.RedemptionResponse",
        name: "",
        type: "tuple",
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
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IVault.VaultActionStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IVault.RedemptionResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "enum IVault.VaultType",
            name: "vaultType",
            type: "uint8",
          },
          {
            internalType: "bytes4",
            name: "strategySelector",
            type: "bytes4",
          },
          {
            internalType: "address",
            name: "strategy",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrar",
            type: "address",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "yieldToken",
            type: "address",
          },
          {
            internalType: "string",
            name: "apTokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "apTokenSymbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
        ],
        internalType: "struct IVault.VaultConfig",
        name: "_newConfig",
        type: "tuple",
      },
    ],
    name: "setVaultConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IVault__factory {
  static readonly abi = _abi;
  static createInterface(): IVaultInterface {
    return new utils.Interface(_abi) as IVaultInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IVault {
    return new Contract(address, _abi, signerOrProvider) as IVault;
  }
}
