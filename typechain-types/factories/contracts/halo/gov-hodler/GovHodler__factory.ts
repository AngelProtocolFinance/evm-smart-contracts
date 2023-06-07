/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../common";
import type {
  GovHodler,
  GovHodlerInterface,
} from "../../../../contracts/halo/gov-hodler/GovHodler";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
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
    name: "GovHolderConfigUpdated",
    type: "event",
  },
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
    name: "GovHolderHaloClaimed",
    type: "event",
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
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "claimHalo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
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
        internalType: "struct GovHodlerMessage.InstantiateMsg",
        name: "details",
        type: "tuple",
      },
    ],
    name: "initialiaze",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "timelockContract",
        type: "address",
      },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001b5760016004556105ac90816100218239f35b600080fdfe608060409080825260048036101561001657600080fd5b600091823560e01c908163082df8061461028e575080636cc919c8146101c957637eb58e981461004557600080fd5b346101c557826003193601126101c5576001600160a01b03813581811681036101c15760243591610074610520565b610083816002541633146104e5565b600154865163a9059cbb60e01b81526001600160a01b0384168682019081526020818101879052919391928492169082908990829060400103925af19081156101b7578591610151575b501561011c5793516001600160a01b03909416845260208401529091600191907f9b6044fc64f5675872b53d77ce1661c2ab9bfcb944bfb3bf92bb82e7752e0e099080604081015b0390a15580f35b845162461bcd60e51b8152602081850152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b905060203d81116101b0575b601f8101601f1916820167ffffffffffffffff81118382101761019d5760209183918952810103126101995751801515810361019957386100cd565b8480fd5b634e487b7160e01b875260418652602487fd5b503d61015d565b86513d87823e3d90fd5b8380fd5b5080fd5b5082903461028a57602036600319011261028a577f964f21e08891a0ed16a74ffd5fd41f2032678ef77ee914965d4bfa6adff0ce6f60019261024f61020c6104ca565b610214610520565b610232868060a01b038060025416331490811561027d575b506104e5565b60018060a01b03166001600160601b0360a01b6002541617600255565b516000546001600160a01b039081168252600154811660208301526002541660408201528060608101610115565b905088541633148961022c565b8280fd5b8385843461028a57606036600319011261028a576102ab84610498565b6102b36104ca565b84526024356001600160a01b03808216820361019957602086019182526044359080821682036104945784870191825260035460ff8160081c161594858096610487575b8015610470575b1561041657508185969798819261037997600160ff19831617600355610404575b505116925116925116908286805161033681610498565b83815284602082015201526001600160601b0360a01b9081885416178755600154161760015560018060a01b03166001600160601b0360a01b6002541617600255565b81516000546001600160a01b039081168252600154811660208301526002541660408201527f964f21e08891a0ed16a74ffd5fd41f2032678ef77ee914965d4bfa6adff0ce6f90606090a16103cc575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff0019600354166003555160018152a180f35b61ffff1916610101176003558a61031f565b608490602088519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152fd5b50303b1580156102fe5750600160ff8316146102fe565b50600160ff8316106102f7565b8580fd5b6060810190811067ffffffffffffffff8211176104b457604052565b634e487b7160e01b600052604160045260246000fd5b600435906001600160a01b03821682036104e057565b600080fd5b156104ec57565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b600260045414610531576002600455565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fdfea26469706673582212200f7cb58479de43ac419e122df4a52888d3653a427d2cc74ef83cce4a816814eb64736f6c63430008120033";

type GovHodlerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovHodlerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovHodler__factory extends ContractFactory {
  constructor(...args: GovHodlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GovHodler> {
    return super.deploy(overrides || {}) as Promise<GovHodler>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GovHodler {
    return super.attach(address) as GovHodler;
  }
  override connect(signer: Signer): GovHodler__factory {
    return super.connect(signer) as GovHodler__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovHodlerInterface {
    return new utils.Interface(_abi) as GovHodlerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovHodler {
    return new Contract(address, _abi, signerOrProvider) as GovHodler;
  }
}
