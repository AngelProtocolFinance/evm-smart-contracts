/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  RegistrarEventsLib,
  RegistrarEventsLibInterface,
} from "../../../../../contracts/core/registrar/lib/RegistrarEventsLib";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "DeleteNetworkConnection",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "axelarGateway",
            type: "address",
          },
          {
            internalType: "string",
            name: "ibcChannel",
            type: "string",
          },
          {
            internalType: "string",
            name: "transferChannel",
            type: "string",
          },
          {
            internalType: "address",
            name: "gasReceiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct AngelCoreStruct.NetworkInfo",
        name: "networkInfo",
        type: "tuple",
      },
    ],
    name: "PostNetworkConnection",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "applicationsReview",
            type: "address",
          },
          {
            internalType: "address",
            name: "indexFundContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "accountsContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoGovCode",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoCw20TokenCode",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoBondingTokenCode",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoCw900Code",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoDistributorCode",
            type: "address",
          },
          {
            internalType: "address",
            name: "subdaoEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchCode",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchCharitesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "donationMatchEmitter",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "max",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "min",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "defaultSplit",
                type: "uint256",
              },
            ],
            internalType: "struct AngelCoreStruct.SplitDetails",
            name: "splitToLiquid",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloTokenLpContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "collectorShare",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "charitySharesContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "fundraisingContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapsRouter",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "multisigEmitter",
            type: "address",
          },
          {
            internalType: "address",
            name: "charityProposal",
            type: "address",
          },
          {
            internalType: "address",
            name: "lockedWithdrawal",
            type: "address",
          },
          {
            internalType: "address",
            name: "proxyAdmin",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "wethAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "cw900lvAddress",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct RegistrarStorage.Config",
        name: "details",
        type: "tuple",
      },
    ],
    name: "UpdateRegistrarConfig",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string[]",
            name: "keys",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
        ],
        indexed: false,
        internalType: "struct RegistrarMessages.UpdateFeeRequest",
        name: "details",
        type: "tuple",
      },
    ],
    name: "UpdateRegistrarFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "UpdateRegistrarOwner",
    type: "event",
  },
] as const;

const _bytecode =
  "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea2646970667358221220178f4b6c07c4a55bcaad13abc82ac47788655856f49fb8e4f6430084849bfad264736f6c63430008120033";

type RegistrarEventsLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RegistrarEventsLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RegistrarEventsLib__factory extends ContractFactory {
  constructor(...args: RegistrarEventsLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RegistrarEventsLib> {
    return super.deploy(overrides || {}) as Promise<RegistrarEventsLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RegistrarEventsLib {
    return super.attach(address) as RegistrarEventsLib;
  }
  override connect(signer: Signer): RegistrarEventsLib__factory {
    return super.connect(signer) as RegistrarEventsLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RegistrarEventsLibInterface {
    return new utils.Interface(_abi) as RegistrarEventsLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RegistrarEventsLib {
    return new Contract(address, _abi, signerOrProvider) as RegistrarEventsLib;
  }
}
