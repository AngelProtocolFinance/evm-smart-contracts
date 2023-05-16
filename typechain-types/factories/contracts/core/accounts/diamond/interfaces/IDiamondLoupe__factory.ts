/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IDiamondLoupe,
  IDiamondLoupeInterface,
} from "../../../../../../contracts/core/accounts/diamond/interfaces/IDiamondLoupe";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "curFunctionselector",
        type: "bytes4",
      },
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "curFacetaddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "curFacetaddresses",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curFacet",
        type: "address",
      },
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "curFacetfunctionselectors",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondLoupe.Facet[]",
        name: "curFacets",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IDiamondLoupe__factory {
  static readonly abi = _abi;
  static createInterface(): IDiamondLoupeInterface {
    return new utils.Interface(_abi) as IDiamondLoupeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDiamondLoupe {
    return new Contract(address, _abi, signerOrProvider) as IDiamondLoupe;
  }
}
