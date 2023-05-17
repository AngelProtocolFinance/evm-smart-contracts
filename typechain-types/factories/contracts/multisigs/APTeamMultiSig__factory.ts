/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  APTeamMultiSig,
  APTeamMultiSigInterface,
} from "../../../contracts/multisigs/APTeamMultiSig";

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
        name: "owner",
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
        name: "required",
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
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "requireexecution",
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
        name: "owner",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "newOwner",
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
  "0x6080806040523461001b576001600755611f6190816100218239f35b600080fdfe6080806040526004361015610028575b5036156100205761001e611cff565b005b61001e611cff565b60003560e01c90816301ffc9a714611a3857508063025e7c27146119f6578063173825d91461186557806320ea8d86146117af5780632f54bf6e146117705780633411c81c14611723578063547415251461166a5780637065cb4814611569578063784547a7146115415780638b51d13f146114b45780639ace38c2146113ad578063a0e67e2b1461131d578063a8abe69a146111b8578063b5dc40c3146110b5578063b77bf60014611097578063b781694a14611074578063ba51a6df14610fec578063c01a8c8414610e55578063d74f8edd14610e39578063dc8452cd14610e1b578063e20056e614610cda578063ee22610b14610b7e578063f06a7522146103c05763f72b230d1461013d573861000f565b34610281576060366003190112610281576004356001600160401b038111610281573660238201121561028157806004013561017881611ce8565b916101866040519384611be1565b81835260209160248385019160051b8301019136831161028157602401905b8282106103a1575050506024356101ba611ae7565b9160069283549360ff93848660101c161595868097610392575b8015610379575b1561031d5761ff001981166101001783558661030a575b508651603281111591826102ff575b826102f5575b50816102eb575b50156102815760005b865181101561029b576001600160a01b039081610234828a611d43565b5116600052600280865286604060002054161580610286575b156102815761027c92610260838b611d43565b511660005285526040600020600160ff19825416179055611d34565b610217565b600080fd5b5082610292838b611d43565b5116151561024d565b50805460ff198116921515909416918217815590846102b657005b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989362ff00ff191617905560405160018152a1005b905015153861020e565b1515915038610207565b818111159250610201565b62ffff00191662010100178255386101f2565b60405162461bcd60e51b815260048101869052602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101db57506001868260081c16146101db565b506001868260081c16106101d4565b81356001600160a01b03811681036102815781529083019083016101a5565b346102815760c0366003190112610281576004356001600160401b038111610281576103f0903690600401611ca1565b6024356001600160401b0381116102815761040f903690600401611ca1565b906044356001600160a01b03811690819003610281576084356001600160401b03811161028157610444903690600401611ca1565b60a4356001600160401b03811161028157610463903690600401611ca1565b90821561028157600554926040519460e086018681106001600160401b038211176109ff57604052855260208501958652604085015260643560608501526080840152600060a084015260c083015280600052600060205260406000209282518051906001600160401b0382116109ff5781906104ea826104e48954611af6565b89611ea5565b602090601f8311600114610b1857600092610b0d575b50508160011b916000199060031b1c19161784555b519283516001600160401b0381116109ff57610541816105386001850154611af6565b60018501611ea5565b6020601f8211600114610a9e578192939495600092610a93575b50508160011b916000199060031b1c19161760018201555b6002810160018060a01b036040850151166bffffffffffffffffffffffff60a01b8254161790556060830151600382015560808301519283516001600160401b0381116109ff576105d4816105cb6004860154611af6565b60048601611ea5565b6020601f8211600114610a2057819060c0949596600092610a15575b50508160011b916000199060031b1c19161760048401555b6005830160a0820151151560ff8019835416911617905501518051906001600160401b0382116109ff5761064c826106436006860154611af6565b60068601611ea5565b602090601f831160011461098f576006929160009183610984575b50508160011b916000199060031b1c1916179101555b6005546001810180911161096e57600555806000526000602052807f180494405e1822cfac7f46cb28e05d25c4e51a01231c971781dfcab4f006392161074f60406000206040519182916020835260e0602084015260066106e2610100850183611b30565b91610730610700601f19948588820301604089015260018401611b30565b60028301546001600160a01b0316606088015260038301546080880152868103850160a088015260048301611b30565b9260ff600583015416151560c08701528584030160e086015201611b30565b0390a261075a611d64565b33600052600260205260ff6040600020541615610281576000818152602081905260409020600201546001600160a01b03161561028157600160205260406000203360005260205260ff60406000205416610281578060005260016020526040600020336000526020526040600020600160ff1982541617905580337f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef600080a360ff6006541615610817575b6020906001600755604051908152f35b600260205260ff60406000205416156102815780600052600160205260406000203360005260205260ff60406000205416156102815780600052600060205260ff600560406000200154166102815780610872602092611dfe565b61087e575b9050610807565b806000526000825261093a604060002060058101600160ff19825416179055600080600460018060a01b036002850154166108cf6003860154956108c86040518095819301611b30565b0383611be1565b604051946108dc86611bc6565b601d86527f63616c6c20726576657274656420776974686f7574206d657373616765000000898701528883519301915af13d15610966573d9061091e82611c86565b9161092c6040519384611be1565b82523d60008784013e611dba565b50807f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a2610877565b606090611dba565b634e487b7160e01b600052601160045260246000fd5b015190508580610667565b906006840160005260206000209160005b601f19851681106109e75750918391600193600695601f198116106109ce575b505050811b0191015561067d565b015160001960f88460031b161c191690558580806109c0565b919260206001819286850151815501940192016109a0565b634e487b7160e01b600052604160045260246000fd5b0151905086806105f0565b6004840160005260206000209560005b601f1984168110610a7b575095829160c0959697600194601f19811610610a62575b505050811b016004840155610608565b015160001960f88460031b161c19169055868080610a52565b82820151885560019097019660209283019201610a30565b01519050858061055b565b6001830160005260206000209060005b601f1984168110610af5575060019394959683601f19811610610adc575b505050811b016001820155610573565b015160001960f88460031b161c19169055858080610acc565b9091602060018192858b015181550193019101610aae565b015190508680610500565b6000888152602081209350601f198516905b818110610b665750908460019594939210610b4d575b505050811b018455610515565b015160001960f88460031b161c19169055868080610b40565b92936020600181928786015181550195019301610b2a565b34610281576020806003193601126102815760043590336000526002815260ff6040600020541615610281578160005260018152604060002033600052815260ff604060002054161561028157816000526000815260ff6005604060002001541661028157610bec82611dfe565b610bf257005b610ca990826000526000815260406000209060058201600160ff19825416179055600080600460018060a01b03600286015416610c3e6003870154966108c86040518095819301611b30565b60405195610c4b87611bc6565b601d87527f63616c6c20726576657274656420776974686f7574206d657373616765000000868801528583519301915af13d15610cd1573d610c8c81611c86565b90610c9a6040519283611be1565b8152600081933d92013e611dba565b507f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a2005b60609150611dba565b3461028157604036600319011261028157610cf3611abb565b610cfb611ad1565b90303303610281576001600160a01b0390811660008181526002602052604090205460ff161561028157818316928360005260ff604060002054166102815760005b60038054821015610e1157848491610d5484611a6e565b9054911b1c1614610d6d57610d6890611d34565b610d3d565b610d9b929350610d7c90611a6e565b90919082549060031b9160018060a01b03809116831b921b1916179055565b806000526002602052604060002060ff19908181541690558260005260016040600020918254161790557f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b90600080a27ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d600080a2005b5050509050610d9b565b34610281576000366003190112610281576020600454604051908152f35b3461028157600036600319011261028157602060405160328152f35b346102815760208060031936011261028157600435610e72611d64565b336000526002825260ff80604060002054161561028157600082815280845260409020600201546001600160a01b03919082161561028157600193848152604060002033600052815281604060002054166102815783600052848152604060002033600052815260406000209160ff1992868482541617905584337f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef600080a3806006541615610f24575b6007869055005b60028252806040600020541615610281578460005285825260406000203360005282528060406000205416156102815784600052600082526005604060002001541661028157610f7384611dfe565b610f7e575b80610f1d565b6000806004610fbd958783528285526040832095896005880191825416179055600286015416610c3e6003870154966108c86040518095819301611b30565b507f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75600080a281808080610f78565b34610281576020366003190112610281576004353033036102815760035460328111159081611069575b8161105f575b81611055575b50156102815760207fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a91604051908152a1005b9050151582611022565b821515915061101c565b808311159150611016565b3461028157600036600319011261028157602060ff600654166040519015158152f35b34610281576000366003190112610281576020600554604051908152f35b34610281576020806003193601126102815760043560038054906110d882611ef9565b9360009360005b84811061113b5786866110f181611ef9565b9160005b82811061110e576040518061110a8682611c42565b0390f35b611136906001600160a01b036111248285611d43565b51166111308287611d43565b52611d34565b6110f5565b816000526001808452604060002061115283611a6e565b90546001600160a01b0391881b1c8116600090815291865260409091205460ff16611188575b505061118390611d34565b6110df565b611193839893611a6e565b905490871b1c166111a4838a611d43565b52810180911161096e579461118388611178565b3461028157608036600319011261028157602480356004356111d8611ae7565b926064359384151585036102815760058054916111f483611ef9565b9660009260005b85811061128c578989896112176112128284611d57565b611ef9565b92815b8381106112655784604051809160208083018184528251809152816040850193019160005b82811061124e57505050500390f35b83518552869550938101939281019260010161123f565b806112736112879284611d43565b516111306112818684611d57565b88611d43565b61121a565b8380611302575b80156112e0575b6112ad575b6112a890611d34565b6111fb565b93846112b9828c611d43565b52600181018091116112cb579361129f565b86634e487b7160e01b60005260116004526000fd5b5082801561129a575080600052600060205260ff82604060002001541661129a565b5080600052600060205260ff82604060002001541615611293565b3461028157600036600319011261028157604051806003549182815260208091019260036000527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b916000905b82821061138d5761110a8561138181890382611be1565b60405191829182611c42565b83546001600160a01b03168652948501946001938401939091019061136a565b34610281576020366003190112610281576004356000526000602052611479604060002061110a604051916113ed836113e68184611b30565b0384611be1565b600661149f60405161140d816114068160018801611b30565b0382611be1565b600284015460038501546040516001600160a01b0390921692611487906114428461143b8160048c01611b30565b0385611be1565b61146560ff60058a0154169861145e604051809a819301611b30565b0388611be1565b6040519a8b9a60e08c5260e08c0190611c02565b908a820360208c0152611c02565b92604089015260608801528682036080880152611c02565b91151560a085015283820360c0850152611c02565b34610281576020806003193601126102815760038054600091600435835b8381106114e3578585604051908152f35b81600052600180875260406000206114fa83611a6e565b905490861b1c6001600160a01b03166000908152908852604090205460ff1661152d575b5061152890611d34565b6114d2565b8591950180911161096e579361152861151e565b3461028157602036600319011261028157602061155f600435611dfe565b6040519015158152f35b3461028157602036600319011261028157611582611abb565b303303610281576001600160a01b03811660008181526002602052604090205490919060ff16610281578115610281576003546001810180911161096e57600454906032811115918261165f575b82611655575b508161164b575b5015610281578160005260026020526040600020600160ff1982541617905560035490680100000000000000008210156109ff57610d7c8260016116249401600355611a6e565b7ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d600080a2005b90501515836115dd565b15159150846115d6565b8181111592506115d0565b3461028157604036600319011261028157600435801515810361028157602490813580151581036102815760009160009160058054935b8481106116b357602086604051908152f35b8380611708575b80156116e6575b6116d4575b6116cf90611d34565b6116a1565b94600181018091116112cb57946116c6565b508280156116c1575080600052600060205260ff8260406000200154166116c1565b5080600052600060205260ff826040600020015416156116ba565b346102815760403660031901126102815761173c611ad1565b600435600052600160205260406000209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b34610281576020366003190112610281576001600160a01b03611791611abb565b166000526002602052602060ff604060002054166040519015158152f35b346102815760208060031936011261028157600435906117cd611d64565b336000526002815260ff6040600020541615610281578160005260018152604060002033600052815260ff604060002054161561028157816000526000815260ff6005604060002001541661028157600181526040600020903360005252604060002060ff198154169055337ff6a317157440607f36269043eb55f1287a5a19ba2216afeab88cd46cbcfb88e9600080a36001600755005b346102815760203660031901126102815761187e611abb565b303303610281576001600160a01b039081166000818152600260205260409020805491929160ff8116156102815760ff1916905560005b600380546000198101929190831161096e578284938310156119ed5785846118dc85611a6e565b905490851b1c16146118f95750506118f49150611d34565b6118b5565b92610d7c9161190a61191695611a6e565b9054911b1c1691611a6e565b60035480156119d757600019019061192d82611a6e565b909182549160031b1b19169055806003558060045411611970575b507f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b90600080a2005b6032811115806119cf575b806119c6575b806119bd575b156102815760207fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a91604051908152a181611948565b50801515611987565b50801515611981565b50600161197b565b634e487b7160e01b600052603160045260246000fd5b50505050611916565b346102815760203660031901126102815760043560035481101561028157611a1f602091611a6e565b905460405160039290921b1c6001600160a01b03168152f35b34610281576020366003190112610281576004359063ffffffff60e01b8216809203610281576020916301ffc9a760e01b148152f35b600354811015611aa55760036000527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b0190600090565b634e487b7160e01b600052603260045260246000fd5b600435906001600160a01b038216820361028157565b602435906001600160a01b038216820361028157565b60443590811515820361028157565b90600182811c92168015611b26575b6020831014611b1057565b634e487b7160e01b600052602260045260246000fd5b91607f1691611b05565b9060009291805491611b4183611af6565b918282526001938481169081600014611ba35750600114611b63575b50505050565b90919394506000526020928360002092846000945b838610611b8f575050505001019038808080611b5d565b805485870183015294019385908201611b78565b9294505050602093945060ff191683830152151560051b01019038808080611b5d565b604081019081106001600160401b038211176109ff57604052565b90601f801991011681019081106001600160401b038211176109ff57604052565b919082519283825260005b848110611c2e575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201611c0d565b6020908160408183019282815285518094520193019160005b828110611c69575050505090565b83516001600160a01b031685529381019392810192600101611c5b565b6001600160401b0381116109ff57601f01601f191660200190565b81601f8201121561028157803590611cb882611c86565b92611cc66040519485611be1565b8284526020838301011161028157816000926020809301838601378301015290565b6001600160401b0381116109ff5760051b60200190565b34611d0657565b6040513481527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c60203392a2565b600019811461096e5760010190565b8051821015611aa55760209160051b010190565b9190820391821161096e57565b600260075414611d75576002600755565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b90919015611dc6575090565b815115611dd65750805190602001fd5b60405162461bcd60e51b815260206004820152908190611dfa906024830190611c02565b0390fd5b6000806003918254936004908154935b868110611e215750505050505050600090565b81600052600160ff60208281526040908160002090611e3f86611a6e565b9054908c1b1c6001600160a01b03166000908152919052205416611e7f575b858514611e745750611e6f90611d34565b611e0e565b965050505050505090565b93848101809111611e905793611e5e565b601184634e487b7160e01b6000525260246000fd5b90601f8111611eb357505050565b600091825260208220906020601f850160051c83019410611eef575b601f0160051c01915b828110611ee457505050565b818155600101611ed8565b9092508290611ecf565b90611f0382611ce8565b611f106040519182611be1565b8281528092611f21601f1991611ce8565b019060203691013756fea2646970667358221220048a3da8cf1b9246c463d94bbf1b739bc767cac0ce2e2cce46ac9a5d7178ca0d64736f6c63430008120033";

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
