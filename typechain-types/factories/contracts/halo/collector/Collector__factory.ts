/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Collector,
  CollectorInterface,
} from "../../../../contracts/halo/collector/Collector";

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
        internalType: "uint256",
        name: "amount",
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
        name: "curDetails",
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
    inputs: [],
    name: "sweep",
    outputs: [],
    stateMutability: "payable",
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
  "0x60808060405234610023576007805460ff60a01b191690556109ce90816100298239f35b600080fdfe608060408181526004908136101561001657600080fd5b600092833560e01c90816335faa416146106195750806396eaadcc1461039b578063e6597d2f1461012b5763e68f909d1461005057600080fd5b346101275782600319360112610127578260e09360c08351610071816108ee565b82815282602082015282858201528260608201528260808201528260a0820152015260018060a01b0380915416928160065493818060025416818060035416955416928280600554169681806001541660c08d8651906100d0826108ee565b8152602081019283528681019485526060810197885260808101998a5260a081019b8c52019b8c5284519c8d52511660208c01525116908901525116606087015251166080850152511660a08301525160c0820152f35b8280fd5b5090346101275760c03660031901126101275781519160c0830183811067ffffffffffffffff8211176103885781526001600160a01b0390823582811681036103845784526101786108a7565b90602085019182526101886108c2565b908086019182526101976108d8565b9160608701928352608435938585168503610380576080880194855260a088019660a43588526007549060ff8260a01c16610326575060c089898989818f978a828b818f948d82877f8bc9f5c29e9304bd43545777fb56f4093fec72c0d227ef2842a5310ea71bf9679f8f8f8f6102a68f938d6102c3948b928a8f96818080926102e09d600160a01b9060ff60a01b191617600755519e8f9651169751169851169951169a5116928481519161024c836108ee565b3383528560208401528201528660608201528860808201528a60a082015201526001600160601b0360a01b99338b82541617905589600154161760015560018060a01b03166001600160601b0360a01b6002541617600255565b60018060a01b03166001600160601b0360a01b6003541617600355565b60018060a01b03166001600160601b0360a01b6004541617600455565b826005541617600555600655828751169060075416176007558185519b51168b52511660208a015251169087015251166060850152511660808301525160a0820152a180f35b608490602086519162461bcd60e51b8352820152602e60248201527f436f6e747261637420696e7374616e63652068617320616c726561647920626560448201526d195b881a5b9a5d1a585b1a5e995960921b6064820152fd5b8880fd5b8580fd5b634e487b7160e01b855260418352602485fd5b508234610616576080366003190112610616576103b66108a7565b6103be6108c2565b6103c66108d8565b6001600160a01b0392808416156105c45783821615610577578383161561052a5783600254163314801561051e575b156104ec5760646006541161049f57928661045b7ff08d33e848f834961c14f91bb1faa5b6aad56910bed866420a7a6ca4cb5d07a996946102a684956102c360e09960209d3560065560018060a01b03166001600160601b0360a01b6002541617600255565b818751945416845281600154168885015281600254168785015281600354166060850152541660808301526005541660a082015260065460c0820152a15160018152f35b855162461bcd60e51b8152602081890152602160248201527f496e76616c69642072657761726420666163746f7220696e70757420676976656044820152603760f91b6064820152608490fd5b855162461bcd60e51b8152602081890152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b508385541633146103f5565b855162461bcd60e51b8152602081890152602160248201527f496e76616c696420676f76436f6e7472616374206164647265737320676976656044820152603760f91b6064820152608490fd5b855162461bcd60e51b8152602081890152602160248201527f496e76616c69642073776170466163746f7279206164647265737320676976656044820152603760f91b6064820152608490fd5b855162461bcd60e51b8152602081890152602660248201527f496e76616c69642074696d656c6f636b436f6e747261637420616464726573736044820152651033b4bb32b760d11b6064820152608490fd5b80fd5b84809492506003193601126108a357341561086c575080546001548351637547736560e01b81526001600160a01b03918216818501526020939092849084906024908290349087165af1928315610862578693610833575b5060065480840290848204148415171561082057606490048084039380851161080d578161078a575b036106cd575b5050507f646c0351fc82a87092630c08f76be57327945e4243abafc8fa7bb9ab32a3903f9151348152a180f35b600754600554865163a9059cbb60e01b81529084166001600160a01b031692810192835260208301949094528492849291169082908890829060400103925af190811561077d577f646c0351fc82a87092630c08f76be57327945e4243abafc8fa7bb9ab32a3903f9391610748918691610750575b5061095a565b9184806106a0565b6107709150843d8611610776575b6107688183610920565b810190610942565b86610742565b503d61075e565b50505051903d90823e3d90fd5b600754600354885163a9059cbb60e01b81529086166001600160a01b03168582019081526020810185905290918891839188169082908d90829060400103925af18015610803576107e1918a916107e6575061095a565b61069a565b6107fd9150883d8a11610776576107688183610920565b8a610742565b88513d8b823e3d90fd5b634e487b7160e01b885260118352602488fd5b634e487b7160e01b875260118252602487fd5b9092508381813d831161085b575b61084b8183610920565b8101031261038457519186610671565b503d610841565b85513d88823e3d90fd5b602060649262461bcd60e51b8352820152601460248201527324b73b30b634b21030b6b7bab73a1033b4bb32b760611b6044820152fd5b8380fd5b602435906001600160a01b03821682036108bd57565b600080fd5b604435906001600160a01b03821682036108bd57565b606435906001600160a01b03821682036108bd57565b60e0810190811067ffffffffffffffff82111761090a57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761090a57604052565b908160209103126108bd575180151581036108bd5790565b1561096157565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fdfea26469706673582212200b97c1d91584d6c7e650e830805b4c18c8ae670d242622adfc156127945a982f64736f6c63430008120033";

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
