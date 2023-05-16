/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAccountsQuery,
  IAccountsQueryInterface,
} from "../../../../../contracts/core/accounts/interface/IAccountsQuery";

const _abi = [
  {
    inputs: [],
    name: "queryConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "version",
            type: "string",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nextAccountId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxGeneralCategoryId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "subDao",
            type: "address",
          },
          {
            internalType: "address",
            name: "gateway",
            type: "address",
          },
          {
            internalType: "address",
            name: "gasReceiver",
            type: "address",
          },
        ],
        internalType: "struct AccountMessages.ConfigResponse",
        name: "config",
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
        name: "curId",
        type: "uint256",
      },
    ],
    name: "queryEndowmentDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256[]",
                name: "sdgs",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "general",
                type: "uint256[]",
              },
            ],
            internalType: "struct AngelCoreStruct.Categories",
            name: "categories",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "tier",
            type: "uint256",
          },
          {
            internalType: "enum AngelCoreStruct.EndowmentType",
            name: "endow_type",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "logo",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "maturityTime",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "locked_vault",
                type: "string[]",
              },
              {
                internalType: "uint256[]",
                name: "lockedPercentage",
                type: "uint256[]",
              },
              {
                internalType: "string[]",
                name: "liquid_vault",
                type: "string[]",
              },
              {
                internalType: "uint256[]",
                name: "liquidPercentage",
                type: "uint256[]",
              },
            ],
            internalType: "struct AngelCoreStruct.AccountStrategies",
            name: "strategies",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "locked",
                type: "string[]",
              },
              {
                internalType: "uint256[]",
                name: "lockedAmount",
                type: "uint256[]",
              },
              {
                internalType: "string[]",
                name: "liquid",
                type: "string[]",
              },
              {
                internalType: "uint256[]",
                name: "liquidAmount",
                type: "uint256[]",
              },
            ],
            internalType: "struct AngelCoreStruct.OneOffVaults",
            name: "oneoffVaults",
            type: "tuple",
          },
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
            name: "rebalance",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "kycDonorsOnly",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "pendingRedemptions",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "proposalLink",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "multisig",
            type: "address",
          },
          {
            internalType: "address",
            name: "dao",
            type: "address",
          },
          {
            internalType: "address",
            name: "daoToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "donationMatchActive",
            type: "bool",
          },
          {
            internalType: "address",
            name: "donationMatchContract",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "allowlistedBeneficiaries",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "allowlistedContributors",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "maturityAllowlist",
            type: "address[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "payoutAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "feePercentage",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            internalType: "struct AngelCoreStruct.EndowmentFee",
            name: "withdrawFee",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "payoutAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "feePercentage",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            internalType: "struct AngelCoreStruct.EndowmentFee",
            name: "depositFee",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "payoutAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "feePercentage",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            internalType: "struct AngelCoreStruct.EndowmentFee",
            name: "balanceFee",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "strategies",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "allowlistedBeneficiaries",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "allowlistedContributors",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "maturityAllowlist",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "maturityTime",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "withdrawFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "depositFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "balanceFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "name",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "image",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "logo",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "categories",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "splitToLiquid",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.Delegate",
                name: "ignoreUserSplits",
                type: "tuple",
              },
            ],
            internalType: "struct AngelCoreStruct.SettingsController",
            name: "settingsController",
            type: "tuple",
          },
          {
            internalType: "uint32",
            name: "parent",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "ignoreUserSplits",
            type: "bool",
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
        ],
        internalType: "struct AccountStorage.Endowment",
        name: "endowment",
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
        name: "curId",
        type: "uint256",
      },
    ],
    name: "queryState",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "locked",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "liquid",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.DonationsReceived",
            name: "donationsReceived",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "closingEndowment",
            type: "bool",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "endowId",
                    type: "uint32",
                  },
                  {
                    internalType: "uint256",
                    name: "fundId",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "addr",
                    type: "address",
                  },
                ],
                internalType: "struct AngelCoreStruct.BeneficiaryData",
                name: "data",
                type: "tuple",
              },
              {
                internalType: "enum AngelCoreStruct.BeneficiaryEnum",
                name: "enumData",
                type: "uint8",
              },
            ],
            internalType: "struct AngelCoreStruct.Beneficiary",
            name: "closingBeneficiary",
            type: "tuple",
          },
        ],
        internalType: "struct AccountMessages.StateResponse",
        name: "stateResponse",
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
        name: "curId",
        type: "uint256",
      },
      {
        internalType: "enum AngelCoreStruct.AccountType",
        name: "curAccountType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "curTokenaddress",
        type: "address",
      },
    ],
    name: "queryTokenAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IAccountsQuery__factory {
  static readonly abi = _abi;
  static createInterface(): IAccountsQueryInterface {
    return new utils.Interface(_abi) as IAccountsQueryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAccountsQuery {
    return new Contract(address, _abi, signerOrProvider) as IAccountsQuery;
  }
}
