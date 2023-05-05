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
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "coinNativeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "Cw20CoinVerified_amount",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "Cw20CoinVerified_addr",
            type: "address[]",
          },
        ],
        internalType: "struct AngelCoreStruct.GenericBalance",
        name: "curTemp",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "curTokenaddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curAmount",
        type: "uint256",
      },
    ],
    name: "addTokenMem",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "coinNativeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "Cw20CoinVerified_amount",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "Cw20CoinVerified_addr",
            type: "address[]",
          },
        ],
        internalType: "struct AngelCoreStruct.GenericBalance",
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
                internalType: "uint256",
                name: "id",
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
        internalType: "address[]",
        name: "cw20",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "cw20Valid",
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
        name: "curDeducttokenfor",
        type: "address",
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
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
    inputs: [],
    name: "genericBalanceDefault",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "coinNativeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "Cw20CoinVerified_amount",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "Cw20CoinVerified_addr",
            type: "address[]",
          },
        ],
        internalType: "struct AngelCoreStruct.GenericBalance",
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
  {
    inputs: [],
    name: "rebalanceDetailsDefaut",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidInvestedProfits",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "lockedInterestsToLiquid",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "interest_distribution",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "principle_distribution",
            type: "uint256",
          },
        ],
        internalType: "struct AngelCoreStruct.RebalanceDetails",
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
            name: "coinNativeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "Cw20CoinVerified_amount",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "Cw20CoinVerified_addr",
            type: "address[]",
          },
        ],
        internalType: "struct AngelCoreStruct.GenericBalance",
        name: "curTemp",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "curTokenaddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curAmount",
        type: "uint256",
      },
    ],
    name: "subTokenMem",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "coinNativeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "Cw20CoinVerified_amount",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "Cw20CoinVerified_addr",
            type: "address[]",
          },
        ],
        internalType: "struct AngelCoreStruct.GenericBalance",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001c5761249f90816100228239308160080152f35b600080fdfe604060808152307f0000000000000000000000000000000000000000000000000000000000000000146004908136101561003857600080fd5b600092833560e01c90816312f1ee09146112385781631f2c2609146111f85781632a0bc0601461088d5781632b15f3cc1461116b578163370419131461114357816340b185af1461102c578163564343ff14610f3f57816367efb78614610ebb578163692cb37014610ea55781636f331a1414610df2578163855762df14610bdc57816390aac6e114610baf578163973d5ef514610acc5781639d965a9b146109e6578163a16acfee146109a457848263aa061d00146108c257508163ad60ed5a1461088d578163b8108b2c146107f0578163b9fb75c514610790578163cc48fc961461070d578163e2aaa7f8146105ce578163e84b82f71461041c578163e9f4742714610369578163ee138400146102da578163eed0c426146102b9575063f362d2d41461016657600080fd5b6102b55760803660031901126102b5573590602435916044359260643591845494815495855b60ff8281831610156102b1576001908888878983898f5b878716106102075750505050505050906101c0916101c557611a6c565b61018c565b6102026101ed6101d583876117bc565b905460039291831b1c6001600160a01b031688611ac6565b6101f7838a6117bc565b9054911b1c87611a7d565b611a6c565b90856102206102178b80956117bc565b929054966117bc565b9560018060a01b03809254600398891b1c1692871b1c1614610256575b505050505061024b90611a6c565b8887898c898f6101a3565b8594975061028061024b966102746102a596959461028e949b6117bc565b905490861b1c936117bc565b929093838554911b1c611ab9565b825460001960039390931b92831b1916911b179055565b9050883889868d61023d565b8780f35b5080fd5b6020906102d16102c836611752565b93929092611da7565b90519015158152f35b83858260031936011261036657813580549392602480359291906102fd87611b35565b94841593815b60ff81168a811015610355578661031a83856117bc565b905491610343578961033e9493926103389260031b1c04918b611b21565b52611a6c565b610303565b634e487b7160e01b8652601288528686fd5b8951806103628b82611681565b0390f35b80fd5b84849160606003193601126102b5576001600160401b0392803584811161041857610397903690830161138c565b93602435908111610418576103ae91369101611519565b906103b7611376565b6001600160a01b0390811690845b865160ff82169081101561040e5783836103df838b611b21565b5116146103f6575b506103f190611a6c565b6103c5565b6103f19196506104069086611b21565b5195906103e7565b6020878651908152f35b8380fd5b929190506105ca57816003193601126105ca57803560249182356001600160401b0381116105c65761045190369083016116fc565b938594602091828201965b855460001981019081116105b457808210156105a65761047c82886117bc565b50835161049e816104908982018095611824565b03601f198101835282611323565b5190206104bd8a6104ca88875180938282019586918c519283916113fa565b8101038084520182611323565b519020146104e157506104dc90611797565b61045c565b866105099596979899506104fb92945061050393506117bc565b5091866117bc565b906119e3565b8254801561059457600019019361052085856117bc565b93909361058457505090849161053682546117ea565b9081610545575b505050505580f35b8390601f831160011461056057505050555b8238808061053d565b838252812092909161057d90601f0160051c8401600185016118a7565b5555610557565b634e487b7160e01b875286905285fd5b634e487b7160e01b8652603183528486fd5b505050509091929350610509565b634e487b7160e01b8a5260118652878afd5b8580fd5b8280fd5b838584610366576080366003190112610366578135602435604435936064356001600160401b0381116107095761060791369101611519565b938054835495855b60ff8082169084821015610705576001908a858a8a8d8b81955b8787161061068d575050505050505090610649929161064e575b50611a6c565b61060f565b6106806106879161067a610662858a6117bc565b905460039190911b1c6001600160a01b03168b611ac6565b85611b21565b5187611a7d565b89610643565b908561069d6102178c8c956117bc565b9560018060a01b03809254600398891b1c1692871b1c16146106d4575b50505050506106c890611a6c565b858a8a8d8f8c90610629565b859497506102806106c8966106f26106f996959461028e949b611b21565b51936117bc565b9050858d8a868e6106ba565b8880f35b8480fd5b8490816003193601126102b557908181608060a0945161072c81611308565b82815282602082015282848201528260608201520152805161074d81611308565b8281526020810191838352808201601481526080606084019386855201938585528251958652511515602086015251908401525115156060830152516080820152f35b849084366003190160c08112610418576060136105ca578151906107b3826112ed565b35815260243560208201526044358282015260a43590811515820361041857906107e4916084359060643590611d03565b82519182526020820152f35b8390858060031936011261036657806020835161080c816112bc565b8451610817816112bc565b83815283838201528152015281519161082f836112bc565b8183526020830182815260208251610846816112bc565b8581526003910190815282519451855290516001600160a01b0316602085015251918483101561087a575060609350820152f35b634e487b7160e01b815260218552602490fd5b8490816003193601126102b557610362906108a6611a2b565b506108af611a2b565b90519182916020835260208301906114c2565b8091846109a1576108d236611752565b6001600160a01b0392831683851690811494919285610995575b851561095c575b5050831561092a575b505050610907575050f35b610913600292516112bc565b6001810180546001600160a01b0319169055015580f35b9091925060018401928354161515928361094a575b5050508580806108fc565b6109549350611d57565b85808061093f565b8491929550168015159182610986575b8261097c575b50509288806108f3565b1490508880610972565b865460081c60ff16925061096c565b865460ff1695506108ec565b50fd5b8085859260031936011261036657602435906001600160401b03821161036657506020926109d86109df92369083016116fc565b9035611e61565b9051908152f35b929190506105ca5760c03660031901126105ca573590610a0461135b565b90610a0d611376565b6064356001600160a01b038181169291839003610ac85760843594818616809603610ac4578116911681149182610ab8575b8215610a84575b5050610a50578380f35b610a5a90516112bc565b60018201906bffffffffffffffffffffffff60a01b825416179055600260a4359101553880808380f35b80151592509082610aa9575b82610a9f575b50503880610a46565b1490503880610a96565b855460081c60ff169250610a90565b855460ff169250610a3f565b8780fd5b8680fd5b848361036657610adb366116bc565b829192935b8354851015610bab57600193835b8354811015610b7b57610b0187836117bc565b50835190610b4e610b5a60209284610b1c8582018093611824565b0394610b30601f1996878101835282611323565b51902093610b3e868a6117bc565b5093885193849182018096611824565b03908101835282611323565b51902014610b71575b610b6c90611797565b610aee565b9394508493610b63565b509394610b8c9195610b9257611797565b93610ae0565b610ba6610b9f82876117bc565b5084611a08565b611797565b8280f35b8490816003193601126102b55761036290610bc8611b01565b50610bd1611b01565b905191829182611611565b905083916102b55760603660031901126102b557823590602435906001600160401b036044358181116105c657610c1690369088016116fc565b9160018690865491602093848701915b8460ff821610610d9a57505050610c3b578680f35b600160401b9586821015610d875790610c59916001820181556117bc565b939093610d75578051928311610d6257908291610c8083610c7a87546117ea565b876118be565b81601f8411600114610cfc57508792610cf1575b50508160011b916000199060031b1c19161790555b805491821015610cde57610cc49293506001820181556117bc565b8154906000199060031b1b19169055808280808080808680f35b634e487b7160e01b835260418452602483fd5b015190508780610c94565b8589528089209350601f1985169089905b828210610d4a575050908460019594939210610d31575b505050811b019055610ca9565b015160001960f88460031b161c19169055878080610d24565b80600186978294978701518155019601940190610d0d565b634e487b7160e01b875260418852602487fd5b634e487b7160e01b8752868852602487fd5b634e487b7160e01b885260418952602488fd5b610da4818b6117bc565b508251610db8816104908a82018095611824565b519020825187810190610dd389828d516104bd81878c6113fa565b51902014610dea575b610de590611a6c565b610c26565b8a9350610ddc565b848361036657610e01366116d2565b9091600190818086815b610e38575b5050610e1a578480f35b610e2a610e309460028301611ac6565b01611a7d565b818080808480f35b60028401805460ff83161015610e9f5781610e52916117bc565b9054600391821b1c6001600160a01b0390811690891614610e7e575b50610e7890611a6c565b81610e0b565b9250610e7890610e9989948861028e61028085888b016117bc565b90610e6e565b50610e10565b61036290610bd1610eb536611577565b91611b67565b848361036657610eca366116d2565b9190835b6002830190815460ff82161015610f3b57610eec81610f0d936117bc565b9054600391821b1c6001600160a01b0390811690851614610f125750611a6c565b610ece565b610f35908661028e610f278560018a016117bc565b929093838554911b1c611a5f565b86610643565b8580f35b848361036657610f4e366116bc565b919081935b60029384830190815487101561102857600193855b8783018054821015610fe857610f7e8a866117bc565b50610b4e610fc98851610fb98660209583610f9c8882018093611824565b0393610fb0601f1995868101835282611323565b519020966117bc565b50938a5193849182018096611824565b51902014610fe0575b610fdb90611797565b610f68565b869550610fd2565b50509587926110019498929561100a575b505050611797565b93929092610f53565b61102092611017916117bc565b50908501611a08565b808780610ff9565b8480f35b848460803660031901126102b5576001600160401b039181358381116102b557611059903690840161138c565b9360249384359081116105ca576110739036908501611519565b9261107c611376565b6001600160a01b03956064803595909491928816905b895160ff82169081101561113657828a6110ac838e611b21565b5116146110c3575b506110be90611a6c565b611092565b876110ce828b611b21565b5111156110ff5790816110f86110f18a6110eb6110be968e611b21565b51611a5f565b918b611b21565b52906110b4565b505050906020601292519362461bcd60e51b855284015282015271496e73756666696369656e742046756e647360701b6044820152fd5b8351806103628b82611681565b839085606036600319011261036657506102d160209261116161135b565b6044359135611d57565b849061117636611577565b919093611181611b01565b505b8382015180519060ff8316918210156111eb576111c29291906001600160a01b039081906111b2908490611b21565b5116908816146111c75750611a6c565b611183565b6111e46020850151916111de876110eb8386611b21565b92611b21565b5286610643565b8551806103628682611611565b8480600319360112610366578060208351611212816112bc565b828152015260208251611224816112bc565b828152018181528251918252516020820152f35b8484826003193601126102b55780356001600160401b0381116105ca576112619136910161138c565b61126961135b565b6001600160a01b0390811691835b815160ff8216908110156112b05783611291869285611b21565b5116146112a7575b6112a290611a6c565b611277565b60019450611299565b60208688519015158152f35b604081019081106001600160401b038211176112d757604052565b634e487b7160e01b600052604160045260246000fd5b606081019081106001600160401b038211176112d757604052565b60a081019081106001600160401b038211176112d757604052565b90601f801991011681019081106001600160401b038211176112d757604052565b6001600160401b0381116112d75760051b60200190565b602435906001600160a01b038216820361137157565b600080fd5b604435906001600160a01b038216820361137157565b81601f82011215611371578035916113a383611344565b926113b16040519485611323565b808452602092838086019260051b820101928311611371578301905b8282106113db575050505090565b81356001600160a01b03811681036113715781529083019083016113cd565b60005b83811061140d5750506000910152565b81810151838201526020016113fd565b908082519081815260208091019281808460051b8301019501936000915b84831061144b5750505050505090565b909192939495848080600193601f1980878303018852601f8c5161147a815180928187528780880191016113fa565b01160101980193019301919493929061143b565b90815180825260208080930193019160005b8281106114ae575050505090565b8351855293810193928101926001016114a0565b6115169160606115056114f36114e1855160808652608086019061141d565b6020860151858203602087015261148e565b6040850151848203604086015261141d565b92015190606081840391015261148e565b90565b81601f820112156113715780359161153083611344565b9261153e6040519485611323565b808452602092838086019260051b820101928311611371578301905b828210611568575050505090565b8135815290830190830161155a565b60031960608282011261137157600435916001600160401b039182841161137157606090848303011261137157604051926115b1846112ed565b806004013584526024810135838111611371578260046115d392840101611519565b60208501526044810135928311611371576115f1920160040161138c565b6040820152906024356001600160a01b0381168103611371579060443590565b90602090818352805182840152604061163783830151606083870152608086019061148e565b910151926060601f198284030191015281808451928381520193019160005b828110611664575050505090565b83516001600160a01b031685529381019392810192600101611656565b6020908160408183019282815285518094520193019160005b8281106116a8575050505090565b83518552938101939281019260010161169a565b6040906003190112611371576004359060243590565b606090600319011261137157600435906024356001600160a01b0381168103611371579060443590565b81601f82011215611371578035906001600160401b0382116112d75760405192611730601f8401601f191660200185611323565b8284526020838301011161137157816000926020809301838601378301015290565b60a090600319011261137157600435906001600160a01b0360243581811681036113715791604435828116810361137157916064359081168103611371579060843590565b60001981146117a65760010190565b634e487b7160e01b600052601160045260246000fd5b80548210156117d45760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c9216801561181a575b602083101461180457565b634e487b7160e01b600052602260045260246000fd5b91607f16916117f9565b600092918154611833816117ea565b9260019180831690811561188c5750600114611850575b50505050565b90919293945060005260209081600020906000915b85831061187b575050505001903880808061184a565b805485840152918301918101611865565b60ff191684525050508115159091020191503880808061184a565b8181106118b2575050565b600081556001016118a7565b9190601f81116118cd57505050565b6118f9926000526020600020906020601f840160051c830193106118fb575b601f0160051c01906118a7565b565b90915081906118ec565b908082146119df5761191781546117ea565b906001600160401b0382116112d757819061193c8261193686546117ea565b866118be565b600090601f831160011461197357600092611968575b50508160011b916000199060031b1c1916179055565b015490503880611952565b81526020808220858352818320935090601f1985169083905b8282106119c65750509084600195949392106119ad575b505050811b019055565b015460001960f88460031b161c191690553880806119a3565b849581929585015481556001809101960194019061198c565b5050565b91906119f2576118f991611905565b634e487b7160e01b600052600060045260246000fd5b90815491600160401b8310156112d757826105039160016118f9950181556117bc565b60405190608082018281106001600160401b038211176112d757604052606080838181528160208201528160408201520152565b919082039182116117a657565b60ff1660ff81146117a65760010190565b90815491600160401b8310156112d75782611aa09160016118f9950181556117bc565b90919082549060031b91821b91600019901b1916179055565b919082018092116117a657565b8054600160401b8110156112d757611ae3916001820181556117bc565b819291549060031b9160018060a01b03809116831b921b1916179055565b60405190611b0e826112ed565b6060604083600081528260208201520152565b80518210156117d45760209160051b010190565b90611b3f82611344565b611b4c6040519182611323565b8281528092611b5d601f1991611344565b0190602036910137565b919091611b72611b01565b50600160005b604083015180519060ff831691821015611be9576001600160a01b03908190611ba2908490611b21565b511690871614611bbc575b50611bb790611a6c565b611b78565b9150611bb790600092611be26020860151916111de88611bdc8386611b21565b51611ab9565b5290611bad565b50929392505015611cfd5781516020830194855151600181018091116117a657611c14604091611b35565b94019182515193600185018095116117a657611c2f85611344565b94611c3d6040519687611323565b808652611c4c601f1991611344565b0136602087013760405191611c60836112ed565b8252602082019586526040820194855260005b84518051821015611cc757611cc291906001600160a01b0390611c97908390611b21565b5116611ca4828951611b21565b52611cb0818b51611b21565b51611cbc828a51611b21565b52611797565b611c73565b505094919692611ce290611cf9959792975190515190611b21565b6001600160a01b0390911690525190515190611b21565b5290565b50905090565b91939282518511908115611d49575b8115611d3c575b5015611d36575060400180516064908103935083116117a6575190565b90509190565b6001915015151438611d19565b602084015186109150611d12565b80546001600160a01b03928316921691909114919082611d83575b505015611d7e57600190565b600090565b6001015480159250908215611d9c575b50503880611d72565b111590503880611d93565b936001600160a01b039283168383169081149491929185611e55575b8515611e1c575b50508315611dea575b505050611de05750600090565b5460101c60ff1690565b90919250600184019283541615159283611e0a575b505050388080611dd3565b611e149350611d57565b388080611dff565b8491929550168015159182611e46575b82611e3c575b5050923880611dca565b1490503880611e32565b865460081c60ff169250611e2c565b865460ff169550611dc3565b9060408051602092838201815192611e838682818601966104bd81878a6113fa565b5190208351858101907232b73237bbb6b2b73a21b7b73a3937b63632b960691b825260138152611eb2816112bc565b51902003611ec1575050505090565b825184810190611ed9868285516104bd81878a6113fa565b519020835185810190701b585d1d5c9a5d1e55da1a5d195b1a5cdd607a1b825260118152611f06816112bc565b51902003611f185750505050600c0190565b825184810190611f30868285516104bd81878a6113fa565b5190208351858101906c1cdc1b1a5d151bd31a5c5d5a59609a1b8252600d8152611f59816112bc565b51902003611f6b575050505060300190565b825184810190611f83868285516104bd81878a6113fa565b5190208351858101906f69676e6f72655573657253706c69747360801b825260108152611faf816112bc565b51902003611fc1575050505060330190565b825184810190611fd9868285516104bd81878a6113fa565b519020835185810190697374726174656769657360b01b8252600a8152611fff816112bc565b51902003612011575050505060030190565b825184810190612029868285516104bd81878a6113fa565b5190208351858101907f77686974656c697374656442656e656669636961726965730000000000000000825260188152612062816112bc565b51902003612074575050505060060190565b82518481019061208c868285516104bd81878a6113fa565b5190208351858101907f77686974656c6973746564436f6e7472696275746f72730000000000000000008252601781526120c5816112bc565b519020036120d7575050505060090190565b8251848101906120ef868285516104bd81878a6113fa565b5190208351858101906b6d6174757269747954696d6560a01b8252600c8152612117816112bc565b519020036121295750505050600f0190565b825184810190612141868285516104bd81878a6113fa565b5190208351858101906670726f66696c6560c81b825260078152612164816112bc565b51902003612176575050505060120190565b82518481019061218e868285516104bd81878a6113fa565b5190208351858101906a6561726e696e677346656560a81b8252600b81526121b5816112bc565b519020036121c7575050505060150190565b8251848101906121df868285516104bd81878a6113fa565b5190208351858101906a776974686472617746656560a81b8252600b8152612206816112bc565b51902003612218575050505060180190565b825184810190612230868285516104bd81878a6113fa565b519020835185810190696465706f73697446656560b01b8252600a8152612256816112bc565b519020036122685750505050601b0190565b825184810190612280868285516104bd81878a6113fa565b5190208351858101906561756d46656560d01b8252600681526122a2816112bc565b519020036122b45750505050601e0190565b8251848101906122cc868285516104bd81878a6113fa565b5190208351858101906c6b7963446f6e6f72734f6e6c7960981b8252600d81526122f5816112bc565b51902003612307575050505060210190565b82518481019061231f868285516104bd81878a6113fa565b519020835185810190636e616d6560e01b82526004815261233f816112bc565b51902003612351575050505060240190565b825184810190612369868285516104bd81878a6113fa565b51902083518581019064696d61676560d81b82526005815261238a816112bc565b5190200361239c575050505060270190565b8251848101906123b4868285516104bd81878a6113fa565b519020835185810190636c6f676f60e01b8252600481526123d4816112bc565b519020036123e65750505050602a0190565b61240084845180936104bd838301968792519283916113fa565b5190208151838101906963617465676f7269657360b01b8252600a8152612426816112bc565b51902003612436575050602d0190565b60649250519062461bcd60e51b82526004820152600d60248201526c496e76616c6964496e7075747360981b6044820152fdfea26469706673582212208a230bc879a4b50b356ba976a629d2906d7fb9eb2e4c455b7a2cfb1956a0937e64736f6c63430008120033";

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
