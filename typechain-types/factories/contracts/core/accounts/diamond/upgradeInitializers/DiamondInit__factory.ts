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
  "0x608080604052346100165761026f908161001c8239f35b600080fdfe60806040818152600436101561001457600080fd5b600091823560e01c63f09a40161461002b57600080fd5b3461021d578160031936011261021d57600435916001600160a01b03808416928385036102195760243591821694858303610215576301ffc9a760e01b87527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020528387208054600160ff1991821681179092556307e4c70760e21b895285892080548216831790556348e2b09360e01b895285892080548216831790556307f5828d60e41b8952858920805490911690911790556100ea90610221565b156101d357506100f990610221565b1561019057507ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4480546001600160a01b03191690911790557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4680546001600160c01b031916909117600160a01b17905560017ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d475580f35b5162461bcd60e51b815260206004820152601f60248201527f456e74657220612076616c6964207265676973747261722061646472657373006044820152606490fd5b62461bcd60e51b815260206004820152601b60248201527f456e74657220612076616c6964206f776e6572206164647265737300000000006044820152606490fd5b8680fd5b8580fd5b8280fd5b6001600160a01b03161561023457600190565b60009056fea26469706673582212207d442f7e43e95da35e367b1d2a4af462d9c969f6c96d164cb5e1ab07855221d764736f6c63430008120033";

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
