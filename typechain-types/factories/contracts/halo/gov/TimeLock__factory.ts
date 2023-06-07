/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TimeLock,
  TimeLockInterface,
} from "../../../../contracts/halo/gov/TimeLock";

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
        internalType: "uint256",
        name: "minDelay",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "proposers",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "executors",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "initTimeLock",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x6080806040523461001657612353908161001c8239f35b600080fdfe6080604052600436101561001b575b361561001957600080fd5b005b60003560e01c806301d5062a146112e957806301ffc9a71461127957806307bd0265146112505780630d3cf6fc14611215578063134008d31461117257806313bc9f20146111545780631429046314610bba578063150b7a0214610b65578063248a9ca314610b365780632ab0f52914610b095780632f2ff15d14610a6657806331d5075014610a3a57806336568abe146109a8578063584b153e1461097157806364d62353146108c65780638065657f146108a75780638f2a0bb0146107865780638f61f4f51461075d57806391d1485414610710578063a217fddf146106f4578063b08e51c0146106cb578063b1c5f427146106a1578063bc197c8114610619578063c4d252f514610366578063d45c44351461033a578063d547741f146102f9578063e38335e5146101d7578063f23a6e61146101825763f27a0c920361000e573461017d57600036600319011261017d576020609854604051908152f35b600080fd5b3461017d5760a036600319011261017d5761019b61138c565b506101a46113a2565b506084356001600160401b03811161017d576101c4903690600401611531565b5060405163f23a6e6160e01b8152602090f35b6102596102526101e6366115a8565b6000805260008051602061229e8339815191526020527fa01e231ca478cf51f663e103939e98de36fa76d3e4e0b1de673dc711acc3a01b5492999198939693919260ff16156102eb575b61023b858514611d45565b6102468a8514611d45565b888a888789888d611bd0565b9687612036565b60005b81811061026c57610019876120cc565b8080887fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b5888886102de6102c58f986102e6998f828e6102b88f836102b3916102be96611dac565b611dbc565b97611dac565b3595611dd0565b906102d282828787611f28565b60405194859485611f01565b0390a3611d9d565b61025c565b6102f43361187a565b610230565b3461017d57604036600319011261017d576100196004356103186113a2565b9080600052606560205261033560016040600020015433906119a7565b611ac0565b3461017d57602036600319011261017d5760043560005260976020526020604060002054604051908152f35b3461017d5760208060031936011261017d57600435906000805160206122fe8339815191528060005260658252604060002033600052825260ff604060002054161561045e57506103c582600052609760205260016040600020541190565b15610400576097908260005252600060408120557fbaa1eb22f2a492ba1a5fea61b8df4d27c6c8b5f3971e63bb58fa14ff72eedb70600080a2005b6084906040519062461bcd60e51b82526004820152603160248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e2063616044820152701b9b9bdd0818994818d85b98d95b1b1959607a1b6064820152fd5b90610468336120fb565b60405161047481611447565b604281528281019360603686378151156106035760308553815160019081101561060357607860218401536041905b8082116105a9575050610566579061052f6048604494936040519687916105208784019676020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b88526104f7815180928b603789019101611667565b8401917001034b99036b4b9b9b4b733903937b6329607d1b603784015251809386840190611667565b01036028810187520185611478565b61055860405194859362461bcd60e51b8552600485015251809281602486015285850190611667565b601f01601f19168101030190fd5b6064836040519062461bcd60e51b825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f81166010811015610603576f181899199a1a9b1b9c1cb0b131b232b360811b901a6105d884866120ea565b5360041c9180156105ed5760001901906104a3565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b3461017d5760a036600319011261017d5761063261138c565b5061063b6113a2565b506001600160401b0360443581811161017d5761065c903690600401611609565b5060643581811161017d57610675903690600401611609565b5060843590811161017d5761068e903690600401611531565b5060405163bc197c8160e01b8152602090f35b3461017d5760206106c36106b4366115a8565b96959095949194939293611bd0565b604051908152f35b3461017d57600036600319011261017d5760206040516000805160206122fe8339815191528152f35b3461017d57600036600319011261017d57602060405160008152f35b3461017d57604036600319011261017d576107296113a2565b600435600052606560205260406000209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b3461017d57600036600319011261017d5760206040516000805160206122be8339815191528152f35b3461017d5760c036600319011261017d576001600160401b0360043581811161017d576107b7903690600401611578565b919060243582811161017d576107d1903690600401611578565b91909260443590811161017d576107ec903690600401611578565b906064359460a435936107fe3361168a565b610809868914611d45565b610814848914611d45565b6108266084358886868a878e88611bd0565b946108318187611e11565b60005b89811061083d57005b8080887f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca88888f8f8f906108958f9a6108a29b61088e8f8f966108886102b3866102de9b8195611dac565b99611dac565b3597611dd0565b9060405196879687611d0d565b610834565b3461017d5760206106c36108ba366113f9565b94939093929192611b7b565b3461017d57602036600319011261017d57600435303303610918577f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d560406098548151908152836020820152a1609855005b60405162461bcd60e51b815260206004820152602b60248201527f54696d656c6f636b436f6e74726f6c6c65723a2063616c6c6572206d7573742060448201526a62652074696d656c6f636b60a81b6064820152608490fd5b3461017d57602036600319011261017d57602061099e600435600052609760205260016040600020541190565b6040519015158152f35b3461017d57604036600319011261017d576109c16113a2565b336001600160a01b038216036109dd5761001990600435611ac0565b60405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608490fd5b3461017d57602036600319011261017d57602061099e6004356000526097602052604060002054151590565b3461017d57604036600319011261017d57600435610a826113a2565b816000526065602052610a9e60016040600020015433906119a7565b81600052606560205260406000209060018060a01b0316908160005260205260ff6040600020541615610acd57005b8160005260656020526040600020816000526020526040600020600160ff19825416179055339160008051602061227e833981519152600080a4005b3461017d57602036600319011261017d57602061099e600435600052609760205260016040600020541490565b3461017d57602036600319011261017d5760043560005260656020526020600160406000200154604051908152f35b3461017d57608036600319011261017d57610b7e61138c565b50610b876113a2565b506064356001600160401b03811161017d57610ba7903690600401611531565b50604051630a85bd0160e11b8152602090f35b3461017d57608036600319011261017d576001600160401b0360243581811161017d57610beb9036906004016114b0565b9060443590811161017d57610c049036906004016114b0565b6064356001600160a01b038116929083900361017d576000549260ff8460081c161593848095611147575b8015611130575b156110d45760ff198116600117600055846110c2575b50610c6760ff60005460081c16610c6281612209565b612209565b7f5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5908160005260656020528160016040600020018181549155817fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff918183600080a46000805160206122be83398151915260005281600160406000200181815491556000805160206122be83398151915283600080a46000805160206122de83398151915260005281600160406000200181815491556000805160206122de83398151915283600080a46000805160206122fe8339815191526000526000805160206122fe8339815191526001604060002001918383549355600080a48160005260406000203060005260205260ff6040600020541615611082575b8061101f575b505060005b8151811015610f0357610e38906001600160a01b03610dad8285612269565b511660008181527fafe71ff1fe81c59ca16af21c02420893e650adae4948ece1623218f842885477602052604090205460ff1615610ea0575b506001600160a01b03610df98285612269565b511660008181527fb33a3829f2d1f31fd111fcd13892b72b93a782f7b93bf968903b15b040efa320602052604090205460ff1615610e3d575b50611d9d565b610d8e565b60008181527fb33a3829f2d1f31fd111fcd13892b72b93a782f7b93bf968903b15b040efa32060205260408120805460ff191660011790553391906000805160206122fe8339815191529060008051602061227e8339815191529080a485610e32565b60008181527fafe71ff1fe81c59ca16af21c02420893e650adae4948ece1623218f84288547760205260408120805460ff191660011790553391906000805160206122be8339815191529060008051602061227e8339815191529080a485610de6565b505060005b8151811015610fa957610f53906001600160a01b03610f278285612269565b5116600081815260008051602061229e833981519152602052604090205460ff1615610f585750611d9d565b610f08565b600081815260008051602061229e83398151915260205260408120805460ff191660011790553391906000805160206122de8339815191529060008051602061227e8339815191529080a484610e32565b827f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5604060043580609855815190600082526020820152a1610fe757005b61ff0019600054166000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a1005b81600052606560205260406000208160005260205260ff60406000205416610d89578160005260656020526040600020816000526020526040600020600160ff19825416179055339160008051602061227e833981519152600080a48380610d89565b8160005260656020526040600020306000526020526040600020600160ff1982541617905533308360008051602061227e833981519152600080a4610d83565b61ffff19166101011760005584610c4c565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b158015610c365750600160ff821614610c36565b50600160ff821610610c2f565b3461017d57602036600319011261017d57602061099e600435611b36565b6100196111f360006111ff7fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b586111ea6111aa366113f9565b6000805160206122de8339815191528a999597929994939452606560205260408a208a805260205260ff60408b20541615611207575b8884848989611b7b565b98899788612036565b6102d282828787611f28565b0390a36120cc565b6112103361187a565b6111e0565b3461017d57600036600319011261017d5760206040517f5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca58152f35b3461017d57600036600319011261017d5760206040516000805160206122de8339815191528152f35b3461017d57602036600319011261017d5760043563ffffffff60e01b811680910361017d57602090630271189760e51b81149081156112be575b506040519015158152f35b637965db0b60e01b8114915081156112d8575b50826112b3565b6301ffc9a760e01b149050826112d1565b3461017d5760c036600319011261017d5761130261138c565b602435906044356001600160401b03811161017d576000926113879261134d7f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca9336906004016113cc565b60649591953560a435916113603361168a565b61137060843583838b8a8a611b7b565b9761137b848a611e11565b60405196879687611d0d565b0390a3005b600435906001600160a01b038216820361017d57565b602435906001600160a01b038216820361017d57565b35906001600160a01b038216820361017d57565b9181601f8401121561017d578235916001600160401b03831161017d576020838186019501011161017d57565b60a060031982011261017d576004356001600160a01b038116810361017d579160243591604435906001600160401b03821161017d5761143b916004016113cc565b90916064359060843590565b608081019081106001600160401b0382111761146257604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b0382111761146257604052565b6001600160401b0381116114625760051b60200190565b81601f8201121561017d578035916114c783611499565b926114d56040519485611478565b808452602092838086019260051b82010192831161017d578301905b8282106114ff575050505090565b83809161150b846113b8565b8152019101906114f1565b6001600160401b03811161146257601f01601f191660200190565b81601f8201121561017d5780359061154882611516565b926115566040519485611478565b8284526020838301011161017d57816000926020809301838601378301015290565b9181601f8401121561017d578235916001600160401b03831161017d576020808501948460051b01011161017d57565b9060a060031983011261017d576001600160401b0360043581811161017d57836115d491600401611578565b9390939260243583811161017d57826115ef91600401611578565b9390939260443591821161017d5761143b91600401611578565b81601f8201121561017d5780359161162083611499565b9261162e6040519485611478565b808452602092838086019260051b82010192831161017d578301905b828210611658575050505090565b8135815290830190830161164a565b60005b83811061167a5750506000910152565b818101518382015260200161166a565b6001600160a01b031660008181527fafe71ff1fe81c59ca16af21c02420893e650adae4948ece1623218f842885477602090815260408083205490936000805160206122be8339815191529160ff16156116e5575050505050565b6116ee906120fb565b908451906116fb82611447565b6042825283820194606036873782511561186657603086538251906001918210156118665790607860218501536041915b8183116117f8575050506117b6578461179260486105589360449798519889916117838984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a526104f7815180928d603789019101611667565b01036028810189520187611478565b5194859362461bcd60e51b8552600485015251809281602486015285850190611667565b60648386519062461bcd60e51b825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f81166010811015611852576f181899199a1a9b1b9c1cb0b131b232b360811b901a61182885876120ea565b5360041c92801561183e5760001901919061172c565b634e487b7160e01b82526011600452602482fd5b634e487b7160e01b83526032600452602483fd5b634e487b7160e01b81526032600452602490fd5b6001600160a01b0316600081815260008051602061229e833981519152602090815260408083205490936000805160206122de8339815191529160ff16156118c3575050505050565b6118cc906120fb565b908451906118d982611447565b6042825283820194606036873782511561186657603086538251906001918210156118665790607860218501536041915b818311611961575050506117b6578461179260486105589360449798519889916117838984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a526104f7815180928d603789019101611667565b909192600f81166010811015611852576f181899199a1a9b1b9c1cb0b131b232b360811b901a61199185876120ea565b5360041c92801561183e5760001901919061190a565b600090808252602090606582526040938484209060018060a01b031690818552835260ff8585205416156119dc575050505050565b6119e5906120fb565b908451906119f282611447565b6042825283820194606036873782511561186657603086538251906001918210156118665790607860218501536041915b818311611a7a575050506117b6578461179260486105589360449798519889916117838984019876020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8a526104f7815180928d603789019101611667565b909192600f81166010811015611852576f181899199a1a9b1b9c1cb0b131b232b360811b901a611aaa85876120ea565b5360041c92801561183e57600019019190611a23565b906000918083526065602052604083209160018060a01b03169182845260205260ff604084205416611af157505050565b8083526065602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b6000526097602052604060002054600181119081611b52575090565b905042101590565b908060209392818452848401376000828201840152601f01601f1916010190565b94611bb1611bca94959293604051968795602087019960018060a01b03168a52604087015260a0606087015260c0860191611b5a565b91608084015260a083015203601f198101835282611478565b51902090565b969294909695919560405196602091828901998060c08b0160a08d525260e08a01919060005b85828210611ce95750505050888103601f1990810160408b0152888252976001600160fb1b03811161017d579089969495939897929160051b80928a830137019380888601878703606089015252604085019460408260051b82010195836000925b848410611c8057505050505050611bca9550608084015260a083015203908101835282611478565b9193969850919398999496603f198282030184528935601e198436030181121561017d5783018681019190356001600160401b03811161017d57803603831361017d57611cd288928392600195611b5a565b9b0194019401918b98969394919a9997959a611c58565b80600192939495838060a01b03611cff886113b8565b168152019401929101611bf6565b929093611d3b926080959897969860018060a01b03168552602085015260a0604085015260a0840191611b5a565b9460608201520152565b15611d4c57565b60405162461bcd60e51b815260206004820152602360248201527f54696d656c6f636b436f6e74726f6c6c65723a206c656e677468206d69736d616044820152620e8c6d60eb1b6064820152608490fd5b60001981146105ed5760010190565b91908110156106035760051b0190565b356001600160a01b038116810361017d5790565b91908110156106035760051b81013590601e198136030182121561017d5701908135916001600160401b03831161017d57602001823603811361017d579190565b90611e29826000526097602052604060002054151590565b611ea4576098548110611e50574201908142116105ed576000526097602052604060002055565b60405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a20696e73756666696369656e746044820152652064656c617960d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602f60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e20616c60448201526e1c9958591e481cd8da19591d5b1959608a1b6064820152608490fd5b611f25949260609260018060a01b0316825260208201528160408201520191611b5a565b90565b90926000938493826040519384928337810185815203925af13d15611fd2573d611f5181611516565b90611f5f6040519283611478565b8152600060203d92013e5b15611f7157565b60405162461bcd60e51b815260206004820152603360248201527f54696d656c6f636b436f6e74726f6c6c65723a20756e6465726c79696e6720746044820152721c985b9cd858dd1a5bdb881c995d995c9d1959606a1b6064820152608490fd5b611f6a565b15611fde57565b60405162461bcd60e51b815260206004820152602a60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e206973604482015269206e6f7420726561647960b01b6064820152608490fd5b61204261204791611b36565b611fd7565b80159081156120ad575b501561205957565b60405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a206d697373696e6720646570656044820152656e64656e637960d01b6064820152608490fd5b6120c69150600052609760205260016040600020541490565b38612051565b6120d861204282611b36565b60005260976020526001604060002055565b908151811015610603570160200190565b60405190606082018281106001600160401b0382111761146257604052602a82526020820160403682378251156106035760309053815160019081101561060357607860218401536029905b80821161219b5750506121575790565b606460405162461bcd60e51b815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f811660108110156121f4576f181899199a1a9b1b9c1cb0b131b232b360811b901a6121ca84866120ea565b5360041c9180156121df576000190190612147565b60246000634e487b7160e01b81526011600452fd5b60246000634e487b7160e01b81526032600452fd5b1561221057565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b80518210156106035760209160051b01019056fe2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d7dc9f88e569f94faad6fa0d44dd44858caf3f34f1bd1c985800aedf5793aad8bb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1d8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63fd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783a2646970667358221220f1bfbb9cdfc9f23e16f2c977c026f6f6b200512f022c6ae5b1a8df9c87951f3f64736f6c63430008120033";

type TimeLockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TimeLockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TimeLock__factory extends ContractFactory {
  constructor(...args: TimeLockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TimeLock> {
    return super.deploy(overrides || {}) as Promise<TimeLock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TimeLock {
    return super.attach(address) as TimeLock;
  }
  override connect(signer: Signer): TimeLock__factory {
    return super.connect(signer) as TimeLock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TimeLockInterface {
    return new utils.Interface(_abi) as TimeLockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TimeLock {
    return new Contract(address, _abi, signerOrProvider) as TimeLock;
  }
}
