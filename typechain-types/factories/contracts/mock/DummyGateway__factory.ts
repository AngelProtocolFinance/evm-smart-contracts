/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DummyGateway,
  DummyGatewayInterface,
} from "../../../contracts/mock/DummyGateway";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "BurnFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "ExceedMintLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAuthModule",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidChainId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCodeHash",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCommands",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSetMintLimitsParams",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenDeployer",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "MintFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotProxy",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSelf",
    type: "error",
  },
  {
    inputs: [],
    name: "SetupFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "TokenAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenContractDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "TokenDeployFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "TokenDoesNotExist",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationContractAddress",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "payloadHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "ContractCall",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceChain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceAddress",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "payloadHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "sourceTxHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sourceEventIndex",
        type: "uint256",
      },
    ],
    name: "ContractCallApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceChain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceAddress",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "payloadHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "sourceTxHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sourceEventIndex",
        type: "uint256",
      },
    ],
    name: "ContractCallApprovedWithMint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationContractAddress",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "payloadHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ContractCallWithToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
    ],
    name: "Executed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "newOperatorsData",
        type: "bytes",
      },
    ],
    name: "OperatorshipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddresses",
        type: "address",
      },
    ],
    name: "TokenDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "TokenMintLimitUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "destinationAddress",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "adminEpoch",
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
    inputs: [
      {
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "adminThreshold",
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
    inputs: [
      {
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "admins",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allTokensFrozen",
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
    name: "authModule",
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
    inputs: [
      {
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "contractAddress",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "callContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "contractAddress",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "callContractWithToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
    ],
    name: "isCommandExecuted",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isContractCallAndMintApproved",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "isContractCallApproved",
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
    inputs: [
      {
        internalType: "string",
        name: "destinationChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "destinationAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "setTestTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "symbols",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "limits",
        type: "uint256[]",
      },
    ],
    name: "setTokenMintLimits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "setup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "tokenAddresses",
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
    name: "tokenDeployer",
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
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "tokenFrozen",
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
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "tokenMintAmount",
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
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "tokenMintLimit",
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
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "newImplementationCodeHash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "setupParams",
        type: "bytes",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "validateContractCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validateContractCallAndMint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657610811908161001c8239f35b600080fdfe608060408181526004918236101561001657600080fd5b600090813560e01c90816309c5eabe1461031957816314bfd6d01461053b575080631876eed9146104d05780631c92115f1461049e578063269eb65e146101ba57806326ef699d1461043b5780632a2dae0a146103e4578063364940d8146102c45780635c60da1b146103e45780635f6970c3146103e957806364940c56146103e457806367ace8eb1461039b5780637b1b769e1461038057806388b305871461019e578063935b13f6146103545780639543fe141461031e5780639ded06df14610319578063a3499c73146102df578063aa1e1f0a146102c4578063b54170841461023b578063bc00c216146101bf578063cec7b359146101ba578063d26ff2101461019e5763f6a5f9f51461012c57600080fd5b346101975760a0366003190112610197576001600160401b039060243582811161019a5761015d9036908601610595565b5050604435918211610197575060209261017d61018e9236908301610595565b505061018761071c565b50356107c9565b90519015158152f35b80fd5b5080fd5b50903461019a57602036600319011261019a5751908152602090f35b6106a0565b50346101975760e0366003190112610197576001600160401b039060243582811161019a576101f19036908601610595565b505060443582811161019a5761020a9036908601610595565b505061021461071c565b5060a435918211610197575060209261023361018e9236908301610595565b5050356107c9565b50823461019a5760a036600319011261019a576001600160401b039080358281116102c05761026d9036908301610595565b50506024358281116102c0576102869036908301610595565b50506044358281116102c05761029f9036908301610595565b50506064359182116102bc576102b791369101610595565b505080f35b8280fd5b8380fd5b50903461019a578160031936011261019a5751908152602090f35b50823461019a57606036600319011261019a576102fa610706565b50604435906001600160401b0382116102bc576102b791369101610595565b6105c7565b5034610197576020366003190112610197576001600160a01b03610340610706565b82546001600160a01b031916911617815580f35b50903461019a5760209061036f61036a36610630565b610732565b90516001600160a01b039091168152f35b50903461019a579060209161039436610630565b5051908152f35b509190346102bc5736600319011261019a576001600160401b039080358281116102c0576103cc90369083016106d6565b50506024359182116102bc576102b7913691016106d6565b6106ba565b5034610197576080366003190112610197576001600160401b039060243582811161019a5761041b9036908601610595565b5050604435918211610197575060209261023361018e9236908301610595565b50823461019a57608036600319011261019a576001600160401b039080358281116102c05761046d9036908301610595565b50506024358281116102c0576104869036908301610595565b50506044359182116102bc576102b791369101610595565b50823461019a57606036600319011261019a576001600160401b039080358281116102c05761046d9036908301610595565b50346101975760c0366003190112610197576001600160401b039060243582811161019a576105029036908601610595565b505060443582811161019a5761051b9036908601610595565b5050608435918211610197575060209261023361018e9236908301610595565b82843461019a576020806003193601126102bc57808452606051848201819052849392840192608092905b82811061057557505050500390f35b83516001600160a01b031685528695509381019392810192600101610566565b9181601f840112156105c2578235916001600160401b0383116105c257602083818601950101116105c257565b600080fd5b346105c25760203660031901126105c2576004356001600160401b0381116105c2576105f7903690600401610595565b005b90601f801991011681019081106001600160401b0382111761061a57604052565b634e487b7160e01b600052604160045260246000fd5b60206003198201126105c2576001600160401b036004358181116105c257826023820112156105c257806004013591821161061a576040519261067d601f8401601f1916602001856105f9565b828452602483830101116105c25781600092602460209301838601378301015290565b346105c2576106ae36610630565b50602060405160008152f35b346105c25760003660031901126105c257602060405160008152f35b9181601f840112156105c2578235916001600160401b0383116105c2576020808501948460051b0101116105c257565b600435906001600160a01b03821682036105c257565b606435906001600160a01b03821682036105c257565b604051908181519160005b8381106107b25750508061076092602092016000838201520380845201826105f9565b602081519101206040516020810190635553444360e01b825260048152604081018181106001600160401b0382111761061a57604052519020036107ad576000546001600160a01b031690565b600090565b60208282018101518683018201528593500161073d565b637472756560e01b036107ad5760019056fea26469706673582212204ad62af77ee86030ea9e773f3c29ddec1d4d87a6ee26a70978195f103f4569af64736f6c63430008120033";

type DummyGatewayConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyGatewayConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyGateway__factory extends ContractFactory {
  constructor(...args: DummyGatewayConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DummyGateway> {
    return super.deploy(overrides || {}) as Promise<DummyGateway>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DummyGateway {
    return super.attach(address) as DummyGateway;
  }
  override connect(signer: Signer): DummyGateway__factory {
    return super.connect(signer) as DummyGateway__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyGatewayInterface {
    return new utils.Interface(_abi) as DummyGatewayInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyGateway {
    return new Contract(address, _abi, signerOrProvider) as DummyGateway;
  }
}
