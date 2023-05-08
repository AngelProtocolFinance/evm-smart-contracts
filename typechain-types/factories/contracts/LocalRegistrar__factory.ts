/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  LocalRegistrar,
  LocalRegistrarInterface,
} from "../../contracts/LocalRegistrar";

const _abi = [
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
        internalType: "struct ILocalRegistrar.AngelProtocolParams",
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
        internalType: "struct ILocalRegistrar.RebalanceParams",
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
        internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
        internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
    name: "angelProtocolParams",
    outputs: [
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "apGoldfinch",
    outputs: [
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
    stateMutability: "view",
    type: "function",
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
        internalType: "struct ILocalRegistrar.AngelProtocolParams",
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
        internalType: "struct ILocalRegistrar.RebalanceParams",
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
        internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
            internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
            internalType: "struct ILocalRegistrar.VaultParams",
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
            internalType: "struct ILocalRegistrar.VaultParams",
            name: "Liquid",
            type: "tuple",
          },
        ],
        internalType: "struct ILocalRegistrar.StrategyParams",
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
    name: "rebalanceParams",
    outputs: [
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
        internalType: "struct ILocalRegistrar.AngelProtocolParams",
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
        internalType: "struct ILocalRegistrar.RebalanceParams",
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
        internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
        internalType: "enum ILocalRegistrar.StrategyApprovalState",
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
  "0x6080806040523461001657611469908161001c8239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c9081630560bd96146110d6575080630dcfe5fa14611081578063296b5cc814610edb5780632e36091414610db257806338f2e95c14610d4f57806342b8c5e914610c785780634349597a14610bfa5780634df988ae14610bb95780636f2da65714610b51578063715018a614610af457806372b1df2914610ada5780637d251776146109c35780638129fc1c1461079d5780638da5cb5b14610774578063afd44bcc1461073c578063b7644fd9146106e6578063b8efa48e14610636578063bb392002146105b9578063c1492439146103e3578063c5ec133a146103b7578063e5bde02914610282578063edbcc599146101b45763f2fde38b1461012057600080fd5b346101b05760203660031901126101b057610139611111565b91610142611291565b6001600160a01b0383161561015e578361015b846112e9565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b50503461027e578160031936011261027e5760c09160a082516101d681611237565b8281528260208201528284820152826060820152826080820152015280516101fd81611237565b60655460ff8116151592838352602083019263ffffffff938492838560081c16825283818401818760281c16815281606086019460ff8960481c16151586528160a06080890198828c60501c168a52019960701c16895284519a8b52511660208a0152511690870152511515606086015251166080840152511660a0820152f35b5080fd5b5091346103b4576020928360031936011261027e57803567ffffffffffffffff81116101b0576102bf916102b89136910161119f565b3691611332565b838151910120815260698352818120908383518093839080546102e181611379565b808552916001918083169081156103915750600114610354575b50505061030e925095939295038261126f565b82519382859384528251928382860152825b84811061033e57505050828201840152601f01601f19168101030190f35b8181018301518882018801528795508201610320565b86528486209492508591905b81831061037957508894505082010161030e38806102fb565b85548884018501529485019487945091830191610360565b9250505061030e94925060ff191682840152151560051b820101869238806102fb565b80fd5b50503461027e578160031936011261027e5780516020916103d7826111cd565b606d5480925251908152f35b5091903461027e578060031936011261027e5767ffffffffffffffff83358181116105b557610415903690860161119f565b6024929192358281116105b15761042f903690880161119f565b93909261043a611291565b610445368484611332565b9788516020809a012088526069895286882091861161059e57506104698154611379565b601f811161055b575b5086601f86116001146104f6578798509480969795819596916104eb575b508460011b906000198660031b1c19161790555b81865192839283378101878152039020935192839283378101848152039020907fbe341763477f316002d91bd656ce6600451213c169ee5883903f4f60426ff6df8380a380f35b905085013538610490565b81885288882090601f198716895b81811061054457508798999a50968096971061052a575b5050600184811b0190556104a4565b860135600019600387901b60f8161c19169055388061051b565b91928b60018192868b013581550194019201610504565b818852888820601f870160051c8101918a8810610594575b601f0160051c01905b8181106105895750610472565b88815560010161057c565b9091508190610573565b634e487b7160e01b885260419052602487fd5b8580fd5b8380fd5b50346101b057816003193601126101b0576105d2611142565b602435918210156105b5577fc29dfab8aee1ae5a857c884f518353e5f8a0d8e0649c8708f6b21bc92f4209ca9161063260209261060d611291565b63ffffffff60e01b1694858752606a845261062a8382892061141b565b518092611159565ba280f35b50503461027e578160031936011261027e5760a0916080825161065881611253565b82815282602082015282848201528260608201520152805161067981611253565b6066549063ffffffff808316938483526020830190828560201c16825280840194600180891b03958694858093851c168252826067541694606088019586526080846068541698019788528451998a52511660208901525116908601525116606084015251166080820152f35b50503461027e578160031936011261027e5760a09060665490600180841b039081606754169082606854169281519463ffffffff80821687528160201c166020870152821c169084015260608301526080820152f35b50503461027e57602036600319011261027e5760209181906001600160a01b03610764611111565b168152606c845220549051908152f35b50503461027e578160031936011261027e5760335490516001600160a01b039091168152602090f35b50346101b057826003193601126101b05782549060ff8260081c1615918280936109b6575b801561099f575b156109455760ff198116600117855582610934575b5060ff845460081c16156108dd57506107f6336112e9565b606460a0835161080581611237565b858152604b602082015260148582015285606082015285608082015201526e640000000000000000140000004b006001600160901b03196065541617606555826080835161085281611253565b60028152606460208201528285820152826060820152015264640000000263ffffffff60e01b60665416176066556bffffffffffffffffffffffff60a01b8060675416606755606854166068556108a7575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b608490602084519162461bcd60e51b8352820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152fd5b61ffff1916610101178455386107de565b835162461bcd60e51b8152602081840152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156107c95750600160ff8216146107c9565b50600160ff8216106107c2565b50346101b05760a03660031901126101b0576109dd611291565b359063ffffffff918281168091036105b5576066546109fa6113f5565b6001600160a01b0391906044358381168103610ad6578467ffffffff000000009168010000000000000000600160e01b0390881b169363ffffffff60e01b16179160201b1617176066556064358181168091036105b1576bffffffffffffffffffffffff60a01b938185606754161760675560843592808416809403610ad6577f386dbf58efc832f07658bc89d0b1552d3a11a7cc20e3953cf7bd8796ccc1f896968460a09760685416176068558251958652610ab5611408565b166020860152610ac361112c565b169084015260608301526080820152a180f35b8780fd5b83823461027e57602036600319011261027e5735606d5580f35b83346103b457806003193601126103b457610b0d611291565b603380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50503461027e578060031936011261027e577f0fc88453320e48dee70566020e32b04f9c148fdf565be3b7d7d9c2838a06d7336020610b8e611111565b60243590610b9a611291565b6001600160a01b0316808652606c83528486208290559351908152a280f35b50503461027e57602036600319011261027e57610bf860ff8260209463ffffffff60e01b610be5611142565b168152606a865220541691518092611159565bf35b50503461027e578060031936011261027e57610c14611111565b602435908115158092036105b5577f1527477b814a609b77a3a52f49fae682370acb615a0212d9e5229186cd66e94d91602091610c4f611291565b6001600160a01b0316808652606b8352848620805460ff191660ff84161790559351908152a280f35b50503461027e57602090816003193601126101b05780610d44610bf89260a095610ca0611142565b8251610cab8161121b565b8281528351610cb9816111ff565b83815283898201528882015283805191610cd2836111ff565b84835289830185905201526001600160e01b0319168152606a86522082519490610cfb8661121b565b610d0960ff825416876113b3565b610d3a610d2a6002610d1d600185016113bf565b93858a01948552016113bf565b9480880195865251809751611159565b519085019061117c565b51606083019061117c565b50503461027e578160031936011261027e5760c0906065549080519160ff81161515835263ffffffff91828260081c166020850152828260281c169084015260ff8160481c1615156060840152818160501c16608084015260701c1660a0820152f35b50346101b05760c03660031901126101b057610dcc611291565b358015158091036101b0576065549064ffffffff00610de96113f5565b60081b16916044359063ffffffff94858316808403610ad65760643591821515809303610ed7576084359780891694858a03610ed35760a43599828b1697888c03610ecf5768ffffffff000000000060c09b7f9ba2671e8e8451ccaa99b5ba3b232e5a1b174450f12aa494675d0941fa4c17f99d63ffffffff60701b9060701b169460ff8d16906001600160901b03191617179160281b161769ff0000000000000000008760481b16179063ffffffff60501b9060501b1617176065558151968752610eb3611408565b1660208701528501526060840152608083015260a0820152a180f35b8c80fd5b8a80fd5b8880fd5b5090346101b05760803660031901126101b057610ef6611142565b6001600160a01b0360243581811693908490036105b157610f1561112c565b906064359186831015610ad657610f2a611291565b815196610f36886111ff565b88885260209487868a0152835192610f4d846111ff565b6001845216978886840152835196610f648861121b565b610f6e86896113b3565b86880191825284880193845263ffffffff60e01b1696878b52606a8752848b2090518381101561106e57610fa2908261141b565b600181019151918251600281101561105b57918189949360029354610100600160a81b03968796015160ff6affffffffffffffffffffff60a81b97889260081b169316911617179055019351918251936002851015611048575091879695939160ff86947ffa06e62a5e92c6354ccefe5daec331c8025e54e73ab99084cc91cb5dca242f2a9a611044985494015160081b169316911617179055518092611159565ba480f35b634e487b7160e01b8d526021905260248cfd5b634e487b7160e01b8d526021855260248dfd5b634e487b7160e01b8c526021845260248cfd5b50503461027e578160031936011261027e5760209181516110a1816111cd565b8251916110ad836111cd565b8252528051906110bc826111cd565b805180926110c9826111cd565b606d548252525190518152f35b849084346101b05760203660031901126101b05760209260ff91906001600160a01b03611101611111565b168152606b855220541615158152f35b600435906001600160a01b038216820361112757565b600080fd5b604435906001600160a01b038216820361112757565b600435906001600160e01b03198216820361112757565b9060048210156111665752565b634e487b7160e01b600052602160045260246000fd5b8051906002821015611166579082526020908101516001600160a01b0316910152565b9181601f840112156111275782359167ffffffffffffffff8311611127576020838186019501011161112757565b6020810190811067ffffffffffffffff8211176111e957604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff8211176111e957604052565b6060810190811067ffffffffffffffff8211176111e957604052565b60c0810190811067ffffffffffffffff8211176111e957604052565b60a0810190811067ffffffffffffffff8211176111e957604052565b90601f8019910116810190811067ffffffffffffffff8211176111e957604052565b6033546001600160a01b031633036112a557565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b92919267ffffffffffffffff82116111e9576040519161135c601f8201601f19166020018461126f565b829481845281830111611127578281602093846000960137010152565b90600182811c921680156113a9575b602083101461139357565b634e487b7160e01b600052602260045260246000fd5b91607f1691611388565b60048210156111665752565b906040516113cc816111ff565b80925460ff81169060028210156111665790825260081c6001600160a01b031660209190910152565b60243563ffffffff811681036111275790565b6024359063ffffffff8216820361112757565b9060048110156111665760ff8019835416911617905556fea2646970667358221220f0f1c1181a9d34282933b5268e5ba72011ddbb0a234db3cb5b34450690cef97464736f6c63430008120033";

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
