/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  RegistrarLib,
  RegistrarLibInterface,
} from "../../../../../contracts/core/registrar/registrar.sol/RegistrarLib";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "addr",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "network",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "inputDenom",
            type: "address",
          },
          {
            internalType: "address",
            name: "yieldToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
          {
            internalType: "enum AngelCoreStruct.EndowmentType[]",
            name: "restrictedFrom",
            type: "AngelCoreStruct.EndowmentType[]",
          },
          {
            internalType: "enum AngelCoreStruct.AccountType",
            name: "acctType",
            type: "AngelCoreStruct.AccountType",
          },
          {
            internalType: "enum AngelCoreStruct.VaultType",
            name: "vaultType",
            type: "AngelCoreStruct.VaultType",
          },
        ],
        internalType: "struct AngelCoreStruct.YieldVault",
        name: "data",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "network",
        type: "uint256",
      },
      {
        internalType: "enum AngelCoreStruct.EndowmentType",
        name: "endowmentType",
        type: "AngelCoreStruct.EndowmentType",
      },
      {
        internalType: "enum AngelCoreStruct.AccountType",
        name: "accountType",
        type: "AngelCoreStruct.AccountType",
      },
      {
        internalType: "enum AngelCoreStruct.VaultType",
        name: "vaultType",
        type: "AngelCoreStruct.VaultType",
      },
      {
        internalType: "enum AngelCoreStruct.BoolOptional",
        name: "approved",
        type: "AngelCoreStruct.BoolOptional",
      },
    ],
    name: "filterVault",
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
] as const;

const _bytecode =
  "0x6080806040523461001a576104969081610020823930815050f35b600080fdfe60806004908136101561001157600080fd5b600091823560e01c63c5795f911461002857600080fd5b6003199060c0368301126102305780359267ffffffffffffffff928385116101d057610100809186360301126101d05781018181108482111761021d57604052838201358381116101d057840193366023860112156101d057828501359380851161020a57602095876100a3601f8801601f19168901610234565b91878352602497368982840101116102065780898b93018386013783010152835284820135868401526100d860448301610270565b60408401526100e960648301610270565b6060840152608482013580151581036101c857608084015260a48201358181116101c8578201366023820112156101c857848101359182116101f4578160051b8688610136818401610234565b809581520191830101913683116101f0578701905b8282106101d45750505060a083015260c48101359060038210156101cc5760e49160c08401520135828110156101d05760e082015260443560038110156101d0576064359160038310156101cc57608435938410156101cc5760a4359460038610156101c8576101be96975035906102b6565b6040519015158152f35b8780fd5b8680fd5b8580fd5b813560038110156101ec57815290880190880161014b565b8a80fd5b8980fd5b8588604187634e487b7160e01b835252fd5b8280fd5b602487604186634e487b7160e01b835252fd5b602486604185634e487b7160e01b835252fd5b8380fd5b6040519190601f01601f1916820167ffffffffffffffff81118382101761025a57604052565b634e487b7160e01b600052604160045260246000fd5b359073ffffffffffffffffffffffffffffffffffffffff8216820361029157565b600080fd5b600311156102a057565b634e487b7160e01b600052602160045260246000fd5b93929190946102c481610296565b6002810361040b575b506102d781610296565b6002810361037c575b506102ea81610296565b60028103610349575b5060048110156102a05760038103610329575b5081610314575b5050600190565b602001510361032457388061030d565b600090565b60e082015160048110156102a057036103425738610306565b5050600090565b60c083015161035781610296565b61036082610296565b61036981610296565b0361037457386102f3565b505050600090565b9390949192600093845b60a083015180518210156103f057602088918360051b0101516103a881610296565b6103b182610296565b6103ba81610296565b146103e7575b60001981146103d157600101610386565b634e487b7160e01b600052601160045260246000fd5b600195506103c0565b505092959194509261040257386102e0565b50505050600090565b61041481610296565b60018114610446575b61042681610296565b15610432575b386102cd565b60808401511561042c575050505050600090565b600160808601511515031561041d5750505050505060009056fea2646970667358221220f1deb10f11302a3fc6a06f948a0bb462c84cc702ba2390a3b1669b80d2e355d764736f6c63430008120033";

type RegistrarLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RegistrarLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RegistrarLib__factory extends ContractFactory {
  constructor(...args: RegistrarLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RegistrarLib> {
    return super.deploy(overrides || {}) as Promise<RegistrarLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RegistrarLib {
    return super.attach(address) as RegistrarLib;
  }
  override connect(signer: Signer): RegistrarLib__factory {
    return super.connect(signer) as RegistrarLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RegistrarLibInterface {
    return new utils.Interface(_abi) as RegistrarLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RegistrarLib {
    return new Contract(address, _abi, signerOrProvider) as RegistrarLib;
  }
}
