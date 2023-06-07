/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  IAccountsQuery,
  IAccountsQueryInterface,
} from "../../../../../contracts/core/accounts/interfaces/IAccountsQuery";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

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
            name: "earlyLockedWithdrawFee",
            type: "tuple",
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
        name: "id",
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
            name: "endowType",
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
                name: "bps",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.FeeSetting",
            name: "earlyLockedWithdrawFee",
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
                name: "bps",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.FeeSetting",
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
                name: "bps",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.FeeSetting",
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
                name: "bps",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.FeeSetting",
            name: "balanceFee",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "acceptedTokens",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "lockedInvestmentManagement",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "liquidInvestmentManagement",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "allowlistedBeneficiaries",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "allowlistedContributors",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "maturityAllowlist",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "maturityTime",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "earlyLockedWithdrawFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "withdrawFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "depositFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "balanceFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "name",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "image",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "logo",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "categories",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
                name: "splitToLiquid",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "locked",
                    type: "bool",
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
                    name: "delegate",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.SettingsPermission",
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
          {
            internalType: "uint256",
            name: "referralId",
            type: "uint256",
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
        name: "id",
        type: "uint256",
      },
    ],
    name: "queryState",
    outputs: [
      {
        components: [
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
        name: "id",
        type: "uint256",
      },
      {
        internalType: "enum AngelCoreStruct.AccountType",
        name: "accountType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "tokenaddress",
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
