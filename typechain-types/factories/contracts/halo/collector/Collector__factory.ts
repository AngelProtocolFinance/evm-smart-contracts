/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../common";
import type {
  Collector,
  CollectorInterface,
} from "../../../../contracts/halo/collector/Collector";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ISwapRouter",
        name: "_swapRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct CollectorStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "CollectedConfigUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct CollectorMessage.InstantiateMsg",
        name: "details",
        type: "tuple",
      },
    ],
    name: "CollecterInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenSwept",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountSwept",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "haloOut",
        type: "uint256",
      },
    ],
    name: "CollectorSweeped",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        internalType: "struct CollectorMessage.InstantiateMsg",
        name: "details",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        internalType: "struct CollectorMessage.ConfigResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRouter",
    outputs: [
      {
        internalType: "contract ISwapRouter",
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
        internalType: "address",
        name: "sweepToken",
        type: "address",
      },
    ],
    name: "sweep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rewardFactor",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "timelockContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "registrarContract",
        type: "address",
      },
    ],
    name: "updateConfig",
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
  "0x60a03461007757601f61071f38819003918201601f19168301916001600160401b0383118484101761007c5780849260209460405283398101031261007757516001600160a01b0381168103610077576006805460ff60a01b1916905560805260405161068c90816100938239608051816102fa0152f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe608060408181526004918236101561001657600080fd5b600090813560e01c90816301681a621461054c575080630c8f855a1461032d578063c31c9c07146102e5578063e68f909d146102215763fb2acc461461005b57600080fd5b3461021e57606036600319011261021e576100746105f8565b61007c61060e565b82546001600160a01b03929190831633036101ec578282161561019a5760646005541161014d57916020956101127f4fae56ac29cdbdb85f5c0dabaf786515fce6350037b67eac1f42a7fe1337062c95936100f060c09660018060a01b03166001600160601b0360a01b6001541617600155565b823560055560018060a01b03166001600160601b0360a01b6003541617600355565b8186519354168352816001541687840152816002541686840152816003541660608401525416608082015260055460a0820152a15160018152f35b845162461bcd60e51b8152602081880152602160248201527f496e76616c69642072657761726420666163746f7220696e70757420676976656044820152603760f91b6064820152608490fd5b845162461bcd60e51b8152602081880152602660248201527f496e76616c69642074696d656c6f636b436f6e747261637420616464726573736044820152651033b4bb32b760d11b6064820152608490fd5b845162461bcd60e51b8152602081880152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b80fd5b509190346102e157826003193601126102e1578260c09360a0835161024581610624565b8281528260208201528285820152826060820152826080820152015260018060a01b038091541692818060015416916005549482808060035416935416948180600254169160a0855161029781610624565b8c8152602081019283528681019485526060810197885260808101998a5201998a5284519a8b52511660208a015251169087015251166060850152511660808301525160a0820152f35b8280fd5b509034610329578160031936011261032957517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b5080fd5b5082346103295760a03660031901126103295782519060a0820182811067ffffffffffffffff8211176105395784526103646105dd565b825261036e6105f8565b6020830190815261037d61060e565b8386019081526001600160a01b03916064359190838316830361053557606086019283526080860194608435865260065460ff8160a01c166104db578686868c8288818f9a998f988260a09b7f20d1afc9939843543e1363769967c3926625e2669cdd6e050e6ecac30a2eee219d8f938a8f8f8f89838f948a806104789661049e9a600183951b9060ff871b191617600655511694519b8c945116975116985116948581519161042c83610624565b338352856020840152820152866060820152886080820152015260a06001600160601b03901b98338a82541617905560018060a01b03166001600160601b0360a01b6001541617600155565b86600254161760025560018060a01b03166001600160601b0360a01b6003541617600355565b838254161790556005558284511690600654161760065581855199511689525116602088015251169085015251166060830152516080820152a180f35b895162461bcd60e51b8152602081840152602e60248201527f436f6e747261637420696e7374616e63652068617320616c726561647920626560448201526d195b881a5b9a5d1a585b1a5e995960921b6064820152608490fd5b8680fd5b634e487b7160e01b845260418252602484fd5b9250503461021e57602036600319011261021e576105686105dd565b5060055415600117156105ca5750602060849262461bcd60e51b8352820152602b60248201527f4e6f2048414c4f20617661696c61626c6520746f20646973747269627574652060448201526a061667465722073776565760ac1b6064820152fd5b634e487b7160e01b815260118352602490fd5b600435906001600160a01b03821682036105f357565b600080fd5b602435906001600160a01b03821682036105f357565b604435906001600160a01b03821682036105f357565b60c0810190811067ffffffffffffffff82111761064057604052565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220217ad71bedfa530c41a77026d36cddfd55cb786b333f8bcf16c3f6923f60e50964736f6c63430008120033";

type CollectorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollectorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Collector__factory extends ContractFactory {
  constructor(...args: CollectorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _swapRouter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Collector> {
    return super.deploy(_swapRouter, overrides || {}) as Promise<Collector>;
  }
  override getDeployTransaction(
    _swapRouter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_swapRouter, overrides || {});
  }
  override attach(address: string): Collector {
    return super.attach(address) as Collector;
  }
  override connect(signer: Signer): Collector__factory {
    return super.connect(signer) as Collector__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollectorInterface {
    return new utils.Interface(_abi) as CollectorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Collector {
    return new Contract(address, _abi, signerOrProvider) as Collector;
  }
}
