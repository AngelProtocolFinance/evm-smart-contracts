/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../../common";
import type {
  StringArray,
  StringArrayInterface,
} from "../../../../../contracts/lib/Strings/string.sol/StringArray";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "addressToString",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "s1",
        type: "string",
      },
      {
        internalType: "string",
        name: "s2",
        type: "string",
      },
    ],
    name: "stringCompare",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "arr",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "searchFor",
        type: "string",
      },
    ],
    name: "stringIndexOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
  "0x6080806040523461001c576109c290816100228239308160520152f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c9081635e57966d146104835750806360353db9146103ea57806373b64e15146103185763c8b6b0fa1461004f57600080fd5b307f000000000000000000000000000000000000000000000000000000000000000014610314578160031936011261031457803592602490813585548110156102d2575b855460001981019081116100f65781101561010857600181018082116100f6576100bd90876107e0565b506100c882886107e0565b6100e4576100df92916100da9161085f565b61073f565b610093565b5050634e487b7160e01b825250808352fd5b5050634e487b7160e01b815260118352fd5b50929391825480156102c057600019019161012383856107e0565b9290926102b05750508061013885925461080e565b80610273575b5050509182825561014e83610727565b61015a85519182610693565b83815260209384820190819484528584209184905b8282106101d057505050508451938085019181865251809252858501958260051b8601019392955b8287106101a45785850386f35b9091929382806101c0600193603f198a8203018652885161066e565b9601920196019592919092610197565b8897949597518589928654926101e58461080e565b808252600194808616908115610257575060011461021f575b5061020d816001960382610693565b8152019401910190929694939661016f565b888d52838d2095508c905b808210610240575081018301945061020d6101fe565b8654838301860152958501958a949091019061022a565b60ff19168584015250151560051b81018301945061020d6101fe565b82601f821160011461028b575050555b82388061013e565b90918082526102a9601f60208420940160051c840160018501610848565b5555610283565b634e487b7160e01b865285905284fd5b50634e487b7160e01b84526031905282fd5b845162461bcd60e51b81526020818601526019818501527f4572726f7220696e2072656d6f76653a20696e7465726e616c000000000000006044820152606490fd5b8280fd5b5082826003193601126103b95781359167ffffffffffffffff808411610314573660238501121561031457838201359261035184610727565b9361035e87519586610693565b8085526020958686016024809360051b830101913683116103e657838101915b8383106103bc5750505050359182116103b957506103a992916103a3913691016106cb565b90610764565b8392919251928352151590820152f35b80fd5b82358781116103e2578a916103d783928836918701016106cb565b81520192019161037e565b8680fd5b8480fd5b50816003193601126103145767ffffffffffffffff81358181116103e65761041590369084016106cb565b936024359182116103b9575061042d913691016106cb565b81519260209361045985828161044c818301968781519384920161064b565b8101038084520182610693565b51902090825161047885828161044c818301968781519384920161064b565b519020149051908152f35b602093929150366003190184136103e65781356001600160a01b03811691908290036106475767ffffffffffffffff9581850187811183821017610634578552601082526f181899199a1a9b1b9c1cb0b131b232b360811b868301528451966060880190811188821017610634578552603387528587018536823787511561062157603090538651916001928310156106215760786021890153815b6014811061053d57865188815280610539818b018c61066e565b0390f35b600c810180821161060e57888110156105fb5785901a6001600160f81b0319600f8161056d848b1c83168761097b565b51169284881b936002908686048214871517156105e8578582018092116105e8576105a28f91926105aa9594938b1a9261097b565b53168561097b565b511660039182018092116105d557906105ca6105d09392861a918c61097b565b5361073f565b61051f565b634e487b7160e01b855260118852602485fd5b634e487b7160e01b895260118c52602489fd5b634e487b7160e01b845260328752602484fd5b634e487b7160e01b845260118752602484fd5b634e487b7160e01b825260328552602482fd5b634e487b7160e01b825260418552602482fd5b8580fd5b60005b83811061065e5750506000910152565b818101518382015260200161064e565b906020916106878151809281855285808601910161064b565b601f01601f1916010190565b90601f8019910116810190811067ffffffffffffffff8211176106b557604052565b634e487b7160e01b600052604160045260246000fd5b81601f820112156107225780359067ffffffffffffffff82116106b55760405192610700601f8401601f191660200185610693565b8284526020838301011161072257816000926020809301838601378301015290565b600080fd5b67ffffffffffffffff81116106b55760051b60200190565b600019811461074e5760010190565b634e487b7160e01b600052601160045260246000fd5b60005b81518110156107d5576020808260051b8401015190604091825161079a83828161044c818301968781519384920161064b565b51902091516107b68282019282885161044c8187858d0161064b565b519020146107cc576107c79061073f565b610767565b91505090600190565b505050600090600090565b80548210156107f85760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c9216801561083e575b602083101461082857565b634e487b7160e01b600052602260045260246000fd5b91607f169161081d565b818110610853575050565b60008155600101610848565b9080821461097757610871815461080e565b9067ffffffffffffffff82116106b557819061088d845461080e565b601f811161093a575b50600090601f83116001146108ce576000926108c3575b50508160011b916000199060031b1c1916179055565b0154905038806108ad565b81526020808220858352818320935090601f1985169083905b828210610921575050908460019594939210610908575b505050811b019055565b015460001960f88460031b161c191690553880806108fe565b84958192958501548155600180910196019401906108e7565b61096790856000526020600020601f850160051c8101916020861061096d575b601f0160051c0190610848565b38610896565b909150819061095a565b5050565b9081518110156107f857016020019056fea2646970667358221220a5d2cb0732c567ca3e08960c28558282ad2e2a950a1f26547f2e954c2727eabf64736f6c63430008120033";

type StringArrayConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StringArrayConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StringArray__factory extends ContractFactory {
  constructor(...args: StringArrayConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<StringArray> {
    return super.deploy(overrides || {}) as Promise<StringArray>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): StringArray {
    return super.attach(address) as StringArray;
  }
  override connect(signer: Signer): StringArray__factory {
    return super.connect(signer) as StringArray__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StringArrayInterface {
    return new utils.Interface(_abi) as StringArrayInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): StringArray {
    return new Contract(address, _abi, signerOrProvider) as StringArray;
  }
}
