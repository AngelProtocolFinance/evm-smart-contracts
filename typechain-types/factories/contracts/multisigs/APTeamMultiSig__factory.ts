/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../common";
import type {
  APTeamMultiSig,
  APTeamMultiSigInterface,
} from "../../../contracts/multisigs/APTeamMultiSig";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "Confirmation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "Execution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "ExecutionFailure",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnerAddition",
    type: "event",
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
    ],
    name: "OwnerRemoval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
    ],
    name: "RequirementChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "Revocation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address",
            name: "destination",
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
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct MultiSigStorage.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    name: "Submission",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "MAX_OWNER_COUNT",
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
        name: "_owner",
        type: "address",
      },
    ],
    name: "addOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_required",
        type: "uint256",
      },
    ],
    name: "changeRequirement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "confirmTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "confirmations",
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
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "getConfirmationCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
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
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "getConfirmations",
    outputs: [
      {
        internalType: "address[]",
        name: "ownerConfirmations",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "pending",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    name: "getTransactionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
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
        name: "from",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "to",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "pending",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    name: "getTransactionIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "transactionIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_required",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_requireExecution",
        type: "bool",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "isConfirmed",
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
        name: "",
        type: "address",
      },
    ],
    name: "isOwner",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "owners",
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
        name: "_owner",
        type: "address",
      },
    ],
    name: "removeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "replaceOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "requireExecution",
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
    name: "required",
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
        name: "transactionId",
        type: "uint256",
      },
    ],
    name: "revokeConfirmation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "destination",
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
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "submitTransaction",
    outputs: [
      {
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
    ],
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
    name: "transactionCount",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "transactions",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "destination",
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
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6080806040523461001b57600160075561201390816100218239f35b600080fdfe6080806040526004361015610028575b5036156100205761001e611d87565b005b61001e611d87565b60003560e01c90816301ffc9a714611ad257508063025e7c2714611a90578063173825d9146118fb57806320ea8d86146118455780632f54bf6e146118065780633411c81c146117b957806354741525146117005780637065cb4814611604578063784547a7146115dc5780638b51d13f1461154f5780639ace38c214611448578063a0e67e2b146113ca578063a8abe69a14611265578063b5dc40c314611162578063b77bf60014611144578063b781694a14611121578063ba51a6df14611095578063c01a8c8414610efe578063d74f8edd14610ee2578063dc8452cd14610ec4578063e20056e614610d83578063ee22610b14610c27578063f06a7522146104695763f72b230d1461013d573861000f565b34610288576060366003190112610288576001600160401b0360043581811161028857366023820112156102885780600401359161017a83611d70565b926101886040519485611c69565b80845260209081850193846024809360051b83010191368311610288578301905b82821061044a575050506101bb611b6f565b9060069081549060ff95868360101c16159283809461043b575b8015610422575b156103c75761ff00198116610100178555836103b4575b508851603281111590816103a7575b8161039c575b81610392575b50156102885760005b89518110156102a4576001600160a01b039081610234828d611dcb565b511660005260028089528b83838c6040600020541615928361028d575b505050156102885761028392610267838e611dcb565b511660005288526040600020600160ff19825416179055611dbc565b610217565b600080fd5b610298929350611dcb565b5116151583838e610251565b50878997939495975191821161037d57600160401b821161037d5760035482600355808310610359575b50600360005260005b8281106103305750505035600455825494151516908160ff1986161783556102fb57005b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989362ff00ff191617905560405160018152a1005b81516001600160a01b0316600080516020611fbe833981519152820155908701906001016102d7565b6103779083600080516020611fbe8339815191529182019101611ddf565b886102ce565b82634e487b7160e01b60005260416004526000fd5b905015153861020e565b833515159150610208565b8091508335111590610202565b62ffff00191662010100178455386101f3565b60405162461bcd60e51b815260048101889052602e818501527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101dc57506001888260081c16146101dc565b506001888260081c16106101d5565b81356001600160a01b03811681036102885781529084019084016101a9565b346102885760c0366003190112610288576004356001600160401b03811161028857610499903690600401611d29565b6024356001600160401b038111610288576104b8903690600401611d29565b906044356001600160a01b03811690819003610288576084356001600160401b038111610288576104ed903690600401611d29565b60a4356001600160401b0381116102885761050c903690600401611d29565b90821561028857600554926040519460e086018681106001600160401b03821117610aa857604052855260208501958652604085015260643560608501526080840152600060a084015260c083015280600052600060205260406000209282518051906001600160401b038211610aa85781906105938261058d8954611b7e565b89611f44565b602090601f8311600114610bc157600092610bb6575b50508160011b916000199060031b1c19161784555b519283516001600160401b038111610aa8576105ea816105e16001850154611b7e565b60018501611f44565b6020601f8211600114610b47578192939495600092610b3c575b50508160011b916000199060031b1c19161760018201555b6002810160018060a01b036040850151166bffffffffffffffffffffffff60a01b8254161790556060830151600382015560808301519283516001600160401b038111610aa85761067d816106746004860154611b7e565b60048601611f44565b6020601f8211600114610ac957819060c0949596600092610abe575b50508160011b916000199060031b1c19161760048401555b6005830160a0820151151560ff8019835416911617905501518051906001600160401b038211610aa8576106f5826106ec6006860154611b7e565b60068601611f44565b602090601f8311600114610a38576006929160009183610a2d575b50508160011b916000199060031b1c1916179101555b60055460018101809111610a1757600555806000526000602052807f180494405e1822cfac7f46cb28e05d25c4e51a01231c971781dfcab4f00639216107f860406000206040519182916020835260e06020840152600661078b610100850183611bb8565b916107d96107a9601f19948588820301604089015260018401611bb8565b60028301546001600160a01b0316606088015260038301546080880152868103850160a088015260048301611bb8565b9260ff600583015416151560c08701528584030160e086015201611bb8565b0390a2610803611e03565b33600052600260205260ff6040600020541615610288576000818152602081905260409020600201546001600160a01b03161561028857600160205260406000203360005260205260ff60406000205416610288578060005260016020526040600020336000526020526040600020600160ff1982541617905580337f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef600080a360ff60065416156108c0575b6020906001600755604051908152f35b600260205260ff60406000205416156102885780600052600160205260406000203360005260205260ff60406000205416156102885780600052600060205260ff60056040600020015416610288578061091b602092611e9d565b610927575b90506108b0565b80600052600082526109e3604060002060058101600160ff19825416179055600080600460018060a01b036002850154166109786003860154956109716040518095819301611bb8565b0383611c69565b6040519461098586611c4e565b601d86527f63616c6c20726576657274656420776974686f7574206d657373616765000000898701528883519301915af13d15610a0f573d906109c782611d0e565b916109d56040519384611c69565b82523d60008784013e611e59565b50807f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a2610920565b606090611e59565b634e487b7160e01b600052601160045260246000fd5b015190508580610710565b906006840160005260206000209160005b601f1985168110610a905750918391600193600695601f19811610610a77575b505050811b01910155610726565b015160001960f88460031b161c19169055858080610a69565b91926020600181928685015181550194019201610a49565b634e487b7160e01b600052604160045260246000fd5b015190508680610699565b6004840160005260206000209560005b601f1984168110610b24575095829160c0959697600194601f19811610610b0b575b505050811b0160048401556106b1565b015160001960f88460031b161c19169055868080610afb565b82820151885560019097019660209283019201610ad9565b015190508580610604565b6001830160005260206000209060005b601f1984168110610b9e575060019394959683601f19811610610b85575b505050811b01600182015561061c565b015160001960f88460031b161c19169055858080610b75565b9091602060018192858b015181550193019101610b57565b0151905086806105a9565b6000888152602081209350601f198516905b818110610c0f5750908460019594939210610bf6575b505050811b0184556105be565b015160001960f88460031b161c19169055868080610be9565b92936020600181928786015181550195019301610bd3565b34610288576020806003193601126102885760043590336000526002815260ff6040600020541615610288578160005260018152604060002033600052815260ff604060002054161561028857816000526000815260ff6005604060002001541661028857610c9582611e9d565b610c9b57005b610d5290826000526000815260406000209060058201600160ff19825416179055600080600460018060a01b03600286015416610ce76003870154966109716040518095819301611bb8565b60405195610cf487611c4e565b601d87527f63616c6c20726576657274656420776974686f7574206d657373616765000000868801528583519301915af13d15610d7a573d610d3581611d0e565b90610d436040519283611c69565b8152600081933d92013e611e59565b507f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a2005b60609150611e59565b3461028857604036600319011261028857610d9c611b43565b610da4611b59565b90303303610288576001600160a01b0390811660008181526002602052604090205460ff161561028857818316928360005260ff604060002054166102885760005b60038054821015610eba57848491610dfd84611b08565b9054911b1c1614610e1657610e1190611dbc565b610de6565b610e44929350610e2590611b08565b90919082549060031b9160018060a01b03809116831b921b1916179055565b806000526002602052604060002060ff19908181541690558260005260016040600020918254161790557f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b90600080a27ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d600080a2005b5050509050610e44565b34610288576000366003190112610288576020600454604051908152f35b3461028857600036600319011261028857602060405160328152f35b346102885760208060031936011261028857600435610f1b611e03565b336000526002825260ff80604060002054161561028857600082815280845260409020600201546001600160a01b03919082161561028857600193848152604060002033600052815281604060002054166102885783600052848152604060002033600052815260406000209160ff1992868482541617905584337f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef600080a3806006541615610fcd575b6007869055005b6002825280604060002054161561028857846000528582526040600020336000528252806040600020541615610288578460005260008252600560406000200154166102885761101c84611e9d565b611027575b80610fc6565b6000806004611066958783528285526040832095896005880191825416179055600286015416610ce76003870154966109716040518095819301611bb8565b507f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a281808080611021565b34610288576020366003190112610288576004353033036102885760035460328111159081611116575b8161110c575b81611102575b5015610288576020817fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a92600455604051908152a1005b90501515826110cb565b82151591506110c5565b8083111591506110bf565b3461028857600036600319011261028857602060ff600654166040519015158152f35b34610288576000366003190112610288576020600554604051908152f35b346102885760208060031936011261028857600435600380549061118582611f8b565b9360009360005b8481106111e857868661119e81611f8b565b9160005b8281106111bb57604051806111b78682611cca565b0390f35b6111e3906001600160a01b036111d18285611dcb565b51166111dd8287611dcb565b52611dbc565b6111a2565b81600052600180845260406000206111ff83611b08565b90546001600160a01b0391881b1c8116600090815291865260409091205460ff16611235575b505061123090611dbc565b61118c565b611240839893611b08565b905490871b1c16611251838a611dcb565b528101809111610a17579461123088611225565b346102885760803660031901126102885760248035600435611285611b6f565b926064359384151585036102885760058054916112a183611f8b565b9660009260005b858110611339578989896112c46112bf8284611df6565b611f8b565b92815b8381106113125784604051809160208083018184528251809152816040850193019160005b8281106112fb57505050500390f35b8351855286955093810193928101926001016112ec565b806113206113349284611dcb565b516111dd61132e8684611df6565b88611dcb565b6112c7565b83806113af575b801561138d575b61135a575b61135590611dbc565b6112a8565b9384611366828c611dcb565b5260018101809111611378579361134c565b86634e487b7160e01b60005260116004526000fd5b50828015611347575080600052600060205260ff826040600020015416611347565b5080600052600060205260ff82604060002001541615611340565b346102885760003660031901126102885760405180600354918281526020809101926003600052600080516020611fbe833981519152916000905b828210611428576111b78561141c81890382611c69565b60405191829182611cca565b83546001600160a01b031686529485019460019384019390910190611405565b3461028857602036600319011261028857600435600052600060205261151460406000206111b760405191611488836114818184611bb8565b0384611c69565b600661153a6040516114a8816114a18160018801611bb8565b0382611c69565b600284015460038501546040516001600160a01b0390921692611522906114dd846114d68160048c01611bb8565b0385611c69565b61150060ff60058a015416986114f9604051809a819301611bb8565b0388611c69565b6040519a8b9a60e08c5260e08c0190611c8a565b908a820360208c0152611c8a565b92604089015260608801528682036080880152611c8a565b91151560a085015283820360c0850152611c8a565b34610288576020806003193601126102885760038054600091600435835b83811061157e578585604051908152f35b816000526001808752604060002061159583611b08565b905490861b1c6001600160a01b03166000908152908852604090205460ff166115c8575b506115c390611dbc565b61156d565b85919501809111610a1757936115c36115b9565b346102885760203660031901126102885760206115fa600435611e9d565b6040519015158152f35b346102885760203660031901126102885761161d611b43565b303303610288576001600160a01b03811660008181526002602052604090205490919060ff166102885781156102885760035460018101809111610a175760045490603281111591826116f5575b826116eb575b50816116e1575b5015610288578160005260026020526040600020600160ff1982541617905560035490600160401b821015610aa857610e258260016116ba9401600355611b08565b7ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d600080a2005b9050151583611678565b1515915084611671565b81811115925061166b565b3461028857604036600319011261028857600435801515810361028857602490813580151581036102885760009160009160058054935b84811061174957602086604051908152f35b838061179e575b801561177c575b61176a575b61176590611dbc565b611737565b9460018101809111611378579461175c565b50828015611757575080600052600060205260ff826040600020015416611757565b5080600052600060205260ff82604060002001541615611750565b34610288576040366003190112610288576117d2611b59565b600435600052600160205260406000209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b34610288576020366003190112610288576001600160a01b03611827611b43565b166000526002602052602060ff604060002054166040519015158152f35b34610288576020806003193601126102885760043590611863611e03565b336000526002815260ff6040600020541615610288578160005260018152604060002033600052815260ff604060002054161561028857816000526000815260ff6005604060002001541661028857600181526040600020903360005252604060002060ff198154169055337ff6a317157440607f36269043eb55f1287a5a19ba2216afeab88cd46cbcfb88e9600080a36001600755005b3461028857602036600319011261028857611914611b43565b303303610288576001600160a01b039081166000818152600260205260409020805491929160ff8116156102885760ff1916905560005b6003805460001981019291908311610a1757828493831015611a8757858461197285611b08565b905490851b1c161461198f57505061198a9150611dbc565b61194b565b92610e25916119a06119ac95611b08565b9054911b1c1691611b08565b6003548015611a715760001901906119c382611b08565b909182549160031b1b19169055806003558060045411611a06575b507f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b90600080a2005b603281111580611a69575b80611a60575b80611a57575b15610288576020817fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a92600455604051908152a1816119de565b50801515611a1d565b50801515611a17565b506001611a11565b634e487b7160e01b600052603160045260246000fd5b505050506119ac565b346102885760203660031901126102885760043560035481101561028857611ab9602091611b08565b905460405160039290921b1c6001600160a01b03168152f35b34610288576020366003190112610288576004359063ffffffff60e01b8216809203610288576020916301ffc9a760e01b148152f35b600354811015611b2d576003600052600080516020611fbe8339815191520190600090565b634e487b7160e01b600052603260045260246000fd5b600435906001600160a01b038216820361028857565b602435906001600160a01b038216820361028857565b60443590811515820361028857565b90600182811c92168015611bae575b6020831014611b9857565b634e487b7160e01b600052602260045260246000fd5b91607f1691611b8d565b9060009291805491611bc983611b7e565b918282526001938481169081600014611c2b5750600114611beb575b50505050565b90919394506000526020928360002092846000945b838610611c17575050505001019038808080611be5565b805485870183015294019385908201611c00565b9294505050602093945060ff191683830152151560051b01019038808080611be5565b604081019081106001600160401b03821117610aa857604052565b90601f801991011681019081106001600160401b03821117610aa857604052565b919082519283825260005b848110611cb6575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201611c95565b6020908160408183019282815285518094520193019160005b828110611cf1575050505090565b83516001600160a01b031685529381019392810192600101611ce3565b6001600160401b038111610aa857601f01601f191660200190565b81601f8201121561028857803590611d4082611d0e565b92611d4e6040519485611c69565b8284526020838301011161028857816000926020809301838601378301015290565b6001600160401b038111610aa85760051b60200190565b34611d8e57565b6040513481527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c60203392a2565b6000198114610a175760010190565b8051821015611b2d5760209160051b010190565b818110611dea575050565b60008155600101611ddf565b91908203918211610a1757565b600260075414611e14576002600755565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b90919015611e65575090565b815115611e755750805190602001fd5b60405162461bcd60e51b815260206004820152908190611e99906024830190611c8a565b0390fd5b6000806003918254936004908154935b868110611ec05750505050505050600090565b81600052600160ff60208281526040908160002090611ede86611b08565b9054908c1b1c6001600160a01b03166000908152919052205416611f1e575b858514611f135750611f0e90611dbc565b611ead565b965050505050505090565b93848101809111611f2f5793611efd565b601184634e487b7160e01b6000525260246000fd5b9190601f8111611f5357505050565b611f7f926000526020600020906020601f840160051c83019310611f81575b601f0160051c0190611ddf565b565b9091508190611f72565b90611f9582611d70565b611fa26040519182611c69565b8281528092611fb3601f1991611d70565b019060203691013756fec2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85ba264697066735822122035e686b16cd9897d415b587522d0b43f173975e458c217d9ed4b2e105e2b723a64736f6c63430008120033";

type APTeamMultiSigConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: APTeamMultiSigConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class APTeamMultiSig__factory extends ContractFactory {
  constructor(...args: APTeamMultiSigConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<APTeamMultiSig> {
    return super.deploy(overrides || {}) as Promise<APTeamMultiSig>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): APTeamMultiSig {
    return super.attach(address) as APTeamMultiSig;
  }
  override connect(signer: Signer): APTeamMultiSig__factory {
    return super.connect(signer) as APTeamMultiSig__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): APTeamMultiSigInterface {
    return new utils.Interface(_abi) as APTeamMultiSigInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): APTeamMultiSig {
    return new Contract(address, _abi, signerOrProvider) as APTeamMultiSig;
  }
}
