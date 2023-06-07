/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  DummyCRVLP,
  DummyCRVLPInterface,
} from "../../../../../contracts/integrations/goldfinch/test/DummyCRVLP";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "amounts",
        type: "uint256[2]",
      },
      {
        internalType: "uint256",
        name: "min_mint_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "use_eth",
        type: "bool",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "add_liquidity",
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
        internalType: "uint256",
        name: "arg0",
        type: "uint256",
      },
    ],
    name: "balances",
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
        internalType: "uint256[2]",
        name: "amounts",
        type: "uint256[2]",
      },
    ],
    name: "calc_token_amount",
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
    name: "coins",
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
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dx",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "exchange",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "get_dy",
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
    name: "lp_price",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256[2]",
        name: "min_amounts",
        type: "uint256[2]",
      },
    ],
    name: "remove_liquidity",
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
        internalType: "uint256",
        name: "token_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min_amount",
        type: "uint256",
      },
    ],
    name: "remove_liquidity_one_coin",
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
        internalType: "uint256",
        name: "_dy_for_get_dy",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_dy_for_exchange",
        type: "uint256",
      },
    ],
    name: "setDys",
    outputs: [],
    stateMutability: "nonpayable",
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
] as const;

const _bytecode =
  "0x60803461008d57601f61056838819003918201601f19168301916001600160401b0383118484101761009257808492604094855283398101031261008d57610052602061004b836100a8565b92016100a8565b600280546001600160a01b039384166001600160a01b031991821617909155600380549290931691161790556040516104ab90816100bd8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361008d5756fe608060408181526004918236101561001657600080fd5b600092833560e01c91826332a8d01a146103e85782634903b0d1146103ce5750816354f0f7d5146103b3578163556d6e9f146103955781635b36389c146103715781635b41b90814610154575080637328333b146101145780638d8ea727146100f2578063c6610657146100d7578063f1dc3cc9146100bb5763fc0c546a1461009e57600080fd5b346100b757816003193601126100b75751908152602090f35b5080fd5b50346100b757906020916100ce36610406565b50505051908152f35b50346100b75760203660031901126100b75751908152602090f35b50346100b757806003193601126100b757366044116100b75751908152602090f35b50346100b75760a03660031901126100b757366044116100b757606435801515036100b7576084356001600160a01b038116036100b75751908152602090f35b90503461036d57608036600319011261036d5760443581356102855760025483516323b872dd60e01b815233818501908152306020828101919091526040820194909452929390926001600160a01b03928591859185169082908a90829060600103925af191821561027b5761020393859361025e575b50600354600154875163a9059cbb60e01b81523394810194855260208501919091529485939290911691839189918391604090910190565b03925af180156102515760209450610223575b50505b6001549051908152f35b8161024292903d1061024a575b61023a8183610425565b81019061045d565b503880610216565b503d610230565b50505051903d90823e3d90fd5b61027490843d861161024a5761023a8183610425565b50386101cb565b85513d88823e3d90fd5b60035483516323b872dd60e01b815233818501908152306020828101919091526040820194909452929390926001600160a01b03928591859185169082908a90829060600103925af191821561027b57610318938593610350575b50600254600154875163a9059cbb60e01b81523394810194855260208501919091529485939290911691839189918391604090910190565b03925af180156102515760209450610332575b5050610219565b8161034892903d1061024a5761023a8183610425565b50388061032b565b61036690843d861161024a5761023a8183610425565b50386102e0565b8280fd5b5050346100b75760603660031901126100b757366064116100b75751908152602090f35b5050346100b7576020916103a836610406565b505050549051908152f35b5050346100b757816003193601126100b75751908152602090f35b8490346100b75760203660031901126100b7576020918152f35b8482853461036d573660031901126100b75735815560243560015580f35b606090600319011261042057600435906024359060443590565b600080fd5b90601f8019910116810190811067ffffffffffffffff82111761044757604052565b634e487b7160e01b600052604160045260246000fd5b9081602091031261042057518015158103610420579056fea264697066735822122094c1e8e75219e26089745230d641e8cc9e27f6f0ddfee207769a50f82b2cf3df64736f6c63430008120033";

type DummyCRVLPConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyCRVLPConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyCRVLP__factory extends ContractFactory {
  constructor(...args: DummyCRVLPConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _token0: PromiseOrValue<string>,
    _token1: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DummyCRVLP> {
    return super.deploy(
      _token0,
      _token1,
      overrides || {}
    ) as Promise<DummyCRVLP>;
  }
  override getDeployTransaction(
    _token0: PromiseOrValue<string>,
    _token1: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_token0, _token1, overrides || {});
  }
  override attach(address: string): DummyCRVLP {
    return super.attach(address) as DummyCRVLP;
  }
  override connect(signer: Signer): DummyCRVLP__factory {
    return super.connect(signer) as DummyCRVLP__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyCRVLPInterface {
    return new utils.Interface(_abi) as DummyCRVLPInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyCRVLP {
    return new Contract(address, _abi, signerOrProvider) as DummyCRVLP;
  }
}
