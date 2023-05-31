/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../common";
import type {
  AngelCoreStruct,
  AngelCoreStructInterface,
} from "../../../../contracts/core/struct.sol/AngelCoreStruct";

const _abi = [
  {
    inputs: [],
    name: "accountStrategiesDefaut",
    outputs: [
      {
        components: [
          {
            internalType: "string[]",
            name: "locked_vault",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "lockedPercentage",
            type: "uint256[]",
          },
          {
            internalType: "string[]",
            name: "liquid_vault",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "liquidPercentage",
            type: "uint256[]",
          },
        ],
        internalType: "struct AngelCoreStruct.AccountStrategies",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiaryDefault",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint32",
                name: "endowId",
                type: "uint32",
              },
              {
                internalType: "uint256",
                name: "fundId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "addr",
                type: "address",
              },
            ],
            internalType: "struct AngelCoreStruct.BeneficiaryData",
            name: "data",
            type: "tuple",
          },
          {
            internalType: "enum AngelCoreStruct.BeneficiaryEnum",
            name: "enumData",
            type: "AngelCoreStruct.BeneficiaryEnum",
          },
        ],
        internalType: "struct AngelCoreStruct.Beneficiary",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "max",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "min",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "defaultSplit",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.SplitDetails",
        name: "splits",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "userLocked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "userLiquid",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "userOverride",
        type: "bool",
      },
    ],
    name: "checkSplits",
    outputs: [
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
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deductamount",
        type: "uint256",
      },
    ],
    name: "deductTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "addresses",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "oneOffVaultsDefault",
    outputs: [
      {
        components: [
          {
            internalType: "string[]",
            name: "locked",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "lockedAmount",
            type: "uint256[]",
          },
          {
            internalType: "string[]",
            name: "liquid",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "liquidAmount",
            type: "uint256[]",
          },
        ],
        internalType: "struct AngelCoreStruct.OneOffVaults",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "payoutAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bps",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.FeeSetting",
        name: "fee",
        type: "tuple",
      },
    ],
    name: "validateFee",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001c5761124990816100228239308160080152f35b600080fdfe604060808152307f0000000000000000000000000000000000000000000000000000000000000000146004908136101561003857600080fd5b600090813560e01c9081632a0bc0601461074f578163564343ff14610b0257816367efb78614610acd5781636f331a1414610a82578163855762df1461086c578163973d5ef514610788578163ad60ed5a1461074f578163b4feed2a1461071e578163b8108b2c14610669578163b9fb75c514610609578163bb37a2831461058c578163d0352ce814610524578163d46887491461040a578163e84b82f71461025b575063e9f47427146100eb57600080fd5b60603660031901126102585781359267ffffffffffffffff91828511610258573660238601121561025857848401359361012485610e47565b9561013184519788610dce565b85875260209560248789019160051b8301019136831161025457602401905b8282106102315750505060243593841161022d573660238501121561022d578301359261017c84610e47565b9361018984519586610dce565b80855260248686019160051b8301019136831161022957929592602401905b82821061021a575050506101ba610d40565b6001600160a01b0390811691855b875160ff8216908110156102115784846101e2838c611147565b5116146101f9575b506101f490611136565b6101c8565b6101f49197506102099087611147565b5196906101ea565b82888751908152f35b813581529083019083016101a8565b8380fd5b5080fd5b81356001600160a01b0381168103610250578152908701908701610150565b8580fd5b8480fd5b80fd5b848484926104065781600319360112610406578035602491823567ffffffffffffffff8111610250576102919036908301610df0565b938594602091828201965b855460001981019081116103f457808210156103e6576102bc8288610e84565b5083516102de816102d08982018095610eec565b03601f198101835282610dce565b5190206102fd8a61030a88875180938282019586918c51928391610bf0565b8101038084520182610dce565b51902014610321575061031c90610e5f565b61029c565b8661034995969798995061033b9294506103439350610e84565b509186610e84565b906110ac565b825480156103d45760001901936103608585610e84565b9390936103c45750509084916103768254610eb2565b9081610385575b505050505580f35b8390601f83116001146103a057505050555b8284808061037d565b83825281209290916103bd90601f0160051c840160018501610f6f565b5555610397565b634e487b7160e01b875286905285fd5b634e487b7160e01b8652603183528486fd5b505050509091929350610349565b634e487b7160e01b8a5260118652878afd5b8280fd5b5050918060031936011261040657805161042381610d80565b8235906001600160a01b038216908183036102505760209281526024359283910152811515908161051b575b50156104a657815162461bcd60e51b8152602081850152602560248201527f496e76616c696420666565207061796f7574207a65726f20616464726573732060448201526433b4bb32b760d91b6064820152608490fd5b612710106104b2578280f35b906020608492519162461bcd60e51b8352820152603e60248201527f496e76616c69642066656520626173697320706f696e747320676976656e2e2060448201527f53686f756c64206265206265747765656e203020616e642031303030302e00006064820152fd5b9050153861044f565b5050826003193601126102585750803560243591828211156105545760208461054d8585611129565b9051908152f35b606490602085519162461bcd60e51b83528201526012602482015271496e73756666696369656e742046756e647360701b6044820152fd5b8285856080366003190112610406576020925035906105a9610d2a565b6105b1610d40565b9060ff8454161593846105ca575b505050519015158152f35b816105df9293949550600160643592016111c4565b9182156105f2575b5050908380806105bf565b6001600160a01b03918216911614905083806105e7565b828585366003190160c08112610229576060136104065781519061062c82610db2565b35815260243560208201526044358282015260a435908115158203610229579061065d91608435906064359061115b565b82519182526020820152f35b8385848060031936011261025857806020835161068581610d80565b845161069081610db2565b83815283838201528386820152815201528151916106ad83610db2565b8183526020830190828252808401838152602082516106cb81610d80565b868152600391019081528251955163ffffffff16865292516020860152516001600160a01b03169084015251908382101561070b57608083836060820152f35b634e487b7160e01b815260218452602490fd5b8385846060366003190112610258575061074660209261073c610d2a565b60443591356111c4565b90519015158152f35b82858160031936011261022d57610784906107686110f4565b506107716110f4565b9051918291602083526020830190610cb8565b0390f35b8285916102585761079836610d0f565b829192935b835485101561086857600193835b8354811015610838576107be8783610e84565b5083519061080b610817602092846107d98582018093610eec565b03946107ed601f1996878101835282610dce565b519020936107fb868a610e84565b5093885193849182018096610eec565b03908101835282610dce565b5190201461082e575b61082990610e5f565b6107ab565b9394508493610820565b509394610849919561084f57610e5f565b9361079d565b61086361085c8287610e84565b50846110d1565b610e5f565b8280f35b84915061022d57606036600319011261022d578235906024359067ffffffffffffffff604435818111610250576108a69036908801610df0565b9160018690865491602093848701915b8460ff821610610a2a575050506108cb578680f35b600160401b9586821015610a1757906108e991600182018155610e84565b939093610a055780519283116109f2579082916109108361090a8754610eb2565b87610f86565b81601f841160011461098c57508792610981575b50508160011b916000199060031b1c19161790555b80549182101561096e57610954929350600182018155610e84565b8154906000199060031b1b19169055808280808080808680f35b634e487b7160e01b835260418452602483fd5b015190508780610924565b8589528089209350601f1985169089905b8282106109da5750509084600195949392106109c1575b505050811b019055610939565b015160001960f88460031b161c191690558780806109b4565b8060018697829497870151815501960194019061099d565b634e487b7160e01b875260418852602487fd5b634e487b7160e01b8752868852602487fd5b634e487b7160e01b885260418952602488fd5b610a34818b610e84565b508251610a48816102d08a82018095610eec565b519020825187810190610a6389828d516102fd81878c610bf0565b51902014610a7a575b610a7590611136565b6108b6565b8a9350610a6c565b8484849261040657600191610a9636610d56565b949190828060a01b03168652016020528320908154928301809311610aba57505580f35b634e487b7160e01b845260119052602483fd5b84915061022d57610afd600191610ae336610d56565b949190828060a01b03168652016020528320918254611129565b905580f35b82859161025857610b1236610d0f565b919081935b600293848301908154871015610bec57600193855b8783018054821015610bac57610b428a86610e84565b5061080b610b8d8851610b7d8660209583610b608882018093610eec565b0393610b74601f1995868101835282610dce565b51902096610e84565b50938a5193849182018096610eec565b51902014610ba4575b610b9f90610e5f565b610b2c565b869550610b96565b5050958792610bc594989295610bce575b505050610e5f565b93929092610b17565b610be492610bdb91610e84565b509085016110d1565b808780610bbd565b8480f35b60005b838110610c035750506000910152565b8181015183820152602001610bf3565b908082519081815260208091019281808460051b8301019501936000915b848310610c415750505050505090565b909192939495848080600193601f1980878303018852601f8c51610c7081518092818752878088019101610bf0565b011601019801930193019194939290610c31565b90815180825260208080930193019160005b828110610ca4575050505090565b835185529381019392810192600101610c96565b610d0c916060610cfb610ce9610cd78551608086526080860190610c13565b60208601518582036020870152610c84565b60408501518482036040860152610c13565b920151906060818403910152610c84565b90565b6040906003190112610d25576004359060243590565b600080fd5b602435906001600160a01b0382168203610d2557565b604435906001600160a01b0382168203610d2557565b6060906003190112610d2557600435906024356001600160a01b0381168103610d25579060443590565b6040810190811067ffffffffffffffff821117610d9c57604052565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff821117610d9c57604052565b90601f8019910116810190811067ffffffffffffffff821117610d9c57604052565b81601f82011215610d255780359067ffffffffffffffff8211610d9c5760405192610e25601f8401601f191660200185610dce565b82845260208383010111610d2557816000926020809301838601378301015290565b67ffffffffffffffff8111610d9c5760051b60200190565b6000198114610e6e5760010190565b634e487b7160e01b600052601160045260246000fd5b8054821015610e9c5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c92168015610ee2575b6020831014610ecc57565b634e487b7160e01b600052602260045260246000fd5b91607f1691610ec1565b600092918154610efb81610eb2565b92600191808316908115610f545750600114610f18575b50505050565b90919293945060005260209081600020906000915b858310610f435750505050019038808080610f12565b805485840152918301918101610f2d565b60ff1916845250505081151590910201915038808080610f12565b818110610f7a575050565b60008155600101610f6f565b9190601f8111610f9557505050565b610fc1926000526020600020906020601f840160051c83019310610fc3575b601f0160051c0190610f6f565b565b9091508190610fb4565b908082146110a857610fdf8154610eb2565b9067ffffffffffffffff8211610d9c57819061100582610fff8654610eb2565b86610f86565b600090601f831160011461103c57600092611031575b50508160011b916000199060031b1c1916179055565b01549050388061101b565b81526020808220858352818320935090601f1985169083905b82821061108f575050908460019594939210611076575b505050811b019055565b015460001960f88460031b161c1916905538808061106c565b8495819295850154815560018091019601940190611055565b5050565b91906110bb57610fc191610fcd565b634e487b7160e01b600052600060045260246000fd5b90815491600160401b831015610d9c5782610343916001610fc195018155610e84565b604051906080820182811067ffffffffffffffff821117610d9c57604052606080838181528160208201528160408201520152565b91908203918211610e6e57565b60ff1660ff8114610e6e5760010190565b8051821015610e9c5760209160051b010190565b92156111795750506040019081516064039160648311610e6e575190565b82518211156111975750505190816064039160648311610e6e579190565b909291602001928351918282106000146111bd5750506064039160648311610e6e575190565b9350919050565b80546001600160a01b03908116801515949390919085611207575b505050826111ec57505090565b600101548015925090821561120057505090565b1115905090565b161492503880806111df56fea264697066735822122090d9fb24de03ba096a56621c43f646cc53b889fc597bc31639fc3eaf2657ece164736f6c63430008120033";

type AngelCoreStructConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AngelCoreStructConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AngelCoreStruct__factory extends ContractFactory {
  constructor(...args: AngelCoreStructConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<AngelCoreStruct> {
    return super.deploy(overrides || {}) as Promise<AngelCoreStruct>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AngelCoreStruct {
    return super.attach(address) as AngelCoreStruct;
  }
  override connect(signer: Signer): AngelCoreStruct__factory {
    return super.connect(signer) as AngelCoreStruct__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AngelCoreStructInterface {
    return new utils.Interface(_abi) as AngelCoreStructInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): AngelCoreStruct {
    return new Contract(address, _abi, signerOrProvider) as AngelCoreStruct;
  }
}
