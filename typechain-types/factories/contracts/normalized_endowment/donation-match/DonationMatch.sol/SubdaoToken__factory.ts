/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  SubdaoToken,
  SubdaoTokenInterface,
} from "../../../../../contracts/normalized_endowment/donation-match/DonationMatch.sol/SubdaoToken";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "accountscontract",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "endowmentid",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "executeDonorMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class SubdaoToken__factory {
  static readonly abi = _abi;
  static createInterface(): SubdaoTokenInterface {
    return new utils.Interface(_abi) as SubdaoTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SubdaoToken {
    return new Contract(address, _abi, signerOrProvider) as SubdaoToken;
  }
}
