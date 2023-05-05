/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  LockedWithdraw,
  LockedWithdrawInterface,
} from "../../../../contracts/normalized_endowment/locked-withdraw/LockedWithdraw";

const _abi = [
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
        indexed: false,
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "LockedWithdrawAPTeam",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "curBeneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "curTokenaddress",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "curAmount",
        type: "uint256[]",
      },
    ],
    name: "LockedWithdrawApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "LockedWithdrawEndowment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "curBeneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "curTokenaddress",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "curAmount",
        type: "uint256[]",
      },
    ],
    name: "LockedWithdrawInitiated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
    ],
    name: "LockedWithdrawRejected",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curRegistrar",
        type: "address",
      },
      {
        internalType: "address",
        name: "curAccounts",
        type: "address",
      },
      {
        internalType: "address",
        name: "curApteammultisig",
        type: "address",
      },
      {
        internalType: "address",
        name: "curEndowfactory",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "curBeneficiary",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "curTokenaddress",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "curAmount",
        type: "uint256[]",
      },
    ],
    name: "propose",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "accountId",
        type: "uint256",
      },
    ],
    name: "reject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        internalType: "address",
        name: "curRegistrar",
        type: "address",
      },
      {
        internalType: "address",
        name: "curAccounts",
        type: "address",
      },
      {
        internalType: "address",
        name: "curApteammultisig",
        type: "address",
      },
      {
        internalType: "address",
        name: "curEndowfactory",
        type: "address",
      },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001b576001600655610d8690816100218239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c90816301ffc9a714610a445750806378b6f3981461098757806396a0756014610575578063b759f9541461024b578063b8adaa11146101b85763f8c8765e1461006157600080fd5b346101b35761006f36610a7a565b600554600881901c60ff161594939085806101a6575b801561018f575b156101335760ff19811660011760055585610121575b5060018060a01b0392838092816001600160601b0360a01b97168760005416176000551685600154161760015516836002541617600255169060035416176003556100e957005b61ff0019600554166005557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a1005b61ffff191661010117600555386100a2565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b15801561008c5750600160ff82161461008c565b50600160ff821610610085565b600080fd5b346101b35760203660031901126101b3576004356101d4610b56565b6101e960018060a01b03600254163314610b1b565b806000526004602052610208600160ff60406000205416151514610be0565b807fcb7f2c434a113f944d05b33c5f1c8c39794bfe8d28f239a4e6a634d491e291af600080a26000908152600460205260409020805460ff191690556001600655005b346101b3576020806003193601126101b357600435610268610b56565b6002546001600160a01b0392906102829084163314610b1b565b81600052600481526001916102a28360ff60406000205416151514610be0565b604080518281523360208201527f5f9402e0640a2eb0ab8ae108e4c182d1b965800fbe4ecdfc8797ffb0cf49f1d29190a180600052600482526040600020817f1d00cdddfe0003fb41878c3adc917cc399149e0b62d56b712a4f80d2ed27b06d61033683546040519182916040835260028b610323604086018d8b01610c1b565b928584038c87015260081c169701610c61565b0390a36040519361034685610ac5565b8385528236818701378084541661035c86610c9e565b526040519461036a86610ac5565b848652833681880137600061037e87610c9e565b526040519561038c87610ac5565b85875260005b858110610566575090859661040a9392856000526004875260406000209380855460081c16946040519687916313ad564f60e11b8b8401526024978a8985015260006044850152606484015260a0608484015260026103f78d60c48601908401610c1b565b8481036023190160a48601529101610c61565b039561041e601f1997888101835282610ae1565b61042784610c9e565b5261043183610c9e565b506040519361043f85610ac5565b601d85527f63616c6c20726576657274656420776974686f7574206d6573736167650000008986015260009a5b61048d575b600088815260048a5260409020805460ff1916905560068a9055005b809998979699518b101561055c576000808c846104aa8286610cc1565b51166104c16104b98389610cc1565b519289610cc1565b51918c83519301915af1853d1561055057503d67ffffffffffffffff811161053b578b61050c9288926104fe8d60405194601f8401160184610ae1565b82523d60008d84013e610cd5565b506000198b146105265788809a9b99979899019a9661046c565b85634e487b7160e01b60005260116004526000fd5b87634e487b7160e01b60005260416004526000fd5b61050c91606090610cd5565b8697989950610471565b60608882018701528501610392565b346101b35760803660031901126101b3576024356001600160a01b03811681036101b35760443567ffffffffffffffff81116101b357366023820112156101b3578060040135916105c583610b03565b916105d36040519384610ae1565b83835260208301906024829560051b820101903682116101b357602401915b818310610967575050506064359267ffffffffffffffff84116101b357366023850112156101b35783600401359361062985610b03565b906106376040519283610ae1565b858252602082016024819760051b830101913683116101b357602401905b82821061095757505050610667610b56565b6003546040516337854c1360e21b8152600480359082015290602090829060249082906000906001600160a01b03165af1801561094b57600090610907575b6106bb91506001600160a01b03163314610b1b565b6040516080810181811067ffffffffffffffff8211176108d457604052600181526020810160018060a01b0385168152604082018681528360608401526004356000526004602052604060002091835115159060ff845491610100600160a81b03905160081b169216906affffffffffffffffffffff60a81b16171782555180519067ffffffffffffffff82116108d457600160401b82116108d4576020600184019161076d84845481865585610bac565b0190600052602060002060005b8381106108ea57505050506002606091019101519081519167ffffffffffffffff83116108d457600160401b83116108d4576020906107be84845481865585610bac565b0190600052602060002060005b8381106108c05750505050604051936040850190604086525180915260608501929060005b8181106108a15750505060209084830382860152519182815201939060005b81811061088b575050506001600160a01b0316913391600435917fdc2392a60c788a4900c84778e03ad7f725858ff5cadfe421002be204be50db2c919081900390a46040805160043581523360208201527f4c4609254522027db8ab56c0975580084420874f5852525bbf5c109475d4dc929190a16001600655005b825186526020958601959092019160010161080f565b82516001600160a01b03168552602094850194909201916001016107f0565b6001906020845194019381840155016107cb565b634e487b7160e01b600052604160045260246000fd5b82516001600160a01b03168183015560209092019160010161077a565b506020813d602011610943575b8161092160209383610ae1565b810103126101b357516001600160a01b03811681036101b3576106bb906106a6565b3d9150610914565b6040513d6000823e3d90fd5b8135815260209182019101610655565b82356001600160a01b03811681036101b3578152602092830192016105f2565b346101b35761099536610a7a565b919261099f610b56565b6002549160018060a01b0380958180946109bc3383891614610b1b565b1680610a2b575b501680610a12575b501690816109fd575b505016806109e4575b6001600655005b6001600160601b0360a01b6003541617600355806109dd565b6001600160a01b0319161760025582806109d4565b6001600160601b0360a01b6001541617600155856109cb565b6001600160601b0360a01b6000541617600055876109c3565b346101b35760203660031901126101b3576004359063ffffffff60e01b82168092036101b3576020916301ffc9a760e01b148152f35b60809060031901126101b3576001600160a01b039060043582811681036101b3579160243581811681036101b3579160443582811681036101b3579160643590811681036101b35790565b6040810190811067ffffffffffffffff8211176108d457604052565b90601f8019910116810190811067ffffffffffffffff8211176108d457604052565b67ffffffffffffffff81116108d45760051b60200190565b15610b2257565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b600260065414610b67576002600655565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b9091828110610bba57505050565b60009182526020822092830192015b828110610bd557505050565b818155600101610bc9565b15610be757565b60405162461bcd60e51b815260206004820152600c60248201526b50656e64696e672054786e7360a01b6044820152606490fd5b90815480825260208092019260005281600020916000905b828210610c41575050505090565b83546001600160a01b031685529384019360019384019390910190610c33565b90815480825260208092019260005281600020916000905b828210610c87575050505090565b835485529384019360019384019390910190610c79565b805115610cab5760200190565b634e487b7160e01b600052603260045260246000fd5b8051821015610cab5760209160051b010190565b90919015610ce1575090565b815115610cf15750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b828510610d37575050604492506000838284010152601f80199101168101030190fd5b8481018201518686016044015293810193859350610d1456fea2646970667358221220c9433da7c915d6f030cddec4fccc209d53201d25c8585ed81851728c8b72a7b264736f6c63430008120033";

type LockedWithdrawConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LockedWithdrawConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LockedWithdraw__factory extends ContractFactory {
  constructor(...args: LockedWithdrawConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LockedWithdraw> {
    return super.deploy(overrides || {}) as Promise<LockedWithdraw>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LockedWithdraw {
    return super.attach(address) as LockedWithdraw;
  }
  override connect(signer: Signer): LockedWithdraw__factory {
    return super.connect(signer) as LockedWithdraw__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LockedWithdrawInterface {
    return new utils.Interface(_abi) as LockedWithdrawInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LockedWithdraw {
    return new Contract(address, _abi, signerOrProvider) as LockedWithdraw;
  }
}
