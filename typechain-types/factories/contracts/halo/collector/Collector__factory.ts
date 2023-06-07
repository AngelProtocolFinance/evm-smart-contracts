/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../common";
import type {
  Collector,
  CollectorInterface,
} from "../../../../contracts/halo/collector/Collector";
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
            name: "registrarContract",
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
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct CollectorStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "CollectedConfigUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct CollectorMessage.InstantiateMsg",
        name: "details",
        type: "tuple",
      },
    ],
    name: "CollecterInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenSwept",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountSwept",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "haloOut",
        type: "uint256",
      },
    ],
    name: "CollectorSweeped",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        internalType: "struct CollectorMessage.InstantiateMsg",
        name: "details",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "queryConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "govContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "timelockContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "distributorContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rewardFactor",
            type: "uint256",
          },
        ],
        internalType: "struct CollectorMessage.ConfigResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sweepToken",
        type: "address",
      },
    ],
    name: "sweep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rewardFactor",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "timelockContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "govContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "swapFactory",
        type: "address",
      },
      {
        internalType: "address",
        name: "registrarContract",
        type: "address",
      },
    ],
    name: "updateConfig",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610023576008805460ff60a01b19169055610b2090816100298239f35b600080fdfe60808060405260048036101561001457600080fd5b600091823560e01c90816301681a62146106e8575080632d830ce3146104715780633b7633581461018f5763e68f909d1461004e57600080fd5b3461018b578160031936011261018b5760e082610100938260405161007281610a1c565b828152602081018390526040808201849052606082018490526080820184905260a0820184905260c082018490529101919091529054600154600754600354955460055460065460025496516001600160a01b03968716999097949691821695928216949082169382169290821691166100eb88610a1c565b898852602088015260408701526060860152608085015260a084015260c08301528282015260405192835260018060a01b03602082015116602084015260018060a01b03604082015116604084015260018060a01b03606082015116606084015260018060a01b03608082015116608084015260018060a01b0360a08201511660a084015260018060a01b0360c08201511660c0840152015160e0820152f35b5080fd5b50903461046e5760a036600319011261046e576101aa6109c4565b6101b26109da565b6101ba6109f0565b6101c2610a06565b6001600160a01b0393908482161561041b57848316156103cd578484161561037f5784865416330361034c576064600754116102fe57849361028c61010097969461026f7f1d727d9d17c4b77844ac6c24387a29f0c99c9c5c8e4541c65fe1ea0957ace4fc9a9561024d6102a99660018060a01b03166001600160601b0360a01b6001541617600155565b863560075560018060a01b03166001600160601b0360a01b6003541617600355565b60018060a01b03166001600160601b0360a01b6005541617600555565b60018060a01b03166001600160601b0360a01b6004541617600455565b81604051945416845281600154166020850152816002541660408501528160035416606085015254166080830152806005541660a08301526006541660c082015260075460e0820152a1602060405160018152f35b60405162461bcd60e51b8152602081890152602160248201527f496e76616c69642072657761726420666163746f7220696e70757420676976656044820152603760f91b6064820152608490fd5b60405162461bcd60e51b8152602081890152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b60405162461bcd60e51b8152602081890152602160248201527f496e76616c696420676f76436f6e7472616374206164647265737320676976656044820152603760f91b6064820152608490fd5b60405162461bcd60e51b8152602081890152602160248201527f496e76616c69642073776170466163746f7279206164647265737320676976656044820152603760f91b6064820152608490fd5b60405162461bcd60e51b8152602081890152602660248201527f496e76616c69642074696d656c6f636b436f6e747261637420616464726573736044820152651033b4bb32b760d11b6064820152608490fd5b80fd5b503461018b5760e036600319011261018b576040519060e0820182811067ffffffffffffffff8211176106d5576040526104a96109a9565b82526104b36109c4565b602083019081526104c26109da565b604084019081526104d16109f0565b606085019081526104e0610a06565b608086019081526001600160a01b039360a435939192919085851685036106d15760a0880194855260c088019660c43588526008549060ff8260a01c1661067657509583818481858e8a977f78436177230a5129c83b842d5dcde018fc24bd8df4179da75f0c36f0805269999f9d9b60e09f9d9b8f8f879f928f92899f61026f936106018c808080808061028c996106279e600160a01b9060ff60a01b191617600855511696519e51169651169751169851169951169160e08b906040516105a781610a1c565b3381528360208201528560408201528660608201528860808201528a60a08201528c60c082015201526001600160601b0360a01b9b338d82541617905560018060a01b03166001600160601b0360a01b6001541617600155565b89600254161760025560018060a01b03166001600160601b0360a01b6003541617600355565b82600654161760065560075582885116906008541617600855816040519c51168c52511660208b0152511660408901525116606087015251166080850152511660a08301525160c0820152a180f35b60849060206040519162461bcd60e51b8352820152602e60248201527f436f6e747261637420696e7374616e63652068617320616c726561647920626560448201526d195b881a5b9a5d1a585b1a5e995960921b6064820152fd5b8880fd5b634e487b7160e01b845260418252602484fd5b9050346109a557602090816003193601126109a1576107056109a9565b9160018060a01b0381836084818985600554168680600254169a63220d2e4760e01b855216998a8c85015282602485015260448401528160648401525af19283156108f857869361096e575b5060075480840290848204148415171561095b57606490049081156109035781816107b5858a96958a9560085416848754168960405180968195829463a9059cbb60e01b9c8d8552840160209093929193604081019460018060a01b031681520152565b03925af180156108f8576107d09187916108e1575b50610a89565b6107da8287610ac7565b61081d575b5050507faff0284593fde4a9fdb8f14598be2d698d16f4ea354e6150aa3c9379363aff7c94509060609392916040519384528301526040820152a180f35b8396959493929784610839836008541693600654169488610ac7565b604080519b8c526001600160a01b03909516928b0192835260208301528993849283910103925af19384156108d45761089c6060957faff0284593fde4a9fdb8f14598be2d698d16f4ea354e6150aa3c9379363aff7c9784916108a75750610a89565b9091929338806107df565b6108c79150833d85116108cd575b6108bf8183610a4f565b810190610a71565b386107ca565b503d6108b5565b50604051903d90823e3d90fd5b6108c79150863d88116108cd576108bf8183610a4f565b6040513d88823e3d90fd5b60405162461bcd60e51b8152808701849052602b60248201527f4e6f2048414c4f20617661696c61626c6520746f20646973747269627574652060448201526a061667465722073776565760ac1b6064820152608490fd5b634e487b7160e01b875260118652602487fd5b9092508181813d831161099a575b6109868183610a4f565b8101031261099657519138610751565b8580fd5b503d61097c565b8380fd5b8280fd5b600435906001600160a01b03821682036109bf57565b600080fd5b602435906001600160a01b03821682036109bf57565b604435906001600160a01b03821682036109bf57565b606435906001600160a01b03821682036109bf57565b608435906001600160a01b03821682036109bf57565b610100810190811067ffffffffffffffff821117610a3957604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610a3957604052565b908160209103126109bf575180151581036109bf5790565b15610a9057565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b91908203918211610ad457565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220437f78851341cf465ef2f593cf05e2a2d92f4171c06e4d3326e5a649b1d126d064736f6c63430008120033";

type CollectorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollectorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Collector__factory extends ContractFactory {
  constructor(...args: CollectorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Collector> {
    return super.deploy(overrides || {}) as Promise<Collector>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Collector {
    return super.attach(address) as Collector;
  }
  override connect(signer: Signer): Collector__factory {
    return super.connect(signer) as Collector__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollectorInterface {
    return new utils.Interface(_abi) as CollectorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Collector {
    return new Contract(address, _abi, signerOrProvider) as Collector;
  }
}
