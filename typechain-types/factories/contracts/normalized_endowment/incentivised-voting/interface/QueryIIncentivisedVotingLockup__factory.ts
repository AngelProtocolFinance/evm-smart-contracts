/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  QueryIIncentivisedVotingLockup,
  QueryIIncentivisedVotingLockupInterface,
} from "../../../../../contracts/normalized_endowment/incentivised-voting/interface/QueryIIncentivisedVotingLockup";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "blocknumber",
        type: "uint256",
      },
    ],
    name: "balanceOfAt",
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
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "uint256",
        name: "blocknumber",
        type: "uint256",
      },
    ],
    name: "totalSupplyAt",
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
] as const;

export class QueryIIncentivisedVotingLockup__factory {
  static readonly abi = _abi;
  static createInterface(): QueryIIncentivisedVotingLockupInterface {
    return new utils.Interface(_abi) as QueryIIncentivisedVotingLockupInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QueryIIncentivisedVotingLockup {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as QueryIIncentivisedVotingLockup;
  }
}
