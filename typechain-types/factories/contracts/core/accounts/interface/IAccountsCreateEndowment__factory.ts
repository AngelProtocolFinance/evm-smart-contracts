/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAccountsCreateEndowment,
  IAccountsCreateEndowmentInterface,
} from "../../../../../contracts/core/accounts/interface/IAccountsCreateEndowment";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "withdrawBeforeMaturity",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "maturityTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maturityHeight",
            type: "uint256",
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
            internalType: "address[]",
            name: "cw4_members",
            type: "address[]",
          },
          {
            internalType: "bool",
            name: "kycDonorsOnly",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum AngelCoreStruct.DurationEnum",
                name: "enumData",
                type: "uint8",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "height",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "time",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.DurationData",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct AngelCoreStruct.Duration",
            name: "cw3MaxVotingPeriod",
            type: "tuple",
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
            name: "earningsFee",
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
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "threshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "votingPeriod",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "timelockPeriod",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationPeriod",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "proposalDeposit",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "snapshotPeriod",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum AngelCoreStruct.TokenType",
                    name: "token",
                    type: "uint8",
                  },
                  {
                    components: [
                      {
                        internalType: "address",
                        name: "existingCw20Data",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "newCw20InitialSupply",
                        type: "uint256",
                      },
                      {
                        internalType: "string",
                        name: "newCw20Name",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "newCw20Symbol",
                        type: "string",
                      },
                      {
                        components: [
                          {
                            internalType: "enum AngelCoreStruct.CurveTypeEnum",
                            name: "curve_type",
                            type: "uint8",
                          },
                          {
                            components: [
                              {
                                internalType: "uint128",
                                name: "value",
                                type: "uint128",
                              },
                              {
                                internalType: "uint256",
                                name: "scale",
                                type: "uint256",
                              },
                              {
                                internalType: "uint128",
                                name: "slope",
                                type: "uint128",
                              },
                              {
                                internalType: "uint128",
                                name: "power",
                                type: "uint128",
                              },
                            ],
                            internalType:
                              "struct AngelCoreStruct.CurveTypeData",
                            name: "data",
                            type: "tuple",
                          },
                        ],
                        internalType: "struct AngelCoreStruct.CurveType",
                        name: "bondingCurveCurveType",
                        type: "tuple",
                      },
                      {
                        internalType: "string",
                        name: "bondingCurveName",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "bondingCurveSymbol",
                        type: "string",
                      },
                      {
                        internalType: "uint256",
                        name: "bondingCurveDecimals",
                        type: "uint256",
                      },
                      {
                        internalType: "address",
                        name: "bondingCurveReserveDenom",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "bondingCurveReserveDecimals",
                        type: "uint256",
                      },
                      {
                        internalType: "uint256",
                        name: "bondingCurveUnbondingPeriod",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct AngelCoreStruct.DaoTokenData",
                    name: "data",
                    type: "tuple",
                  },
                ],
                internalType: "struct AngelCoreStruct.DaoToken",
                name: "token",
                type: "tuple",
              },
            ],
            internalType: "struct AngelCoreStruct.DaoSetup",
            name: "dao",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "createDao",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "proposalLink",
            type: "uint256",
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
            internalType: "address[]",
            name: "maturityAllowlist",
            type: "address[]",
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
        internalType: "struct AccountMessages.CreateEndowmentRequest",
        name: "curDetails",
        type: "tuple",
      },
    ],
    name: "createEndowment",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IAccountsCreateEndowment__factory {
  static readonly abi = _abi;
  static createInterface(): IAccountsCreateEndowmentInterface {
    return new utils.Interface(_abi) as IAccountsCreateEndowmentInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAccountsCreateEndowment {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IAccountsCreateEndowment;
  }
}
