/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../common";
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
            name: "feeRate",
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
  "0x608080604052346100c1576000549060ff8260081c1661006f575060ff80821610610034575b60405161167390816100c78239f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610025565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe6040608081526004908136101561001557600080fd5b600091823560e01c80630560bd96146112285780630dcfe5fa146111b457806327e57db91461110e578063296b5cc814610f5c5780632e36091414610e0d57806342b8c5e914610d295780634349597a14610c7e5780634df988ae14610c30578063513e2aea14610b4b5780636f2da65714610ab6578063715018a614610a5957806372b1df2914610a205780638129fc1c146107f45780638da5cb5b146107cb578063afd44bcc14610769578063b6c54a5d146106fe578063b8efa48e14610667578063bb392002146105dd578063c1492439146103e8578063e5bde02914610294578063edbcc599146101a75763f2fde38b1461011357600080fd5b346101a35760203660031901126101a35761012c61128f565b91610135611361565b6001600160a01b03831615610151578361014e846113b9565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b50503461029057816003193601126102905760c09160a082516101c9816114cc565b8281528260208201528284820152826060820152826080820152015280516101f0816114cc565b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028545460ff8116151592838352602083019263ffffffff938492838560081c16825283818401818760281c16815281606086019460ff8960481c16151586528160a06080890198828c60501c168a52019960701c16895284519a8b52511660208a0152511690870152511515606086015251166080840152511660a0820152f35b5080fd5b5091346103e5576020928360031936011261029057803567ffffffffffffffff81116101a3576102d1916102ca91369101611333565b369161150a565b83815191012081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285783528181209083835180938390805461031281611551565b808552916001918083169081156103c25750600114610385575b50505061033f92509593929503826114e8565b82519382859384528251928382860152825b84811061036f57505050828201840152601f01601f19168101030190f35b8181018301518882018801528795508201610351565b86528486209492508591905b8183106103aa57508894505082010161033f388061032c565b85548884018501529485019487945091830191610391565b9250505061033f94925060ff191682840152151560051b8201018692388061032c565b80fd5b5091903461029057806003193601126102905767ffffffffffffffff83358181116105d95761041a9036908601611333565b6024929192358281116105d5576104349036908801611333565b93909261043f611361565b61044a36848461150a565b9788516020809a012088527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285789528688209186116105c2575061048d8154611551565b601f811161057f575b5086601f861160011461051a5787985094809697958195969161050f575b508460011b906000198660031b1c19161790555b81865192839283378101878152039020935192839283378101848152039020907fbe341763477f316002d91bd656ce6600451213c169ee5883903f4f60426ff6df8380a380f35b9050850135386104b4565b81885288882090601f198716895b81811061056857508798999a50968096971061054e575b5050600184811b0190556104c8565b860135600019600387901b60f8161c19169055388061053f565b91928b60018192868b013581550194019201610528565b818852888820601f870160051c8101918a88106105b8575b601f0160051c01905b8181106105ad5750610496565b8881556001016105a0565b9091508190610597565b634e487b7160e01b885260419052602487fd5b8580fd5b8380fd5b50346101a357816003193601126101a3576105f66112d6565b602435918210156105d9577fc29dfab8aee1ae5a857c884f518353e5f8a0d8e0649c8708f6b21bc92f4209ca91610663602092610631611361565b63ffffffff60e01b169485875260008051602061161e833981519152845261065b83828920611605565b5180926112ed565ba280f35b8284346103e557806003193601126103e5576020825161068681611494565b8281520152805161069681611494565b60018060a01b03807fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028555416918281526020827fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285654169101908152835192835251166020820152f35b50346101a35760203660031901126101a3573560068110156101a35781926020610736935161072c81611494565b82815201526115cd565b815161074181611494565b81546001600160a01b0316808252600190920154602091820190815283519283525190820152f35b505034610290576020366003190112610290576020906107c361078a61128f565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a6020526040902090565b549051908152f35b50503461029057816003193601126102905760335490516001600160a01b039091168152602090f35b50346101a357826003193601126101a357825460ff8160081c161591828093610a13575b80156109fc575b156109a2575060ff198116600117845581610991575b5061085860ff845460081c1661084a81611402565b61085381611402565b611402565b610861336113b9565b82549061087360ff8360081c16611402565b606460a08451610882816114cc565b868152604b602082015260148682015286606082015286608082015201527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028546e640000000000000000140000004b006001600160901b031982541617905583602084516108ee81611494565b82815201526bffffffffffffffffffffffff60a01b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028558181541690557fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302856908154169055610959578280f35b61ff001916825551600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a138808280f35b61ffff191661010117835538610835565b608490602085519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152fd5b50303b15801561081f5750600160ff83161461081f565b50600160ff831610610818565b83823461029057602036600319011261029057357f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb5580f35b83346103e557806003193601126103e557610a72611361565b603380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5050346102905780600319360112610290577f0fc88453320e48dee70566020e32b04f9c148fdf565be3b7d7d9c2838a06d7336020610af361128f565b60243593610aff611361565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a60205260409020859055519384526001600160a01b031692a280f35b50346101a357816003193601126101a357610b64611361565b356001600160a01b0381811692918390036105d9576bffffffffffffffffffffffff60a01b927fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302855908482541617905560243592818416809403610c2c577f9348367471abbad89a2ce1dba9d07a45451e375d9691426d8314644e6e1e7aae937fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028569182541617905581519080610c1761128f565b168252610c226112c0565b166020820152a180f35b8480fd5b50503461029057602036600319011261029057610c7c60ff8260209463ffffffff60e01b610c5c6112d6565b16815260008051602061161e8339815191528652205416915180926112ed565bf35b505034610290578060031936011261029057610c9861128f565b602435918215158093036105d9577f1527477b814a609b77a3a52f49fae682370acb615a0212d9e5229186cd66e94d91602091610cd3611361565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285960205260409020805460ff191660ff8716179055519384526001600160a01b031692a280f35b50503461029057602090816003193601126101a35780610e02610c7c9260a095610d516112d6565b8251610d5c816114b0565b8281528351610d6a81611494565b83815283898201528882015283805191610d8383611494565b84835289830185905201526001600160e01b031916815260008051602061161e83398151915286522082519490610db9866114b0565b610dc760ff8254168761158b565b610df8610de86002610ddb60018501611597565b93858a0194855201611597565b94808801958652518097516112ed565b5190850190611310565b516060830190611310565b50346101a35760c03660031901126101a357610e27611361565b358015158091036101a3577fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302854908154926024359263ffffffff90818516808603610f58576044359383851691828603610f545760643593841515809503610f50576084359580871696878103610f4c5760a43591821698898303610f485768ffffffff000000000060c09c64ffffffff007f9ba2671e8e8451ccaa99b5ba3b232e5a1b174450f12aa494675d0941fa4c17f99f60ff8f9763ffffffff60701b9060701b169716906001600160901b031916179160081b16179160281b161769ff0000000000000000008860481b16179063ffffffff60501b9060501b1617179055815196875260208701528501526060840152608083015260a0820152a180f35b8d80fd5b8c80fd5b8a80fd5b8980fd5b8780fd5b50346101a35760803660031901126101a357610f766112d6565b610f7e6112c0565b610f866112aa565b93606435908482101561110a57610f9b611361565b805195610fa787611494565b87875260018060a01b038094169560209487868a0152835192610fc984611494565b6001845216978886840152835196610fe0886114b0565b610fea868961158b565b86880191825284880193845263ffffffff60e01b1696878b5260008051602061161e8339815191528752848b209051838110156110f75761102b9082611605565b60018101915191825160028110156110e457918189949360029354610100600160a81b03968796015160ff6affffffffffffffffffffff60a81b97889260081b1693169116171790550193519182519360028510156110d1575091879695939160ff86947ffa06e62a5e92c6354ccefe5daec331c8025e54e73ab99084cc91cb5dca242f2a9a6110cd985494015160081b1693169116171790555180926112ed565ba480f35b634e487b7160e01b8d526021905260248cfd5b634e487b7160e01b8d526021855260248dfd5b634e487b7160e01b8c526021845260248cfd5b8680fd5b50346101a35760603660031901126101a357359060068210156101a3577f5183e16e36d1058722dbfe016c1819682a2726b21ff09705c29ebb96a8dcdc95916060916024359061115c6112aa565b91815161116881611494565b6001600160a01b039384168082526020820183815290946001919061118c886115cd565b935184546001600160a01b03191691161783555191015581519384526020840152820152a180f35b50503461029057816003193601126102905760209181516111d481611462565b8251916111e083611462565b8252528051906111ef82611462565b805180926111fc82611462565b7f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb548252525190518152f35b5050346102905760203660031901126102905760209060ff61128461124b61128f565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028596020526040902090565b541690519015158152f35b600435906001600160a01b03821682036112a557565b600080fd5b604435906001600160a01b03821682036112a557565b602435906001600160a01b03821682036112a557565b600435906001600160e01b0319821682036112a557565b9060048210156112fa5752565b634e487b7160e01b600052602160045260246000fd5b80519060028210156112fa579082526020908101516001600160a01b0316910152565b9181601f840112156112a55782359167ffffffffffffffff83116112a557602083818601950101116112a557565b6033546001600160a01b0316330361137557565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b1561140957565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b6020810190811067ffffffffffffffff82111761147e57604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761147e57604052565b6060810190811067ffffffffffffffff82111761147e57604052565b60c0810190811067ffffffffffffffff82111761147e57604052565b90601f8019910116810190811067ffffffffffffffff82111761147e57604052565b92919267ffffffffffffffff821161147e5760405191611534601f8201601f1916602001846114e8565b8294818452818301116112a5578281602093846000960137010152565b90600182811c92168015611581575b602083101461156b57565b634e487b7160e01b600052602260045260246000fd5b91607f1691611560565b60048210156112fa5752565b906040516115a481611494565b80925460ff81169060028210156112fa5790825260081c6001600160a01b031660209190910152565b60068110156112fa576000527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285b602052604060002090565b9060048110156112fa5760ff8019835416911617905556fedebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302858a2646970667358221220723d74f6cd1f686e3e7fb7b4b697ea0487977712acb60b28347acd55e533825664736f6c63430008120033";

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
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<LocalRegistrar> {
    return super.deploy(overrides || {}) as Promise<LocalRegistrar>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
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
  static connect(address: string, signerOrProvider: Signer | Provider): LocalRegistrar {
    return new Contract(address, _abi, signerOrProvider) as LocalRegistrar;
  }
}
