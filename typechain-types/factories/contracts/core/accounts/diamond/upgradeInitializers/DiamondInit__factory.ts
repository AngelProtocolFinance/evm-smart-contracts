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
  "0x6080806040523461001657610313908161001c8239f35b600080fdfe6080604090808252600436101561001557600080fd5b600091823560e01c63f09a40161461002c57600080fd5b346102c157806003193601126102c157600435906001600160a01b0380831691908284036102bd57602435908116908181036102b9576301ffc9a760e01b87527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020528287208054600160ff1991821681179092556307e4c70760e21b895284892080548216831790556348e2b09360e01b895284892080548216831790556307f5828d60e41b895284892080548216831790559690956100ed906102c5565b1561027757506100fc906102c5565b15610233577ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4480546001600160a01b031990811690941790557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4680546001600160c01b031916909117600160a01b1790557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d478390555167ffffffffffffffff6060820190811191111761021f577ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4b90815416905560647ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4c557ff42c870234ce1595c214fdf331f4ac5d8ba4c010e9f64d466736c93812624d4d9182541617905580f35b634e487b7160e01b84526041600452602484fd5b815162461bcd60e51b815260206004820152601f60248201527f456e74657220612076616c6964207265676973747261722061646472657373006044820152606490fd5b62461bcd60e51b815260206004820152601b60248201527f456e74657220612076616c6964206f776e6572206164647265737300000000006044820152606490fd5b8680fd5b8580fd5b8280fd5b6001600160a01b0316156102d857600190565b60009056fea264697066735822122025faeb432dac98e26f5290afc2877c52591f180ca6ce6f73f74a859f07085a0764736f6c63430008120033";

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
