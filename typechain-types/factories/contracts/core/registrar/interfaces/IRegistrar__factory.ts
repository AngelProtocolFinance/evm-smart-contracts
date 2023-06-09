/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRegistrar,
  IRegistrarInterface,
} from "../../../../../contracts/core/registrar/interfaces/IRegistrar";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "_chainName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "_accountsContractAddress",
        type: "string",
      },
    ],
    name: "AccountsContractStorageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct LocalRegistrarLib.AngelProtocolParams",
        name: "_newAngelProtocolParams",
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
        indexed: false,
        internalType: "enum AngelCoreStruct.FeeTypes",
        name: "_fee",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_payout",
        type: "address",
      },
    ],
    name: "FeeUpdated",
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
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct LocalRegistrarLib.RebalanceParams",
        name: "_newRebalanceParams",
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
        internalType: "enum LocalRegistrarLib.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
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
        internalType: "enum LocalRegistrarLib.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
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
        name: "_tokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isAccepted",
        type: "bool",
      },
    ],
    name: "TokenAcceptanceChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_targetChain",
        type: "string",
      },
    ],
    name: "getAccountsContractAddressByChain",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAngelProtocolParams",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        internalType: "struct LocalRegistrarLib.AngelProtocolParams",
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
        internalType: "enum AngelCoreStruct.FeeTypes",
        name: "_feeType",
        type: "uint8",
      },
    ],
    name: "getFeeSettingsByFeeType",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "payoutAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bps",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.FeeSetting",
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
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        internalType: "struct LocalRegistrarLib.RebalanceParams",
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
    name: "getStrategyApprovalState",
    outputs: [
      {
        internalType: "enum LocalRegistrarLib.StrategyApprovalState",
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
            internalType: "enum LocalRegistrarLib.StrategyApprovalState",
            name: "approvalState",
            type: "uint8",
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
            internalType: "struct LocalRegistrarLib.VaultParams",
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
            internalType: "struct LocalRegistrarLib.VaultParams",
            name: "Liquid",
            type: "tuple",
          },
        ],
        internalType: "struct LocalRegistrarLib.StrategyParams",
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
        name: "_operator",
        type: "address",
      },
    ],
    name: "getVaultOperatorApproved",
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
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "queryAllStrategies",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "allStrategies",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "queryConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "applicationsReview",
            type: "address",
          },
          {
            internalType: "address",
            name: "indexFundContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "accountsContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoGovContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoTokenContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoBondingTokenContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoCw900Contract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoDistributorContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchCharitesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchEmitter",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "max",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "min",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "defaultSplit",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.SplitDetails",
            name: "splitToLiquid",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloTokenLpContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "collectorShare",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "charitySharesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "fundraisingContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapsRouter",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "charityProposal",
            type: "address",
          },
          {
            internalType: "address",
            name: "lockedWithdrawal",
            type: "address",
          },
          {
            internalType: "address",
            name: "proxyAdmin",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "wMaticAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "cw900lvAddress",
            type: "address",
          },
        ],
        internalType: "struct RegistrarStorage.Config",
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
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "queryNetworkConnection",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "axelarGateway",
            type: "address",
          },
          {
            internalType: "string",
            name: "ibcChannel",
            type: "string",
          },
          {
            internalType: "string",
            name: "transferChannel",
            type: "string",
          },
          {
            internalType: "address",
            name: "gasReceiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.NetworkInfo",
        name: "response",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_chainName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_accountsContractAddress",
        type: "string",
      },
    ],
    name: "setAccountsContractAddressByChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        internalType: "struct LocalRegistrarLib.AngelProtocolParams",
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
        internalType: "enum AngelCoreStruct.FeeTypes",
        name: "_feeType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_payout",
        type: "address",
      },
    ],
    name: "setFeeSettingsByFeesType",
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
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        internalType: "struct LocalRegistrarLib.RebalanceParams",
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
        internalType: "enum LocalRegistrarLib.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
      },
    ],
    name: "setStrategyApprovalState",
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
        internalType: "enum LocalRegistrarLib.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isApproved",
        type: "bool",
      },
    ],
    name: "setVaultOperatorApproved",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "testQuery",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
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
            internalType: "address",
            name: "accountsContract",
            type: "address",
          },
          {
            internalType: "string[]",
            name: "approved_charities",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "splitMax",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "splitMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "splitDefault",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collectorShare",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "indexFundContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchCharitesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloTokenLpContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "charitySharesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "fundraisingContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "applicationsReview",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapsRouter",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "charityProposal",
            type: "address",
          },
          {
            internalType: "address",
            name: "lockedWithdrawal",
            type: "address",
          },
          {
            internalType: "address",
            name: "proxyAdmin",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "wMaticAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoGovContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoTokenContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoBondingTokenContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoCw900Contract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoDistributorContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "cw900lvAddress",
            type: "address",
          },
        ],
        internalType: "struct RegistrarMessages.UpdateConfigRequest",
        name: "details",
        type: "tuple",
      },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "axelarGateway",
            type: "address",
          },
          {
            internalType: "string",
            name: "ibcChannel",
            type: "string",
          },
          {
            internalType: "string",
            name: "transferChannel",
            type: "string",
          },
          {
            internalType: "address",
            name: "gasReceiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.NetworkInfo",
        name: "networkInfo",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "action",
        type: "string",
      },
    ],
    name: "updateNetworkConnections",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "updateOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "network",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "stratagyName",
            type: "string",
          },
          {
            internalType: "address",
            name: "inputDenom",
            type: "address",
          },
          {
            internalType: "address",
            name: "yieldToken",
            type: "address",
          },
          {
            internalType: "enum AngelCoreStruct.EndowmentType[]",
            name: "restrictedFrom",
            type: "uint8[]",
          },
          {
            internalType: "enum AngelCoreStruct.AccountType",
            name: "acctType",
            type: "uint8",
          },
          {
            internalType: "enum AngelCoreStruct.VaultType",
            name: "vaultType",
            type: "uint8",
          },
        ],
        internalType: "struct RegistrarMessages.VaultAddRequest",
        name: "details",
        type: "tuple",
      },
    ],
    name: "vaultAdd",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_stratagyName",
        type: "string",
      },
    ],
    name: "vaultRemove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_stratagyName",
        type: "string",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
      {
        internalType: "enum AngelCoreStruct.EndowmentType[]",
        name: "restrictedfrom",
        type: "uint8[]",
      },
    ],
    name: "vaultUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

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
