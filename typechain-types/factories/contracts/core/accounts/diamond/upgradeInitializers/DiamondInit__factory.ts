/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  DiamondInit,
  DiamondInitInterface,
} from "../../../../../../contracts/core/accounts/diamond/upgradeInitializers/DiamondInit";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "curOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "curRegistrar",
        type: "address",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100165761028a908161001c8239f35b600080fdfe6080604090808252600436101561001557600080fd5b600091823560e01c63f09a40161461002c57600080fd5b34610238578060031936011261023857600435916001600160a01b0380841692908385036102345760243590811692838203610230576301ffc9a760e01b87527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020528287208054600160ff1991821681179092556307e4c70760e21b895284892080548216831790556348e2b09360e01b895284892080548216831790556307f5828d60e41b8952848920805490911682179055956100ec9061023c565b156101ee57506100fb9061023c565b156101ab57506bffffffffffffffffffffffff60a01b917ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4590838254161790557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4691825416179055807ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d47557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d485580f35b5162461bcd60e51b815260206004820152601f60248201527f456e74657220612076616c6964207265676973747261722061646472657373006044820152606490fd5b62461bcd60e51b815260206004820152601b60248201527f456e74657220612076616c6964206f776e6572206164647265737300000000006044820152606490fd5b8680fd5b8580fd5b8280fd5b6001600160a01b03161561024f57600190565b60009056fea2646970667358221220395c1783739377c5d1d204bdba2e4a2552f92d545574baa326980c50775829b264736f6c63430008120033";

type DiamondInitConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondInitConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondInit__factory extends ContractFactory {
  constructor(...args: DiamondInitConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DiamondInit> {
    return super.deploy(overrides || {}) as Promise<DiamondInit>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DiamondInit {
    return super.attach(address) as DiamondInit;
  }
  override connect(signer: Signer): DiamondInit__factory {
    return super.connect(signer) as DiamondInit__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondInitInterface {
    return new utils.Interface(_abi) as DiamondInitInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondInit {
    return new Contract(address, _abi, signerOrProvider) as DiamondInit;
  }
}
