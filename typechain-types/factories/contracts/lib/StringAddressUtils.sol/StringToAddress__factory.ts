/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../common";
import type {
  StringToAddress,
  StringToAddressInterface,
} from "../../../../contracts/lib/StringAddressUtils.sol/StringToAddress";

const _abi = [
  {
    inputs: [],
    name: "InvalidAddressString",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea2646970667358221220a937a2e5bca17507ddda644a2d51b2a5a5bf21cb944fe60f2fdb8e74df40609764736f6c63430008120033";

type StringToAddressConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StringToAddressConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StringToAddress__factory extends ContractFactory {
  constructor(...args: StringToAddressConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<StringToAddress> {
    return super.deploy(overrides || {}) as Promise<StringToAddress>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): StringToAddress {
    return super.attach(address) as StringToAddress;
  }
  override connect(signer: Signer): StringToAddress__factory {
    return super.connect(signer) as StringToAddress__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StringToAddressInterface {
    return new utils.Interface(_abi) as StringToAddressInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): StringToAddress {
    return new Contract(address, _abi, signerOrProvider) as StringToAddress;
  }
}
