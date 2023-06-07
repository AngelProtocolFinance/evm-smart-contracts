/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../../common";
import type {
  Factory,
  FactoryInterface,
} from "../../../../../contracts/normalized_endowment/endowment-multisig/EndowmentMultiSigFactory.sol/Factory";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "instantiation",
        type: "address",
      },
    ],
    name: "ContractInstantiation",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "endowmentIdToMultisig",
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
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "getInstantiationCount",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "instantiations",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isInstantiation",
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
] as const;

const _bytecode =
  "0x608080604052346100165761019d908161001c8239f35b600080fdfe60806040818152600436101561001457600080fd5b600091823560e01c9081632f4f33161461010e5750806357183c82146100bc5780638f838478146100855763de15304c1461004e57600080fd5b3461008157602036600319011261008157600435825260026020908152918190205490516001600160a01b039091168152f35b5080fd5b50346100815760203660031901126100815760209181906001600160a01b036100ac61014c565b1681526001845220549051908152f35b50346100815780600319360112610081576100d561014c565b6001600160a01b03908116835260016020528183208054602435919082101561010a5784526020938490200154915191168152f35b8480fd5b919050346101485760203660031901126101485760209260ff91906001600160a01b0361013961014c565b16815280855220541615158152f35b8280fd5b600435906001600160a01b038216820361016257565b600080fdfea2646970667358221220f31a15c2494ba6011b4529d52c4671d431cbacddfd8cc72b0ea4b673c717b73764736f6c63430008120033";

type FactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Factory__factory extends ContractFactory {
  constructor(...args: FactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Factory> {
    return super.deploy(overrides || {}) as Promise<Factory>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Factory {
    return super.attach(address) as Factory;
  }
  override connect(signer: Signer): Factory__factory {
    return super.connect(signer) as Factory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FactoryInterface {
    return new utils.Interface(_abi) as FactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Factory {
    return new Contract(address, _abi, signerOrProvider) as Factory;
  }
}
