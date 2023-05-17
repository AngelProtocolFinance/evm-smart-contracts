/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  AccountsQueryEndowments,
  AccountsQueryEndowmentsInterface,
} from "../../../../../contracts/core/accounts/facets/AccountsQueryEndowments";

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
        internalType: "uint32",
        name: "id",
        type: "uint32",
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
        internalType: "uint32",
        name: "id",
        type: "uint32",
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
        internalType: "uint32",
        name: "id",
        type: "uint32",
      },
      {
        internalType: "enum AngelCoreStruct.AccountType",
        name: "accountType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "tokenAddress",
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

const _bytecode =
  "0x60808060405234610016576116ca908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c90816302d008f214610f9d575080639969dd1e14610ecd578063c99c8f22146103925763e68f909d1461004b57600080fd5b3461038d57600036600319011261038d57600060e060405161006c81611373565b828152606060208201528260408201528260608201528260808201528260a08201528260c0820152015260018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4454167ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d46547ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d475460018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d48541660018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4954169160018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4a5416936040519561019187611373565b865260405160007ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d45548060011c906001811615610383575b60208210600182161461036d578184526001811690811561034957506001146102c6575b50906102018163ffffffff949303826113ac565b602088015260018060a01b038116604088015260a01c166060860152608085015260a084015260c083015260e082015260405180916020825260018060a01b03815116602083015260208101516102666101009182604086015261012085019061112c565b9160018060a01b03604082015116606085015260608101516080850152608081015160a085015260018060a01b0360a08201511660c085015260018060a01b0360c08201511660e085015260e060018060a01b0391015116908301520390f35b929190507ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d456000527fc190d2043ebd5011149152baff4574e2454c51ab29dfd2caee58657602b14bc8926000905b80821061032d57509192509081016020016102016101ed565b9192936001816020925483858801015201910190939291610314565b60ff191660208086019190915291151560051b8401909101915061020190506101ed565b634e487b7160e01b600052602260045260246000fd5b90607f16906101c9565b600080fd5b3461038d57602036600319011261038d5763ffffffff6103b0611119565b60006103a06040516103c18161131d565b828152606060208201526040516103d781611301565b60608152606060208201526040820152826060820152826080820152606060a0820152606060c08201528260e082015261040f6113ce565b61010082015261041d6113ce565b61012082015260405161042f8161133a565b8381528360208201528360408201528360608201528360808201528360a08201526101408201528261016082015282610180820152826101a0820152826101c0820152826101e08201528261020082015282610220820152826102408201526060610260820152606061028082015260606102a08201526104ae6113f2565b6102c08201526104bc6113f2565b6102e08201526104ca6113f2565b6103008201526040516104dc81611356565b6040516104e881611301565b84815284602082015281526040516104ff81611301565b848152846020820152602082015260405161051981611301565b848152846020820152604082015260405161053381611301565b848152846020820152606082015260405161054d81611301565b848152846020820152608082015260405161056781611301565b84815284602082015260a082015260405161058181611301565b84815284602082015260c082015260405161059b81611301565b84815284602082015260e08201526040516105b581611301565b8481528460208201526101008201526040516105d081611301565b8481528460208201526101208201526040516105eb81611301565b84815284602082015261014082015260405161060681611301565b84815284602082015261016082015260405161062181611301565b84815284602082015261018082015260405161063c81611301565b8481528460208201526101a082015261032082015282610340820152826103608201526106676113f2565b6103808201520152166000527ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d42602052604060208160002060458351916106ad8361131d565b80546001600160a01b031683526106c660018201611411565b8484015284516106d581611301565b6106e1600283016114e2565b81526106ef600383016114e2565b85820152858401526004810154606084015260ff600582015416610712816111a0565b608084015261072360068201611411565b60a084015261073460078201611411565b60c0840152600881015460e084015261074f60098201611591565b610100840152610761600d8201611591565b61012084015284516107728161133a565b63ffffffff601183015460ff811615158352818160081c1687840152818160281c168884015260ff8160481c1615156060840152818160501c16608084015260701c1660a082015261014084015260ff6012820154161515610160840152601381015461018084015260148101546101a084015260018060a01b036015820154166101c084015260018060a01b036016820154166101e084015260ff601782015460018060a01b03811661020086015260a01c16151561022084015260018060a01b0360188201541661024084015261084d601982016115df565b61026084015261085f601a82016115df565b610280840152610871601b82016115df565b6102a0840152610883601c8201611637565b6102c0840152610895601f8201611637565b6102e08401526108a760228201611637565b61030084015284516108b881611356565b6108c46025830161166d565b81526108d26027830161166d565b858201526108e26029830161166d565b868201526108f2602b830161166d565b6060820152610903602d830161166d565b6080820152610914602f830161166d565b60a08201526109256031830161166d565b60c08201526109366033830161166d565b60e08201526109476035830161166d565b6101008201526109596037830161166d565b61012082015261096b6039830161166d565b61014082015261097d603b830161166d565b61016082015261098f603d830161166d565b6101808201526109a1603f830161166d565b6101a082015261032084015260ff604182015463ffffffff8116610340860152851c16151561036084015284516109d7816112cf565b6042820154815260438201548582015260448201548682015261038084015201546103a08201526103a0610c25610c0d610bf5610b05610aed610aca610ab4610a81610a488a6108c08e519e8f9e8f9381855260018060a01b038151168286015201519201526108e08d019061112c565b60408b0151908c6060601f19828403019101526020610a70835160408452604084019061116c565b92015190602081840391015261116c565b60608a015160808c015260808a0151610a99816111a0565b60a08c015260a08a0151601f198c83030160c08d015261112c565b60c08901518a8203601f190160e08c015261112c565b60e08801516101008a0152610100880151601f198a8303016101208b0152611206565b610120870151888203601f19016101408a0152611206565b63ffffffff60a0610140880151805115156101608b0152826020820151166101808b0152826040820151166101a08b0152606081015115156101c08b0152826080820151166101e08b015201511661020088015261016086015115156102208801526101808601516102408801526101a086015161026088015260018060a01b036101c08701511661028088015260018060a01b036101e0870151166102a088015260018060a01b03610200870151166102c088015261022086015115156102e088015260018060a01b0361024087015116610300880152610260860151601f198883030161032089015261125d565b610280850151868203601f190161034088015261125d565b6102a0840151858203601f190161036087015261125d565b6102c083015180516001600160a01b031661038086015260208101516103a08601526040015115156103c0850152916102e081015180516001600160a01b03166103e0860152602081015161040086015260400151151561042085015261030081015180516001600160a01b03166104408601526020810151610460860152604001511515610480850152610320810151805180516001600160a01b03166104a0870152602001516104c0860152610e7e906101a09060208181015180516001600160a01b03166104e08a01520151610500880152604081015180516001600160a01b031661052089015260200151610540880152606081015180516001600160a01b031661056089015260200151610580880152608081015180516001600160a01b03166105a0890152602001516105c088015260a081015180516001600160a01b03166105e08901526020015161060088015260c081015180516001600160a01b03166106208901526020015161064088015260e081015180516001600160a01b03166106608901526020015161068088015261010081015180516001600160a01b03166106a0890152602001516106c088015261012081015180516001600160a01b03166106e08901526020015161070088015261014081015180516001600160a01b03166107208901526020015161074088015261016081015180516001600160a01b03166107608901526020015161078088015261018081015180516001600160a01b03166107a0890152602001516107c0880152015180516001600160a01b03166107e087015260200151610800860152565b63ffffffff61034082015116610820850152610360810151151561084085015260406103808201518051610860870152602081015161088087015201516108a085015201516108c08301520390f35b3461038d57606036600319011261038d57610ee6611119565b60243590600282101561038d576044356001600160a01b038116929083900361038d578215610f6057610f18816111a0565b610f4057610f2760039161129a565b019060005260205260206040600020545b604051908152f35b610f4b60059161129a565b01906000526020526020604060002054610f38565b60405162461bcd60e51b8152602060048201526015602482015274496e76616c696420746f6b656e206164647265737360581b6044820152606490fd5b3461038d5760208060031936011261038d57610fb7611119565b91610fc1816112cf565b604051610fcd81611301565b6000815260008382015281526000828201526040805191610fed83611301565b610ff56113f2565b835260008484015201526110088261129a565b9161102260ff60066110198461129a565b0154169161129a565b9060405193611030856112cf565b60016040519161103f83611301565b80548352015484820152845282840190151581526040519061106082611301565b6040519161106d836112cf565b60ff600a63ffffffff9586600782015416865260088101548887015260018060a01b039586600983015416604082015284520154169160048310156111035760409286830152828701918252858351975180518952015186880152511515828701525192835190815116606087015284810151608087015201511660a084015201519060048210156111035760e09160c0820152f35b634e487b7160e01b600052602160045260246000fd5b6004359063ffffffff8216820361038d57565b919082519283825260005b848110611158575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201611137565b90815180825260208080930193019160005b82811061118c575050505090565b83518552938101939281019260010161117e565b6002111561110357565b908082519081815260208091019281808460051b8301019501936000915b8483106111d85750505050505090565b90919293949584806111f6600193601f198682030187528a5161112c565b98019301930191949392906111c8565b61125a91606061124961123761122585516080865260808601906111aa565b6020860151858203602087015261116c565b604085015184820360408601526111aa565b92015190606081840391015261116c565b90565b90815180825260208080930193019160005b82811061127d575050505090565b83516001600160a01b03168552938101939281019260010161126f565b63ffffffff166000527ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d41602052604060002090565b6060810190811067ffffffffffffffff8211176112eb57604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff8211176112eb57604052565b6103c0810190811067ffffffffffffffff8211176112eb57604052565b60c0810190811067ffffffffffffffff8211176112eb57604052565b6101c0810190811067ffffffffffffffff8211176112eb57604052565b610100810190811067ffffffffffffffff8211176112eb57604052565b6080810190811067ffffffffffffffff8211176112eb57604052565b90601f8019910116810190811067ffffffffffffffff8211176112eb57604052565b604051906113db82611390565b606080838181528160208201528160408201520152565b604051906113ff826112cf565b60006040838281528260208201520152565b90604051906000835490600182811c908084169687156114d8575b60209485841089146114c457879884899798995290816000146114a25750600114611463575b505050611461925003836113ac565b565b600090815285812095935091905b81831061148a5750506114619350820101388080611452565b85548884018501529485019487945091830191611471565b9250505061146194925060ff191682840152151560051b820101388080611452565b634e487b7160e01b85526022600452602485fd5b91607f169161142c565b9060405191828154918282526020928383019160005283600020936000905b82821061151757505050611461925003836113ac565b855484526001958601958895509381019390910190611501565b90815467ffffffffffffffff81116112eb57604051926020611558818460051b01866113ac565b82855260009182528082208186015b848410611575575050505050565b600183819261158385611411565b815201920193019290611567565b9060405161159e81611390565b60606115da600383956115b081611531565b85526115be600182016114e2565b60208601526115cf60028201611531565b6040860152016114e2565b910152565b9060405191828154918282526020928383019160005283600020936000905b82821061161457505050611461925003836113ac565b85546001600160a01b0316845260019586019588955093810193909101906115fe565b90604051611644816112cf565b82546001600160a01b031681526001830154602082015260029092015460ff1615156040830152565b9060405161167a81611301565b82546001600160a01b03168152600190920154602083015256fea2646970667358221220b6a44bdc76e5ede2020213920ab548e6ced7a01c11647a07c6c6e11f1992bc7f64736f6c63430008120033";

type AccountsQueryEndowmentsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AccountsQueryEndowmentsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AccountsQueryEndowments__factory extends ContractFactory {
  constructor(...args: AccountsQueryEndowmentsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AccountsQueryEndowments> {
    return super.deploy(overrides || {}) as Promise<AccountsQueryEndowments>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AccountsQueryEndowments {
    return super.attach(address) as AccountsQueryEndowments;
  }
  override connect(signer: Signer): AccountsQueryEndowments__factory {
    return super.connect(signer) as AccountsQueryEndowments__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AccountsQueryEndowmentsInterface {
    return new utils.Interface(_abi) as AccountsQueryEndowmentsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AccountsQueryEndowments {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as AccountsQueryEndowments;
  }
}
