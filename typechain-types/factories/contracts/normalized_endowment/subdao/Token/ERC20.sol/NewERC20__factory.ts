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
        name: "curName",
        type: "string",
      },
      {
        internalType: "string",
        name: "curSymbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "curMintaddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curTotalmint",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "curAdmin",
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
  "0x6080806040523461001657611929908161001c8239f35b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c91826301ffc9a714610e8d5750816306fdde0314610de3578163095ea7b314610db95781630ab751b3146107d357816318160ddd146107b457816323b872dd146106e9578163248a9ca3146106be5781632f2ff15d14610613578163313ce567146105f757816336568abe14610557578163395093511461050857816340c10f191461044057816370a082311461040957816391d14854146103c357816395d89b41146102e2578163a217fddf146102c7578163a457c2d714610206578163a9059cbb146101d5578163d53913931461019a578163d547741f14610157575063dd62ed3e1461010c57600080fd5b3461015357806003193601126101535780602092610128610f7a565b610130610f95565b6001600160a01b0391821683526034865283832091168252845220549051908152f35b5080fd5b91905034610196578060031936011261019657610193913561018e600161017c610f95565b938387526065602052862001546115c5565b6116d5565b80f35b8280fd5b505034610153578160031936011261015357602090517f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68152f35b5050346101535780600319360112610153576020906101ff6101f5610f7a565b60243590336110b3565b5160018152f35b905082346102c457826003193601126102c457610221610f7a565b91836024359233815260346020528181206001600160a01b038616825260205220549082821061025b576020856101ff8585038733611269565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152fd5b80fd5b50503461015357816003193601126101535751908152602090f35b5050346101535781600319360112610153578051908260375461030481611056565b8085529160019180831690811561039b575060011461033e575b5050506103308261033a940383610fdd565b5191829182610f4e565b0390f35b9450603785527f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae5b8286106103835750505061033082602061033a958201019461031e565b80546020878701810191909152909501948101610366565b61033a97508693506020925061033094915060ff191682840152151560051b8201019461031e565b9050346101965781600319360112610196578160209360ff926103e4610f95565b90358252606586526001600160a01b0383832091168252855220541690519015158152f35b50503461015357602036600319011261015357806020926001600160a01b03610430610f7a565b1681526033845220549051908152f35b9190503461019657806003193601126101965761045b610f7a565b906001600160a01b036024359261047061139d565b169283156104c657506020827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef926104ab8795603554611090565b6035558585526033835280852082815401905551908152a380f35b6020606492519162461bcd60e51b8352820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b5050346101535780600319360112610153576101ff60209261055061052b610f7a565b91338152603486528481206001600160a01b0384168252865284602435912054611090565b9033611269565b83915034610153578260031936011261015357610572610f95565b90336001600160a01b0383160361058e579061019391356116d5565b608490602085519162461bcd60e51b8352820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b5050346101535781600319360112610153576020905160128152f35b905034610196578160031936011261019657359061062f610f95565b908284526065602052610647600182862001546115c5565b82845260656020526001600160a01b0381852092169182855260205260ff818520541615610673578380f35b82845260656020528084208285526020528320600160ff1982541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8480a43880808380f35b9050346101965760203660031901126101965781602093600192358152606585522001549051908152f35b8391503461015357606036600319011261015357610705610f7a565b61070d610f95565b9184604435946001600160a01b038416815260346020528181203382526020522054906000198203610748575b6020866101ff8787876110b3565b8482106107715750918391610766602096956101ff95033383611269565b91939481935061073a565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346101535781600319360112610153576020906035549051908152f35b8383346101535760a03660031901126101535767ffffffffffffffff8335818111610db5576108059036908601610fff565b602435828111610db15761081c9036908701610fff565b94604435906001600160a01b0392838316809303610dad57608435938416809403610dad5786549460ff98898760081c161595868097610da1575b8015610d8b575b15610d2257899a6108fb9160019b9a9b9960ff19908a8d8d848416179055610d11575b508b80528a8d60209d8e9460658652828220818352865286838320541615610cca575b507f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a69485825260658152828220338352815286838320541615610c80575b5093505050505460081c166108f681611882565b611882565b8251828111610c6d5780610910603654611056565b94601f95868111610bfd575b508a908d878411600114610b7c5792610b71575b5050600019600383901b1c191690881b176036555b8051918211610b5e57819061095b603754611056565b848111610af1575b508890848311600114610a72578b92610a67575b5050600019600383901b1c191690861b176037555b61099461139d565b8215610a26575050857fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856064356109ce81603554611090565b603555848452603382528884208181540190558851908152a36109ef578380f35b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989261ff0019855416855551908152a18180808380f35b606492508587519262461bcd60e51b845283015260248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b015190508a80610977565b60378c528893507f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae9190601f1984168d5b8c828210610adb5750508411610ac2575b505050811b0160375561098c565b015160001960f88460031b161c191690558a8080610ab4565b8385015186558c97909501949384019301610aa3565b90915060378b527f42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae8480850160051c8201928b8610610b55575b918a91869594930160051c01915b828110610b47575050610963565b8d81558594508a9101610b39565b92508192610b2b565b60248a604186634e487b7160e01b835252fd5b015190508c80610930565b603681528b94507f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b8929190601f198516908e5b828210610be65750508411610bcd575b505050811b01603655610945565b015160001960f88460031b161c191690558c8080610bbf565b8385015186558e979095019493840193018e610baf565b90915060368d527f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b88680850160051c8201928d8610610c64575b859493910160051c909101908b908f5b838210610c565750505061091c565b81558594508c91018f610c47565b92508192610c37565b60248b604187634e487b7160e01b835252fd5b85825260658152828220903383525220918254161790558c33917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339280a48c808a8d8f8e6108e2565b81805260658652828220818352865282822084868254161790553390827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a4386108a4565b61ffff1916610101178c558e610881565b60848560208b519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b15801561085e575060018b89161461085e565b5060018b891610610857565b8680fd5b8480fd5b8380fd5b5050346101535780600319360112610153576020906101ff610dd9610f7a565b6024359033611269565b50503461015357816003193601126101535780519082603654610e0581611056565b8085529160019180831690811561039b5750600114610e30575050506103308261033a940383610fdd565b9450603685527f4a11f94e20a93c79f6ec743a1954ec4fc2c08429ae2122118bf234b2185c81b85b828610610e755750505061033082602061033a958201019461031e565b80546020878701810191909152909501948101610e58565b84913461019657602036600319011261019657357fffffffff00000000000000000000000000000000000000000000000000000000811680910361019657602092507f7965db0b000000000000000000000000000000000000000000000000000000008114908115610f01575b5015158152f35b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501483610efa565b60005b838110610f3e5750506000910152565b8181015183820152602001610f2e565b60409160208252610f6e8151809281602086015260208686019101610f2b565b601f01601f1916010190565b600435906001600160a01b0382168203610f9057565b600080fd5b602435906001600160a01b0382168203610f9057565b6080810190811067ffffffffffffffff821117610fc757604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610fc757604052565b81601f82011215610f905780359067ffffffffffffffff8211610fc75760405192611034601f8401601f191660200185610fdd565b82845260208383010111610f9057816000926020809301838601378301015290565b90600182811c92168015611086575b602083101461107057565b634e487b7160e01b600052602260045260246000fd5b91607f1691611065565b9190820180921161109d57565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038091169182156111ff5716918215611195576000828152603360205260408120549180831061112b57604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef95876020965260338652038282205586815220818154019055604051908152a3565b608460405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152fd5b6001600160a01b0380911691821561133457169182156112ca5760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260348252604060002085600052825280604060002055604051908152a3565b608460405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152fd5b3360009081527fa0f6cebec7fb889cc5ac88647269c4c0108fb926abd2111b551f234b348876df60209081526040808320549092907f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a69060ff16156114025750505050565b61140b33611773565b84519161141783610fab565b604283528483019360603686378351156115b157603085538351906001918210156115b15790607860218601536041915b81831161154357505050611501576114a39385936114e7936114d86048946114fd995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b978801528251928391603789019101610f2b565b8401917f206973206d697373696e6720726f6c6520000000000000000000000000000000603784015251809386840190610f2b565b01036028810185520183610fdd565b5191829162461bcd60e51b835260048301610f4e565b0390fd5b60648486519062461bcd60e51b825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561159d576f181899199a1a9b1b9c1cb0b131b232b360811b901a611573858861174c565b5360041c92801561158957600019019190611448565b602482634e487b7160e01b81526011600452fd5b602483634e487b7160e01b81526032600452fd5b80634e487b7160e01b602492526032600452fd5b600081815260209060658252604092838220338352835260ff8483205416156115ee5750505050565b6115f733611773565b84519161160383610fab565b604283528483019360603686378351156115b157603085538351906001918210156115b15790607860218601536041915b81831161168f57505050611501576114a39385936114e7936114d86048946114fd995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b978801528251928391603789019101610f2b565b909192600f8116601081101561159d576f181899199a1a9b1b9c1cb0b131b232b360811b901a6116bf858861174c565b5360041c92801561158957600019019190611634565b9060009180835260656020526001600160a01b036040842092169182845260205260ff60408420541661170757505050565b8083526065602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b90815181101561175d570160200190565b634e487b7160e01b600052603260045260246000fd5b604051906060820182811067ffffffffffffffff821117610fc757604052602a825260208201604036823782511561175d5760309053815160019081101561175d57607860218401536029905b8082116118145750506117d05790565b606460405162461bcd60e51b815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f8116601081101561186d576f181899199a1a9b1b9c1cb0b131b232b360811b901a611843848661174c565b5360041c9180156118585760001901906117c0565b60246000634e487b7160e01b81526011600452fd5b60246000634e487b7160e01b81526032600452fd5b1561188957565b608460405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fdfea264697066735822122073ca035abfb6d9e53e54245f392079ccd102b56062f3cf373fc7ec8c9cafde3964736f6c63430008120033";

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
