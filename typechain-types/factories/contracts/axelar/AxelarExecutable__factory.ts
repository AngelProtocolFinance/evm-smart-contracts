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
  "0x608060405234801561001057600080fd5b50610531806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063116191b6146100465780631a98b2e01461007b5780634916065814610090575b600080fd5b60005461005f906201000090046001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b61008e61008936600461027b565b6100a3565b005b61008e61009e366004610355565b61016f565b600085856040516100b59291906103f9565b604051908190038120600054631876eed960e01b83529092506201000090046001600160a01b031690631876eed990610102908e908e908e908e908e9089908d908d908d90600401610432565b6020604051808303816000875af1158015610121573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101459190610491565b61016257604051631403112d60e21b815260040160405180910390fd5b5050505050505050505050565b600082826040516101819291906103f9565b604051908190038120600054635f6970c360e01b83529092506201000090046001600160a01b031690635f6970c3906101c8908b908b908b908b908b9089906004016104ba565b6020604051808303816000875af11580156101e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061020b9190610491565b61022857604051631403112d60e21b815260040160405180910390fd5b5050505050505050565b60008083601f84011261024457600080fd5b50813567ffffffffffffffff81111561025c57600080fd5b60208301915083602082850101111561027457600080fd5b9250929050565b60008060008060008060008060008060c08b8d03121561029a57600080fd5b8a35995060208b013567ffffffffffffffff808211156102b957600080fd5b6102c58e838f01610232565b909b50995060408d01359150808211156102de57600080fd5b6102ea8e838f01610232565b909950975060608d013591508082111561030357600080fd5b61030f8e838f01610232565b909750955060808d013591508082111561032857600080fd5b506103358d828e01610232565b9150809450508092505060a08b013590509295989b9194979a5092959850565b60008060008060008060006080888a03121561037057600080fd5b87359650602088013567ffffffffffffffff8082111561038f57600080fd5b61039b8b838c01610232565b909850965060408a01359150808211156103b457600080fd5b6103c08b838c01610232565b909650945060608a01359150808211156103d957600080fd5b506103e68a828b01610232565b989b979a50959850939692959293505050565b8183823760009101908152919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b89815260c06020820152600061044c60c083018a8c610409565b828103604084015261045f81898b610409565b9050866060840152828103608084015261047a818688610409565b9150508260a08301529a9950505050505050505050565b6000602082840312156104a357600080fd5b815180151581146104b357600080fd5b9392505050565b8681526080602082015260006104d4608083018789610409565b82810360408401526104e7818688610409565b91505082606083015297965050505050505056fea26469706673582212201279de1d17469276a12bdff1e17d8c7d49dd1df99235bf2a4e07c1349bb50e9a64736f6c634300080f0033";

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
