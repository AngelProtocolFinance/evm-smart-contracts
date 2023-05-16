/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IIndexFund,
  IIndexFundInterface,
} from "../../../../../contracts/core/index-fund/Iindex-fund.sol/IIndexFund";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "queryFundDetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256[]",
            name: "members",
            type: "uint256[]",
          },
          {
            internalType: "bool",
            name: "rotatingFund",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "splitToLiquid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiryTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiryHeight",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.IndexFund",
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
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
    ],
    name: "queryInvolvedFunds",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256[]",
            name: "members",
            type: "uint256[]",
          },
          {
            internalType: "bool",
            name: "rotatingFund",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "splitToLiquid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiryTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiryHeight",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.IndexFund[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "member",
        type: "uint256",
      },
    ],
    name: "removeMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IIndexFund__factory {
  static readonly abi = _abi;
  static createInterface(): IIndexFundInterface {
    return new utils.Interface(_abi) as IIndexFundInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IIndexFund {
    return new Contract(address, _abi, signerOrProvider) as IIndexFund;
  }
}
