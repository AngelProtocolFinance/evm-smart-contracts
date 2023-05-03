/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERC721,
  ERC721Interface,
} from "../../../../../@openzeppelin/contracts/token/ERC721/ERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
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
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
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
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
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
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052346200031957620012e0803803806200001d816200031e565b928339810190604081830312620003195780516001600160401b03908181116200031957836200004f91840162000344565b916020938482015183811162000319576200006b920162000344565b825190828211620003035760008054926001958685811c95168015620002f8575b88861014620002e4578190601f9586811162000291575b5088908683116001146200022d57849262000221575b5050600019600383901b1c191690861b1781555b81519384116200020d5784548581811c9116801562000202575b87821014620001ee57838111620001a6575b50859284116001146200014157839495509262000135575b5050600019600383901b1c191690821b1790555b604051610f299081620003b78239f35b01519050388062000111565b9190601f1984169585845280842093905b8782106200018e5750508385961062000174575b505050811b01905562000125565b015160001960f88460031b161c1916905538808062000166565b80878596829496860151815501950193019062000152565b8582528682208480870160051c820192898810620001e4575b0160051c019086905b828110620001d8575050620000f9565b838155018690620001c8565b92508192620001bf565b634e487b7160e01b82526022600452602482fd5b90607f1690620000e7565b634e487b7160e01b81526041600452602490fd5b015190503880620000b9565b8480528985208994509190601f198416865b8c8282106200027a575050841162000260575b505050811b018155620000cd565b015160001960f88460031b161c1916905538808062000252565b8385015186558c979095019493840193016200023f565b9091508380528884208680850160051c8201928b8610620002da575b918a91869594930160051c01915b828110620002cb575050620000a3565b8681558594508a9101620002bb565b92508192620002ad565b634e487b7160e01b83526022600452602483fd5b94607f16946200008c565b634e487b7160e01b600052604160045260246000fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200030357604052565b919080601f84011215620003195782516001600160401b03811162000303576020906200037a601f8201601f191683016200031e565b92818452828287010111620003195760005b818110620003a257508260009394955001015290565b85810183015184820184015282016200038c56fe608060408181526004918236101561001657600080fd5b600092833560e01c91826301ffc9a7146107815750816306fdde03146106b6578163081812fc1461068e578163095ea7b3146104f957816323b872dd146104cf57816342842e0e146104a65781636352211e1461047657816370a08231146103cc57816395d89b41146102b3578163a22cb465146101e3578163b88d4fde14610155578163c87b56dd14610104575063e985e9c5146100b457600080fd5b3461010057806003193601126101005760ff816020936100d2610890565b6100da6108ab565b6001600160a01b0391821683526005875283832091168252855220549151911615158152f35b5080fd5b838334610100576020366003190112610100576101246101519335610d13565b818151610130816108f6565b5280519161013d836108f6565b825251918291602083526020830190610850565b0390f35b919050346101df5760803660031901126101df57610171610890565b6101796108ab565b846064359467ffffffffffffffff8611610100573660238701121561010057850135946101b16101a88761094a565b95519586610928565b858552366024878301011161010057856101dc96602460209301838801378501015260443591610a6a565b80f35b8280fd5b919050346101df57806003193601126101df576101fe610890565b90602435918215158093036102af576001600160a01b03169283331461026d5750338452600560205280842083855260205280842060ff1981541660ff8416179055519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a380f35b6020606492519162461bcd60e51b8352820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152fd5b8480fd5b8284346103c957806003193601126103c9578151918160019283549384811c918186169586156103bf575b60209687851081146103ac578899509688969785829a52918260001461038557505060011461032a575b505050610151929161031b910385610928565b51928284938452830190610850565b91908693508083527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf65b82841061036d575050508201018161031b610151610308565b8054848a018601528895508794909301928101610354565b60ff19168782015293151560051b8601909301935084925061031b91506101519050610308565b60248360228c634e487b7160e01b835252fd5b92607f16926102de565b80fd5b83915034610100576020366003190112610100576001600160a01b036103f0610890565b1690811561040d5760208480858581526003845220549051908152f35b608490602085519162461bcd60e51b8352820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e657200000000000000000000000000000000000000000000006064820152fd5b8284346103c95760203660031901126103c957506001600160a01b0361049e602093356109b1565b915191168152f35b505034610100576101dc906104ba366108c1565b919251926104c7846108f6565b858452610a6a565b83346103c9576101dc6104e1366108c1565b916104f46104ef8433610b00565b6109f9565b610bdf565b9050346101df57816003193601126101df57610513610890565b90602435926001600160a01b0391828061052c876109b1565b1694169380851461062557803314908115610606575b501561059e5784865260205284208273ffffffffffffffffffffffffffffffffffffffff19825416179055610576836109b1565b167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258480a480f35b6020608492519162461bcd60e51b8352820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152fd5b90508652600560205281862033875260205260ff828720541638610542565b506020608492519162461bcd60e51b8352820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f72000000000000000000000000000000000000000000000000000000000000006064820152fd5b8284346103c95760203660031901126103c957506001600160a01b0361049e602093356109d6565b8284346103c957806003193601126103c95781519181825492600184811c91818616958615610777575b60209687851081146103ac578899509688969785829a52918260001461038557505060011461071c57505050610151929161031b910385610928565b91908693508280527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b82841061075f575050508201018161031b610151610308565b8054848a018601528895508794909301928101610746565b92607f16926106e0565b8491346101df5760203660031901126101df57357fffffffff0000000000000000000000000000000000000000000000000000000081168091036101df57602092507f80ac58cd000000000000000000000000000000000000000000000000000000008114908115610826575b81156107fc575b5015158152f35b7f01ffc9a700000000000000000000000000000000000000000000000000000000915014836107f5565b7f5b5e139f00000000000000000000000000000000000000000000000000000000811491506107ee565b919082519283825260005b84811061087c575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161085b565b600435906001600160a01b03821682036108a657565b600080fd5b602435906001600160a01b03821682036108a657565b60609060031901126108a6576001600160a01b039060043582811681036108a6579160243590811681036108a6579060443590565b6020810190811067ffffffffffffffff82111761091257604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761091257604052565b67ffffffffffffffff811161091257601f01601f191660200190565b1561096d57565b606460405162461bcd60e51b815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e20494400000000000000006044820152fd5b60005260026020526001600160a01b03604060002054166109d3811515610966565b90565b6109df81610d13565b60005260046020526001600160a01b036040600020541690565b15610a0057565b608460405162461bcd60e51b815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206f7220617070726f766564000000000000000000000000000000000000006064820152fd5b90610a8e939291610a7e6104ef8433610b00565b610a89838383610bdf565b610d36565b15610a9557565b60405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608490fd5b906001600160a01b038080610b14846109b1565b16931691838314938415610b47575b508315610b31575b50505090565b610b3d919293506109d6565b1614388080610b2b565b909350600052600560205260406000208260005260205260ff604060002054169238610b23565b15610b7557565b608460405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e65720000000000000000000000000000000000000000000000000000006064820152fd5b90610c0791610bed846109b1565b916001600160a01b03938493848094169485911614610b6e565b16918215610caa5781610c2491610c1d866109b1565b1614610b6e565b7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef600084815260046020526040812073ffffffffffffffffffffffffffffffffffffffff199081815416905583825260036020526040822060001981540190558482526040822060018154019055858252600260205284604083209182541617905580a4565b608460405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152fd5b6000526002602052610d346001600160a01b03604060002054161515610966565b565b9293600093909291803b15610ee857948491610daa96604051809481937f150b7a0200000000000000000000000000000000000000000000000000000000978884523360048501526001600160a01b0380921660248501526044840152608060648401528260209b8c976084830190610850565b0393165af1849181610e90575b50610e67575050503d600014610e5f573d610dd18161094a565b90610ddf6040519283610928565b81528091833d92013e5b80519182610e5c5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608490fd5b01fd5b506060610de9565b7fffffffff00000000000000000000000000000000000000000000000000000000161492509050565b9091508581813d8311610ee1575b610ea88183610928565b810103126102af57517fffffffff00000000000000000000000000000000000000000000000000000000811681036102af579038610db7565b503d610e9e565b50505091505060019056fea2646970667358221220feafcf311f236eb4fcbfdf7bd4fc3bfb4f6b252f2fdc18ebe736b084ec0d823864736f6c63430008120033";

type ERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721__factory extends ContractFactory {
  constructor(...args: ERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC721>;
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  override attach(address: string): ERC721 {
    return super.attach(address) as ERC721;
  }
  override connect(signer: Signer): ERC721__factory {
    return super.connect(signer) as ERC721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721Interface {
    return new utils.Interface(_abi) as ERC721Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC721 {
    return new Contract(address, _abi, signerOrProvider) as ERC721;
  }
}
