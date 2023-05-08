/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  SwapRouter,
  SwapRouterInterface,
} from "../../../../../contracts/core/swap-router/swapping.sol/SwapRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "curTokenin",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "curTokenout",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "curAmountin",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "curAmountout",
        type: "uint256",
      },
    ],
    name: "executeSwapOperations",
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
        components: [
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "accountsContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapRouter",
            type: "address",
          },
        ],
        internalType: "struct SwapRouterMessages.InstantiateMsg",
        name: "curDetails",
        type: "tuple",
      },
    ],
    name: "intiSwapRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "swapEthToAnyToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapEthToToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curTokena",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curAmountin",
        type: "uint256",
      },
    ],
    name: "swapTokenToUsdc",
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
] as const;

const _bytecode =
  "0x60808060405234610016576113a3908161001c8239f35b600080fdfe60406080815260048036101561001457600080fd5b600091823560e01c80632435e368146105d257806375477365146104bb57806375c9f3ac1461031f57806379470bc91461025e5763a470947a1461005757600080fd5b3461025a57608036600319011261025a578051906080820182811067ffffffffffffffff82111761024757815261008c610946565b825261009661092b565b60208301908152604435926001600160a01b03919082851685036102435783810194855260643590838216820361023f576060810191825286549460ff8660a01c16610208575090838080935116936bffffffffffffffffffffffff60a01b9485600154161760015551168360025416176002555116906003541617600355600160a01b925116906affffffffffffffffffffff60a81b161717815581546801000000000000000090818110156101f5578060016101569201855561095c565b929080549360031b62ffffff94856101f4831b921b19161790558354828110156101e2578060016101899201865561095c565b81549060031b9085610bb8831b921b19161790558354918210156101cf57508060016101b79201845561095c565b819291549060031b91612710831b921b191617905580f35b634e487b7160e01b845260419052602483fd5b634e487b7160e01b855260418252602485fd5b634e487b7160e01b845260418352602484fd5b5162461bcd60e51b81526020818901526012602482015271105b1c9958591e48125b9a5d1a5b1a5e995960721b6044820152606490fd5b8780fd5b8680fd5b634e487b7160e01b855260418452602485fd5b8280fd5b50903461025a578160031936011261025a57610278610946565b6001546001600160a01b03929190859084163381148015610312575b61029d90610f49565b855163e68f909d60e01b815293849182905afa91821561030857906102dc93929186602097936102e3575b505033926103c06024359301511690610a38565b9051908152f35b6103009293503d8091833e6102f881836108f1565b810190610f84565b9038806102c8565b84513d87823e3d90fd5b5060025485163314610294565b508290816003193601126104b7576001546001600160a01b039084908490831633811480156104aa575b61035290610f49565b61035d341515611330565b845163e68f909d60e01b815292839182905afa90811561049d578491610483575b506103e0810194828061039e6103c0828a51169501948286511690610cff565b9751169251169261025842018042116104705790610414949392918651936103c5856108be565b845262ffffff6020998a9687870152168785015233606085015260808401523460a08401528660c08401528660e08401526003541690855180958194829363414bf38960e01b845283016109d1565b039134905af1928315610465578093610430575b505051908152f35b909192508382813d831161045e575b61044981836108f1565b8101031261045b575051908380610428565b80fd5b503d61043f565b8251903d90823e3d90fd5b634e487b7160e01b875260118352602487fd5b61049791503d8086833e6102f881836108f1565b8561037e565b50505051903d90823e3d90fd5b5060025484163314610349565b5080fd5b5082906020928360031936011261025a576104d4610946565b906104e0341515611330565b600154835163e68f909d60e01b81526001600160a01b0391869082908590829086165afa9081156105c857906103e09187916105ae575b500192816105288282875116610cff565b9451169361025842019182421161059b579162ffffff849261041497958b97958a5197610554896108be565b88521687870152168785015233606085015260808401523460a08401528660c08401528660e08401526003541690855180958194829363414bf38960e01b845283016109d1565b634e487b7160e01b885260118552602488fd5b6105c291503d8089833e6102f881836108f1565b88610517565b85513d88823e3d90fd5b50823461045b57608036600319011261045b5767ffffffffffffffff92803584811161025a573660238201121561025a57808201359461061186610913565b61061d865191826108f1565b8681526020928382016024809960051b8301019136831161023f578901905b82821061089f5750505061064e61092b565b60443592831161089b573660238401121561089b57828501359261067184610913565b9361067e895195866108f1565b808552898686019160051b83010191368311610897578a879101915b83831061088757505050508151918215610845578694855b60ff87168581101561071a576106e9906001600160a01b036106d482876109b0565b5116866106e230938b6109b0565b5191610a38565b8101809111610708579560ff80911690811461070857600101956106b2565b634e487b7160e01b8952601188528a89fd5b5089888c8b8760643586106107f257845163a9059cbb60e01b815233858201908152602081018890529091889183919082908690829060400103926001600160a01b03165af19182156107e75780926107af575b50501561077d57505051908152f35b600f9085606494519362461bcd60e51b85528401528201526e151c985b9cd9995c8819985a5b1959608a1b6044820152fd5b9091508682813d83116107e0575b6107c781836108f1565b8101031261045b57506107d9906109c4565b868061076e565b503d6107bd565b8551903d90823e3d90fd5b845162461bcd60e51b81528085018890526028818501527f4f75747075742066756e6473206c657373207468616e20746865206d696e696d604482015267756d2066756e647360c01b6064820152608490fd5b875162461bcd60e51b81528087018690526018818b01527f496e76616c69642063616c6c546f6b656e206c656e67746800000000000000006044820152606490fd5b823581529181019187910161069a565b8880fd5b8580fd5b81356001600160a01b038116810361089757815290850190850161063c565b610100810190811067ffffffffffffffff8211176108db57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff8211176108db57604052565b67ffffffffffffffff81116108db5760051b60200190565b602435906001600160a01b038216820361094157565b600080fd5b600435906001600160a01b038216820361094157565b9060005482101561099a57600080526003600a8084047f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5630193060290565b634e487b7160e01b600052603260045260246000fd5b805182101561099a5760209160051b010190565b5190811515820361094157565b91909160e06101008201938160018060a01b039182815116855282602082015116602086015262ffffff60408201511660408601528260608201511660608601526080810151608086015260a081015160a086015260c081015160c0860152015116910152565b93929362ffffff610a498383610cff565b16908115610ca65760018060a01b03809116906040948551946323b872dd60e01b8652600498338a88015230602488015282604488015260209560009787816064818c8b5af1908115610c2e578991610c71575b5015610c3857600354895163095ea7b360e01b81529086166001600160a01b03168c82019081526020810186905288908290819060400103818c8b5af1908115610c2e578991610bf9575b5015610bc557610258420192834211610bb25794899a9b9492819492828a9998610b5d9d5199610b178b6108be565b8a5216898901528c880152166060860152608085015260a08401528560c08401528560e0840152600354169085885180988195829463414bf38960e01b845283016109d1565b03925af1938415610ba757508193610b76575b50505090565b9091809350813d8311610ba0575b610b8e81836108f1565b8101031261045b575051388080610b70565b503d610b84565b51913d9150823e3d90fd5b634e487b7160e01b895260118c52602489fd5b885162461bcd60e51b8152808c01889052600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b90508781813d8311610c27575b610c1081836108f1565b8101031261089757610c21906109c4565b38610ae8565b503d610c06565b8a513d8b823e3d90fd5b885162461bcd60e51b8152808c018890526013602482015272151c985b9cd9995c919c9bdb4819985a5b1959606a1b6044820152606490fd5b90508781813d8311610c9f575b610c8881836108f1565b8101031261089757610c99906109c4565b38610a9d565b503d610c7e565b60405162461bcd60e51b815260206004820152601a60248201527f496e76616c696420546f6b656e2053656e6420746f20737761700000000000006044820152606490fd5b51906001600160a01b038216820361094157565b6001600160a01b039290838116908115610f12578484168015610edb57808314610e885785921015610e82575b168015610e3d576000809460049481865416965b600380821015610e3157610d538261095c565b919062ffffff9283915490831b1c16604090815190630b4c774160e11b8252898c83015287871660248301526044820152808c81606460209384935afa928315610e27575090879291600092610def575b505016610dd35750506000198114610dbe57600101610d40565b601187634e487b7160e01b6000525260246000fd5b969850965092505050610de6915061095c565b9054911b1c1690565b90809350813d8311610e20575b610e0681836108f1565b8101031261045b5750610e198691610ceb565b3880610da4565b503d610dfc565b513d6000823e3d90fd5b50505050925050915090565b60405162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a205a45524f5f4144445245535300006044820152606490fd5b92610d2c565b60405162461bcd60e51b815260206004820152602560248201527f556e697377617056324c6962726172793a204944454e544943414c5f41444452604482015264455353455360d81b6064820152608490fd5b60405162461bcd60e51b815260206004820152600f60248201526e24b73b30b634b2102a37b5b2b7102160891b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420546f6b656e204160881b6044820152606490fd5b15610f5057565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b602090818184031261094157805167ffffffffffffffff91828211610941570190818403916104e083126109415760409283519561042091828801888110868211176108db578652610fd584610ceb565b8852610fe2878501610ceb565b87890152610ff1868501610ceb565b8689015261100160608501610ceb565b606089015261101260808501610ceb565b608089015261102360a08501610ceb565b60a089015261103460c08501610ceb565b60c089015261104560e08501610ceb565b60e0890152610100611058818601610ceb565b9089015261012061106a818601610ceb565b9089015261014061107c818601610ceb565b9089015261016061108e818601610ceb565b908901526101806110a0818601610ceb565b908901526101a06110b2818601610ceb565b9089015260606101bf198201126109415785519060608201828110878211176108db5787526101c0928386015183526101e092838701518a82015261020094858801518a8301528b01526102209261110b848801610ceb565b908b01526102409361111e858801610ceb565b908b015261026092611131848801610ceb565b908b015261028093611144858801610ceb565b908b01526102a09283870151908b01526102c093611163858801610ceb565b908b01526102e09283870151888111610941578701918a83820312610941578951928b84018481108b8211176108db578b528051908a821161094157019080601f830112156109415781516111b781610913565b926111c48d5194856108f1565b8184528d8085019260051b820101928311610941578d809101915b83831061131857505050908352508a01526103009260a09190611203878601610ceb565b908b015261031f19011261094157855160a08101958611818710176108db57866104c09661131198526112c36103209561123e8789016109c4565b84526103409a61124f8c8a016109c4565b908501526103609283890151908501526103809361126e858a016109c4565b60608201526103a095868a015160808301528d01526103c095611292878a01610ceb565b908d01526103e0966112a5888a01610ceb565b908d01526104009a6112b88c8a01610ceb565b908d01528701610ceb565b908a01526112d46104408601610ceb565b908901526112e56104608501610ceb565b908801526112f66104808401610ceb565b908701526113076104a08301610ceb565b9086015201610ceb565b9082015290565b819061132384610ceb565b8152019101908d906111df565b1561133757565b60405162461bcd60e51b815260206004820152600e60248201526d125b9d985b1a5908105b5bdd5b9d60921b6044820152606490fdfea2646970667358221220cac6a59ccbe7f56766309162312383b4343a7eda2860d5597c193b81bc1faf6f64736f6c63430008120033";

type SwapRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SwapRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SwapRouter__factory extends ContractFactory {
  constructor(...args: SwapRouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SwapRouter> {
    return super.deploy(overrides || {}) as Promise<SwapRouter>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SwapRouter {
    return super.attach(address) as SwapRouter;
  }
  override connect(signer: Signer): SwapRouter__factory {
    return super.connect(signer) as SwapRouter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SwapRouterInterface {
    return new utils.Interface(_abi) as SwapRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SwapRouter {
    return new Contract(address, _abi, signerOrProvider) as SwapRouter;
  }
}
