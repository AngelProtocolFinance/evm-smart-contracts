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
        internalType: "struct AngelCoreStruct.EndowmentFee",
        name: "fee",
        type: "tuple",
      },
    ],
    name: "validateFee",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001c5761123890816100228239308160080152f35b600080fdfe604060808152307f0000000000000000000000000000000000000000000000000000000000000000146004908136101561003857600080fd5b600090813560e01c9081632a0bc06014610635578163564343ff14610af157816367efb78614610abc5781636f331a1414610a71578163855762df1461085b57816393dae3f714610752578163973d5ef51461066e578163ad60ed5a14610635578163b4feed2a14610604578163b8108b2c1461054f578163b9fb75c5146104ef578163bb37a28314610472578163d0352ce81461040a578163e84b82f71461025b575063e9f47427146100eb57600080fd5b60603660031901126102585781359267ffffffffffffffff91828511610258573660238601121561025857848401359361012485610e36565b9561013184519788610dbd565b85875260209560248789019160051b8301019136831161025457602401905b8282106102315750505060243593841161022d573660238501121561022d578301359261017c84610e36565b9361018984519586610dbd565b80855260248686019160051b8301019136831161022957929592602401905b82821061021a575050506101ba610d2f565b6001600160a01b0390811691855b875160ff8216908110156102115784846101e2838c611136565b5116146101f9575b506101f490611125565b6101c8565b6101f49197506102099087611136565b5196906101ea565b82888751908152f35b813581529083019083016101a8565b8380fd5b5080fd5b81356001600160a01b0381168103610250578152908701908701610150565b8580fd5b8480fd5b80fd5b848484926104065781600319360112610406578035602491823567ffffffffffffffff8111610250576102919036908301610ddf565b938594602091828201965b855460001981019081116103f457808210156103e6576102bc8288610e73565b5083516102de816102d08982018095610edb565b03601f198101835282610dbd565b5190206102fd8a61030a88875180938282019586918c51928391610bdf565b8101038084520182610dbd565b51902014610321575061031c90610e4e565b61029c565b8661034995969798995061033b9294506103439350610e73565b509186610e73565b9061109b565b825480156103d45760001901936103608585610e73565b9390936103c45750509084916103768254610ea1565b9081610385575b505050505580f35b8390601f83116001146103a057505050555b8284808061037d565b83825281209290916103bd90601f0160051c840160018501610f5e565b5555610397565b634e487b7160e01b875286905285fd5b634e487b7160e01b8652603183528486fd5b505050509091929350610349565b634e487b7160e01b8a5260118652878afd5b8280fd5b50508260031936011261025857508035602435918282111561043a576020846104338585611118565b9051908152f35b606490602085519162461bcd60e51b83528201526012602482015271496e73756666696369656e742046756e647360701b6044820152fd5b82858560803660031901126104065760209250359061048f610d19565b610497610d2f565b9060ff8454161593846104b0575b505050519015158152f35b816104c59293949550600160643592016111b3565b9182156104d8575b5050908380806104a5565b6001600160a01b03918216911614905083806104cd565b828585366003190160c08112610229576060136104065781519061051282610da1565b35815260243560208201526044358282015260a435908115158203610229579061054391608435906064359061114a565b82519182526020820152f35b8385848060031936011261025857806020835161056b81610d6f565b845161057681610da1565b838152838382015283868201528152015281519161059383610da1565b8183526020830190828252808401838152602082516105b181610d6f565b868152600391019081528251955163ffffffff16865292516020860152516001600160a01b0316908401525190838210156105f157608083836060820152f35b634e487b7160e01b815260218452602490fd5b8385846060366003190112610258575061062c602092610622610d19565b60443591356111b3565b90519015158152f35b82858160031936011261022d5761066a9061064e6110e3565b506106576110e3565b9051918291602083526020830190610ca7565b0390f35b8285916102585761067e36610cfe565b829192935b835485101561074e57600193835b835481101561071e576106a48783610e73565b508351906106f16106fd602092846106bf8582018093610edb565b03946106d3601f1996878101835282610dbd565b519020936106e1868a610e73565b5093885193849182018096610edb565b03908101835282610dbd565b51902014610714575b61070f90610e4e565b610691565b9394508493610706565b50939461072f919561073557610e4e565b93610683565b6107496107428287610e73565b50846110c0565b610e4e565b8280f35b5050918060031936011261040657805161076b81610d6f565b8235906001600160a01b038216908183036102505760209281526024359283910152156000146107e657815162461bcd60e51b8152602081850152602560248201527f496e76616c696420666565207061796f7574207a65726f20616464726573732060448201526433b4bb32b760d91b6064820152608490fd5b612710106107f2578280f35b906020608492519162461bcd60e51b8352820152603e60248201527f496e76616c69642066656520626173697320706f696e747320676976656e2e2060448201527f53686f756c64206265206265747765656e203020616e642031303030302e00006064820152fd5b84915061022d57606036600319011261022d578235906024359067ffffffffffffffff604435818111610250576108959036908801610ddf565b9160018690865491602093848701915b8460ff821610610a19575050506108ba578680f35b600160401b9586821015610a0657906108d891600182018155610e73565b9390936109f45780519283116109e1579082916108ff836108f98754610ea1565b87610f75565b81601f841160011461097b57508792610970575b50508160011b916000199060031b1c19161790555b80549182101561095d57610943929350600182018155610e73565b8154906000199060031b1b19169055808280808080808680f35b634e487b7160e01b835260418452602483fd5b015190508780610913565b8589528089209350601f1985169089905b8282106109c95750509084600195949392106109b0575b505050811b019055610928565b015160001960f88460031b161c191690558780806109a3565b8060018697829497870151815501960194019061098c565b634e487b7160e01b875260418852602487fd5b634e487b7160e01b8752868852602487fd5b634e487b7160e01b885260418952602488fd5b610a23818b610e73565b508251610a37816102d08a82018095610edb565b519020825187810190610a5289828d516102fd81878c610bdf565b51902014610a69575b610a6490611125565b6108a5565b8a9350610a5b565b8484849261040657600191610a8536610d45565b949190828060a01b03168652016020528320908154928301809311610aa957505580f35b634e487b7160e01b845260119052602483fd5b84915061022d57610aec600191610ad236610d45565b949190828060a01b03168652016020528320918254611118565b905580f35b82859161025857610b0136610cfe565b919081935b600293848301908154871015610bdb57600193855b8783018054821015610b9b57610b318a86610e73565b506106f1610b7c8851610b6c8660209583610b4f8882018093610edb565b0393610b63601f1995868101835282610dbd565b51902096610e73565b50938a5193849182018096610edb565b51902014610b93575b610b8e90610e4e565b610b1b565b869550610b85565b5050958792610bb494989295610bbd575b505050610e4e565b93929092610b06565b610bd392610bca91610e73565b509085016110c0565b808780610bac565b8480f35b60005b838110610bf25750506000910152565b8181015183820152602001610be2565b908082519081815260208091019281808460051b8301019501936000915b848310610c305750505050505090565b909192939495848080600193601f1980878303018852601f8c51610c5f81518092818752878088019101610bdf565b011601019801930193019194939290610c20565b90815180825260208080930193019160005b828110610c93575050505090565b835185529381019392810192600101610c85565b610cfb916060610cea610cd8610cc68551608086526080860190610c02565b60208601518582036020870152610c73565b60408501518482036040860152610c02565b920151906060818403910152610c73565b90565b6040906003190112610d14576004359060243590565b600080fd5b602435906001600160a01b0382168203610d1457565b604435906001600160a01b0382168203610d1457565b6060906003190112610d1457600435906024356001600160a01b0381168103610d14579060443590565b6040810190811067ffffffffffffffff821117610d8b57604052565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff821117610d8b57604052565b90601f8019910116810190811067ffffffffffffffff821117610d8b57604052565b81601f82011215610d145780359067ffffffffffffffff8211610d8b5760405192610e14601f8401601f191660200185610dbd565b82845260208383010111610d1457816000926020809301838601378301015290565b67ffffffffffffffff8111610d8b5760051b60200190565b6000198114610e5d5760010190565b634e487b7160e01b600052601160045260246000fd5b8054821015610e8b5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c92168015610ed1575b6020831014610ebb57565b634e487b7160e01b600052602260045260246000fd5b91607f1691610eb0565b600092918154610eea81610ea1565b92600191808316908115610f435750600114610f07575b50505050565b90919293945060005260209081600020906000915b858310610f325750505050019038808080610f01565b805485840152918301918101610f1c565b60ff1916845250505081151590910201915038808080610f01565b818110610f69575050565b60008155600101610f5e565b9190601f8111610f8457505050565b610fb0926000526020600020906020601f840160051c83019310610fb2575b601f0160051c0190610f5e565b565b9091508190610fa3565b9080821461109757610fce8154610ea1565b9067ffffffffffffffff8211610d8b578190610ff482610fee8654610ea1565b86610f75565b600090601f831160011461102b57600092611020575b50508160011b916000199060031b1c1916179055565b01549050388061100a565b81526020808220858352818320935090601f1985169083905b82821061107e575050908460019594939210611065575b505050811b019055565b015460001960f88460031b161c1916905538808061105b565b8495819295850154815560018091019601940190611044565b5050565b91906110aa57610fb091610fbc565b634e487b7160e01b600052600060045260246000fd5b90815491600160401b831015610d8b5782610343916001610fb095018155610e73565b604051906080820182811067ffffffffffffffff821117610d8b57604052606080838181528160208201528160408201520152565b91908203918211610e5d57565b60ff1660ff8114610e5d5760010190565b8051821015610e8b5760209160051b010190565b92156111685750506040019081516064039160648311610e5d575190565b82518211156111865750505190816064039160648311610e5d579190565b909291602001928351918282106000146111ac5750506064039160648311610e5d575190565b9350919050565b80546001600160a01b039081168015159493909190856111f6575b505050826111db57505090565b60010154801592509082156111ef57505090565b1115905090565b161492503880806111ce56fea264697066735822122033654b8795e0130266226d5e1e46663eef61e099fcf6fcf568f1001010cf8c6a64736f6c63430008120033";

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
