/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  DonationMatch,
  DonationMatchInterface,
} from "../../../../../contracts/normalized_endowment/donation-match/DonationMatch.sol/DonationMatch";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
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
            name: "registrarContract",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "poolFee",
            type: "uint24",
          },
          {
            internalType: "address",
            name: "usdcAddress",
            type: "address",
          },
        ],
        internalType: "struct DonationMatchMessages.InstantiateMessage",
        name: "curDetails",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "curEmitteraddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "queryConfig",
    outputs: [
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
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657611d92908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163d61e991b146103a457508063d769c637146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a09160806040516100648161168c565b82815282602082015282604082015282606082015201526040516100878161168c565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f257366003190160c081126103a05760a0136100f25760405161011b8161168c565b6001600160a01b036004358181168103610397578252602435908082168203610397576020830191825261014d611617565b6040840190815262ffffff606435818116810361039c5760608601908152608435928484168403610397576080870193845260a43590858216808303610397576004549060ff8260081c1615998a809b61038a575b8015610373575b156103175760ff1983166001176004558894859384936101d1918e610305575b5015156116e3565b6004805462010000600160b01b03191660109290921b62010000600160b01b0316919091179055805161020790831615156116e3565b5116976bffffffffffffffffffffffff60a01b98898c5416178b556102308282511615156116e3565b51168760015416176001556102498282511615156116e3565b51169060035492815116156102d25762ffffff60a01b905160a01b169168ffffffffffffffffff60b81b1617176003556102878282511615156116e3565b51169060025416176002556102995780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101c9565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101a95750600160ff8416146101a9565b50600160ff8416106101a2565b600080fd5b8680fd5b5080fd5b82346100f25760803660031901126100f2576103be611617565b91606480356001600160a01b03811690036116135760035463e68f909d60e01b83528390839060049082906001600160a01b03165afa91821561160857839261131e575b5060608201516001600160a01b0316156112dc5761042d60018060a01b03606084015116331461184c565b60608201516040516354f3ce9960e01b81526004803590820152908490829060249082906001600160a01b03165afa9081156108c3578491610cea575b5060e08101516004811015610ca5576001610485911461184c565b6080810180516003811015610cd65715610cb9575b516003811015610ca557600114610c86575b5060025483546001600160a01b0390811693916104cf9185916024359116611b80565b92604051956370a0823160e01b87523060048801526020968781602481865afa9081156108fa579086918891610c55575b5010610c115760405163095ea7b360e01b8082526001600160a01b039093166004820152602481018690528781806044810103818a89356001600160a01b03165af19081156108fa578791610bdc575b5015610ba05760045486546001600160a01b0360109290921c82169116813b156109605760405163395b4b6560e11b815260048035908201526001600160a01b0387358116602483015290911660448201526064810187905290879082908183816084810103925af180156108fa57610b8d575b5085546001600160a01b03908116908535168103610a06575060288502858104602814861517156109de57849004908180018083116109f25786039586116109de5760405163a9059cbb60e01b81526001600160a01b0382166004820152602481018390528881806044810103818b8a356001600160a01b03165af190811561093c5788916109a9575b5015610973576004549697889760101c6001600160a01b031693843b1561096f57604051631facad4560e11b80825260048035908301526001600160a01b038935811660248401529094166044820152606481018590529294899084908183816084810103925af180156109645784938a91610947575b505060608601516040519182526001600160a01b0316600482015260248101929092528082806044810103818b8a356001600160a01b03165af190811561093c578891610905575b506107189150611aeb565b60608301516001600160a01b0316803b1561039c57604051630b49b2f360e11b8152600480359082015285356001600160a01b03166024820152604481018390529087908290606490829084905af19081156108fa5787916108e2575b50506004546060909301516001600160a01b039081169360101c16803b1561039c5760405192835260048035908401526001600160a01b038535811660248501529093166044830152606482015290849082908183816084810103925af19081156108c35784916108ce575b505080356001600160a01b03163b156108bf57604051630852cd8d60e31b81526004810183905283816024818386356001600160a01b03165af19081156108c35784916108ab575b505060045460101c6001600160a01b031691823b156108a657604051631ef3698760e11b8152600480359082015291356001600160a01b03166024830152604482015290829082908183816064810103925af1801561089b5761088b57505080f35b61089490611679565b6100f25780f35b6040513d84823e3d90fd5b505050fd5b6108b490611679565b6108bf578285610829565b5050fd5b6040513d86823e3d90fd5b6108d790611679565b6108bf5782856107e1565b6108eb90611679565b6108f6578588610775565b8580fd5b6040513d89823e3d90fd5b905081813d8311610935575b61091b81836116c2565b8101031261039c5761092f610718916117e4565b8961070d565b503d610911565b6040513d8a823e3d90fd5b61095391929450611679565b610960578291888b6106c5565b8780fd5b6040513d8b823e3d90fd5b8880fd5b60405162461bcd60e51b815260048101899052600f60248201526e151c985b9cd9995c8819985a5b1959608a1b60448201528590fd5b90508881813d83116109d7575b6109c081836116c2565b81010312610960576109d1906117e4565b8961064e565b503d6109b6565b634e487b7160e01b87526011600452602487fd5b634e487b7160e01b88526011600452602488fd5b60405192835284356001600160a01b03166004840152602483018690529596879694959194919392918190839060449082908b905af19081156108fa578791610b56575b50610a559150611aeb565b60608101516001600160a01b0390811693908535163b156108f65760405193638ea692ef60e01b85528360048601526024850152600435604485015260018060a01b031692838582015285816084818360018060a01b038a35165af1908115610b4b578691610b33575b50506004546060909101516001600160a01b039081169260109290921c1690813b156108f6578560a49281956040519788968795630fabb2b560e31b875260018060a01b038335166004880152602487015260448601526004359085015260848401525af1801561089b5761088b57505080f35b610b3c90611679565b610b47578487610abf565b8480fd5b6040513d88823e3d90fd5b905081813d8311610b86575b610b6c81836116c2565b810103126108f657610b80610a55916117e4565b88610a4a565b503d610b62565b610b9990969196611679565b94876105c4565b60405162461bcd60e51b8152600481018890526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b60448201528490fd5b90508781813d8311610c0a575b610bf381836116c2565b8101031261039c57610c04906117e4565b88610550565b503d610be9565b60405162461bcd60e51b815260048101889052601a60248201527f496e73756666696369656e74205265736572766520546f6b656e00000000000060448201528490fd5b809250898092503d8311610c7f575b610c6e81836116c2565b8101031261039c5785905189610500565b503d610c64565b6102800151610c9f906001600160a01b0316301461184c565b846104ac565b634e487b7160e01b85526021600452602485fd5b610cd160018060a01b0361018086015116301461184c565b61049a565b634e487b7160e01b86526021600452602486fd5b3d91508185823e610cfb82826116c2565b6020818381010312610b475780516001600160401b0381116108f6576109e081830184840103126108f65760405192836104008101106001600160401b03610400860111176112c8576104008401604052610d57828401611721565b8452602082840101516001600160401b03811161096057610d7f908285019084860101611887565b6020850152604082840101516001600160401b038111610960576040818486010183860103126109605760405190610db68261165e565b8084860101516001600160401b0381116112c457610ddd90848701908387890101016118f7565b82526020818587010101516001600160401b0381116112c45790610e09918487019186880101016118f7565b602082015260408501528282016060818101519086015260800151600381101561096057608085015260a082840101516001600160401b03811161096057610e58908285019084860101611887565b60a085015260c082840101516001600160401b03811161096057610e83908285019084860101611887565b60c085015260e0828401015160048110156109605760e0850152610eac610100838501016117e4565b610100850152610ec1610120838501016117e4565b610120850152828201610140818101519086015261016001516001600160401b03811161096057610ef99082850190848601016119d5565b61016085015261018082840101516001600160401b03811161096057610f269082850190848601016119d5565b610180850152610f3e8184016101a0848601016117f1565b6101a08501528282016102408101516101c08601526102608101516101e0860152610280810151610200860152610f78906102a001611721565b610220850152610f8d6102c083850101611721565b610240850152610fa26102e0838501016117e4565b610260850152610fb761030083850101611721565b61028085015261032082840101516001600160401b03811161096057610fe490828501908486010161177e565b6102a085015261034082840101516001600160401b0381116109605761101190828501908486010161177e565b6102c085015261036082840101516001600160401b0381116109605761103e90828501908486010161177e565b6102e085015261105681840161038084860101611a72565b61030085015261106e8184016103e084860101611a72565b6103208501526104406110878285018285870101611a72565b61034086015261109f8285016104a085870101611a72565b610360860152838301828501036104ff19011261039c57604051806102208101106001600160401b03610220830111176112b0579161098091836102206112a49695016040526110f782860161050085880101611aad565b815261110b82860161054085880101611aad565b602082015261112282860161058085880101611aad565b60408201526111398286016105c085880101611aad565b606082015261115082860161060085880101611aad565b608082015261116782860161064085880101611aad565b60a082015261117e82860161068085880101611aad565b60c08201526111958286016106c085880101611aad565b60e08201526111ac82860161070085880101611aad565b6101008201526111c482860161074085880101611aad565b6101208201526111dc82860161078085880101611aad565b6101408201526111f48286016107c085880101611aad565b61016082015261120c82860161080085880101611aad565b61018082015261122482860161084085880101611aad565b6101a082015261123c82860161088085880101611aad565b6101c08201526112548286016108c085880101611aad565b6101e082015261126c82860161090085880101611aad565b6102008201526103808701528382016109408101516103a088015261129490610960016117e4565b6103c08701528301920101611735565b6103e08201528561046a565b634e487b7160e01b88526041600452602488fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152fd5b9091503d8084833e61133081836116c2565b8101906020818303126116045780516001600160401b03918282116108f657016104e081840312610b47576040519261042092838501858110828211176112b05760405261137d83611721565b855261138b60208401611721565b602086015261139c60408401611721565b60408601526113ad60608401611721565b60608601526113be60808401611721565b60808601526113cf60a08401611721565b60a08601526113e060c08401611721565b60c08601526113f160e08401611721565b60e0860152610100611404818501611721565b90860152610120611416818501611721565b90860152610140611428818501611721565b9086015261016061143a818501611721565b9086015261018061144c818501611721565b908601526101a061145e818501611721565b908601526101c061147183828601611735565b90860152610220611483818501611721565b6101e087015261024091611498838601611721565b610200880152610260916114ad838701611721565b90880152610280926114c0848701611721565b908801526102a09182860151908801526102c0926114df848701611721565b908801526102e0918286015182811161160057860191602083870312611600576040519261150c8461162d565b80519182116115fc579161152d876115f1999795936104c09997950161177e565b825289015261030091611541838601611721565b90890152611554610320938486016117f1565b908801526103c090611567828501611721565b908801526103e09161157a838501611721565b9088015261159d61040096611590888601611721565b6103408a01528401611721565b6103608801526115b06104408401611721565b6103808801526115c36104608401611721565b6103a08801526115d66104808401611721565b908701526115e76104a08301611721565b9086015201611721565b908201529084610402565b8b80fd5b8a80fd5b8380fd5b6040513d85823e3d90fd5b8280fd5b604435906001600160a01b038216820361039757565b602081019081106001600160401b0382111761164857604052565b634e487b7160e01b600052604160045260246000fd5b604081019081106001600160401b0382111761164857604052565b6001600160401b03811161164857604052565b60a081019081106001600160401b0382111761164857604052565b606081019081106001600160401b0382111761164857604052565b90601f801991011681019081106001600160401b0382111761164857604052565b156116ea57565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361039757565b91908260609103126103975760405161174d816116a7565b604080829480518452602081015160208501520151910152565b6001600160401b0381116116485760051b60200190565b81601f820112156103975780519161179583611767565b926117a360405194856116c2565b808452602092838086019260051b820101928311610397578301905b8282106117cd575050505090565b8380916117d984611721565b8152019101906117bf565b5190811515820361039757565b91908260a0910312610397576040516118098161168c565b6080808294611817816117e4565b8452611825602082016117e4565b602085015260408101516040850152611840606082016117e4565b60608501520151910152565b1561185357565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215610397578251906001600160401b03821161164857604051916020916118bf601f8301601f19168401856116c2565b8184528282870101116103975760005b8181106118e457508260009394955001015290565b85810183015184820184015282016118cf565b81601f820112156103975780519161190e83611767565b9261191c60405194856116c2565b808452602092838086019260051b820101928311610397578301905b828210611946575050505090565b81518152908301908301611938565b9080601f830112156103975781519061196d82611767565b9261197b60405194856116c2565b828452602092838086019160051b8301019280841161039757848301915b8483106119a95750505050505090565b82516001600160401b0381116103975786916119ca84848094890101611887565b815201920191611999565b91909160808184031261039757604051906001600160401b0390608083018281118482101761164857604052829481518381116103975781611a18918401611955565b845260208201518381116103975781611a329184016118f7565b602085015260408201518381116103975781611a4f918401611955565b6040850152606082015192831161039757606092611a6d92016118f7565b910152565b919082606091031261039757604051611a8a816116a7565b6040611a6d818395611a9b81611721565b855260208101516020860152016117e4565b91908260409103126103975760405191611ac68361162d565b82602060405192611ad68461165e565b611adf81611721565b84520151602083015252565b15611af257565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611b3b57565b634e487b7160e01b600052601160045260246000fd5b8115611b5b570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361039757565b90916001600160a01b03918216908216818114611d56578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611d05578491600091611d1b575b5016918215611d115760e060049360405194858092633850c7bd851b82525afa928315611d0557600093611c76575b501015611c3557611c2f9291611c2791168092611b28565b60601c611b28565b60601c90565b8260601b91600160601b93808404851490151715611b3b57611c5991168092611b51565b8060601b928184041490151715611b3b57611c7391611b51565b90565b60e0939193813d8211611cfd575b81611c9160e093836116c2565b810103126103a05780519185831683036100f25760208201518060020b036100f257611cbf60408301611b71565b50611ccc60608301611b71565b50611cd960808301611b71565b5060a082015160ff8116036100f2575060c0611cf591016117e4565b509138611c0f565b3d9150611c84565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611d4e575b81611d35602093836116c2565b810103126100f25750611d488491611721565b38611be0565b3d9150611d28565b5050509056fea2646970667358221220d6e8cb0851e76d153690357b9754a81aa09f7ce56bf69adf0dc3e0c3c3ae4c0764736f6c63430008120033";

type DonationMatchConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DonationMatchConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DonationMatch__factory extends ContractFactory {
  constructor(...args: DonationMatchConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DonationMatch> {
    return super.deploy(overrides || {}) as Promise<DonationMatch>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DonationMatch {
    return super.attach(address) as DonationMatch;
  }
  override connect(signer: Signer): DonationMatch__factory {
    return super.connect(signer) as DonationMatch__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DonationMatchInterface {
    return new utils.Interface(_abi) as DonationMatchInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DonationMatch {
    return new Contract(address, _abi, signerOrProvider) as DonationMatch;
  }
}
