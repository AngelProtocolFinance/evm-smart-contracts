/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
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
        name: "registrarSplits",
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
        internalType: "string",
        name: "setting",
        type: "string",
      },
    ],
    name: "controllerSettingValid",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curDeductamount",
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
    inputs: [],
    name: "donationsReceivedDefault",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "locked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquid",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.DonationsReceived",
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
        internalType: "address[]",
        name: "curAddress",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "curAmount",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "curTokenaddress",
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
] as const;

const _bytecode =
  "0x6080806040523461001c576117ea908161002282393081600a0152f35b600080fdfe6080604090808252307f0000000000000000000000000000000000000000000000000000000000000000146004918236101561003a57600080fd5b600093843560e01c9182631f2c2609146110845750816327b2cd97146110295781632a0bc060146107f35781633704191314610ff8578163564343ff14610f0b5781636318b26214610b8b57816367efb78614610b5b5781636f331a1414610b26578163855762df1461090f578163973d5ef51461082c578163ad60ed5a146107f3578163b8108b2c1461073e578163b9fb75c5146106de578163d0352ce814610676578163e2aaa7f814610536578163e84b82f714610387578163e9f4742714610262575063f362d2d41461010f57600080fd5b61025e57608036600319011261025e573590602435916044359260643591845494815495855b60ff82818316101561025a576001908888878983898f5b878716106101b05750505050505050906101699161016e57611668565b610135565b6101ab61019661017e83876113b6565b905460039291831b1c6001600160a01b0316886116c2565b6101a0838a6113b6565b9054911b1c87611679565b611668565b90856101c96101c08b80956113b6565b929054966113b6565b9560018060a01b03809254600398891b1c1692871b1c16146101ff575b50505050506101f490611668565b8887898c898f61014c565b859497506102296101f49661021d61024e969594610237949b6113b6565b905490861b1c936113b6565b929093838554911b1c6116b5565b825460001960039390931b92831b1916911b179055565b9050883889868d6101e6565b8780f35b5080fd5b838560603660031901126103845781359267ffffffffffffffff92838511610380573660238601121561038057848101359361029d8561131b565b956102aa84519788611278565b85875260209560248789019160051b8301019136831161037c57602401905b82821061035957505050602435908111610355579293926102ec91369101611333565b916102f56110df565b6001600160a01b0390811691855b875160ff82169081101561034c57848461031d838c6116fd565b511614610334575b5061032f90611668565b610303565b61032f91975061034490876116fd565b519690610325565b82888751908152f35b8380fd5b81356001600160a01b03811681036103785781529087019087016102c9565b8780fd5b8680fd5b8280fd5b80fd5b929190506103805781600319360112610380578035602491823567ffffffffffffffff8111610532576103bd903690830161129a565b938594602091828201965b855460001981019081116105205780821015610512576103e882886113b6565b50835161040a816103fc898201809561141e565b03601f198101835282611278565b5190206104298a61043688875180938282019586918c519283916110f5565b8101038084520182611278565b5190201461044d575061044890611391565b6103c8565b8661047595969798995061046792945061046f93506113b6565b5091866113b6565b906115de565b8254801561050057600019019361048c85856113b6565b9390936104f05750509084916104a282546113e4565b90816104b1575b505050505580f35b8390601f83116001146104cc57505050555b823880806104a9565b83825281209290916104e990601f0160051c8401600185016114a1565b55556104c3565b634e487b7160e01b875286905285fd5b634e487b7160e01b8652603183528486fd5b505050509091929350610475565b634e487b7160e01b8a5260118652878afd5b8580fd5b8385846103845760803660031901126103845781356024356044359360643567ffffffffffffffff81116106725761057091369101611333565b938054835495855b60ff808216908482101561066e576001908a858a8a8d8b81955b878716106105f65750505050505050906105b292916105b7575b50611668565b610578565b6105e96105f0916105e36105cb858a6113b6565b905460039190911b1c6001600160a01b03168b6116c2565b856116fd565b5187611679565b896105ac565b90856106066101c08c8c956113b6565b9560018060a01b03809254600398891b1c1692871b1c161461063d575b505050505061063190611668565b858a8a8d8f8c90610592565b859497506102296106319661065b610662969594610237949b6116fd565b51936113b6565b9050858d8a868e610623565b8880f35b8480fd5b8385826003193601126103845750803560243591828211156106a65760208461069f858561165b565b9051908152f35b606490602085519162461bcd60e51b83528201526012602482015271496e73756666696369656e742046756e647360701b6044820152fd5b849084366003190160c0811261035557606013610380578151906107018261125c565b35815260243560208201526044358282015260a4359081151582036103555790610732916084359060643590611711565b82519182526020820152f35b8390858060031936011261038457806020835161075a8161122a565b84516107658161125c565b83815283838201528386820152815201528151916107828361125c565b8183526020830190828252808401838152602082516107a08161122a565b868152600391019081528251955163ffffffff16865292516020860152516001600160a01b0316908401525190838210156107e057608083836060820152f35b634e487b7160e01b815260218452602490fd5b84908160031936011261025e576108289061080c611626565b50610815611626565b90519182916020835260208301906111bd565b0390f35b84836103845761083b36611214565b829192935b835485101561090b57600193835b83548110156108db5761086187836113b6565b508351906108ae6108ba6020928461087c858201809361141e565b0394610890601f1996878101835282611278565b5190209361089e868a6113b6565b509388519384918201809661141e565b03908101835282611278565b519020146108d1575b6108cc90611391565b61084e565b93945084936108c3565b5093946108ec91956108f257611391565b93610840565b6109066108ff82876113b6565b5084611603565b611391565b8280f35b9050839161025e57606036600319011261025e578235906024359067ffffffffffffffff6044358181116105325761094a903690880161129a565b9160018690865491602093848701915b8460ff821610610ace5750505061096f578680f35b600160401b9586821015610abb579061098d916001820181556113b6565b939093610aa9578051928311610a96579082916109b4836109ae87546113e4565b876114b8565b81601f8411600114610a3057508792610a25575b50508160011b916000199060031b1c19161790555b805491821015610a12576109f89293506001820181556113b6565b8154906000199060031b1b19169055808280808080808680f35b634e487b7160e01b835260418452602483fd5b0151905087806109c8565b8589528089209350601f1985169089905b828210610a7e575050908460019594939210610a65575b505050811b0190556109dd565b015160001960f88460031b161c19169055878080610a58565b80600186978294978701518155019601940190610a41565b634e487b7160e01b875260418852602487fd5b634e487b7160e01b8752868852602487fd5b634e487b7160e01b885260418952602488fd5b610ad8818b6113b6565b508251610aec816103fc8a8201809561141e565b519020825187810190610b0789828d5161042981878c6110f5565b51902014610b1e575b610b1990611668565b61095a565b8a9350610b10565b92505061025e57610b56600191610b3c366112f1565b949190828060a01b031686520160205283209182546116b5565b905580f35b92505061025e57610b56600191610b71366112f1565b949190828060a01b0316865201602052832091825461165b565b60209085853660031901841361025e57803567ffffffffffffffff811161038057610bb9903690830161129a565b8351610bd486828161042981830196878151938492016110f5565b519020835185810190697374726174656769657360b01b8252600a8152610bfa8161122a565b5190208114918215610ec8575b8215610e85575b8215610e4e575b8215610e1c575b8215610deb575b8215610dbb575b8215610d8b575b8215610d62575b8215610d37575b8215610d0d575b508115610cdd575b8115610caa575b8115610c75575b5015610c6f57506001905b519015158152f35b90610c67565b90508251848101906f69676e6f72655573657253706c69747360801b825260108152610ca08161122a565b5190201484610c5c565b90508251848101906c1cdc1b1a5d151bd31a5c5d5a59609a1b8252600d8152610cd28161122a565b519020811490610c55565b90508251848101906963617465676f7269657360b01b8252600a8152610d028161122a565b519020811490610c4e565b909150835185810191636c6f676f60e01b83528152610d2b8161122a565b51902081149085610c46565b915083518581019064696d61676560d81b825260058152610d578161122a565b519020811491610c3f565b9150835185810190636e616d6560e01b8252838152610d808161122a565b519020811491610c38565b91508351858101906962616c616e636546656560b01b8252600a8152610db08161122a565b519020811491610c31565b9150835185810190696465706f73697446656560b01b8252600a8152610de08161122a565b519020811491610c2a565b91508351858101906a776974686472617746656560a81b8252600b8152610e118161122a565b519020811491610c23565b91508351858101906b6d6174757269747954696d6560a01b8252600c8152610e438161122a565b519020811491610c1c565b9150835185810190701b585d1d5c9a5d1e505b1b1bdddb1a5cdd607a1b825260118152610e7a8161122a565b519020811491610c15565b91508351858101907f616c6c6f776c6973746564436f6e7472696275746f7273000000000000000000825260178152610ebd8161122a565b519020811491610c0e565b91508351858101907f616c6c6f776c697374656442656e656669636961726965730000000000000000825260188152610f008161122a565b519020811491610c07565b848361038457610f1a36611214565b919081935b600293848301908154871015610ff457600193855b8783018054821015610fb457610f4a8a866113b6565b506108ae610f958851610f858660209583610f68888201809361141e565b0393610f7c601f1995868101835282611278565b519020966113b6565b50938a519384918201809661141e565b51902014610fac575b610fa790611391565b610f34565b869550610f9e565b5050958792610fcd94989295610fd6575b505050611391565b93929092610f1f565b610fec92610fe3916113b6565b50908501611603565b808780610fc5565b8480f35b839085606036600319011261038457506110206020926110166110c4565b6044359135611765565b90519015158152f35b915050608036600319011261038057602092506110446110c4565b61105b61104f6110df565b93826064359135611765565b92831561106d575b5050519015158152f35b6001600160a01b0391821691161491503880611063565b85908160031936011261025e5760208161109e849361122a565b8281520152602082516110b08161122a565b828152018181528251918252516020820152f35b602435906001600160a01b03821682036110da57565b600080fd5b604435906001600160a01b03821682036110da57565b60005b8381106111085750506000910152565b81810151838201526020016110f8565b908082519081815260208091019281808460051b8301019501936000915b8483106111465750505050505090565b909192939495848080600193601f1980878303018852601f8c51611175815180928187528780880191016110f5565b011601019801930193019194939290611136565b90815180825260208080930193019160005b8281106111a9575050505090565b83518552938101939281019260010161119b565b6112119160606112006111ee6111dc8551608086526080860190611118565b60208601518582036020870152611189565b60408501518482036040860152611118565b920151906060818403910152611189565b90565b60409060031901126110da576004359060243590565b6040810190811067ffffffffffffffff82111761124657604052565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff82111761124657604052565b90601f8019910116810190811067ffffffffffffffff82111761124657604052565b81601f820112156110da5780359067ffffffffffffffff821161124657604051926112cf601f8401601f191660200185611278565b828452602083830101116110da57816000926020809301838601378301015290565b60609060031901126110da57600435906024356001600160a01b03811681036110da579060443590565b67ffffffffffffffff81116112465760051b60200190565b81601f820112156110da5780359161134a8361131b565b926113586040519485611278565b808452602092838086019260051b8201019283116110da578301905b828210611382575050505090565b81358152908301908301611374565b60001981146113a05760010190565b634e487b7160e01b600052601160045260246000fd5b80548210156113ce5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c92168015611414575b60208310146113fe57565b634e487b7160e01b600052602260045260246000fd5b91607f16916113f3565b60009291815461142d816113e4565b92600191808316908115611486575060011461144a575b50505050565b90919293945060005260209081600020906000915b8583106114755750505050019038808080611444565b80548584015291830191810161145f565b60ff1916845250505081151590910201915038808080611444565b8181106114ac575050565b600081556001016114a1565b9190601f81116114c757505050565b6114f3926000526020600020906020601f840160051c830193106114f5575b601f0160051c01906114a1565b565b90915081906114e6565b908082146115da5761151181546113e4565b9067ffffffffffffffff82116112465781906115378261153186546113e4565b866114b8565b600090601f831160011461156e57600092611563575b50508160011b916000199060031b1c1916179055565b01549050388061154d565b81526020808220858352818320935090601f1985169083905b8282106115c15750509084600195949392106115a8575b505050811b019055565b015460001960f88460031b161c1916905538808061159e565b8495819295850154815560018091019601940190611587565b5050565b91906115ed576114f3916114ff565b634e487b7160e01b600052600060045260246000fd5b90815491600160401b831015611246578261046f9160016114f3950181556113b6565b604051906080820182811067ffffffffffffffff82111761124657604052606080838181528160208201528160408201520152565b919082039182116113a057565b60ff1660ff81146113a05760010190565b90815491600160401b831015611246578261169c9160016114f3950181556113b6565b90919082549060031b91821b91600019901b1916179055565b919082018092116113a057565b8054600160401b811015611246576116df916001820181556113b6565b819291549060031b9160018060a01b03809116831b921b1916179055565b80518210156113ce5760209160051b010190565b91939282518511908115611757575b811561174a575b5015611744575060400180516064908103935083116113a0575190565b90509190565b6001915015151438611727565b602084015186109150611720565b80546001600160a01b039081168015159493909190856117a8575b5050508261178d57505090565b60010154801592509082156117a157505090565b1115905090565b1614925038808061178056fea26469706673582212209c457b2638895691db2da71cd06e18be312c452520d91a64beff3141d2f4f63264736f6c63430008120033";

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
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AngelCoreStruct> {
    return super.deploy(overrides || {}) as Promise<AngelCoreStruct>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
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
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AngelCoreStruct {
    return new Contract(address, _abi, signerOrProvider) as AngelCoreStruct;
  }
}
