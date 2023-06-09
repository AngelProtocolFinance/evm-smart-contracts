/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  LocalRegistrar,
  LocalRegistrarInterface,
} from "../../../../contracts/core/registrar/LocalRegistrar";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
    inputs: [],
    name: "getAPGoldfinchParams",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "allowedSlippage",
                type: "uint256",
              },
            ],
            internalType: "struct APGoldfinchConfigLib.CRVParams",
            name: "crvParams",
            type: "tuple",
          },
        ],
        internalType: "struct APGoldfinchConfigLib.APGoldfinchConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
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
    inputs: [],
    name: "initialize",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "allowedSlippage",
                type: "uint256",
              },
            ],
            internalType: "struct APGoldfinchConfigLib.CRVParams",
            name: "crvParams",
            type: "tuple",
          },
        ],
        internalType: "struct APGoldfinchConfigLib.APGoldfinchConfig",
        name: "_apGoldfinch",
        type: "tuple",
      },
    ],
    name: "setAPGoldfinchParams",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_lockAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_liqAddr",
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
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100c1576000549060ff8260081c1661006f575060ff80821610610034575b60405161176090816100c78239f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610025565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe6040608081526004908136101561001557600080fd5b600091823560e01c80630560bd96146113115780630dcfe5fa1461129d57806327e57db9146111f7578063296b5cc8146110455780632e36091414610ef65780633cc5579b14610e8f57806342b8c5e914610dab5780634349597a14610d075780634df988ae14610cb9578063513e2aea14610bd45780636f2da65714610b3f578063715018a614610ae257806372b1df2914610aa95780638129fc1c1461087d5780638da5cb5b14610854578063a360fab1146107e1578063afd44bcc1461077f578063b6c54a5d14610714578063b8efa48e1461067d578063bb392002146105f3578063c1492439146103fe578063e5bde029146102aa578063edbcc599146101bd5763f2fde38b1461012957600080fd5b346101b95760203660031901126101b95761014261136d565b9161014b61144e565b6001600160a01b038316156101675783610164846114a6565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b5050346102a657816003193601126102a65760c09160a082516101df816115b9565b828152826020820152828482015282606082015282608082015201528051610206816115b9565b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028545460ff8116151592838352602083019263ffffffff938492838560081c16825283818401818760281c16815281606086019460ff8960481c16151586528160a06080890198828c60501c168a52019960701c16895284519a8b52511660208a0152511690870152511515606086015251166080840152511660a0820152f35b5080fd5b5091346103fb57602092836003193601126102a657803567ffffffffffffffff81116101b9576102e7916102e091369101611420565b36916115f7565b83815191012081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028578352818120908383518093839080546103288161163e565b808552916001918083169081156103d8575060011461039b575b50505061035592509593929503826115d5565b82519382859384528251928382860152825b84811061038557505050828201840152601f01601f19168101030190f35b8181018301518882018801528795508201610367565b86528486209492508591905b8183106103c05750889450508201016103553880610342565b855488840185015294850194879450918301916103a7565b9250505061035594925060ff191682840152151560051b82010186923880610342565b80fd5b509190346102a657806003193601126102a65767ffffffffffffffff83358181116105ef576104309036908601611420565b6024929192358281116105eb5761044a9036908801611420565b93909261045561144e565b6104603684846115f7565b9788516020809a012088527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285789528688209186116105d857506104a3815461163e565b601f8111610595575b5086601f861160011461053057879850948096979581959691610525575b508460011b906000198660031b1c19161790555b81865192839283378101878152039020935192839283378101848152039020907fbe341763477f316002d91bd656ce6600451213c169ee5883903f4f60426ff6df8380a380f35b9050850135386104ca565b81885288882090601f198716895b81811061057e57508798999a509680969710610564575b5050600184811b0190556104de565b860135600019600387901b60f8161c191690553880610555565b91928b60018192868b01358155019401920161053e565b818852888820601f870160051c8101918a88106105ce575b601f0160051c01905b8181106105c357506104ac565b8881556001016105b6565b90915081906105ad565b634e487b7160e01b885260419052602487fd5b8580fd5b8380fd5b50346101b957816003193601126101b95761060c6113b4565b602435918210156105ef577fc29dfab8aee1ae5a857c884f518353e5f8a0d8e0649c8708f6b21bc92f4209ca9161067960209261064761144e565b63ffffffff60e01b169485875260008051602061170b8339815191528452610671838289206116f2565b5180926113cb565ba280f35b8284346103fb57806003193601126103fb576020825161069c81611581565b828152015280516106ac81611581565b60018060a01b03807fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028555416918281526020827fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285654169101908152835192835251166020820152f35b50346101b95760203660031901126101b9573560068110156101b9578192602061074c935161074281611581565b82815201526116ba565b815161075781611581565b81546001600160a01b0316808252600190920154602091820190815283519283525190820152f35b5050346102a65760203660031901126102a6576020906107d96107a061136d565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a6020526040902090565b549051908152f35b5050346102a6573660031901126103fb576101646107fd61136d565b610843610808611411565b6001600160a01b0390921660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285c6020526040902090565b9060ff801983541691151516179055565b5050346102a657816003193601126102a65760335490516001600160a01b039091168152602090f35b50346101b957826003193601126101b957825460ff8160081c161591828093610a9c575b8015610a85575b15610a2b575060ff198116600117845581610a1a575b506108e160ff845460081c166108d3816114ef565b6108dc816114ef565b6114ef565b6108ea336114a6565b8254906108fc60ff8360081c166114ef565b606460a0845161090b816115b9565b868152604b602082015260148682015286606082015286608082015201527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028546e640000000000000000140000004b006001600160901b0319825416179055836020845161097781611581565b82815201526bffffffffffffffffffffffff60a01b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028558181541690557fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028569081541690556109e2578280f35b61ff001916825551600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a138808280f35b61ffff1916610101178355386108be565b608490602085519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152fd5b50303b1580156108a85750600160ff8316146108a8565b50600160ff8316106108a1565b8382346102a65760203660031901126102a657357f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb5580f35b83346103fb57806003193601126103fb57610afb61144e565b603380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5050346102a657806003193601126102a6577f0fc88453320e48dee70566020e32b04f9c148fdf565be3b7d7d9c2838a06d7336020610b7c61136d565b60243593610b8861144e565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a60205260409020859055519384526001600160a01b031692a280f35b50346101b957816003193601126101b957610bed61144e565b356001600160a01b0381811692918390036105ef576bffffffffffffffffffffffff60a01b927fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302855908482541617905560243592818416809403610cb5577f9348367471abbad89a2ce1dba9d07a45451e375d9691426d8314644e6e1e7aae937fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028569182541617905581519080610ca061136d565b168252610cab61139e565b166020820152a180f35b8480fd5b5050346102a65760203660031901126102a657610d0560ff8260209463ffffffff60e01b610ce56113b4565b16815260008051602061170b8339815191528652205416915180926113cb565bf35b5050346102a657806003193601126102a6577f1527477b814a609b77a3a52f49fae682370acb615a0212d9e5229186cd66e94d6020610d4461136d565b610d4c611411565b93610d5561144e565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285960205260409020610d97908690610843565b5193151584526001600160a01b031692a280f35b5050346102a657602090816003193601126101b95780610e84610d059260a095610dd36113b4565b8251610dde8161159d565b8281528351610dec81611581565b83815283898201528882015283805191610e0583611581565b84835289830185905201526001600160e01b031916815260008051602061170b83398151915286522082519490610e3b8661159d565b610e4960ff82541687611678565b610e7a610e6a6002610e5d60018501611684565b93858a0194855201611684565b94808801958652518097516113cb565b51908501906113ee565b5160608301906113ee565b5050346102a65760203660031901126102a65760209060ff610eeb610eb261136d565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285c6020526040902090565b541690519015158152f35b50346101b95760c03660031901126101b957610f1061144e565b358015158091036101b9577fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302854908154926024359263ffffffff9081851680860361104157604435938385169182860361103d57606435938415158095036110395760843595808716968781036110355760a435918216988983036110315768ffffffff000000000060c09c64ffffffff007f9ba2671e8e8451ccaa99b5ba3b232e5a1b174450f12aa494675d0941fa4c17f99f60ff8f9763ffffffff60701b9060701b169716906001600160901b031916179160081b16179160281b161769ff0000000000000000008860481b16179063ffffffff60501b9060501b1617179055815196875260208701528501526060840152608083015260a0820152a180f35b8d80fd5b8c80fd5b8a80fd5b8980fd5b8780fd5b50346101b95760803660031901126101b95761105f6113b4565b61106761139e565b61106f611388565b9360643590848210156111f35761108461144e565b80519561109087611581565b87875260018060a01b038094169560209487868a01528351926110b284611581565b60018452169788868401528351966110c98861159d565b6110d38689611678565b86880191825284880193845263ffffffff60e01b1696878b5260008051602061170b8339815191528752848b209051838110156111e05761111490826116f2565b60018101915191825160028110156111cd57918189949360029354610100600160a81b03968796015160ff6affffffffffffffffffffff60a81b97889260081b1693169116171790550193519182519360028510156111ba575091879695939160ff86947ffa06e62a5e92c6354ccefe5daec331c8025e54e73ab99084cc91cb5dca242f2a9a6111b6985494015160081b1693169116171790555180926113cb565ba480f35b634e487b7160e01b8d526021905260248cfd5b634e487b7160e01b8d526021855260248dfd5b634e487b7160e01b8c526021845260248cfd5b8680fd5b50346101b95760603660031901126101b957359060068210156101b9577f5183e16e36d1058722dbfe016c1819682a2726b21ff09705c29ebb96a8dcdc959160609160243590611245611388565b91815161125181611581565b6001600160a01b0393841680825260208201838152909460019190611275886116ba565b935184546001600160a01b03191691161783555191015581519384526020840152820152a180f35b5050346102a657816003193601126102a65760209181516112bd8161154f565b8251916112c98361154f565b8252528051906112d88261154f565b805180926112e58261154f565b7f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb548252525190518152f35b5050346102a65760203660031901126102a65760209060ff610eeb61133461136d565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028596020526040902090565b600435906001600160a01b038216820361138357565b600080fd5b604435906001600160a01b038216820361138357565b602435906001600160a01b038216820361138357565b600435906001600160e01b03198216820361138357565b9060048210156113d85752565b634e487b7160e01b600052602160045260246000fd5b80519060028210156113d8579082526020908101516001600160a01b0316910152565b60243590811515820361138357565b9181601f840112156113835782359167ffffffffffffffff8311611383576020838186019501011161138357565b6033546001600160a01b0316330361146257565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b156114f657565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b6020810190811067ffffffffffffffff82111761156b57604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761156b57604052565b6060810190811067ffffffffffffffff82111761156b57604052565b60c0810190811067ffffffffffffffff82111761156b57604052565b90601f8019910116810190811067ffffffffffffffff82111761156b57604052565b92919267ffffffffffffffff821161156b5760405191611621601f8201601f1916602001846115d5565b829481845281830111611383578281602093846000960137010152565b90600182811c9216801561166e575b602083101461165857565b634e487b7160e01b600052602260045260246000fd5b91607f169161164d565b60048210156113d85752565b9060405161169181611581565b80925460ff81169060028210156113d85790825260081c6001600160a01b031660209190910152565b60068110156113d8576000527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285b602052604060002090565b9060048110156113d85760ff8019835416911617905556fedebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302858a2646970667358221220c93e61ae432c106d1f937af59594c7d842948cdca782cfd3cf0310736dd0157864736f6c63430008120033";

type LocalRegistrarConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LocalRegistrarConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LocalRegistrar__factory extends ContractFactory {
  constructor(...args: LocalRegistrarConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LocalRegistrar> {
    return super.deploy(overrides || {}) as Promise<LocalRegistrar>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LocalRegistrar {
    return super.attach(address) as LocalRegistrar;
  }
  override connect(signer: Signer): LocalRegistrar__factory {
    return super.connect(signer) as LocalRegistrar__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LocalRegistrarInterface {
    return new utils.Interface(_abi) as LocalRegistrarInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LocalRegistrar {
    return new Contract(address, _abi, signerOrProvider) as LocalRegistrar;
  }
}
