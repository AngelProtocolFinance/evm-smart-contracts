/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRegistrar,
  IRegistrarInterface,
} from "../../../contracts/interfaces/IRegistrar";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct IRegistrar.AngelProtocolParams",
        name: "newAngelProtocolParams",
        type: "tuple",
      },
    ],
    name: "AngelProtocolParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_gasFee",
        type: "uint256",
      },
    ],
    name: "GasFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct IRegistrar.RebalanceParams",
        name: "newRebalanceParams",
        type: "tuple",
      },
    ],
    name: "RebalanceParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isApproved",
        type: "bool",
      },
    ],
    name: "StrategyApprovalChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_lockAddr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_liqAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isApproved",
        type: "bool",
      },
    ],
    name: "StrategyParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAccepted",
        type: "bool",
      },
    ],
    name: "TokenAcceptanceChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "getAngelProtocolParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
        ],
        internalType: "struct IRegistrar.AngelProtocolParams",
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
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
    ],
    name: "getGasByToken",
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
    name: "getRebalanceParams",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
        ],
        internalType: "struct IRegistrar.RebalanceParams",
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
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
    ],
    name: "getStrategyParamsById",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isApproved",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "enum IVault.VaultType",
                name: "Type",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "vaultAddr",
                type: "address",
              },
            ],
            internalType: "struct IRegistrar.VaultParams",
            name: "Locked",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "enum IVault.VaultType",
                name: "Type",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "vaultAddr",
                type: "address",
              },
            ],
            internalType: "struct IRegistrar.VaultParams",
            name: "Liquid",
            type: "tuple",
          },
        ],
        internalType: "struct IRegistrar.StrategyParams",
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
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
    ],
    name: "isStrategyApproved",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
    ],
    name: "isTokenAccepted",
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
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
        ],
        internalType: "struct IRegistrar.AngelProtocolParams",
        name: "_angelProtocolParams",
        type: "tuple",
      },
    ],
    name: "setAngelProtocolParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_gasFee",
        type: "uint256",
      },
    ],
    name: "setGasByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
        ],
        internalType: "struct IRegistrar.RebalanceParams",
        name: "_rebalanceParams",
        type: "tuple",
      },
    ],
    name: "setRebalanceParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        internalType: "bool",
        name: "_isApproved",
        type: "bool",
      },
    ],
    name: "setStrategyApproved",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "_liqAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_lockAddr",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isApproved",
        type: "bool",
      },
    ],
    name: "setStrategyParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isAccepted",
        type: "bool",
      },
    ],
    name: "setTokenAccepted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IRegistrar__factory {
  static readonly abi = _abi;
  static createInterface(): IRegistrarInterface {
    return new utils.Interface(_abi) as IRegistrarInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRegistrar {
    return new Contract(address, _abi, signerOrProvider) as IRegistrar;
  }
}
