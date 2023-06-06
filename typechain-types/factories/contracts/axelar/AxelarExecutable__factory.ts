/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  AxelarExecutable,
  AxelarExecutableInterface,
} from "../../../contracts/axelar/AxelarExecutable";

const _abi = [
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NotApprovedByGateway",
    type: "error",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "commandId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "sourceChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceAddress",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "execute",
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
        name: "sourceChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceAddress",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "tokenSymbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "executeWithToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gateway",
    outputs: [
      {
        internalType: "contract IAxelarGateway",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657610427908161001c8239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c908163116191b6146102c2575080631a98b2e0146101945763491606581461004457600080fd5b3461019057826003196080368201126101845767ffffffffffffffff9060243582811161018c5761007890369086016102e9565b6044929192358481116101885761009290369088016102e9565b959092606435958611610184576101009661010f89926100c16100ba60209a369087016102e9565b3691610371565b8981519101209260018060a01b03865460101c16978d519b8c9a8b998a98635f6970c360e01b8a528035908a0152608060248a015260848901916103d0565b928684030160448701526103d0565b90606483015203925af1908115610177578491610149575b501561013b5750610138905161031c565b80f35b9051631403112d60e21b8152fd5b61016a915060203d8111610170575b610162818361034f565b8101906103b8565b38610127565b503d610158565b50505051903d90823e3d90fd5b5080fd5b8580fd5b8380fd5b8280fd5b5034610190578260031960c0368201126101845767ffffffffffffffff9060243582811161018c576101c990369086016102e9565b604492919235848111610188576101e390369088016102e9565b959094606435818111610190576101fd9036908a016102e9565b96909760843592831161018c57610274986020988c97610284610298956102368f9861022c9036908b016102e9565b9690953691610371565b8d81519101209560018060a01b038a5460101c169b519e8f9d8e9c8d9b631876eed960e01b8d528035908d015260c060248d015260c48c01916103d0565b91848a84030160448b01526103d0565b9360648701528584030160848601526103d0565b60a43560a483015203925af190811561017757849161014957501561013b5750610138905161031c565b849034610184578160031936011261018457905460101c6001600160a01b03168152602090f35b9181601f840112156103175782359167ffffffffffffffff8311610317576020838186019501011161031757565b600080fd5b610100810190811067ffffffffffffffff82111761033957604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761033957604052565b92919267ffffffffffffffff8211610339576040519161039b601f8201601f19166020018461034f565b829481845281830111610317578281602093846000960137010152565b90816020910312610317575180151581036103175790565b908060209392818452848401376000828201840152601f01601f191601019056fea26469706673582212201218e69c7881791988a7b2f67b338cfb3aa2b99edcb4001238b3482753e0fe0f64736f6c63430008120033";

type AxelarExecutableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AxelarExecutableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AxelarExecutable__factory extends ContractFactory {
  constructor(...args: AxelarExecutableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AxelarExecutable> {
    return super.deploy(overrides || {}) as Promise<AxelarExecutable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AxelarExecutable {
    return super.attach(address) as AxelarExecutable;
  }
  override connect(signer: Signer): AxelarExecutable__factory {
    return super.connect(signer) as AxelarExecutable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AxelarExecutableInterface {
    return new utils.Interface(_abi) as AxelarExecutableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AxelarExecutable {
    return new Contract(address, _abi, signerOrProvider) as AxelarExecutable;
  }
}
