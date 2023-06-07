/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../../../common";
import type {
  DiamondInit,
  DiamondInitInterface,
} from "../../../../../../contracts/core/accounts/diamond/upgradeInitializers/DiamondInit";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "registrar",
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
  "0x60808060405234610016576102e9908161001c8239f35b600080fdfe6080604090808252600436101561001557600080fd5b600091823560e01c63f09a40161461002c57600080fd5b346102975780600319360112610297576004356001600160a01b0381811693848303610293576024359182169283830361028f576301ffc9a760e01b87527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020528487208054600160ff1991821681179092556307e4c70760e21b895286892080548216831790556348e2b09360e01b895286892080548216831790556307f5828d60e41b8952868920805490911690911790556100ea9061029b565b1561024d57506100f99061029b565b15610209577ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4680546001600160a01b031990811690941790557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4880546001600160c01b031916909117600160a01b17905560017ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4955805167ffffffffffffffff9181019182119110176101f5577ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4d9081541690556103e87ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4e5580f35b634e487b7160e01b82526041600452602482fd5b815162461bcd60e51b815260206004820152601f60248201527f456e74657220612076616c6964207265676973747261722061646472657373006044820152606490fd5b62461bcd60e51b815260206004820152601b60248201527f456e74657220612076616c6964206f776e6572206164647265737300000000006044820152606490fd5b8680fd5b8580fd5b8280fd5b6001600160a01b0316156102ae57600190565b60009056fea264697066735822122093c8fa249b5ea448f99d65eb2631b90606c777c621eafdbad1a70f39fb5aa02f64736f6c63430008120033";

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

  override deploy(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<DiamondInit> {
    return super.deploy(overrides || {}) as Promise<DiamondInit>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
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
  static connect(address: string, signerOrProvider: Signer | Provider): DiamondInit {
    return new Contract(address, _abi, signerOrProvider) as DiamondInit;
  }
}
