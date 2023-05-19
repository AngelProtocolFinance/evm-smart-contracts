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
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOut",
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
        name: "details",
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
        name: "tokena",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountin",
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
  "0x6080806040523461001657611089908161001c8239f35b600080fdfe60406080815260048036101561001457600080fd5b600091823560e01c80635bf1322a146105ec57806375477365146104cb57806375c9f3ac1461032d57806379470bc91461025e5763a470947a1461005757600080fd5b3461025a57608036600319011261025a578051906080820182811067ffffffffffffffff82111761024757815261008c61073f565b825261009661075a565b60208301908152604435926001600160a01b03919082851685036102435783810194855260643590838216820361023f576060810191825286549460ff8660a01c16610208575090838080935116936bffffffffffffffffffffffff60a01b9485600154161760015551168360025416176002555116906003541617600355600160a01b925116906affffffffffffffffffffff60a81b161717815581546801000000000000000090818110156101f557806001610156920185556107c5565b929080549360031b62ffffff94856101f4831b921b19161790558354828110156101e257806001610189920186556107c5565b81549060031b9085610bb8831b921b19161790558354918210156101cf57508060016101b7920184556107c5565b819291549060031b91612710831b921b191617905580f35b634e487b7160e01b845260419052602483fd5b634e487b7160e01b855260418252602485fd5b634e487b7160e01b845260418352602484fd5b5162461bcd60e51b81526020818901526012602482015271105b1c9958591e48125b9a5d1a5b1a5e995960721b6044820152606490fd5b8780fd5b8680fd5b634e487b7160e01b855260418452602485fd5b8280fd5b50903461025a578160031936011261025a5761027861073f565b6001546001600160a01b039290831691903383148015610320575b61029c90610d79565b84519283809263e68f909d60e01b82526103e09586935afa92831561031657906102e094939291602097936102e7575b505033926103406024359301511690610898565b9051908152f35b610307929350803d1061030f575b6102ff81836107a3565b810190610db4565b9038806102cc565b503d6102f5565b85513d88823e3d90fd5b5060025484163314610293565b508290816003193601126104c7576001546001600160a01b0390811633811480156104ba575b61035c90610d79565b610367341515611016565b8251809163e68f909d60e01b825281876103e09485935afa9182156104b0578592610493575b505061036081019482806103ae610340828a51169501948286511690610b2f565b9751169251169261025842018042116104805790610424949392918651936103d585610770565b845262ffffff6020998a9687870152168785015233606085015260808401523460a08401528660c08401528660e08401526003541690855180958194829363414bf38960e01b84528301610831565b039134905af1928315610475578093610440575b505051908152f35b909192508382813d831161046e575b61045981836107a3565b8101031261046b575051908380610438565b80fd5b503d61044f565b8251903d90823e3d90fd5b634e487b7160e01b875260118352602487fd5b6104a99250803d1061030f576102ff81836107a3565b858061038d565b84513d87823e3d90fd5b5060025482163314610353565b5080fd5b5082906020928360031936011261025a576104e461073f565b906104f0341515611016565b600154835163e68f909d60e01b81526001600160a01b03916103e09190829082908690829087165afa9182156105e25790610360929188926105c5575b505001928161053f8282875116610b2f565b945116936102584201918242116105b2579162ffffff849261042497958b97958a519761056b89610770565b88521687870152168785015233606085015260808401523460a08401528660c08401528660e08401526003541690855180958194829363414bf38960e01b84528301610831565b634e487b7160e01b885260118552602488fd5b6105db9250803d1061030f576102ff81836107a3565b888061052d565b86513d89823e3d90fd5b509190346104c75760803660031901126104c75761060861073f565b9161062161061461075a565b9330908560443591610898565b9260643584106106eb57845163a9059cbb60e01b81523384820190815260208181018790529192839182908690829060400103926001600160a01b03165af19182156106e057916106b2575b501561067d575060209151908152f35b606490602084519162461bcd60e51b8352820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152fd5b6106d3915060203d81116106d9575b6106cb81836107a3565b810190610819565b3861066d565b503d6106c1565b8551903d90823e3d90fd5b845162461bcd60e51b8152602081850152602860248201527f4f75747075742066756e6473206c657373207468616e20746865206d696e696d604482015267756d2066756e647360c01b6064820152608490fd5b600435906001600160a01b038216820361075557565b600080fd5b602435906001600160a01b038216820361075557565b610100810190811067ffffffffffffffff82111761078d57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761078d57604052565b9060005482101561080357600080526003600a8084047f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5630193060290565b634e487b7160e01b600052603260045260246000fd5b90816020910312610755575180151581036107555790565b91909160e06101008201938160018060a01b039182815116855282602082015116602086015262ffffff60408201511660408601528260608201511660608601526080810151608086015260a081015160a086015260c081015160c0860152015116910152565b93929362ffffff6108a98383610b2f565b16908115610ad65760018060a01b03809116906040948551946323b872dd60e01b8652600498338a88015230602488015282604488015260209560009787816064818c8b5af1908115610a76578991610ab9575b5015610a8057600354895163095ea7b360e01b81529086166001600160a01b03168c82019081526020810186905288908290819060400103818c8b5af1908115610a76578991610a59575b5015610a2557610258420192834211610a125794899a9b9492819492828a99986109bd9d51996109778b610770565b8a5216898901528c880152166060860152608085015260a08401528560c08401528560e0840152600354169085885180988195829463414bf38960e01b84528301610831565b03925af1938415610a07575081936109d6575b50505090565b9091809350813d8311610a00575b6109ee81836107a3565b8101031261046b5750513880806109d0565b503d6109e4565b51913d9150823e3d90fd5b634e487b7160e01b895260118c52602489fd5b885162461bcd60e51b8152808c01889052600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b610a709150883d8a116106d9576106cb81836107a3565b38610948565b8a513d8b823e3d90fd5b885162461bcd60e51b8152808c018890526013602482015272151c985b9cd9995c919c9bdb4819985a5b1959606a1b6044820152606490fd5b610ad09150883d8a116106d9576106cb81836107a3565b386108fd565b60405162461bcd60e51b815260206004820152601a60248201527f496e76616c696420546f6b656e2053656e6420746f20737761700000000000006044820152606490fd5b51906001600160a01b038216820361075557565b6001600160a01b039290838116908115610d42578484168015610d0b57808314610cb85785921015610cb2575b168015610c6d576000809460049481865416965b600380821015610c6157610b83826107c5565b919062ffffff9283915490831b1c16604090815190630b4c774160e11b8252898c83015287871660248301526044820152808c81606460209384935afa928315610c57575090879291600092610c1f575b505016610c035750506000198114610bee57600101610b70565b601187634e487b7160e01b6000525260246000fd5b969850965092505050610c1691506107c5565b9054911b1c1690565b90809350813d8311610c50575b610c3681836107a3565b8101031261046b5750610c498691610b1b565b3880610bd4565b503d610c2c565b513d6000823e3d90fd5b50505050925050915090565b60405162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a205a45524f5f4144445245535300006044820152606490fd5b92610b5c565b60405162461bcd60e51b815260206004820152602560248201527f556e697377617056324c6962726172793a204944454e544943414c5f41444452604482015264455353455360d81b6064820152608490fd5b60405162461bcd60e51b815260206004820152600f60248201526e24b73b30b634b2102a37b5b2b7102160891b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420546f6b656e204160881b6044820152606490fd5b15610d8057565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b8091036103e08112610755576040908151926103a09081850167ffffffffffffffff938682108583111761078d576060918652610df083610b1b565b8752610dfe60208401610b1b565b6020880152610e0e868401610b1b565b86880152610e1d828401610b1b565b82880152610e2d60808401610b1b565b6080880152610e3e60a08401610b1b565b60a0880152610e4f60c08401610b1b565b60c0880152610e6060e08401610b1b565b60e0880152610100610e73818501610b1b565b90880152610120610e85818501610b1b565b90880152610140610e97818501610b1b565b90880152610160610ea9818501610b1b565b90880152610180610ebb818501610b1b565b9088015261019f19011261075557835193606085019384118585101761078d576110056103c09361100f9583526101a0968785015181526101c0978886015160208301526101e094858701519083015289015261020096610f1d888601610b1b565b9089015261022092610f30848601610b1b565b9089015261024096610f43888601610b1b565b9089015261026092838501519089015261028096610f62888601610b1b565b908901526102a092610f75848601610b1b565b908901526102c096610f88888601610b1b565b908901526102e092610f9b848601610b1b565b9089015261030096610fae888601610b1b565b9089015261032092610fc1848601610b1b565b9089015261034096610fd4888601610b1b565b9089015261036092610fe7848601610b1b565b9089015261038096610ffa888601610b1b565b908901528301610b1b565b9086015201610b1b565b9082015290565b1561101d57565b60405162461bcd60e51b815260206004820152600e60248201526d125b9d985b1a5908105b5bdd5b9d60921b6044820152606490fdfea26469706673582212201af9019e8f878c852957f9a50cb9070f94c79e582ff9707726cb776be88cb96f64736f6c63430008120033";

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
