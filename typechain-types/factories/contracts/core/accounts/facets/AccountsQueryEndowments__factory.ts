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
                name: "earlyLockedWithdrawFee",
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
  "0x6080806040523461001657611765908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c90816302d008f214611038575080639969dd1e14610f68578063c99c8f22146103925763e68f909d1461004b57600080fd5b3461038d57600036600319011261038d57600060e060405161006c8161140e565b828152606060208201528260408201528260608201528260808201528260a08201528260c0820152015260018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4454167ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d46547ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d475460018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d48541660018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4954169160018060a01b037ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4a541693604051956101918761140e565b865260405160007ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d45548060011c906001811615610383575b60208210600182161461036d578184526001811690811561034957506001146102c6575b50906102018163ffffffff94930382611447565b602088015260018060a01b038116604088015260a01c166060860152608085015260a084015260c083015260e082015260405180916020825260018060a01b0381511660208301526020810151610266610100918260408601526101208501906111c7565b9160018060a01b03604082015116606085015260608101516080850152608081015160a085015260018060a01b0360a08201511660c085015260018060a01b0360c08201511660e085015260e060018060a01b0391015116908301520390f35b929190507ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d456000527fc190d2043ebd5011149152baff4574e2454c51ab29dfd2caee58657602b14bc8926000905b80821061032d57509192509081016020016102016101ed565b9192936001816020925483858801015201910190939291610314565b60ff191660208086019190915291151560051b8401909101915061020190506101ed565b634e487b7160e01b600052602260045260246000fd5b90607f16906101c9565b600080fd5b3461038d57602036600319011261038d5763ffffffff6103b06111b4565b60006103c06040516103c1816113b8565b828152606060208201526040516103d78161139c565b60608152606060208201526040820152826060820152826080820152606060a0820152606060c08201528260e082015261040f611469565b61010082015261041d611469565b61012082015260405161042f816113d5565b8381528360208201528360408201528360608201528360808201528360a08201526101408201528261016082015282610180820152826101a0820152826101c0820152826101e08201528261020082015282610220820152826102408201526060610260820152606061028082015260606102a08201526104ae61148d565b6102c08201526104bc61148d565b6102e08201526104ca61148d565b6103008201526104d861148d565b6103208201526040516104ea816113f1565b6040516104f68161139c565b848152846020820152815260405161050d8161139c565b84815284602082015260208201526040516105278161139c565b84815284602082015260408201526040516105418161139c565b848152846020820152606082015260405161055b8161139c565b84815284602082015260808201526040516105758161139c565b84815284602082015260a082015260405161058f8161139c565b84815284602082015260c08201526040516105a98161139c565b84815284602082015260e08201526040516105c38161139c565b8481528460208201526101008201526040516105de8161139c565b8481528460208201526101208201526040516105f98161139c565b8481528460208201526101408201526040516106148161139c565b84815284602082015261016082015260405161062f8161139c565b84815284602082015261018082015260405161064a8161139c565b8481528460208201526101a08201526040516106658161139c565b8481528460208201526101c0820152610340820152826103608201528261038082015261069061148d565b6103a08201520152166000527ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d426020526040602081600020604a8351916106d6836113b8565b80546001600160a01b031683526106ef600182016114ac565b8484015284516106fe8161139c565b61070a6002830161157d565b81526107186003830161157d565b85820152858401526004810154606084015260ff60058201541661073b8161123b565b608084015261074c600682016114ac565b60a084015261075d600782016114ac565b60c0840152600881015460e08401526107786009820161162c565b61010084015261078a600d820161162c565b610120840152845161079b816113d5565b63ffffffff601183015460ff811615158352818160081c1687840152818160281c168884015260ff8160481c1615156060840152818160501c16608084015260701c1660a082015261014084015260ff6012820154161515610160840152601381015461018084015260148101546101a084015260018060a01b036015820154166101c084015260018060a01b036016820154166101e084015260ff601782015460018060a01b03811661020086015260a01c16151561022084015260018060a01b036018820154166102408401526108766019820161167a565b610260840152610888601a820161167a565b61028084015261089a601b820161167a565b6102a08401526108ac601c82016116d2565b6102c08401526108be601f82016116d2565b6102e08401526108d0602282016116d2565b6103008401526108e2602582016116d2565b61032084015284516108f3816113f1565b6108ff60288301611708565b815261090d602a8301611708565b8582015261091d602c8301611708565b8682015261092d602e8301611708565b606082015261093e60308301611708565b608082015261094f60328301611708565b60a082015261096060348301611708565b60c082015261097160368301611708565b60e082015261098260388301611708565b610100820152610994603a8301611708565b6101208201526109a6603c8301611708565b6101408201526109b8603e8301611708565b6101608201526109c9868301611708565b6101808201526109db60428301611708565b6101a08201526109ed60448301611708565b6101c082015261034084015260ff604682015463ffffffff8116610360860152851c1615156103808401528451610a238161136a565b604782015481526048820154858201526049820154868201526103a084015201546103c08201526103c0610c71610c59610c41610b51610b39610b16610b00610acd610a948a6109608e519e8f9e8f9381855260018060a01b038151168286015201519201526109808d01906111c7565b60408b0151908c6060601f19828403019101526020610abc8351604084526040840190611207565b920151906020818403910152611207565b60608a015160808c015260808a0151610ae58161123b565b60a08c015260a08a0151601f198c83030160c08d01526111c7565b60c08901518a8203601f190160e08c01526111c7565b60e08801516101008a0152610100880151601f198a8303016101208b01526112a1565b610120870151888203601f19016101408a01526112a1565b63ffffffff60a0610140880151805115156101608b0152826020820151166101808b0152826040820151166101a08b0152606081015115156101c08b0152826080820151166101e08b015201511661020088015261016086015115156102208801526101808601516102408801526101a086015161026088015260018060a01b036101c08701511661028088015260018060a01b036101e0870151166102a088015260018060a01b03610200870151166102c088015261022086015115156102e088015260018060a01b0361024087015116610300880152610260860151601f19888303016103208901526112f8565b610280850151868203601f19016103408801526112f8565b6102a0840151858203601f19016103608701526112f8565b6102c083015180516001600160a01b031661038086015260208101516103a08601526040015115156103c0850152916102e081015180516001600160a01b03166103e0860152602081015161040086015260400151151561042085015261030081015180516001600160a01b0316610440860152602081015161046086015260400151151561048085015261032081015180516001600160a01b03166104a086015260208101516104c08601526040015115156104e0850152610340810151805180516001600160a01b031661050087015260200151610520860152610f19906101c09060208181015180516001600160a01b03166105408a01520151610560880152604081015180516001600160a01b0316610580890152602001516105a0880152606081015180516001600160a01b03166105c0890152602001516105e0880152608081015180516001600160a01b03166106008901526020015161062088015260a081015180516001600160a01b03166106408901526020015161066088015260c081015180516001600160a01b0316610680890152602001516106a088015260e081015180516001600160a01b03166106c0890152602001516106e088015261010081015180516001600160a01b03166107008901526020015161072088015261012081015180516001600160a01b03166107408901526020015161076088015261014081015180516001600160a01b0316610780890152602001516107a088015261016081015180516001600160a01b03166107c0890152602001516107e088015261018081015180516001600160a01b0316610800890152602001516108208801526101a081015180516001600160a01b031661084089015260200151610860880152015180516001600160a01b0316610880870152602001516108a0860152565b63ffffffff610360820151166108c085015261038081015115156108e085015260406103a082015180516109008701526020810151610920870152015161094085015201516109608301520390f35b3461038d57606036600319011261038d57610f816111b4565b60243590600282101561038d576044356001600160a01b038116929083900361038d578215610ffb57610fb38161123b565b610fdb57610fc2600391611335565b019060005260205260206040600020545b604051908152f35b610fe6600591611335565b01906000526020526020604060002054610fd3565b60405162461bcd60e51b8152602060048201526015602482015274496e76616c696420746f6b656e206164647265737360581b6044820152606490fd5b3461038d5760208060031936011261038d576110526111b4565b9161105c8161136a565b6040516110688161139c565b60008152600083820152815260008282015260408051916110888361139c565b61109061148d565b835260008484015201526110a382611335565b916110bd60ff60066110b484611335565b01541691611335565b90604051936110cb8561136a565b6001604051916110da8361139c565b8054835201548482015284528284019015158152604051906110fb8261139c565b604051916111088361136a565b60ff600a63ffffffff9586600782015416865260088101548887015260018060a01b0395866009830154166040820152845201541691600483101561119e5760409286830152828701918252858351975180518952015186880152511515828701525192835190815116606087015284810151608087015201511660a0840152015190600482101561119e5760e09160c0820152f35b634e487b7160e01b600052602160045260246000fd5b6004359063ffffffff8216820361038d57565b919082519283825260005b8481106111f3575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016111d2565b90815180825260208080930193019160005b828110611227575050505090565b835185529381019392810192600101611219565b6002111561119e57565b908082519081815260208091019281808460051b8301019501936000915b8483106112735750505050505090565b9091929394958480611291600193601f198682030187528a516111c7565b9801930193019194939290611263565b6112f59160606112e46112d26112c08551608086526080860190611245565b60208601518582036020870152611207565b60408501518482036040860152611245565b920151906060818403910152611207565b90565b90815180825260208080930193019160005b828110611318575050505090565b83516001600160a01b03168552938101939281019260010161130a565b63ffffffff166000527ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d41602052604060002090565b6060810190811067ffffffffffffffff82111761138657604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761138657604052565b6103e0810190811067ffffffffffffffff82111761138657604052565b60c0810190811067ffffffffffffffff82111761138657604052565b6101e0810190811067ffffffffffffffff82111761138657604052565b610100810190811067ffffffffffffffff82111761138657604052565b6080810190811067ffffffffffffffff82111761138657604052565b90601f8019910116810190811067ffffffffffffffff82111761138657604052565b604051906114768261142b565b606080838181528160208201528160408201520152565b6040519061149a8261136a565b60006040838281528260208201520152565b90604051906000835490600182811c90808416968715611573575b602094858410891461155f578798848997989952908160001461153d57506001146114fe575b5050506114fc92500383611447565b565b600090815285812095935091905b8183106115255750506114fc93508201013880806114ed565b8554888401850152948501948794509183019161150c565b925050506114fc94925060ff191682840152151560051b8201013880806114ed565b634e487b7160e01b85526022600452602485fd5b91607f16916114c7565b9060405191828154918282526020928383019160005283600020936000905b8282106115b2575050506114fc92500383611447565b85548452600195860195889550938101939091019061159c565b90815467ffffffffffffffff8111611386576040519260206115f3818460051b0186611447565b82855260009182528082208186015b848410611610575050505050565b600183819261161e856114ac565b815201920193019290611602565b906040516116398161142b565b60606116756003839561164b816115cc565b85526116596001820161157d565b602086015261166a600282016115cc565b60408601520161157d565b910152565b9060405191828154918282526020928383019160005283600020936000905b8282106116af575050506114fc92500383611447565b85546001600160a01b031684526001958601958895509381019390910190611699565b906040516116df8161136a565b82546001600160a01b031681526001830154602082015260029092015460ff1615156040830152565b906040516117158161139c565b82546001600160a01b03168152600190920154602083015256fea264697066735822122038d14dfec692248ea9f8cc0ff3e9e3198808b3b16f5d0289f7fcca71f8b18e3164736f6c63430008120033";

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
