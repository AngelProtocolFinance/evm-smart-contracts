/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  NewERC20,
  NewERC20Interface,
} from "../../../../../../contracts/normalized_endowment/subdao/Token/ERC20.sol/NewERC20";

const _abi = [
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
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
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        internalType: "address",
        name: "mintaddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalmint",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "initErC20",
    outputs: [],
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
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x608080604052346100165761180f908161001c8239f35b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c91826301ffc9a714610e605750816306fdde0314610db6578163095ea7b314610d8c5781630ab751b3146107b257816318160ddd1461079357816323b872dd146106c7578163248a9ca31461069c5781632f2ff15d146105ef578163313ce567146105d357816336568abe1461054157816339509351146104f157816340c10f191461042957816370a08231146103f157816391d14854146103aa57816395d89b41146102c9578163a217fddf146102ae578163a457c2d714610206578163a9059cbb146101d5578163d53913931461019a578163d547741f14610157575063dd62ed3e1461010c57600080fd5b3461015357806003193601126101535780602092610128610f02565b610130610f1d565b6001600160a01b0391821683526034865283832091168252845220549051908152f35b5080fd5b91905034610196578060031936011261019657610193913561018e600161017c610f1d565b938387526065602052862001546114c3565b6115cd565b80f35b8280fd5b505034610153578160031936011261015357602090517f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68152f35b5050346101535780600319360112610153576020906101ff6101f5610f02565b602435903361103b565b5160018152f35b905082346102ab57826003193601126102ab57610221610f02565b918360243592338152603460205281812060018060a01b038616825260205220549082821061025a576020856101ff85850387336111ab565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b50503461015357816003193601126101535751908152602090f35b505034610153578160031936011261015357805190826037546102eb81610fde565b808552916001918083169081156103825750600114610325575b50505061031782610321940383610f65565b5191829182610ed6565b0390f35b9450603785527f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae5b82861061036a575050506103178260206103219582010194610305565b8054602087870181019190915290950194810161034d565b61032197508693506020925061031794915060ff191682840152151560051b82010194610305565b9050346101965781600319360112610196578160209360ff926103cb610f1d565b90358252606586528282206001600160a01b039091168252855220549151911615158152f35b5050346101535760203660031901126101535760209181906001600160a01b03610419610f02565b1681526033845220549051908152f35b91905034610196578060031936011261019657610444610f02565b90602435916104516112ad565b6001600160a01b03169283156104af57506020827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef926104948795603554611018565b6035558585526033835280852082815401905551908152a380f35b6020606492519162461bcd60e51b8352820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b5050346101535780600319360112610153576101ff60209261053a610514610f02565b338352603486528483206001600160a01b03821684528652918490205460243590611018565b90336111ab565b8391503461015357826003193601126101535761055c610f1d565b90336001600160a01b03831603610578579061019391356115cd565b608490602085519162461bcd60e51b8352820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152fd5b5050346101535781600319360112610153576020905160128152f35b905034610196578160031936011261019657359061060b610f1d565b908284526065602052610623600182862001546114c3565b828452606560209081528185206001600160a01b039093168086529290528084205460ff1615610651578380f35b82845260656020528084208285526020528320600160ff1982541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8480a43880808380f35b9050346101965760203660031901126101965781602093600192358152606585522001549051908152f35b83915034610153576060366003190112610153576106e3610f02565b6106eb610f1d565b6001600160a01b03821684526034602090815285852033865290529284902054604435939260018201610727575b6020866101ff87878761103b565b8482106107505750918391610745602096956101ff950333836111ab565b919394819350610719565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346101535781600319360112610153576020906035549051908152f35b8383346101535760a03660031901126101535767ffffffffffffffff8335818111610d88576107e49036908601610f87565b602435828111610d84576107fb9036908701610f87565b946001600160a01b0391604435838116929190839003610d8057608435938416809403610d805786549460ff98898760081c161595868097610d74575b8015610d5e575b15610d0457899a6108dc9160019b9a9b9960ff19908a8d8d848416179055610cf3575b508b80528a8d60209d8e9460658652828220818352865286838320541615610cac575b507f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a69485825260658152828220338352815286838320541615610c62575b5093505050505460081c166108d781611779565b611779565b8251828111610c4f57806108f1603654610fde565b94601f95868111610bdf575b508a908d878411600114610b5e5792610b53575b5050600019600383901b1c191690881b176036555b8051918211610b4057819061093c603754610fde565b848111610ad3575b508890848311600114610a54578b92610a49575b5050600019600383901b1c191690861b176037555b6109756112ad565b8215610a07575050857fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856064356109af81603554611018565b603555848452603382528884208181540190558851908152a36109d0578380f35b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989261ff0019855416855551908152a18180808380f35b865162461bcd60e51b815291820186905260248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260649150fd5b015190508a80610958565b60378c528893507f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae9190601f1984168d5b8c828210610abd5750508411610aa4575b505050811b0160375561096d565b015160001960f88460031b161c191690558a8080610a96565b8385015186558c97909501949384019301610a85565b90915060378b527f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae8480850160051c8201928b8610610b37575b918a91869594930160051c01915b828110610b29575050610944565b8d81558594508a9101610b1b565b92508192610b0d565b634e487b7160e01b8a526041845260248afd5b015190508c80610911565b603681528b94507f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b8929190601f198516908e5b828210610bc85750508411610baf575b505050811b01603655610926565b015160001960f88460031b161c191690558c8080610ba1565b8385015186558e979095019493840193018e610b91565b90915060368d527f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b88680850160051c8201928d8610610c46575b859493910160051c909101908b908f5b838210610c38575050506108fd565b81558594508c91018f610c29565b92508192610c19565b634e487b7160e01b8b526041855260248bfd5b85825260658152828220903383525220918254161790558c33917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339280a48c808a8d8f8e6108c3565b81805260658652828220818352865282822084868254161790553390827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a438610885565b61ffff1916610101178c558e610862565b885162461bcd60e51b8152602081870152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b15801561083f575060018b89161461083f565b5060018b891610610838565b8680fd5b8480fd5b8380fd5b5050346101535780600319360112610153576020906101ff610dac610f02565b60243590336111ab565b50503461015357816003193601126101535780519082603654610dd881610fde565b808552916001918083169081156103825750600114610e035750505061031782610321940383610f65565b9450603685527f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b85b828610610e48575050506103178260206103219582010194610305565b80546020878701810191909152909501948101610e2b565b849134610196576020366003190112610196573563ffffffff60e01b81168091036101965760209250637965db0b60e01b8114908115610ea2575b5015158152f35b6301ffc9a760e01b14905083610e9b565b60005b838110610ec65750506000910152565b8181015183820152602001610eb6565b60409160208252610ef68151809281602086015260208686019101610eb3565b601f01601f1916010190565b600435906001600160a01b0382168203610f1857565b600080fd5b602435906001600160a01b0382168203610f1857565b6080810190811067ffffffffffffffff821117610f4f57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610f4f57604052565b81601f82011215610f185780359067ffffffffffffffff8211610f4f5760405192610fbc601f8401601f191660200185610f65565b82845260208383010111610f1857816000926020809301838601378301015290565b90600182811c9216801561100e575b6020831014610ff857565b634e487b7160e01b600052602260045260246000fd5b91607f1691610fed565b9190820180921161102557565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b03908116918215611158571691821561110757600082815260336020526040812054918083106110b357604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef95876020965260338652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b0390811691821561125c571691821561120c5760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260348252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fd5b3360009081527fa0f6cebec7fb889cc5ac88647269c4c0108fb926abd2111b551f234b348876df60209081526040808320549092907f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a69060ff16156113125750505050565b61131b3361166a565b84519161132783610f33565b604283528483019360603686378351156114af57603085538351906001918210156114af5790607860218601536041915b818311611441575050506113ff576113ad9385936113e5936113d66048946113fb9951988576020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8b978801528251928391603789019101610eb3565b8401917001034b99036b4b9b9b4b733903937b6329607d1b603784015251809386840190610eb3565b01036028810185520183610f65565b5162461bcd60e51b815291829160048301610ed6565b0390fd5b60648486519062461bcd60e51b825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561149b576f181899199a1a9b1b9c1cb0b131b232b360811b901a6114718588611643565b5360041c92801561148757600019019190611358565b634e487b7160e01b82526011600452602482fd5b634e487b7160e01b83526032600452602483fd5b634e487b7160e01b81526032600452602490fd5b600081815260209060658252604092838220338352835260ff8483205416156114ec5750505050565b6114f53361166a565b84519161150183610f33565b604283528483019360603686378351156114af57603085538351906001918210156114af5790607860218601536041915b818311611587575050506113ff576113ad9385936113e5936113d66048946113fb9951988576020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8b978801528251928391603789019101610eb3565b909192600f8116601081101561149b576f181899199a1a9b1b9c1cb0b131b232b360811b901a6115b78588611643565b5360041c92801561148757600019019190611532565b906000918083526065602052604083209160018060a01b03169182845260205260ff6040842054166115fe57505050565b8083526065602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b908151811015611654570160200190565b634e487b7160e01b600052603260045260246000fd5b604051906060820182811067ffffffffffffffff821117610f4f57604052602a82526020820160403682378251156116545760309053815160019081101561165457607860218401536029905b80821161170b5750506116c75790565b606460405162461bcd60e51b815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f81166010811015611764576f181899199a1a9b1b9c1cb0b131b232b360811b901a61173a8486611643565b5360041c91801561174f5760001901906116b7565b60246000634e487b7160e01b81526011600452fd5b60246000634e487b7160e01b81526032600452fd5b1561178057565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fdfea2646970667358221220306babd102921c567cbeb5bebc82c68b0f1c1c2ffc22306224edc0d3d084339f64736f6c63430008120033";

type NewERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NewERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NewERC20__factory extends ContractFactory {
  constructor(...args: NewERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<NewERC20> {
    return super.deploy(overrides || {}) as Promise<NewERC20>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): NewERC20 {
    return super.attach(address) as NewERC20;
  }
  override connect(signer: Signer): NewERC20__factory {
    return super.connect(signer) as NewERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NewERC20Interface {
    return new utils.Interface(_abi) as NewERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NewERC20 {
    return new Contract(address, _abi, signerOrProvider) as NewERC20;
  }
}
