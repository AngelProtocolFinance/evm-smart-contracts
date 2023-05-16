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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
    ],
    name: "LockedWithdrawRejected",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
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
  "0x6080806040523461001b576001600655610c3990816100218239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c90816301ffc9a7146109375750806378b6f3981461087a578063a6ad90e1146104ac578063bbe21ca51461040e578063f8c8765e146102bc5763fe0f4ff41461006157600080fd5b346102b7576020806003193601126102b75761007b6109b8565b90610084610a40565b6002546001600160a01b039061009d9082163314610a05565b7f6929f36b27810d5ef047fe5439a6ee2ca4a72d458e4e42855022aeaeec2e15e561010463ffffffff85169485600052600485526100e7600160ff60406000205416151514610aca565b6040805163ffffffff909216825233602083015290918291820190565b0390a18260005260048252827fc7f39f03fff1cd9c7712c09a41c0304443f512a53a97648cd43d92f3245db5e161016360406000206040519182916040835260026101556040850160018401610b05565b918483038a86015201610b4b565b0390a2600154169180600052600482526040600020604051806101d385820193632d4d963360e11b8552856024840152600060448401526000606484015285608484015260c060a484015260026101c060e4850160018401610b05565b8481036023190160c48601529101610b4b565b03946101e7601f19968781018452836109cb565b60405191604083019167ffffffffffffffff94848410868511176102905760008094938194604052601d87527f63616c6c20726576657274656420776974686f7574206d6573736167650000008a88015251925af1943d156102a6573d92831161029057600495610274936102668760405194601f84011601846109cb565b82523d60008784013e610b88565b5060005252604060002060ff1981541690556001600655600080f35b634e487b7160e01b600052604160045260246000fd5b506102749150600494606090610b88565b600080fd5b346102b7576102ca3661096d565b600554600881901c60ff16159493908580610401575b80156103ea575b1561038e5760ff1981166001176005558561037c575b5060018060a01b0392838092816001600160601b0360a01b971687600054161760005516856001541617600155168360025416176002551690600354161760035561034457005b61ff0019600554166005557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a1005b61ffff191661010117600555856102fd565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156102e75750600160ff8216146102e7565b50600160ff8216106102e0565b346102b75760203660031901126102b75763ffffffff61042c6109b8565b610434610a40565b61044960018060a01b03600254163314610a05565b16806000526004602052610469600160ff60406000205416151514610aca565b807f2bb7c53fe69127dc40ace40e6a4441c876e0533df019218e0ce71db63726c689600080a26000908152600460205260409020805460ff191690556001600655005b346102b75760603660031901126102b7576104c56109b8565b60243567ffffffffffffffff81116102b757366023820112156102b75780600401356104f0816109ed565b916104fe60405193846109cb565b81835260208301906024829360051b820101903682116102b757602401915b81831061085a575050506044359067ffffffffffffffff82116102b757366023830112156102b757816004013591610554836109ed565b9061056260405192836109cb565b838252602082016024819560051b830101913683116102b757602401905b82821061084a57505050610592610a40565b6003546040516337854c1360e21b815263ffffffff8716600482015290602090829060249082906000906001600160a01b03165af1801561083e576000906107fa575b6105ea91506001600160a01b03163314610a05565b6040516060810181811067ffffffffffffffff82111761029057604052600181526020810185815282604083015263ffffffff871660005260046020526040600020908251151560ff801984541691161782555180519067ffffffffffffffff821161029057600160401b8211610290576020600184019161067184845481865585610a96565b0190600052602060002060005b8381106107dd57505050506002604091019101519081519167ffffffffffffffff831161029057600160401b8311610290576020906106c284845481865585610a96565b0190600052602060002060005b8381106107c95750505050604051936040850190604086525180915260608501929060005b8181106107aa5750505060209084830382860152519182815201919060005b818110610794577f32f56d18bfc579f56d1a177d015ec6da38adaed2c651941eda2cb1be4f675cc261078a873363ffffffff82167f237eb2ec3129d73995499732f1816798140e2ecd718d95fdb70b08281fcf19be8a8a038ba36040805163ffffffff909216825233602083015290918291820190565b0390a16001600655005b8251845260209384019390920191600101610713565b82516001600160a01b03168552602094850194909201916001016106f4565b6001906020845194019381840155016106cf565b82516001600160a01b03168183015560209092019160010161067e565b506020813d602011610836575b81610814602093836109cb565b810103126102b757516001600160a01b03811681036102b7576105ea906105d5565b3d9150610807565b6040513d6000823e3d90fd5b8135815260209182019101610580565b82356001600160a01b03811681036102b75781526020928301920161051d565b346102b7576108883661096d565b9192610892610a40565b6002549160018060a01b0380958180946108af3383891614610a05565b168061091e575b501680610905575b501690816108f0575b505016806108d7575b6001600655005b6001600160601b0360a01b6003541617600355806108d0565b6001600160a01b0319161760025582806108c7565b6001600160601b0360a01b6001541617600155856108be565b6001600160601b0360a01b6000541617600055876108b6565b346102b75760203660031901126102b7576004359063ffffffff60e01b82168092036102b7576020916301ffc9a760e01b148152f35b60809060031901126102b7576001600160a01b039060043582811681036102b7579160243581811681036102b7579160443582811681036102b7579160643590811681036102b75790565b6004359063ffffffff821682036102b757565b90601f8019910116810190811067ffffffffffffffff82111761029057604052565b67ffffffffffffffff81116102905760051b60200190565b15610a0c57565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b600260065414610a51576002600655565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b9091828110610aa457505050565b60009182526020822092830192015b828110610abf57505050565b818155600101610ab3565b15610ad157565b60405162461bcd60e51b815260206004820152600c60248201526b50656e64696e672054786e7360a01b6044820152606490fd5b90815480825260208092019260005281600020916000905b828210610b2b575050505090565b83546001600160a01b031685529384019360019384019390910190610b1d565b90815480825260208092019260005281600020916000905b828210610b71575050505090565b835485529384019360019384019390910190610b63565b90919015610b94575090565b815115610ba45750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b828510610bea575050604492506000838284010152601f80199101168101030190fd5b8481018201518686016044015293810193859350610bc756fea2646970667358221220a6ce8ad703a3087ab1ceda059cf7232231963a2aad0dd8775ff677930a2d26d964736f6c63430008120033";

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
