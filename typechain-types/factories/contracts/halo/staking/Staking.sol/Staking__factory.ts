/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Staking,
  StakingInterface,
} from "../../../../../contracts/halo/staking/Staking.sol/Staking";

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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Staked",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Unstaked",
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
    inputs: [],
    name: "haloToken",
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
        components: [
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "interestRate",
            type: "uint256",
          },
        ],
        internalType: "struct Staking.InstantiateMsg",
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
    name: "interestRate",
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
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "stake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "stakeFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakeInfos",
    outputs: [
      {
        internalType: "bool",
        name: "started",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "startTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimed",
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
        name: "",
        type: "address",
      },
    ],
    name: "stakeNumber",
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
    name: "supportsHistory",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
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
    name: "token",
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
    name: "totalStaked",
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
        name: "",
        type: "address",
      },
    ],
    name: "totalStakedFor",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakeId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curInterestRate",
        type: "uint256",
      },
    ],
    name: "updateInterestRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60803462000380576001600160401b0390604090808201838111828210176200036a5782526011815260207029ba30b5b2b2102430b637902a37b5b2b760791b81830152825193838501858110828211176200036a578452600385526214d21560ea1b8286015282518181116200036a576004928354916001958684811c941680156200035f575b838510146200034a578190601f94858111620002f4575b5083908583116001146200028c5760009262000280575b5050600019600383901b1c191690861b1784555b86519283116200026b576005938454908682811c9216801562000260575b838310146200024b575082811162000202575b508091831160011462000196575081929394956000926200018a575b5050600019600383901b1c191690831b1790555b6006805460ff1916905560075560088054336001600160a01b0319821681179092559151916001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3611ca69081620003868239f35b01519050388062000116565b90601f198316968460005282600020926000905b898210620001ea5750508386979896959610620001d0575b505050811b0190556200012a565b015160001960f88460031b161c19169055388080620001c2565b808885968294968601518155019501930190620001aa565b846000528160002083808601871c82019284871062000241575b01861c019086905b82811062000234575050620000fa565b6000815501869062000224565b925081926200021c565b602290634e487b7160e01b6000525260246000fd5b91607f1691620000e7565b604184634e487b7160e01b6000525260246000fd5b015190503880620000b5565b90889350601f1983169188600052856000209260005b87828210620002dd5750508411620002c3575b505050811b018455620000c9565b015160001960f88460031b161c19169055388080620002b5565b8385015186558c97909501949384019301620002a2565b90915086600052836000208580850160051c82019286861062000340575b918a91869594930160051c01915b828110620003305750506200009e565b600081558594508a910162000320565b9250819262000312565b602286634e487b7160e01b6000525260246000fd5b93607f169362000087565b634e487b7160e01b600052604160045260246000fd5b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde031461151757508163095ea7b3146114ed5781630e89439b146112ef5781630ef96356146110da57816318160ddd146110bb57816323b872dd14610ff05781632e8ddde614610fc8578163313ce56714610fac5781633950935114610f5d5781633f4ba83a14610eb15781634196ace214610e7a5781634b341aed14610e435781635c975abb14610e1f5781637033e4a614610e0457816370a0823114610dcd578163715018a614610d65578163752a50a614610ce757816377b3492714610b085781637c3a00fd14610ae9578163817b1cd214610aca5781638456cb5914610a625781638da5cb5b14610a3a57816395d89b411461091f578163a457c2d71461085e578163a9059cbb1461082d578163cd6ef9b114610340578163dd62ed3e146102f7578163f2fde38b1461020e578163fa14a50d14610199575063fc0c546a1461016f57600080fd5b346101955781600319360112610195576020906001600160a01b03600954169051908152f35b5080fd5b9190503461020a578060031936011261020a578060a0936001600160a01b036101c0611649565b168152600c60205281812060243582526020522060ff8154169260018201549260028301549160038401549301549381519515158652602086015284015260608301526080820152f35b8280fd5b90503461020a57602036600319011261020a57610229611649565b90610232611725565b6001600160a01b0380921692831561028e5750506008548273ffffffffffffffffffffffffffffffffffffffff19821617600855167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b50503461019557806003193601126101955780602092610315611649565b61031d611664565b6001600160a01b0391821683526002865283832091168252845220549051908152f35b8391503461019557606036600319011261019557803590602493843594604492833567ffffffffffffffff81116108295761037e90369083016116ce565b93610387611a8a565b338752602097600c8952848820818952895260ff8589205416156107e957338852600c89528488208189528952600285892001544211156107a957338852600c895284882081895289526103f66003868a200154338a52600c8b52868a20838b528b5284878b20015490611c63565b871161076957338852600c89528488209088528852818488200161041b87825461177d565b9055600a5480870290878204148715171561075757606461043d91048761177d565b6001600160a01b03600954169085517f70a0823100000000000000000000000000000000000000000000000000000000815230858201528a818781865afa90811561074d579082918b91610718575b50106106b2578891838b92885194859384927fa9059cbb000000000000000000000000000000000000000000000000000000008452338a8501528a8401525af19081156106a857906104e591899161067b575b50611af7565b3315610616573387526001885283872054928684106105b0575050508394957faf01bfc8475df280aca00b578c4a948e6d95700f0db8c13365240f7f973c875494600e9233895260018352038388205585600354036003558683518781527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef833392a333875281815282872061057c878254611c63565b905561058a86600b54611c63565b600b55338752526105a5818620549151928392339684611b51565b0390a2600160075580f35b6084929160227f45524332303a206275726e20616d6f756e7420657863656564732062616c616e928b88519562461bcd60e51b87528601528401528201527f63650000000000000000000000000000000000000000000000000000000000006064820152fd5b60217f45524332303a206275726e2066726f6d20746865207a65726f20616464726573929389608496519562461bcd60e51b87528601528401528201527f73000000000000000000000000000000000000000000000000000000000000006064820152fd5b61069b91508a3d8c116106a1575b61069381836116ac565b810190611adf565b8a6104df565b503d610689565b85513d8a823e3d90fd5b6084847f496e73756666696369656e742068616c6f20746f6b656e2062616c616e636520856033898f8c519562461bcd60e51b87528601528401528201527f696e207374616b696e6720636f6e7472616374000000000000000000000000006064820152fd5b8092508c8092503d8311610746575b61073181836116ac565b81010312610742578190518c61048c565b8980fd5b503d610727565b87513d8c823e3d90fd5b8388601185634e487b7160e01b835252fd5b50600e7f496e76616c696420616d6f756e74000000000000000000000000000000000000929389606496519562461bcd60e51b8752860152840152820152fd5b50600f7f5374616b65206e6f7420656e6465640000000000000000000000000000000000929389606496519562461bcd60e51b8752860152840152820152fd5b50600f7f5374616b65206e6f7420666f756e640000000000000000000000000000000000929389606496519562461bcd60e51b8752860152840152820152fd5b8680fd5b50503461019557806003193601126101955760209061085761084d611649565b60243590336117a0565b5160018152f35b9050823461091c578260031936011261091c57610879611649565b91836024359233815260026020528181206001600160a01b03861682526020522054908282106108b3576020856108578585038733611956565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152fd5b80fd5b82843461091c578060031936011261091c578151918160055492600184811c91818616958615610a30575b6020968785108114610a1d578899509688969785829a5291826000146109f657505060011461099a575b50505061099692916109879103856116ac565b51928284938452830190611609565b0390f35b9190869350600583527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db05b8284106109de5750505082010181610987610996610974565b8054848a0186015288955087949093019281016109c5565b60ff19168782015293151560051b8601909301935084925061098791506109969050610974565b60248360228c634e487b7160e01b835252fd5b92607f169261094a565b5050346101955781600319360112610195576020906001600160a01b03600854169051908152f35b50503461019557816003193601126101955760207f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25891610aa0611a8a565b610aa8611725565b610ab0611b70565b600160ff19600654161760065551338152a1600160075580f35b505034610195578160031936011261019557602090600b549051908152f35b505034610195578160031936011261019557602090600a549051908152f35b90503461020a578160031936011261020a5781519082820182811067ffffffffffffffff821117610cd4578352610b3d611649565b82526020820191602435835284549260ff8460081c161593848095610cc7575b8015610cb0575b15610c475760ff198116600117875584610c36575b506001600160a01b03928383511615610bf3575051600a55511673ffffffffffffffffffffffffffffffffffffffff19600954161760095582600b55610bbd575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b606490602087519162461bcd60e51b8352820152600f60248201527f496e76616c6964206164647265737300000000000000000000000000000000006044820152fd5b61ffff191661010117865538610b79565b608484602088519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b158015610b645750600160ff821614610b64565b50600160ff821610610b5d565b602485604184634e487b7160e01b835252fd5b90503461020a57602036600319011261020a57803591610d05611a8a565b610d0d611725565b60648311610d22575050600a55600160075580f35b906020606492519162461bcd60e51b8352820152601560248201527f496e76616c696420696e746572657374207261746500000000000000000000006044820152fd5b833461091c578060031936011261091c57610d7e611725565b806001600160a01b0360085473ffffffffffffffffffffffffffffffffffffffff198116600855167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50503461019557602036600319011261019557806020926001600160a01b03610df4611649565b1681526001845220549051908152f35b50503461019557816003193601126101955751908152602090f35b50503461019557816003193601126101955760209060ff6006541690519015158152f35b50503461019557602036600319011261019557806020926001600160a01b03610e6a611649565b168152600e845220549051908152f35b50503461019557602036600319011261019557806020926001600160a01b03610ea1611649565b168152600d845220549051908152f35b90503461020a578260031936011261020a57610ecb611a8a565b610ed3611725565b6006549060ff821615610f1a575060ff1916600655513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a1600160075580f35b606490602084519162461bcd60e51b8352820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152fd5b505034610195578060031936011261019557610857602092610fa5610f80611649565b91338152600286528481206001600160a01b038416825286528460243591205461177d565b9033611956565b5050346101955781600319360112610195576020905160128152f35b5050346101955781600319360112610195576020906001600160a01b03600954169051908152f35b839150346101955760603660031901126101955761100c611649565b611014611664565b9184604435946001600160a01b03841681526002602052818120338252602052205490600019820361104f575b6020866108578787876117a0565b848210611078575091839161106d6020969561085795033383611956565b919394819350611041565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346101955781600319360112610195576020906003549051908152f35b838334610195576060366003190112610195576110f5611649565b916024359260443567ffffffffffffffff811161020a5761111990369087016116ce565b611121611a8a565b611129611b70565b846001600160a01b03806009541688875180926323b872dd60e01b825281898161117a60209e8f973090339085016040919493929460608201956001600160a01b0380921683521660208201520152565b03925af19081156112e557906111969187916112ce5750611af7565b831692838552600d87528585206111ad8154611b42565b90556276a70042018042116112bb579161128a81869593898b9c88829d7fc65e53b88159e7d2c0fc12a0600072e28ae53ff73b4c1715369c30f160935142998d6112498651966111fc8861167a565b600188528488019242845281890194855260608901958b875260808a01978289528252600c815282822090600d8152838320548352522096511515879060ff801983541691151516179055565b51600186015551600285015551600384015551910155868952600e8c5289892061127483825461177d565b905561128282600b5461177d565b600b55611bc0565b838652600e89526112a48787205492885193849384611b51565b0390a28152600d8452205490600160075551908152f35b60248660118b634e487b7160e01b835252fd5b61069b9150893d8b116106a15761069381836116ac565b87513d88823e3d90fd5b83833461019557806003193601126101955782359160243567ffffffffffffffff8111610195576113248491369087016116ce565b61132c611b70565b611334611a8a565b60095484516323b872dd60e01b8152338189019081523060208281019190915260408201989098529091879183916001600160a01b03169082908890829060600103925af19081156114e357906113919185916114c65750611af7565b338352600d85528383206113a58154611b42565b90556276a70042018042116114b357907fc65e53b88159e7d2c0fc12a0600072e28ae53ff73b4c1715369c30f160935142918596978651916113e68361167a565b600183528983019042825288840190815260608401908782526080850192898452338a52600c8d528c600d8c8c2091528b8b20548b528d5261143a8b8b2096511515879060ff801983541691151516179055565b51600186015551600285015551600384015551910155338452600e875284842061146584825461177d565b905561147383600b5461177d565b600b556114808333611bc0565b338452600e87528484205461149b8651928392339684611b51565b0390a2338152600d8452205490600160075551908152f35b602484601189634e487b7160e01b835252fd5b6114dd9150873d89116106a15761069381836116ac565b886104df565b85513d86823e3d90fd5b50503461019557806003193601126101955760209061085761150d611649565b6024359033611956565b84843461019557816003193601126101955781845492600184811c918186169586156115ff575b6020968785108114610a1d579087899a92868b999a9b5291826000146115d557505060011461157a575b858861099689610987848a03856116ac565b815286935091907f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8284106115bd575050508201018161098761099688611568565b8054848a0186015288955087949093019281016115a3565b60ff19168882015294151560051b8701909401945085935061098792506109969150899050611568565b92607f169261153e565b919082519283825260005b848110611635575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201611614565b600435906001600160a01b038216820361165f57565b600080fd5b602435906001600160a01b038216820361165f57565b60a0810190811067ffffffffffffffff82111761169657604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761169657604052565b81601f8201121561165f5780359067ffffffffffffffff82116116965760405192611703601f8401601f1916602001856116ac565b8284526020838301011161165f57816000926020809301838601378301015290565b6001600160a01b0360085416330361173957565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b9190820180921161178a57565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038091169182156118ec5716918215611882576000828152600160205260408120549180831061181857604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef95876020965260018652038282205586815220818154019055604051908152a3565b608460405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152fd5b6001600160a01b03809116918215611a2157169182156119b75760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260028252604060002085600052825280604060002055604051908152a3565b608460405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152fd5b608460405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152fd5b600260075414611a9b576002600755565b606460405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b9081602091031261165f5751801515810361165f5790565b15611afe57565b606460405162461bcd60e51b815260206004820152600f60248201527f5472616e73666572206661696c656400000000000000000000000000000000006044820152fd5b600019811461178a5760010190565b611b6d9392606092825260208201528160408201520190611609565b90565b60ff60065416611b7c57565b606460405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152fd5b6001600160a01b0316908115611c1f577fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602082611c0260009460035461177d565b6003558484526001825260408420818154019055604051908152a3565b606460405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b9190820391821161178a5756fea2646970667358221220793cac817b45f66236e3dffdc7dab268f6a000409ab01beb54555749ad5cde6964736f6c63430008120033";

type StakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Staking__factory extends ContractFactory {
  constructor(...args: StakingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Staking> {
    return super.deploy(overrides || {}) as Promise<Staking>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Staking {
    return super.attach(address) as Staking;
  }
  override connect(signer: Signer): Staking__factory {
    return super.connect(signer) as Staking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new utils.Interface(_abi) as StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Staking {
    return new Contract(address, _abi, signerOrProvider) as Staking;
  }
}
