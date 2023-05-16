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
        name: "chainName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "accountsContractAddress",
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
    stateMutability: "view",
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
  "0x608080604052346100c1576000549060ff8260081c1661006f575060ff80821610610034575b60405161166190816100c78239f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610025565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe6040608081526004908136101561001557600080fd5b600091823560e01c80630560bd96146112825780630dcfe5fa1461120e578063296b5cc81461105b5780632e36091414610f0e57806342b8c5e914610e2a5780634349597a14610d7f5780634df988ae14610d315780636f2da65714610c9c578063715018a614610c3f57806372b1df2914610c065780637d25177614610a8c5780638129fc1c146107e95780638da5cb5b146107c0578063afd44bcc1461075e578063b8efa48e14610651578063bb392002146105c7578063c1492439146103d2578063e5bde0291461027e578063edbcc599146101915763f2fde38b146100fd57600080fd5b3461018d57602036600319011261018d576101166112e9565b9161011f6113a5565b6001600160a01b0383161561013b5783610138846113fd565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b50503461027a578160031936011261027a5760c09160a082516101b3816114b0565b8281528260208201528284820152826060820152826080820152015280516101da816114b0565b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028545460ff8116151592838352602083019263ffffffff938492838560081c16825283818401818760281c16815281606086019460ff8960481c16151586528160a06080890198828c60501c168a52019960701c16895284519a8b52511660208a0152511690870152511515606086015251166080840152511660a0820152f35b5080fd5b5091346103cf576020928360031936011261027a57803567ffffffffffffffff811161018d576102bb916102b491369101611377565b369161150a565b83815191012081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028588352818120908383518093839080546102fc81611551565b808552916001918083169081156103ac575060011461036f575b50505061032992509593929503826114e8565b82519382859384528251928382860152825b84811061035957505050828201840152601f01601f19168101030190f35b818101830151888201880152879550820161033b565b86528486209492508591905b8183106103945750889450508201016103293880610316565b8554888401850152948501948794509183019161037b565b9250505061032994925060ff191682840152151560051b82010186923880610316565b80fd5b5091903461027a578060031936011261027a5767ffffffffffffffff83358181116105c3576104049036908601611377565b6024929192358281116105bf5761041e9036908801611377565b9390926104296113a5565b61043436848461150a565b9788516020809a012088527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285889528688209186116105ac57506104778154611551565b601f8111610569575b5086601f8611600114610504578798509480969795819596916104f9575b508460011b906000198660031b1c19161790555b81865192839283378101878152039020935192839283378101848152039020907fbe341763477f316002d91bd656ce6600451213c169ee5883903f4f60426ff6df8380a380f35b90508501353861049e565b81885288882090601f198716895b81811061055257508798999a509680969710610538575b5050600184811b0190556104b2565b860135600019600387901b60f8161c191690553880610529565b91928b60018192868b013581550194019201610512565b818852888820601f870160051c8101918a88106105a2575b601f0160051c01905b8181106105975750610480565b88815560010161058a565b9091508190610581565b634e487b7160e01b885260419052602487fd5b8580fd5b8380fd5b503461018d578160031936011261018d576105e061131a565b602435918210156105c3577fc29dfab8aee1ae5a857c884f518353e5f8a0d8e0649c8708f6b21bc92f4209ca9161064d60209261061b6113a5565b63ffffffff60e01b169485875260008051602061160c8339815191528452610645838289206115f3565b518092611331565ba280f35b50503461027a578160031936011261027a5760a09160808251610673816114cc565b828152826020820152828482015282606082015201528051610694816114cc565b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302855549063ffffffff808316938483526020830190828560201c16825280840194600180891b03958694858093851c168252827fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302856541694606088019586526080847fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302857541698019788528451998a52511660208901525116908601525116606084015251166080820152f35b50503461027a57602036600319011261027a576020906107b861077f6112e9565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285b6020526040902090565b549051908152f35b50503461027a578160031936011261027a5760335490516001600160a01b039091168152602090f35b503461018d578260031936011261018d5782549060ff8260081c161591828093610a7f575b8015610a68575b15610a0e5760ff1981166001178555826109fd575b5060ff845460081c16156109a65750610842336113fd565b606460a08351610851816114b0565b858152604b602082015260148582015285606082015285608082015201527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028546e640000000000000000140000004b006001600160901b031982541617905582608083516108bd816114cc565b6002815260646020820152828582015282606082015201527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285564640000000263ffffffff60e01b8254161790556bffffffffffffffffffffffff60a01b7fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028568181541690557fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302857908154169055610970575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b608490602084519162461bcd60e51b8352820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152fd5b61ffff19166101011784553861082a565b835162461bcd60e51b8152602081840152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156108155750600160ff821614610815565b50600160ff82161061080e565b503461018d5760a036600319011261018d57610aa66113a5565b359063ffffffff918281168091036105c3577fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302855805490610ae46115cd565b6001600160a01b0392906044358481168103610c02578567ffffffff000000009168010000000000000000600160e01b0390891b169363ffffffff60e01b16179160201b16171790556064358181168091036105bf576bffffffffffffffffffffffff60a01b937fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302856828682541617905560843592808416809403610bfe577f386dbf58efc832f07658bc89d0b1552d3a11a7cc20e3953cf7bd8796ccc1f8969660a096857fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302857918254161790558251958652610bdd6115e0565b166020860152610beb611304565b169084015260608301526080820152a180f35b8780fd5b8880fd5b83823461027a57602036600319011261027a57357f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb5580f35b83346103cf57806003193601126103cf57610c586113a5565b603380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50503461027a578060031936011261027a577f0fc88453320e48dee70566020e32b04f9c148fdf565be3b7d7d9c2838a06d7336020610cd96112e9565b60243593610ce56113a5565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285b60205260409020859055519384526001600160a01b031692a280f35b50503461027a57602036600319011261027a57610d7d60ff8260209463ffffffff60e01b610d5d61131a565b16815260008051602061160c833981519152865220541691518092611331565bf35b50503461027a578060031936011261027a57610d996112e9565b602435918215158093036105c3577f1527477b814a609b77a3a52f49fae682370acb615a0212d9e5229186cd66e94d91602091610dd46113a5565b6001600160a01b03821660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a60205260409020805460ff191660ff8716179055519384526001600160a01b031692a280f35b50503461027a576020908160031936011261018d5780610f03610d7d9260a095610e5261131a565b8251610e5d81611494565b8281528351610e6b81611478565b83815283898201528882015283805191610e8483611478565b84835289830185905201526001600160e01b031916815260008051602061160c83398151915286522082519490610eba86611494565b610ec860ff8254168761158b565b610ef9610ee96002610edc60018501611597565b93858a0194855201611597565b9480880195865251809751611331565b5190850190611354565b516060830190611354565b503461018d5760c036600319011261018d57610f286113a5565b359081151580920361018d577fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df223028549182549164ffffffff00610f676115cd565b60081b16926044359163ffffffff9081841690818503610c0257606435928315158094036110575760843598818a1695868b036110535760a4359a838c1698898d0361104f5768ffffffff000000000060c09c8c947f9ba2671e8e8451ccaa99b5ba3b232e5a1b174450f12aa494675d0941fa4c17f99f60ff9063ffffffff60701b9060701b169616906001600160901b03191617179160281b161769ff0000000000000000008860481b16179063ffffffff60501b9060501b161717905581519687526110336115e0565b1660208701528501526060840152608083015260a0820152a180f35b8d80fd5b8b80fd5b8980fd5b50903461018d57608036600319011261018d5761107661131a565b6001600160a01b0360243581811693908490036105bf57611095611304565b906064359186831015610bfe576110aa6113a5565b8151966110b688611478565b88885260209487868a01528351926110cd84611478565b60018452169788868401528351966110e488611494565b6110ee868961158b565b86880191825284880193845263ffffffff60e01b1696878b5260008051602061160c8339815191528752848b209051838110156111fb5761112f90826115f3565b60018101915191825160028110156111e857918189949360029354610100600160a81b03968796015160ff6affffffffffffffffffffff60a81b97889260081b1693169116171790550193519182519360028510156111d5575091879695939160ff86947ffa06e62a5e92c6354ccefe5daec331c8025e54e73ab99084cc91cb5dca242f2a9a6111d1985494015160081b169316911617179055518092611331565ba480f35b634e487b7160e01b8d526021905260248cfd5b634e487b7160e01b8d526021855260248dfd5b634e487b7160e01b8c526021845260248cfd5b50503461027a578160031936011261027a57602091815161122e81611446565b82519161123a83611446565b82525280519061124982611446565b8051809261125682611446565b7f9adeaf5f56ed44c39532f4e17724750ace61a4efefd70bdb78bd8d52f859eedb548252525190518152f35b50503461027a57602036600319011261027a5760209060ff6112de6112a56112e9565b6001600160a01b031660009081527fdebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df2230285a6020526040902090565b541690519015158152f35b600435906001600160a01b03821682036112ff57565b600080fd5b604435906001600160a01b03821682036112ff57565b600435906001600160e01b0319821682036112ff57565b90600482101561133e5752565b634e487b7160e01b600052602160045260246000fd5b805190600282101561133e579082526020908101516001600160a01b0316910152565b9181601f840112156112ff5782359167ffffffffffffffff83116112ff57602083818601950101116112ff57565b6033546001600160a01b031633036113b957565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b6020810190811067ffffffffffffffff82111761146257604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761146257604052565b6060810190811067ffffffffffffffff82111761146257604052565b60c0810190811067ffffffffffffffff82111761146257604052565b60a0810190811067ffffffffffffffff82111761146257604052565b90601f8019910116810190811067ffffffffffffffff82111761146257604052565b92919267ffffffffffffffff82116114625760405191611534601f8201601f1916602001846114e8565b8294818452818301116112ff578281602093846000960137010152565b90600182811c92168015611581575b602083101461156b57565b634e487b7160e01b600052602260045260246000fd5b91607f1691611560565b600482101561133e5752565b906040516115a481611478565b80925460ff811690600282101561133e5790825260081c6001600160a01b031660209190910152565b60243563ffffffff811681036112ff5790565b6024359063ffffffff821682036112ff57565b90600481101561133e5760ff8019835416911617905556fedebda8d00e660e70f0186e78ec1bf4113321596136d08a9edd0344df22302859a26469706673582212209ffeb6046d73780e7ed2757923cd9ae95e85b118599ca8bdd3cec2d2f77f2ade64736f6c63430008120033";

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
