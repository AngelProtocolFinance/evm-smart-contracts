/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  IVaultLiquid,
  IVaultLiquidInterface,
} from "../../../contracts/interfaces/IVaultLiquid";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

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
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IRouter.VaultActionStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IRouter.RedemptionResponse",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class IVaultLiquid__factory {
  static readonly abi = _abi;
  static createInterface(): IVaultLiquidInterface {
    return new utils.Interface(_abi) as IVaultLiquidInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IVaultLiquid {
    return new Contract(address, _abi, signerOrProvider) as IVaultLiquid;
  }
}
