/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  DiamondLoupeFacet,
  DiamondLoupeFacetInterface,
} from "../../../../../../contracts/core/accounts/diamond/facets/DiamondLoupeFacet";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "facetAddress_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "facetAddresses_",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "facet",
        type: "address",
      },
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "facetfunctionselectors",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondLoupe.Facet[]",
        name: "facets_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
  "0x6080806040523461001657610760908161001c8239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816301ffc9a7146104785750806352ef6b2c146103945780637a0ed62714610175578063adfca15e146100bf5763cdffacc61461005a57600080fd5b346100bb5760203660031901126100bb573563ffffffff60e01b81168091036100bb5782527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c6020908152918190205490516001600160a01b039091168152f35b8280fd5b5090346100bb576020918260031936011261017157356001600160a01b0381168103610171576001600160a01b031660009081527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131d60205260409020829084906101289061054d565b9083519383808695860192818752855180945286019401925b82811061015057505050500390f35b83516001600160e01b03191685528695509381019392810192600101610141565b8380fd5b5091346103915780600319360112610391577fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131e928354906101b58261050b565b946101c2855196876104d3565b828652601f196101d18461050b565b01845b81811061034a575050835b83811061029357858588825191602080840191818552835180935285850182878560051b880101950196825b8584106102185787870388f35b90919293809596603f198982030185528951826060818785019360018060a01b038151168652015193878382015284518094520192019084905b80821061026f57505050988101989695946001019301919061020b565b82516001600160e01b03191684528994938401939092019160019190910190610252565b8185527fb5c239a29faf02594141bbc5e6982a9b85ba2b4d59c3ed3baaf4cb8e5e11cbef81015461030d906001600160a01b0316806102d2848b610523565b51526001600160a01b031660009081527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131d6020526040902090565b610324602061031c848b610523565b51019161054d565b90526000198114610337576001016101df565b634e487b7160e01b855260118352602485fd5b865187810181811067ffffffffffffffff82111761037e579060209291895287815282606081830152828b010152016101d4565b634e487b7160e01b885260418652602488fd5b80fd5b8284346103915780600319360112610391579080519182907fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131e918254808652602080960190819484527fb5c239a29faf02594141bbc5e6982a9b85ba2b4d59c3ed3baaf4cb8e5e11cbef90845b81811061045b57505050816104179103826104d3565b83519485948186019282875251809352850193925b82811061043b57505050500390f35b83516001600160a01b03168552869550938101939281019260010161042c565b82546001600160a01b031684529288019260019283019201610401565b9291905034610171576020366003190112610171573563ffffffff60e01b81168091036101715783527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f602090815292205460ff1615158152f35b90601f8019910116810190811067ffffffffffffffff8211176104f557604052565b634e487b7160e01b600052604160045260246000fd5b67ffffffffffffffff81116104f55760051b60200190565b80518210156105375760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b906040918251809382549283835260209182840191600052826000209460005b8160078201106106b757846105c8975493838310610697575b838310610677575b838310610657575b838310610637575b838310610617575b8383106105fa575b508282106105de575b50106105ca575b50905003836104d3565b565b6001600160e01b03191681520180386105be565b83811b6001600160e01b031916855290930192600101846105b7565b84901b6001600160e01b03191685529093019260010184386105ae565b606085901b6001600160e01b0319168652948101946001909201916105a6565b608085901b6001600160e01b03191686529481019460019092019161059e565b60a085901b6001600160e01b031916865294810194600190920191610596565b60c085901b6001600160e01b03191686529481019460019092019161058e565b60e085901b6001600160e01b031916865294810194600190920191610586565b86546001600160e01b031960e082811b8216875260c083811b83168989015260a084811b8416888a0152608085811b85166060808c019190915286901b8516908a015284881b84169089015283891b8316908801529116908501526001909601958895506101009093019260080161056d56fea2646970667358221220744a63f3733bd719f754362441b91ad67da3e4338218748aeb634b384099523664736f6c63430008120033";

type DiamondLoupeFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondLoupeFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondLoupeFacet__factory extends ContractFactory {
  constructor(...args: DiamondLoupeFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DiamondLoupeFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondLoupeFacet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DiamondLoupeFacet {
    return super.attach(address) as DiamondLoupeFacet;
  }
  override connect(signer: Signer): DiamondLoupeFacet__factory {
    return super.connect(signer) as DiamondLoupeFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondLoupeFacetInterface {
    return new utils.Interface(_abi) as DiamondLoupeFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondLoupeFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondLoupeFacet;
  }
}
