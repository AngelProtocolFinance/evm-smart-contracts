/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  GovHodlerEvents,
  GovHodlerEventsInterface,
} from "../../../../../contracts/halo/gov-hodler/events.sol/GovHodlerEvents";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "claimHalo",
    type: "event",
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
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct GovHodlerStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "updateConfig",
    type: "event",
  },
] as const;

const _bytecode =
  "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea2646970667358221220bb504945d5ad5af0103db9e4fa6701bbaa9eb5f274f9ef95d82355d56d8d1a8f64736f6c63430008120033";

type GovHodlerEventsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovHodlerEventsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovHodlerEvents__factory extends ContractFactory {
  constructor(...args: GovHodlerEventsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GovHodlerEvents> {
    return super.deploy(overrides || {}) as Promise<GovHodlerEvents>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GovHodlerEvents {
    return super.attach(address) as GovHodlerEvents;
  }
  override connect(signer: Signer): GovHodlerEvents__factory {
    return super.connect(signer) as GovHodlerEvents__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovHodlerEventsInterface {
    return new utils.Interface(_abi) as GovHodlerEventsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovHodlerEvents {
    return new Contract(address, _abi, signerOrProvider) as GovHodlerEvents;
  }
}
