/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, BigNumberish, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../common";
import type {MockUSDC, MockUSDCInterface} from "../../../contracts/mock/MockUSDC";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
    ],
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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
    name: "burnFrom",
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
    stateMutability: "pure",
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
        name: "to",
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
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x604060808152346200043d57620011c1803803806200001e8162000442565b92833981016060828203126200043d5781516001600160401b0392908381116200043d57826200005091830162000468565b92602092838301518281116200043d5786916200006f91850162000468565b920151938051918083116200033d5760038054936001938486811c9616801562000432575b888710146200041c578190601f96878111620003c6575b5088908783116001146200035f5760009262000353575b505060001982841b1c191690841b1781555b84519182116200033d5760049485548481811c9116801562000332575b888210146200031d57858111620002d2575b50869085841160011462000267579383949184926000956200025b575b50501b92600019911b1c19161782555b60058054336001600160a01b03198216811790925586519291906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3620f424094858102958187041490151715620002465733156200020957505060025490838201809211620001f457506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9160025533835282815284832084815401905584519384523393a351610ce69081620004db8239f35b601190634e487b7160e01b6000525260246000fd5b8360649362461bcd60e51b845283015260248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b601183634e487b7160e01b6000525260246000fd5b01519350388062000120565b9190601f198416928760005284896000209460005b8b89838310620002ba57505050106200029f575b50505050811b01825562000130565b01519060f884600019921b161c191690553880808062000290565b8686015189559097019694850194889350016200027c565b86600052876000208680860160051c8201928a871062000313575b0160051c019085905b8281106200030657505062000103565b60008155018590620002f6565b92508192620002ed565b602287634e487b7160e01b6000525260246000fd5b90607f1690620000f1565b634e487b7160e01b600052604160045260246000fd5b015190503880620000c2565b90869350601f19831691856000528a6000209260005b8c828210620003af575050841162000396575b505050811b018155620000d4565b015160001983861b60f8161c1916905538808062000388565b8385015186558a9790950194938401930162000375565b90915083600052886000208780850160051c8201928b861062000412575b918891869594930160051c01915b82811062000402575050620000ab565b60008155859450889101620003f2565b92508192620003e4565b634e487b7160e01b600052602260045260246000fd5b95607f169562000094565b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200033d57604052565b919080601f840112156200043d5782516001600160401b0381116200033d576020906200049e601f8201601f1916830162000442565b928184528282870101116200043d5760005b818110620004c657508260009394955001015290565b8581018301518482018401528201620004b056fe6080604081815260048036101561001557600080fd5b600092833560e01c90816306fdde03146106b757508063095ea7b31461068d57806318160ddd1461066e57806323b872dd14610631578063313ce5671461061557806339509351146105c557806340c10f19146104ff57806342966c68146104e157806370a08231146104aa578063715018a61461044d57806379cc67901461041a5780638da5cb5b146103f157806395d89b41146102d1578063a457c2d71461022a578063a9059cbb146101f9578063dd62ed3e146101ac5763f2fde38b146100de57600080fd5b346101a85760203660031901126101a8576100f76107f5565b90610100610826565b6001600160a01b03918216928315610156575050600554826bffffffffffffffffffffffff60a01b821617600555167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b5050346101f557806003193601126101f557806020926101ca6107f5565b6101d2610810565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b5050346101f557806003193601126101f5576020906102236102196107f5565b60243590336108a1565b5160018152f35b5082346102ce57826003193601126102ce576102446107f5565b918360243592338152600160205281812060018060a01b038616825260205220549082821061027d576020856102238585038733610a0f565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b509190346101f557816003193601126101f557805190828454600181811c908083169283156103e7575b60209384841081146103d4578388529081156103b85750600114610363575b505050829003601f01601f191682019267ffffffffffffffff841183851017610350575082918261034c9252826107ac565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106103a4575050505083010138808061031a565b80548886018301529301928490820161038e565b60ff1916878501525050151560051b840101905038808061031a565b634e487b7160e01b895260228a52602489fd5b91607f16916102fb565b5050346101f557816003193601126101f55760055490516001600160a01b039091168152602090f35b5050346101f5573660031901126102ce5761044a6104366107f5565b60243590610445823383610b11565b610ba9565b80f35b83346102ce57806003193601126102ce57610466610826565b600580546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5050346101f55760203660031901126101f55760209181906001600160a01b036104d26107f5565b16815280845220549051908152f35b8382346101f55760203660031901126101f55761044a903533610ba9565b5090346101a857806003193601126101a8576105196107f5565b9060243591610526610826565b6001600160a01b031692831561058357506020827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92610569879560025461087e565b60025585855284835280852082815401905551908152a380f35b6020606492519162461bcd60e51b8352820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b5050346101f557806003193601126101f55761022360209261060e6105e86107f5565b338352600186528483206001600160a01b0382168452865291849020546024359061087e565b9033610a0f565b5050346101f557816003193601126101f5576020905160068152f35b5050346101f55760603660031901126101f5576020906102236106526107f5565b61065a610810565b60443591610669833383610b11565b6108a1565b5050346101f557816003193601126101f5576020906002549051908152f35b5050346101f557806003193601126101f5576020906102236106ad6107f5565b6024359033610a0f565b84915083346101a857826003193601126101a85782600354600181811c908083169283156107a2575b60209384841081146103d457838852908115610786575060011461073057505050829003601f01601f191682019267ffffffffffffffff841183851017610350575082918261034c9252826107ac565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b838510610772575050505083010185808061031a565b80548886018301529301928490820161075c565b60ff1916878501525050151560051b840101905085808061031a565b91607f16916106e0565b6020808252825181830181905290939260005b8281106107e157505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016107bf565b600435906001600160a01b038216820361080b57565b600080fd5b602435906001600160a01b038216820361080b57565b6005546001600160a01b0316330361083a57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b9190820180921161088b57565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b039081169182156109bc571691821561096b5760008281528060205260408120549180831061091757604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b03908116918215610ac05716918215610a705760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fd5b9060018060a01b0380831660005260016020526040600020908216600052602052604060002054926000198403610b49575b50505050565b808410610b6457610b5b930391610a0f565b38808080610b43565b60405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606490fd5b6001600160a01b03168015610c6157600091818352826020526040832054818110610c1157817fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef926020928587528684520360408620558060025403600255604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608490fdfea26469706673582212209c37654ff1460a117f7ae484576054d3a366b024297ab95ff3407b77a7fe37b664736f6c63430008120033";

type MockUSDCConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockUSDCConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockUSDC__factory extends ContractFactory {
  constructor(...args: MockUSDCConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    supply: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<MockUSDC> {
    return super.deploy(name, symbol, supply, overrides || {}) as Promise<MockUSDC>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    supply: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, supply, overrides || {});
  }
  override attach(address: string): MockUSDC {
    return super.attach(address) as MockUSDC;
  }
  override connect(signer: Signer): MockUSDC__factory {
    return super.connect(signer) as MockUSDC__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockUSDCInterface {
    return new utils.Interface(_abi) as MockUSDCInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): MockUSDC {
    return new Contract(address, _abi, signerOrProvider) as MockUSDC;
  }
}
