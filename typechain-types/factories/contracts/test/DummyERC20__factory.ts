/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DummyERC20,
  DummyERC20Interface,
} from "../../../contracts/test/DummyERC20";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approveFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_newDecimals",
        type: "uint8",
      },
    ],
    name: "setDecimals",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
  "0x60803462000312576040906001600160401b038183018181118382101762000214578352600591828152602091642a37b5b2b760d91b8383015284518581018181108382111762000214578652600390818152622a25a760e91b8582015283519083821162000214578254916001958684811c9416801562000307575b88851014620002f1578190601f948581116200029d575b50889085831160011462000236576000926200022a575b505060001982861b1c191690861b1783555b8051938411620002145760049586548681811c9116801562000209575b82821014620001f457838111620001ab575b50809285116001146200013d575093839491849260009562000131575b50501b92600019911b1c19161790555b805460ff1916601217905551610b289081620003188239f35b01519350388062000108565b92919084601f1981168860005285600020956000905b8983831062000190575050501062000175575b50505050811b01905562000118565b01519060f884600019921b161c191690553880808062000166565b85870151895590970196948501948893509081019062000153565b8760005281600020848088018b1c820192848910620001ea575b018a1c019087905b828110620001dd575050620000eb565b60008155018790620001cd565b92508192620001c5565b602288634e487b7160e01b6000525260246000fd5b90607f1690620000d9565b634e487b7160e01b600052604160045260246000fd5b015190503880620000aa565b90889350601f19831691876000528a6000209260005b8c8282106200028657505084116200026d575b505050811b018355620000bc565b015160001983881b60f8161c191690553880806200025f565b8385015186558c979095019493840193016200024c565b9091508560005288600020858085018c1c8201928b8610620002e7575b918a9186959493018d1c01915b828110620002d757505062000093565b600081558594508a9101620002c7565b92508192620002ba565b634e487b7160e01b600052602260045260246000fd5b93607f16936200007c565b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146106ee57508163095ea7b3146106c457816318160ddd146106a557816323b872dd146105ec5781632b991746146105d1578163313ce567146105af578163395093511461055f57816340c10f191461049c57816370a08231146104655781637a1395aa1461043857816395d89b41146103195781639dc29fac146101f8578163a457c2d71461015057508063a9059cbb146101205763dd62ed3e146100ca57600080fd5b3461011c578060031936011261011c576100e261080f565b6001600160a01b036024358181169290839003610118579160209491849316825260018552828220908252845220549051908152f35b8480fd5b5080fd5b503461011c578060031936011261011c5760209061014961013f61080f565b6024359033610882565b5160018152f35b905082346101f557826003193601126101f55761016b61080f565b918360243592338152600160205281812060018060a01b03861682526020522054908282106101a45760208561014985850387336109f0565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b8391503461011c578260031936011261011c5761021361080f565b6001600160a01b0316906024359082156102cc5782845283602052848420549082821061027e57508184957fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef936020938688528785520381872055816002540360025551908152a380f35b608490602087519162461bcd60e51b8352820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152fd5b608490602086519162461bcd60e51b8352820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152fd5b83833461011c578160031936011261011c57805190828454600181811c9080831692831561042e575b602093848410811461041b578388529081156103ff57506001146103aa575b505050829003601f01601f191682019267ffffffffffffffff84118385101761039757508291826103939252826107c6565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106103eb5750505050830101858080610361565b8054888601830152930192849082016103d5565b60ff1916878501525050151560051b8401019050858080610361565b634e487b7160e01b895260228a52602489fd5b91607f1691610342565b83903461011c57602036600319011261011c573560ff811680910361011c5760ff19600554161760055580f35b50503461011c57602036600319011261011c5760209181906001600160a01b0361048d61080f565b16815280845220549051908152f35b9190503461055b578060031936011261055b576104b761080f565b6001600160a01b0316916024359190831561051957506020827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef926104ff879560025461085f565b60025585855284835280852082815401905551908152a380f35b6020606492519162461bcd60e51b8352820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b8280fd5b50503461011c578060031936011261011c576101496020926105a861058261080f565b338352600186528483206001600160a01b0382168452865291849020546024359061085f565b90336109f0565b50503461011c578160031936011261011c5760209060ff600554169051908152f35b83346101f5576105e96105e33661082a565b916109f0565b80f35b905082346101f557826105fe3661082a565b6001600160a01b038316855260016020818152858720338852905293909420549394909391928201610639575b602086610149878787610882565b848210610662575091839161065760209695610149950333836109f0565b91939481935061062b565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b50503461011c578160031936011261011c576020906002549051908152f35b50503461011c578060031936011261011c576020906101496106e461080f565b60243590336109f0565b8490843461055b578260031936011261055b5782600354600181811c908083169283156107bc575b602093848410811461041b578388529081156103ff575060011461076657505050829003601f01601f191682019267ffffffffffffffff84118385101761039757508291826103939252826107c6565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106107a85750505050830101858080610361565b805488860183015293019284908201610792565b91607f1691610716565b6020808252825181830181905290939260005b8281106107fb57505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016107d9565b600435906001600160a01b038216820361082557565b600080fd5b6060906003190112610825576001600160a01b0390600435828116810361082557916024359081168103610825579060443590565b9190820180921161086c57565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b0390811691821561099d571691821561094c576000828152806020526040812054918083106108f857604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b03908116918215610aa15716918215610a515760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfea264697066735822122071d34e8775df262bb76a30f5eb10290c2a30b91dd33c35259468b161469481da64736f6c63430008120033";

type DummyERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyERC20__factory extends ContractFactory {
  constructor(...args: DummyERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DummyERC20> {
    return super.deploy(overrides || {}) as Promise<DummyERC20>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DummyERC20 {
    return super.attach(address) as DummyERC20;
  }
  override connect(signer: Signer): DummyERC20__factory {
    return super.connect(signer) as DummyERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyERC20Interface {
    return new utils.Interface(_abi) as DummyERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyERC20 {
    return new Contract(address, _abi, signerOrProvider) as DummyERC20;
  }
}
