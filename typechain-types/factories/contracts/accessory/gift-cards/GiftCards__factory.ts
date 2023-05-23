/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  GiftCards,
  GiftCardsInterface,
} from "../../../../contracts/accessory/gift-cards/GiftCards";

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
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum AngelCoreStruct.AllowanceAction",
        name: "action",
        type: "uint8",
      },
    ],
    name: "GiftCardsUpdateBalances",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "keeper",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nextDeposit",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct GiftCardsStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "GiftCardsUpdateConfig",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct GiftCardsStorage.Deposit",
        name: "deposit",
        type: "tuple",
      },
    ],
    name: "GiftCardsUpdateDeposit",
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
    inputs: [
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "executeClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "executeDepositERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockedPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidPercentage",
        type: "uint256",
      },
    ],
    name: "executeSpend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "keeper",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
        ],
        internalType: "struct GiftCardsMessage.InstantiateMsg",
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
    inputs: [
      {
        internalType: "address",
        name: "userAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
    ],
    name: "queryBalance",
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
    name: "queryConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "keeper",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nextDeposit",
            type: "uint256",
          },
        ],
        internalType: "struct GiftCardsStorage.Config",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
    ],
    name: "queryDeposit",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct GiftCardsStorage.Deposit",
        name: "",
        type: "tuple",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "keeper",
        type: "address",
      },
      {
        internalType: "address",
        name: "registrarContract",
        type: "address",
      },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100c6576001606b556006549060ff8260081c16610074575060ff80821610610039575b6040516114d890816100cc8239f35b60ff90811916176006557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a13861002a565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe60806040818152600436101561001457600080fd5b600091823560e01c90816311c9a94d14611098575080631dbfb30f14610cbe57806338485c5914610acf578063715018a614610a6f5780638da5cb5b14610a47578063935feaa5146109aa578063ac42a4eb14610962578063b6a597dd14610740578063e687f79f146101a5578063e68f909d1461012f5763f2fde38b1461009b57600080fd5b3461012b57602036600319011261012b576100b46111f4565b906100bd611295565b6001600160a01b038216156100d957506100d6906112ed565b80f35b5162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b5080fd5b503461012b578160031936011261012b579060809161014c61147d565b5080519061015982611225565b60018060a01b0380935416928383528060015416602084019081528180600254169184860192835260606003549601958652845196875251166020860152511690830152516060820152f35b503461012b5760a036600319011261012b5760043563ffffffff9182821680920361073c576101d261120f565b6101da611413565b608435606494853591866101ee82856113f0565b036107035760443595610202871515611396565b33895260209760058952868a209560018060a01b0380911696878c528a5288888c2054106106c15780600154168851809163e68f909d60e01b82528160046103e09485935afa918d83156106b657908b93929192610423575b5050018b8b8b6044858551168d51948593849263095ea7b360e01b8452600484015260248301528d5af1908115610419578d916103ec575b50156103b857908b959493929151168851926102ae84611257565b83528a8301968752888301938452803b156103b45787869260a4958b51998a988997631b13439160e01b8952511660048801525160248701525160448601528401528960848401525af180156103aa5761037b575b5033855260058452818520816000528452816000208054908482039182116103675755815133815293840152820152600160608201527f1d569e9ccc852fe0e371351b3eba47af14f39603cc94343da84fda12c1d01db490608090a16001606b5580f35b634e487b7160e01b87526011600452602487fd5b67ffffffffffffffff81969296116103965782529338610303565b634e487b7160e01b82526041600452602482fd5b83513d88823e3d90fd5b8580fd5b885162461bcd60e51b8152600481018c9052600e60248201526d105c1c1c9bdd994819985a5b195960921b60448201528390fd5b61040c91508c8d3d10610412575b6104048183611273565b8101906113d8565b38610293565b503d6103fa565b8a513d8f823e3d90fd5b8193508092503d83116106af575b61043b8183611273565b8101039081126106ab578951906103a09081830183811067ffffffffffffffff821117610696578c526060908e61047186611469565b855261047e818701611469565b9085015261048d8d8601611469565b8d85015261049c828601611469565b828501526104ac60808601611469565b60808501526104bd60a08601611469565b60a08501526104ce60c08601611469565b60c08501526104df60e08601611469565b60e08501526101006104f2818701611469565b90850152610120610504818701611469565b90850152610140610516818701611469565b90850152610160610528818701611469565b9085015261018061053a818701611469565b9085015261019f190112610692576106876103c08c948f9361067d87519161056183611257565b6101a0928385015181526101c09788860151908201526101e093848601518b83015289015261020096610595888601611469565b90890152610220926105a8848601611469565b90890152610240966105bb888601611469565b90890152610260928385015190890152610280966105da888601611469565b908901526102a0926105ed848601611469565b908901526102c096610600888601611469565b908901526102e092610613848601611469565b9089015261030096610626888601611469565b9089015261032092610639848601611469565b908901526103409661064c888601611469565b908901526103609261065f848601611469565b9089015261038096610672888601611469565b908901528301611469565b9086015201611469565b90820152388061025b565b8d80fd5b50634e487b7160e01b8f52604160045260248ffd5b8c80fd5b503d610431565b8b51903d90823e3d90fd5b50865162461bcd60e51b8152600481018a9052601e60248201527f496e73756666696369656e74207370656e6461626c652062616c616e636500006044820152fd5b845162461bcd60e51b8152602060048201526013602482015272496e76616c69642070657263656e746167657360681b60448201528790fd5b8380fd5b503461012b578060031936011261012b57805181810181811067ffffffffffffffff82111761094e5782526107736111f4565b815261077d61120f565b906020810191825260069182549160ff8360081c161592838094610941575b801561092a575b156108cf5760ff1981166001178555610823929190846108be575b506107e160ff865460081c166107d381611336565b6107dc81611336565b611336565b6107ea336112ed565b8654336001600160a01b03199182161788559151600180546001600160a01b039283169085161790559051600280549093169116179055565b6001600381905583516000546001600160a01b03908116825282548116602083015260025416604082015260608101919091527fd3b4944622ba3933e922c4ed265fe2df22540c84d2eca7fbd9d942593577453f90608090a1610884578280f35b805461ff001916905551600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a138808280f35b61ffff1916610101178555386107be565b855162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156107a35750600160ff8216146107a3565b50600160ff82161061079c565b634e487b7160e01b84526041600452602484fd5b503461012b578060031936011261012b578060209261097f6111f4565b61098761120f565b6001600160a01b0391821683526005865283832091168252845220549051908152f35b503461012b57602036600319011261012b57610a45816080936109cb61147d565b5060043581526004602052209160ff60038251946109e886611225565b60018060a01b038082541687526001820154166020870152600281015484870152015416151560608401525180926060809160018060a01b0380825116855260208201511660208501526040810151604085015201511515910152565bf35b503461012b578160031936011261012b5760395490516001600160a01b039091168152602090f35b8234610acc5780600319360112610acc57610a88611295565b603980546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b509034610acc5781600319360112610acc57600435610aec61120f565b610af4611413565b6002546001600160a01b03919082163303610c7a5782845260206004815260ff6003878720015416610c375784956004610c2e92867f1d569e9ccc852fe0e371351b3eba47af14f39603cc94343da84fda12c1d01db4979852818152828920977f363486153e7f2aa0a57195763226fc3a6fd1caf0d7820b2ba18cc536be40582160a060038b01600260019c8d928360ff198254161790558b89519387855281835416898601528201541689840152015460608201528b6080820152a1808a528282526002848b2001548787168b52600583528a888b8780842093868152888852200154168c528352610beb858c209182546113f0565b90558952528087208681015460029091015491516001600160a01b0394851681529416909216602084015260408301919091526000606083015281906080820190565b0390a1606b5580f35b60649086519062461bcd60e51b82526004820152601760248201527f4465706f73697420616c726561647920636c61696d65640000000000000000006044820152fd5b845162461bcd60e51b815260206004820152601e60248201527f4f6e6c79206b65657065722063616e20636c61696d206465706f7369747300006044820152606490fd5b503461012b57606036600319011261012b57610cd86111f4565b610ce061120f565b610ce8611413565b825191610cf483611225565b3383526001600160a01b038216602084015260443584840181905260608401869052610d21901515611396565b60015484516302b05ecb60e11b81526001600160a01b038481166004830152909160209183916024918391165afa908115610fcd578691611079575b5015611045578351636eb1769f60e11b81523360048201523060248201526020816044816001600160a01b0387165afa908115610fcd578691611013575b5060443511610fd75783516323b872dd60e01b81523360048201523060248201526044803590820152602081606481896001600160a01b0388165af1908115610fcd578691610fae575b5015610f78577f363486153e7f2aa0a57195763226fc3a6fd1caf0d7820b2ba18cc536be4058219260a09290916001600160a01b0381169182610ef5575b505050600354855260046020526003848620600180851b038351166bffffffffffffffffffffffff851b90818354161782556001820190600180871b0360208601511690825416179055858301516002820155016060820151151560ff80198354169116179055610eca60035494519185835260208301906060809160018060a01b0380825116855260208201511660208501526040810151604085015201511515910152565ba160018101809111610ee1576003556001606b5580f35b634e487b7160e01b82526011600452602482fd5b7f1d569e9ccc852fe0e371351b3eba47af14f39603cc94343da84fda12c1d01db4926001606086015288526005602052868820600180871b0382168952602052868820610f4560443582546113f0565b905586516001600160a01b03928316815291166020820152604435604082015260006060820152608090a1388080610e23565b835162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8811985a5b1959608a1b6044820152606490fd5b610fc7915060203d602011610412576104048183611273565b38610de5565b85513d88823e3d90fd5b835162461bcd60e51b8152602060048201526015602482015274496e737566696369656e7420416c6c6f77616e636560581b6044820152606490fd5b90506020813d60201161103d575b8161102e60209383611273565b810103126103b4575138610d9b565b3d9150611021565b835162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b2102a37b5b2b760991b6044820152606490fd5b611092915060203d602011610412576104048183611273565b38610d5d565b83833461012b57606036600319011261012b576110b36111f4565b926110bc61120f565b604435916001600160a01b0380841692918385036111f05786549082821633036111ae5750817fd3b4944622ba3933e922c4ed265fe2df22540c84d2eca7fbd9d942593577453f979816908161119a575b50508116611175575b50611150575b50516000546001600160a01b039081168252600154811660208301526002541660408201526003546060820152608090a180f35b600180546001600160a01b0319166001600160a01b039092169190911790558361111c565b600280546001600160a01b0319166001600160a01b0390921691909117905585611116565b6001600160a01b031916178755878061110d565b62461bcd60e51b815260206004820152601c60248201527f4f6e6c79206f776e65722063616e2075706461746520636f6e666967000000006044820152606490fd5b8680fd5b600435906001600160a01b038216820361120a57565b600080fd5b602435906001600160a01b038216820361120a57565b6080810190811067ffffffffffffffff82111761124157604052565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff82111761124157604052565b90601f8019910116810190811067ffffffffffffffff82111761124157604052565b6039546001600160a01b031633036112a957565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603980546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b1561133d57565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b1561139d57565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a59081e995c9bc8185b5bdd5b9d606a1b6044820152606490fd5b9081602091031261120a5751801515810361120a5790565b919082018092116113fd57565b634e487b7160e01b600052601160045260246000fd5b6002606b5414611424576002606b55565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b51906001600160a01b038216820361120a57565b6040519061148a82611225565b6000606083828152826020820152826040820152015256fea2646970667358221220ee7483cc585629b243398e0c1d0e8cbee074e8762e794a0dbeea6c470c01564c64736f6c63430008120033";

type GiftCardsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GiftCardsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GiftCards__factory extends ContractFactory {
  constructor(...args: GiftCardsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GiftCards> {
    return super.deploy(overrides || {}) as Promise<GiftCards>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GiftCards {
    return super.attach(address) as GiftCards;
  }
  override connect(signer: Signer): GiftCards__factory {
    return super.connect(signer) as GiftCards__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GiftCardsInterface {
    return new utils.Interface(_abi) as GiftCardsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GiftCards {
    return new Contract(address, _abi, signerOrProvider) as GiftCards;
  }
}
