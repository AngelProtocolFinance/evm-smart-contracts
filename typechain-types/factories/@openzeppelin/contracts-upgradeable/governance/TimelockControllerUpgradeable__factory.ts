/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../common";
import type {
  TimelockControllerUpgradeable,
  TimelockControllerUpgradeableInterface,
} from "../../../../@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "CallExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "CallScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "Cancelled",
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
        indexed: false,
        internalType: "uint256",
        name: "oldDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256",
      },
    ],
    name: "MinDelayChange",
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
    inputs: [],
    name: "CANCELLER_ROLE",
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
    name: "EXECUTOR_ROLE",
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
    name: "PROPOSER_ROLE",
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
    name: "TIMELOCK_ADMIN_ROLE",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinDelay",
    outputs: [
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
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
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperation",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperationBatch",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperation",
    outputs: [
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationDone",
    outputs: [
      {
        internalType: "bool",
        name: "done",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationPending",
    outputs: [
      {
        internalType: "bool",
        name: "pending",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationReady",
    outputs: [
      {
        internalType: "bool",
        name: "ready",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
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
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "schedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "scheduleBatch",
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
    inputs: [
      {
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "updateDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657611cfa908161001c8239f35b600080fdfe608060405260048036101561001d575b50361561001b57600080fd5b005b600090813560e01c9082826301d5062a14610db15750816301ffc9a714610d4157816307bd026514610d185781630d3cf6fc14610cdd578163134008d314610c3a57816313bc9f2014610c1c578163150b7a0214610bc6578163248a9ca314610b995781632ab0f52914610b6c5781632f2ff15d14610abc57816331d5075014610a9057816336568abe146109ff578163584b153e146109c857816364d623531461091a5781638065657f146108fa5781638f2a0bb0146107d25781638f61f4f51461079757816391d148541461074d578163a217fddf14610731578163b08e51c0146106f6578163b1c5f427146106cb578163bc197c8114610640578163c4d252f51461035c578163d45c443514610332578163d547741f146102f2578163e38335e5146101da578163f23a6e611461017c575063f27a0c920361000f57346101795780600319360112610179576020609854604051908152f35b80fd5b9050346101d65760a03660031901126101d657610197610e5a565b506101a0610e75565b506084356001600160401b0381116101d2576101bf9250369101610f73565b5060405163f23a6e6160e01b8152602090f35b8280fd5b5080fd5b8261024e60ff6040610247846101ef36610fea565b92848688849f989c979a9e8f90859f8e899f600080516020611ca5833981519152909a999a526065602052818120818052602052205416156102e4575b6102378483146117b4565b6102428683146117b4565b61163e565b9788611ad1565b875b818110610264578861026189611b67565b80f35b8080897fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b5889896102d76102be868f6102b7828f928f908f6102df9f6102ac916102b193611831565b611857565b97611831565b359561186b565b906102cb828287876119c3565b6040519485948561199c565b0390a361180c565b610250565b6102ed336112d6565b61022c565b9050346101d65760403660031901126101d6576102619035610312610e75565b90808452606560205261032d60016040862001543390611415565b61152e565b9050346101d65760203660031901126101d657602091604091358152609783522054604051908152f35b9050346101d6576020806003193601126101d2578135917ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f7838085526065835260408520338652835260ff6040862054161561046057506103ca83600052609760205260016040600020541190565b156104045750609790828452528160408120557fbaa1eb22f2a492ba1a5fea61b8df4d27c6c8b5f3971e63bb58fa14ff72eedb708280a280f35b6084916040519162461bcd60e51b8352820152603160248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e2063616044820152701b9b9bdd0818994818d85b98d95b1b1959607a1b6064820152fd5b8461046a33611b96565b916040519061047882610f06565b6042825285820192606036853782511561062d576030845382519060019182101561061a5790607860218501536041915b8183116105af5750505061056d57604493929161053b604861055f9360405193849161052c8b84019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a526105038d82519283916037890191016110b1565b8401917001034b99036b4b9b9b4b733903937b6329607d1b6037840152518093868401906110b1565b01036028810184520182610f37565b60405195869462461bcd60e51b8652850152518092816024860152858501906110b1565b601f01601f19168101030190fd5b60648486806040519262461bcd60e51b845283015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f81166010811015610607576f181899199a1a9b1b9c1cb0b131b232b360811b901a6105df8587611b85565b53871c9280156105f4576000190191906104a9565b634e487b7160e01b825260118852602482fd5b634e487b7160e01b835260328952602483fd5b634e487b7160e01b815260328752602490fd5b634e487b7160e01b815260328652602490fd5b9050346101d65760a03660031901126101d65761065b610e5a565b50610664610e75565b506001600160401b036044358181116106c757610684903690840161104b565b506064358181116106c75761069c903690840161104b565b506084359081116101d2576106b49250369101610f73565b5060405163bc197c8160e01b8152602090f35b8380fd5b82346101795760206106ee6106df36610fea565b9695909594919493929361163e565b604051908152f35b823461017957806003193601126101795760206040517ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f7838152f35b8234610179578060031936011261017957602090604051908152f35b9050346101d65760403660031901126101d657604060209260ff92610770610e75565b90358252606585528282206001600160a01b03909116825284522054604051911615158152f35b823461017957806003193601126101795760206040517fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc18152f35b9050346101d65760c03660031901126101d6576001600160401b0381358181116106c7576108039036908401610fba565b9190926024358281116108f65761081d9036908301610fba565b9290916044359182116108f25761083691369101610fba565b909260a4359160643591610849336110d4565b6108548188146117b4565b61085f8288146117b4565b610871608435848489858a8d8f61163e565b9661087c85896118ac565b895b818110610889578a80f35b80808a7f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8b8b8f8c8c6108e0888e6108d98f9d8f9e6108ed9f6102ac836108d3926102d79c611831565b99611831565b359761186b565b906040519687968761177c565b61087e565b8680fd5b8580fd5b82346101795760206106ee61090e36610eb8565b949390939291926115e9565b9050346101d65760203660031901126101d65780359030330361097057507f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d560406098548151908152836020820152a160985580f35b60849060206040519162461bcd60e51b8352820152602b60248201527f54696d656c6f636b436f6e74726f6c6c65723a2063616c6c6572206d7573742060448201526a62652074696d656c6f636b60a81b6064820152fd5b82346101795760203660031901126101795760206109f58335600052609760205260016040600020541190565b6040519015158152f35b823461017957604036600319011261017957610a19610e75565b336001600160a01b03821603610a345761026191923561152e565b60405162461bcd60e51b8152602081850152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608490fd5b82346101795760203660031901126101795760206109f583356000526097602052604060002054151590565b9050346101d65760403660031901126101d65735610ad8610e75565b8183526065602052610af260016040852001543390611415565b8183526065602052604083209060018060a01b03169081845260205260ff60408420541615610b1f578280f35b81835260656020526040832081845260205260408320600160ff1982541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8480a438808280f35b82346101795760203660031901126101795760206109f58335600052609760205260016040600020541490565b9050346101d65760203660031901126101d657604060209260019235815260658452200154604051908152f35b9050346101d65760803660031901126101d657610be1610e5a565b50610bea610e75565b506064356001600160401b0381116101d257610c099250369101610f73565b50604051630a85bd0160e11b8152602090f35b82346101795760203660031901126101795760206109f583356115a4565b82610261610cbb82610cc77fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b58610cb2610c7236610eb8565b600080516020611ca58339815191528a999597929994939452606560205260408a208a805260205260ff60408b20541615610ccf575b88848489896115e9565b98899788611ad1565b6102cb828287876119c3565b0390a3611b67565b610cd8336112d6565b610ca8565b823461017957806003193601126101795760206040517f5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca58152f35b82346101795780600319360112610179576020604051600080516020611ca58339815191528152f35b9050346101d65760203660031901126101d6573563ffffffff60e01b81168091036101d657602090630271189760e51b8114908115610d86575b506040519015158152f35b637965db0b60e01b811491508115610da0575b5082610d7b565b6301ffc9a760e01b14905082610d99565b915034610e575760c0366003190112610e5757610dcc610e5a565b90602435604435926001600160401b038411610e5357610e137f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca93610e4d95369101610e8b565b60649591953560a43591610e26336110d4565b610e3660843583838b8a8a6115e9565b97610e41848a6118ac565b6040519687968761177c565b0390a380f35b8480fd5b50fd5b600435906001600160a01b0382168203610e7057565b600080fd5b602435906001600160a01b0382168203610e7057565b9181601f84011215610e70578235916001600160401b038311610e705760208381860195010111610e7057565b60a0600319820112610e70576004356001600160a01b0381168103610e70579160243591604435906001600160401b038211610e7057610efa91600401610e8b565b90916064359060843590565b608081019081106001600160401b03821117610f2157604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b03821117610f2157604052565b6001600160401b038111610f2157601f01601f191660200190565b81601f82011215610e7057803590610f8a82610f58565b92610f986040519485610f37565b82845260208383010111610e7057816000926020809301838601378301015290565b9181601f84011215610e70578235916001600160401b038311610e70576020808501948460051b010111610e7057565b9060a0600319830112610e70576001600160401b03600435818111610e70578361101691600401610fba565b93909392602435838111610e70578261103191600401610fba565b93909392604435918211610e7057610efa91600401610fba565b9080601f83011215610e70578135906001600160401b038211610f21578160051b6040519360209361107f85840187610f37565b85528380860192820101928311610e70578301905b8282106110a2575050505090565b81358152908301908301611094565b60005b8381106110c45750506000910152565b81810151838201526020016110b4565b6001600160a01b031660008181527fafe71ff1fe81c59ca16af21c02420893e650adae4948ece1623218f842885477602090815260408083205490937fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc19160ff1615611141575050505050565b61114a90611b96565b9084519061115782610f06565b604282528382019460603687378251156112c257603086538251906001918210156112c25790607860218501536041915b8183116112545750505061121257846111ee604861055f9360449798519889916111df8984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a52610503815180928d6037890191016110b1565b01036028810189520187610f37565b5194859362461bcd60e51b85526004850152518092816024860152858501906110b1565b60648386519062461bcd60e51b825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f811660108110156112ae576f181899199a1a9b1b9c1cb0b131b232b360811b901a6112848587611b85565b5360041c92801561129a57600019019190611188565b634e487b7160e01b82526011600452602482fd5b634e487b7160e01b83526032600452602483fd5b634e487b7160e01b81526032600452602490fd5b6001600160a01b031660008181527f7dc9f88e569f94faad6fa0d44dd44858caf3f34f1bd1c985800aedf5793aad8b60209081526040808320549093600080516020611ca58339815191529160ff1615611331575050505050565b61133a90611b96565b9084519061134782610f06565b604282528382019460603687378251156112c257603086538251906001918210156112c25790607860218501536041915b8183116113cf5750505061121257846111ee604861055f9360449798519889916111df8984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a52610503815180928d6037890191016110b1565b909192600f811660108110156112ae576f181899199a1a9b1b9c1cb0b131b232b360811b901a6113ff8587611b85565b5360041c92801561129a57600019019190611378565b600090808252602090606582526040938484209060018060a01b031690818552835260ff85852054161561144a575050505050565b61145390611b96565b9084519061146082610f06565b604282528382019460603687378251156112c257603086538251906001918210156112c25790607860218501536041915b8183116114e85750505061121257846111ee604861055f9360449798519889916111df8984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a52610503815180928d6037890191016110b1565b909192600f811660108110156112ae576f181899199a1a9b1b9c1cb0b131b232b360811b901a6115188587611b85565b5360041c92801561129a57600019019190611491565b906000918083526065602052604083209160018060a01b03169182845260205260ff60408420541661155f57505050565b8083526065602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b60005260976020526040600020546001811190816115c0575090565b905042101590565b908060209392818452848401376000828201840152601f01601f1916010190565b9461161f61163894959293604051968795602087019960018060a01b03168a52604087015260a0606087015260c08601916115c8565b91608084015260a083015203601f198101835282610f37565b51902090565b969294909695919560405196602091828901998060c08b0160a08d525260e08a01919060005b81811061175457505050601f19898203810160408b0152888252976001600160fb1b038111610e70579089969495939897929160051b80928a830137019380888601878703606089015252604085019460408260051b82010195836000925b8484106116eb575050505050506116389550608084015260a083015203908101835282610f37565b9193969850919398999496603f198282030184528935601e1984360301811215610e705783018681019190356001600160401b038111610e70578036038313610e705761173d889283926001956115c8565b9b0194019401918b98969394919a9997959a6116c3565b90919283359060018060a01b038216809203610e705790815285019285019190600101611664565b9290936117aa926080959897969860018060a01b03168552602085015260a0604085015260a08401916115c8565b9460608201520152565b156117bb57565b60405162461bcd60e51b815260206004820152602360248201527f54696d656c6f636b436f6e74726f6c6c65723a206c656e677468206d69736d616044820152620e8c6d60eb1b6064820152608490fd5b600019811461181b5760010190565b634e487b7160e01b600052601160045260246000fd5b91908110156118415760051b0190565b634e487b7160e01b600052603260045260246000fd5b356001600160a01b0381168103610e705790565b91908110156118415760051b81013590601e1981360301821215610e705701908135916001600160401b038311610e70576020018236038113610e70579190565b906118c4826000526097602052604060002054151590565b61193f5760985481106118eb5742019081421161181b576000526097602052604060002055565b60405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a20696e73756666696369656e746044820152652064656c617960d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602f60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e20616c60448201526e1c9958591e481cd8da19591d5b1959608a1b6064820152608490fd5b6119c0949260609260018060a01b03168252602082015281604082015201916115c8565b90565b90926000938493826040519384928337810185815203925af13d15611a6d573d6119ec81610f58565b906119fa6040519283610f37565b8152600060203d92013e5b15611a0c57565b60405162461bcd60e51b815260206004820152603360248201527f54696d656c6f636b436f6e74726f6c6c65723a20756e6465726c79696e6720746044820152721c985b9cd858dd1a5bdb881c995d995c9d1959606a1b6064820152608490fd5b611a05565b15611a7957565b60405162461bcd60e51b815260206004820152602a60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e206973604482015269206e6f7420726561647960b01b6064820152608490fd5b611add611ae2916115a4565b611a72565b8015908115611b48575b5015611af457565b60405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a206d697373696e6720646570656044820152656e64656e637960d01b6064820152608490fd5b611b619150600052609760205260016040600020541490565b38611aec565b611b73611add826115a4565b60005260976020526001604060002055565b908151811015611841570160200190565b60405190606082018281106001600160401b03821117610f2157604052602a82526020820160403682378251156118415760309053815160019081101561184157607860218401536029905b808211611c36575050611bf25790565b606460405162461bcd60e51b815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f81166010811015611c8f576f181899199a1a9b1b9c1cb0b131b232b360811b901a611c658486611b85565b5360041c918015611c7a576000190190611be2565b60246000634e487b7160e01b81526011600452fd5b60246000634e487b7160e01b81526032600452fdfed8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63a26469706673582212205aea33229e53e72e415622fa7349cedaa40cbc744b8827d237b209f0510d22bd64736f6c63430008120033";

type TimelockControllerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TimelockControllerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TimelockControllerUpgradeable__factory extends ContractFactory {
  constructor(...args: TimelockControllerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<TimelockControllerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<TimelockControllerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TimelockControllerUpgradeable {
    return super.attach(address) as TimelockControllerUpgradeable;
  }
  override connect(signer: Signer): TimelockControllerUpgradeable__factory {
    return super.connect(signer) as TimelockControllerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TimelockControllerUpgradeableInterface {
    return new utils.Interface(_abi) as TimelockControllerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TimelockControllerUpgradeable {
    return new Contract(address, _abi, signerOrProvider) as TimelockControllerUpgradeable;
  }
}
