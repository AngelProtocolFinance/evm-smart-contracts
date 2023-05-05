/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  DonationMatchEmitter,
  DonationMatchEmitterInterface,
} from "../../../../contracts/normalized_endowment/donation-match/DonationMatchEmitter";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donationMatch",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
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
        internalType: "address",
        name: "accountsContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "DonationMatchExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "donationMatch",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "reserveToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "uniswapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "poolFee",
            type: "uint24",
          },
        ],
        indexed: false,
        internalType: "struct DonationMatchStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "DonationMatchInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Erc20ApprovalGiven",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Erc20Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Erc20Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
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
    name: "burnErC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
        internalType: "address",
        name: "curAccountsContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "executeDonorMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "giveApprovalErC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curAccountscontract",
        type: "address",
      },
    ],
    name: "initDonationMatchEmiiter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "donationMatch",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "reserveToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "uniswapFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "poolFee",
            type: "uint24",
          },
        ],
        internalType: "struct DonationMatchStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "initializeDonationMatch",
    outputs: [],
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
    ],
    name: "isDonationMatch",
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
        name: "endowmentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferErC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100205760ff19600054166000556105b690816100268239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c9081633adaa5ae146103cc575080633de6d30e146103565780633f595a8a146103215780635ec1bbd2146102e357806372b696ca1461025f5780637d5d95a8146101c057637d691d3e1461007057600080fd5b346101bc5760e03660031901126101bc576100896104ca565b9060a03660431901126101b857825160a0810181811067ffffffffffffffff8211176101a55784526100b96104e0565b8152606435906001600160a01b0380831683036101a157602082019283526100df6104f6565b9186810192835260a43590828216820361019d576060810191825260c435938962ffffff968787168703610199578a86858196947f3d4d4fb92a75ba512dd2523d8c40b034a187c13ab3feccb3265fdefa6fd1ba599e8360e09f60808299019d8e5261015282855460081c163314610545565b1691828152600160205220600160ff1982541617905583519c358d5260208d01525116908a01525116606088015251166080860152511660a0840152511660c0820152a180f35b5080fd5b8880fd5b8680fd5b634e487b7160e01b865260418352602486fd5b8380fd5b8280fd5b5050346101995760a03660031901126101995760c07fe16655a702814019c5d7706692dbf1df02a26521e509213eb18af11a36c4dee6916101ff6104af565b906102086104e0565b916102116104f6565b90338752600160205261022960ff8489205416610545565b82519333855260018060a01b03938480931660208701526024359086015216606084015260643560808401521660a0820152a180f35b505034610199576102dd7f1d861f14f5f6701699cda19ddada77d9f6804495e40a9822569b845c359c8d22916102943661050c565b9194929333885260016020526102af60ff828a205416610545565b519384526001600160a01b039485166020850152909316604083015260608201929092529081906080820190565b0390a180f35b5050346101995760203660031901126101995760209160ff9082906001600160a01b0361030e6104af565b1681526001855220541690519015158152f35b505034610199576102dd7f3676b561fc3c7f77d2c549de4da884250354ea1a35c74df94852dd4fa457ac16916102943661050c565b5090346101bc5760603660031901126101bc577f4c72cdd303d97a6d3a90e4f8b2b9b11ddddeb599a332db70ae5891b781e5c8f6916060916103966104ca565b33865260016020526103ad60ff8388205416610545565b8151923583526001600160a01b0316602083015260443590820152a180f35b84929150346101bc5760203660031901126101bc576103e96104af565b906001600160a01b03821615610464575082549160ff831661042b57506001600160a81b031990911660089190911b610100600160a81b031617600117815580f35b606490602086519162461bcd60e51b83528201526013602482015272105b1c9958591e481a5b9a5d1a585b1a5e9959606a1b6044820152fd5b62461bcd60e51b8152602083820152602160248201527f496e76616c6964206163636f756e747320636f6e7472616374206164647265736044820152607360f81b6064820152608490fd5b600435906001600160a01b03821682036104c557565b600080fd5b602435906001600160a01b03821682036104c557565b604435906001600160a01b03821682036104c557565b608435906001600160a01b03821682036104c557565b60809060031901126104c557600435906001600160a01b039060243582811681036104c5579160443590811681036104c5579060643590565b1561054c57565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fdfea2646970667358221220c8902d75bed2ecd9b24353fe42a1c5615ae976fca32e3094351bd8bad1735d1e64736f6c63430008120033";

type DonationMatchEmitterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DonationMatchEmitterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DonationMatchEmitter__factory extends ContractFactory {
  constructor(...args: DonationMatchEmitterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DonationMatchEmitter> {
    return super.deploy(overrides || {}) as Promise<DonationMatchEmitter>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DonationMatchEmitter {
    return super.attach(address) as DonationMatchEmitter;
  }
  override connect(signer: Signer): DonationMatchEmitter__factory {
    return super.connect(signer) as DonationMatchEmitter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DonationMatchEmitterInterface {
    return new utils.Interface(_abi) as DonationMatchEmitterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DonationMatchEmitter {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DonationMatchEmitter;
  }
}
