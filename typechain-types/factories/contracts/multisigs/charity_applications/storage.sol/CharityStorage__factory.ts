/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  CharityStorage,
  CharityStorageInterface,
} from "../../../../../contracts/multisigs/charity_applications/storage.sol/CharityStorage";

const _abi = [
  {
    inputs: [],
    name: "config",
    outputs: [
      {
        internalType: "uint256",
        name: "proposalExpiry",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "applicationMultisig",
        type: "address",
      },
      {
        internalType: "address",
        name: "accountsContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "seedSplitToLiquid",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "newEndowGasMoney",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "gasAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "fundSeedAsset",
        type: "bool",
      },
      {
        internalType: "address",
        name: "seedAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "seedAssetAmount",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                name: "endowmentController",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                name: "strategies",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                name: "profile",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                name: "earningsFee",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
                    components: [
                      {
                        internalType: "address",
                        name: "Addr",
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
            internalType: "uint256",
            name: "parent",
            type: "uint256",
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
        name: "charityApplication",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "meta",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "enum CharityApplicationsStorage.Status",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100165761106b908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063013cf08b146100b2576379502c551461003257600080fd5b346100ad5760003660031901126100ad5761012060015460018060a01b03806002541690806003541660045460ff600554166006549160075493600854966040519889526020890152604088015260608701521515608086015260a085015260ff8116151560c085015260081c1660e0830152610100820152f35b600080fd5b346100ad5760203660031901126100ad5760043560009081526020819052604090208054600182015490916001600160a01b03919091169061048060405260028101546001600160a01b03811660805260a090811c60ff1615159052600381015460c052600481015460e05261012a60058201610d80565b6101005260405161013a81610d26565b61014660068301610e51565b815261015460078301610e51565b602082015261012052600881015461014052600981015460ff1661017781610ea0565b61016052610187600a8201610d80565b61018052610197600b8201610d80565b6101a0526101a7600c8201610eaa565b6101c052600d81015460ff1615156101e052600e810154610200526040516101ce81610d26565b60ff600f830154166101df81610ea0565b81526040516101ed81610d26565b601083015481526011830154602082015260208201526101a06080015261021660128201610eaa565b6102405261022660138201610eaa565b6102605260148101546102805260158101546102a05260168101546102c05261025160178201610f02565b6102e052610261601a8201610f02565b61030052610271601d8201610f02565b6103205261028160208201610f02565b6103405260405167ffffffffffffffff610100820190811190821117610d1057610100810160405260238201548152602482015460208201526025820154604082015260268201546060820152602782015460808201526001600160801b0360288301541660a0820152602982015460c082015260405161030181610d26565b60ff602a8401541661031281610f38565b81526040518061016081011067ffffffffffffffff61016083011117610d10576101608101604052602b8401546001600160a01b03168152602c8401546020820152610360602d8501610d80565b6040820152610371602e8501610d80565b606082015260405161038281610d26565b60ff602f8601541661039381610f38565b815260405180608081011067ffffffffffffffff608083011117610d1057608081016040526001600160801b0360308701541681526031860154602082015260328601546001600160801b038116604083015260801c60608201526020820152608082015261040460338501610d80565b60a082015261041560348501610d80565b60c0820152603584015460e08083019190915260368501546001600160a01b031661010083015260378501546101208301526038850154610140830152602083019190915282015261036052603981015460ff16151561038052603a8101546103a05260405167ffffffffffffffff610220820190811190821117610d105761022081016040526104a8603b8301610f42565b81526104b6603d8301610f42565b60208201526104c7603f8301610f42565b60408201526104d860418301610f42565b60608201526104e960438301610f42565b60808201526104fa60458301610f42565b60a082015261050b60478301610f42565b60c082015261051c60498301610f42565b60e082015261052d604b8301610f42565b61010082015261053f604d8301610f42565b610120820152610551604f8301610f42565b61014082015261056360518301610f42565b61016082015261057560538301610f42565b61018082015261058760558301610f42565b6101a082015261059960578301610f42565b6101c08201526105ab60598301610f42565b6101e08201526105bd605b8301610f42565b6102008201526103c052605d8101546103e0526105dc605e8201610eaa565b61040052605f81015460ff161515610420526040516105fa81610d42565b60608201548152606182015460208201526062820154604082015261044052606381015461046052610ce061063160648301610d80565b60ff606660658501549401541693604051958652602086015260c0604086015260018060a01b036080511660c0860152602060800151151560e0860152604060800151610100860152606060800151610120860152610c9b6107c16107ab61075261073c6107266106f36106b88c610a606080800151916109a06101408201520190610f84565b60a060800151908d61016060bf198284030191015260206106e28351604084526040840190610fc4565b920151906020818403910152610fc4565b610140516101808d01526101605161070a81610ea0565b6101a08d0152610180518c820360bf19016101c08e0152610f84565b6101a0518b820360bf19016101e08d0152610f84565b6101c0518a820360bf19016102008c0152610ff8565b6101e05115156102208a810191909152610200516102408b0152518051602091829161077d81610ea0565b6102608d0152015180516102808c015201516102a08a01526102405189820360bf19016102c08b0152610ff8565b6102605188820360bf19016102e08a0152610ff8565b610280516103008801526102a0516103208801526102c0516103408801526102e05180516001600160a01b031661036089015260208101516103808901526040015115156103a08801526103005180516001600160a01b03166103c089015260208101516103e08901526040015115156104008801526103205180516001600160a01b031661042089015260208101516104408901526040015115156104608801526103405180516001600160a01b031661048089015260208101516104a08901526040015115156104c0880152602060e06102e06080015160bf198a8503016104e08b01528051845282810151838501526040810151604085015260608101516060850152608081015160808501526001600160801b0360a08201511660a085015260c081015160c0850152015161010060e0840152805161090381610f38565b610100840152015190604061012082015260018060a01b0382511661014082015260208201516101608201526103006101406109f16109d961097261095a60408801516101e0610180890152610320880190610f84565b606088015187820361013f19016101a0890152610f84565b6001600160801b036060602060808a0151805161098e81610f38565b6101c08b01520151805183166101e08a015260208101516102008a0152604081015183166102208a015201511661024087015260a087015186820361013f1901610260880152610f84565b60c086015185820361013f1901610280870152610f84565b60e08501516102a08501526101008501516001600160a01b039081166102c08601526101208601516102e0860152919094015191909201526103805115156105008901526103a0516105208901526103c05180515180519092166105408a0152602090910151610560890152610c7b90610200906020818101515180516001600160a01b03166105808d015201516105a08b015260408101515180516001600160a01b03166105c08c0152602001516105e08b015260608101515180516001600160a01b03166106008c0152602001516106208b015260808101515180516001600160a01b03166106408c0152602001516106608b015260a08101515180516001600160a01b03166106808c0152602001516106a08b015260c08101515180516001600160a01b03166106c08c0152602001516106e08b015260e08101515180516001600160a01b03166107008c0152602001516107208b01526101008101515180516001600160a01b03166107408c0152602001516107608b01526101208101515180516001600160a01b03166107808c0152602001516107a08b01526101408101515180516001600160a01b03166107c08c0152602001516107e08b01526101608101515180516001600160a01b03166108008c0152602001516108208b01526101808101515180516001600160a01b03166108408c0152602001516108608b01526101a08101515180516001600160a01b03166108808c0152602001516108a08b01526101c08101515180516001600160a01b03166108c08c0152602001516108e08b01526101e08101515180516001600160a01b03166109008c0152602001516109208b015201515180516001600160a01b03166109408a015260200151610960890152565b6103e0516109808801526104005187820360bf19016109a0890152610ff8565b6104205115156109c08701526104405180516109e08801526020810151610a0088015260400151610a2087015261046051610a40870152858103606087015290610f84565b9060808401526004821015610cfa57829160a08301520390f35b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff821117610d1057604052565b6060810190811067ffffffffffffffff821117610d1057604052565b90601f8019910116810190811067ffffffffffffffff821117610d1057604052565b90604051906000835490600182811c90808416968715610e47575b6020948584108914610e335787988489979899529081600014610e115750600114610dd2575b505050610dd092500383610d5e565b565b600090815285812095935091905b818310610df9575050610dd09350820101388080610dc1565b85548884018501529485019487945091830191610de0565b92505050610dd094925060ff191682840152151560051b820101388080610dc1565b634e487b7160e01b85526022600452602485fd5b91607f1691610d9b565b9060405191828154918282526020928383019160005283600020936000905b828210610e8657505050610dd092500383610d5e565b855484526001958601958895509381019390910190610e70565b60021115610cfa57565b9060405191828154918282526020928383019160005283600020936000905b828210610edf57505050610dd092500383610d5e565b85546001600160a01b031684526001958601958895509381019390910190610ec9565b90604051610f0f81610d42565b82546001600160a01b031681526001830154602082015260029092015460ff1615156040830152565b60031115610cfa57565b90604051602081019080821067ffffffffffffffff831117610d10578160405260018194610f6f84610d26565b818060a01b0381541684520154604082015252565b919082519283825260005b848110610fb0575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610f8f565b90815180825260208080930193019160005b828110610fe4575050505090565b835185529381019392810192600101610fd6565b90815180825260208080930193019160005b828110611018575050505090565b83516001600160a01b03168552938101939281019260010161100a56fea2646970667358221220630c2bdbd488c482f8529d653014b697598a32efa861243ac68866af74227a3b64736f6c63430008120033";

type CharityStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CharityStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CharityStorage__factory extends ContractFactory {
  constructor(...args: CharityStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CharityStorage> {
    return super.deploy(overrides || {}) as Promise<CharityStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): CharityStorage {
    return super.attach(address) as CharityStorage;
  }
  override connect(signer: Signer): CharityStorage__factory {
    return super.connect(signer) as CharityStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CharityStorageInterface {
    return new utils.Interface(_abi) as CharityStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CharityStorage {
    return new Contract(address, _abi, signerOrProvider) as CharityStorage;
  }
}
