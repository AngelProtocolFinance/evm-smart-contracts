/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {Signer, utils, Contract, ContractFactory, Overrides} from "ethers";
import type {Provider, TransactionRequest} from "@ethersproject/providers";
import type {PromiseOrValue} from "../../../../../common";
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
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
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
        name: "details",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "emitteraddress",
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
  "0x6080806040523461001657611d58908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163cfcb6c5b146103a457508063d769c637146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a0916080604051610064816116bf565b8281528260208201528260408201528260608201520152604051610087816116bf565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f257366003190160c081126103a05760a0136100f25760405161011b816116bf565b6001600160a01b036004358181168103610397578252602435908082168203610397576020830191825261014d611665565b6040840190815262ffffff606435818116810361039c5760608601908152608435928484168403610397576080870193845260a43590858216808303610397576004549060ff8260081c1615998a809b61038a575b8015610373575b156103175760ff1983166001176004558894859384936101d1918e610305575b5015156116fb565b6004805462010000600160b01b03191660109290921b62010000600160b01b0316919091179055805161020790831615156116fb565b5116976bffffffffffffffffffffffff60a01b98898c5416178b556102308282511615156116fb565b51168760015416176001556102498282511615156116fb565b51169060035492815116156102d25762ffffff60a01b905160a01b169168ffffffffffffffffff60b81b1617176003556102878282511615156116fb565b51169060025416176002556102995780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101c9565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101a95750600160ff8416146101a9565b50600160ff8416106101a2565b600080fd5b8680fd5b5080fd5b9050346103a05760803660031901126103a05763ffffffff60043516600435036103a0576103d0611665565b906064356001600160a01b03811690036116615760035463e68f909d60e01b82526103e090829060049082906001600160a01b03165afa9081156116565783916113fc575b5060408101516001600160a01b0316156113b75761044060018060a01b03604083015116331461178f565b60408181015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa908115610903578491610d33575b506080810180516002811015610d1f57610cd45750506104b160018060a01b0361016083015116301461178f565b60025483546001600160a01b03908116916104d29183916024359116611b46565b906040516370a0823160e01b8152306004820152602081602481855afa801561093e5783918791610c9f575b5010610c5a5760405163095ea7b360e01b81526001600160a01b0390911660048201526024810182905260208180604481010381886064356001600160a01b03165af1908115610b8a578591610c20575b5015610be35760045484546001600160a01b0360109290921c821691869116823b156103a05760405163395b4b6560e11b81526004803563ffffffff1690820152606480356001600160a01b039081166024840152929092166044820152908101849052918290608490829084905af18015610b8a57610bd0575b50835484906001600160a01b0390811690606435168103610a3c575050602881029181830460281482151715610a28576064830480800193908410610a14578284810311610a145760405163a9059cbb60e01b81526001600160a01b0386166004820152606482046024820152602081806044810103818a6064356001600160a01b03165af1908115610a095787916109cf575b50156109985760045486959060101c6001600160a01b0316803b1561039c57604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b0390811660248401529390931660448201528284049281019290925286908290608490829084905af190811561093e578691610984575b5050604082810151905163095ea7b360e01b81526001600160a01b03909116600482015260648204602482015260208180604481010381896064356001600160a01b03165af1801561093e578690610949575b6107379150611ab1565b60408201516001600160a01b0316803b15610922576040516307f740eb60e21b81526004803563ffffffff1690820152606480356001600160a01b031660248301528084046044830152909187918391829084905af190811561093e578691610926575b505060045460409092015160109290921c6001600160a01b039081169216823b1561092257604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b03908116602484015292909216604482015291819004908201529084908290608490829084905af190811561090357849161090e575b50506064356001600160a01b03163b156108ff57604051630852cd8d60e31b815282820360048201528381602481836064356001600160a01b03165af19081156109035784916108eb575b505060045460101c6001600160a01b031691823b156108e65760648492836040519586948593631ef3698760e11b855263ffffffff60043516600486015260018060a01b0386351660248601520360448401525af180156108db576108cb57505080f35b6108d4906116ac565b6100f25780f35b6040513d84823e3d90fd5b505050fd5b6108f4906116ac565b6108ff578238610867565b5050fd5b6040513d86823e3d90fd5b610917906116ac565b6108ff57823861081c565b8580fd5b61092f906116ac565b61093a57843861079b565b8480fd5b6040513d88823e3d90fd5b506020813d60201161097c575b81610963602093836116da565b8101031261092257610977610737916119cc565b61072d565b3d9150610956565b61098d906116ac565b61093a5784386106da565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b90506020813d602011610a01575b816109ea602093836116da565b8101031261039c576109fb906119cc565b3861065e565b3d91506109dd565b6040513d89823e3d90fd5b634e487b7160e01b86526011600452602486fd5b634e487b7160e01b85526011600452602485fd5b60405163095ea7b360e01b81526064356001600160a01b031660048201526024810184905291949391906020908290604490829089905af18015610b8a578590610b95575b610a8b9150611ab1565b60408101516001600160a01b039081169390606435163b1561093a576040519363de764d2160e01b8552836004860152602485015263ffffffff60043516604485015260018060a01b03169283606482015284816084818360018060a01b03606435165af1908115610b8a578591610b76575b50506004546040909101516001600160a01b039081169160101c16803b1561093a5784928360a4926040519687958694630fabb2b560e31b865260018060a01b036064351660048701526024860152604485015263ffffffff60043516606485015260848401525af180156108db576108cb57505080f35b610b7f906116ac565b6108e6578338610afe565b6040513d87823e3d90fd5b506020813d602011610bc8575b81610baf602093836116da565b8101031261093a57610bc3610a8b916119cc565b610a81565b3d9150610ba2565b610bdc909491946116ac565b92386105ca565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610c52575b81610c3b602093836116da565b8101031261093a57610c4c906119cc565b3861054f565b3d9150610c2e565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610ccc575b81610cbb602093836116da565b8101031261092257829051386104fe565b3d9150610cae565b516002811015610d0b57600114610cec575b506104b1565b6102400151610d05906001600160a01b0316301461178f565b38610ce6565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610d4482826116da565b602081838101031261093a578051906001600160401b03821161092257610b8082820184830103126109225760405192836103e08101106001600160401b036103e0860111176113a3576103e08401604052610da1838301611739565b8452602083830101516001600160401b03811161139b57610dc99082840190858501016117ca565b6020850152604083830101516001600160401b03811161139b5760408185850101838501031261139b5760405190610e008261167b565b8085850101516001600160401b03811161139f57610e279084860190838888010101611851565b8252602081868601010151906001600160401b03821161139f57610e5391848601918787010101611851565b602082015260408501528183016060818101519086015260800151600281101561139b57608085015260a083830101516001600160401b03811161139b57610ea29082840190858501016117ca565b60a085015260c083830101516001600160401b03811161139b57610ecd9082840190858501016117ca565b60c085015281830160e0818101519086015261010001516001600160401b03811161139b57610f0390828401908585010161192f565b61010085015261012083830101516001600160401b03811161139b57610f3090828401908585010161192f565b61012085015260c08284018284010361013f19011261039c576040518060c08101106001600160401b0360c0830111176113875760c08101604052610f7a610140858501016119cc565b8152610f8b610160858501016119d9565b6020820152610f9f610180858501016119d9565b6040820152610fb36101a0858501016119cc565b6060820152610fc76101c0858501016119d9565b6080820152610fdb6101e0858501016119d9565b60a0820152610140850152610ff5610200848401016119cc565b610160850152818301610220810151610180860152610240808201516101a0870152906110259061026001611739565b6101c086015261103a61028085850101611739565b6101e086015261104f6102a085850101611739565b6102008601526110646102c0858501016119cc565b6102208601526110796102e085850101611739565b9085015261030083830101516001600160401b03811161139b576110a49082840190858501016119ea565b61026085015261032083830101516001600160401b03811161139b576110d19082840190858501016119ea565b61028085015261034083830101516001600160401b03811161139b576110fe9082840190858501016119ea565b6102a085015261111681830161036085850101611a50565b6102c085015261112e8183016103a085850101611a50565b6102e08501526111468183016103e085850101611a50565b61030085015261115e81830161042085850101611a50565b6103208501526106608284018284010361045f19011261039c57604051806102208101106001600160401b036102208301111761138757610b609392918161022061137293016040526111b982850161046087870101611a7f565b81526111cd8285016104c087870101611a7f565b60208201526111e482850161052087870101611a7f565b60408201526111fb82850161058087870101611a7f565b60608201526112128285016105e087870101611a7f565b608082015261122982850161064087870101611a7f565b60a08201526112408285016106a087870101611a7f565b60c082015261125782850161070087870101611a7f565b60e082015261126e82850161076087870101611a7f565b6101008201526112868285016107c087870101611a7f565b61012082015261129e82850161082087870101611a7f565b6101408201526112b682850161088087870101611a7f565b6101608201526112ce8285016108e087870101611a7f565b6101808201526112e682850161094087870101611a7f565b6101a08201526112fe8285016109a087870101611a7f565b6101c0820152611316828501610a0087870101611a7f565b6101e082015261132e828501610a6087870101611a7f565b610200820152610340870152611349610ac0858501016119d9565b61036087015261135e610ae0858501016119cc565b6103808701528201610b008484010161174d565b6103a08501520101516103c082015238610483565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b90506103e03d6103e01161164f575b61141581836116da565b81016103e08282031261164b57604051916103a0918284018481106001600160401b038211176113a357604052611641916103c09161145382611739565b865261146160208301611739565b602087015261147260408301611739565b604087015261148360608301611739565b606087015261149460808301611739565b60808701526114a560a08301611739565b60a08701526114b660c08301611739565b60c08701526114c760e08301611739565b60e08701526101006114da818401611739565b908701526101206114ec818401611739565b908701526101406114fe818401611739565b90870152610160611510818401611739565b90870152610180611522818401611739565b908701526115356101a09182840161174d565b9086015261020093611548858301611739565b6101c087015261163761022091611560838501611739565b6101e089015261024096611575888601611739565b9089015261026092838501519089015261028096611594888601611739565b908901526102a0926115a7848601611739565b908901526102c0966115ba888601611739565b908901526102e0926115cd848601611739565b90890152610300966115e0888601611739565b90890152610320926115f3848601611739565b9089015261034096611606888601611739565b9089015261036092611619848601611739565b908901526103809661162c888601611739565b908901528301611739565b9086015201611739565b9082015238610415565b8380fd5b503d61140b565b6040513d85823e3d90fd5b8280fd5b604435906001600160a01b038216820361039757565b604081019081106001600160401b0382111761169657604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161169657604052565b60a081019081106001600160401b0382111761169657604052565b90601f801991011681019081106001600160401b0382111761169657604052565b1561170257565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361039757565b919082606091031261039757604051606081018181106001600160401b0382111761169657604052604080829480518452602081015160208501520151910152565b1561179657565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215610397578251906001600160401b0382116116965760405191602091611802601f8301601f19168401856116da565b8184528282870101116103975760005b81811061182757508260009394955001015290565b8581018301518482018401528201611812565b6001600160401b0381116116965760051b60200190565b81601f82011215610397578051916118688361183a565b9261187660405194856116da565b808452602092838086019260051b820101928311610397578301905b8282106118a0575050505090565b81518152908301908301611892565b9080601f83011215610397578151906118c78261183a565b926118d560405194856116da565b828452602092838086019160051b8301019280841161039757848301915b8483106119035750505050505090565b82516001600160401b038111610397578691611924848480948901016117ca565b8152019201916118f3565b91909160808184031261039757604051906001600160401b03906080830182811184821017611696576040528294815183811161039757816119729184016118af565b84526020820151838111610397578161198c918401611851565b6020850152604082015183811161039757816119a99184016118af565b60408501526060820151928311610397576060926119c79201611851565b910152565b5190811515820361039757565b519063ffffffff8216820361039757565b81601f8201121561039757805191611a018361183a565b92611a0f60405194856116da565b808452602092838086019260051b820101928311610397578301905b828210611a39575050505090565b838091611a4584611739565b815201910190611a2b565b919082604091031261039757604051611a688161167b565b6020808294611a7681611739565b84520151910152565b91906060838203126103975760206119c760405192611a9d8461167b565b828496611aa9816119cc565b865201611a50565b15611ab857565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611b0157565b634e487b7160e01b600052601160045260246000fd5b8115611b21570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361039757565b90916001600160a01b03918216908216818114611d1c578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611ccb578491600091611ce1575b5016918215611cd75760e060049360405194858092633850c7bd851b82525afa928315611ccb57600093611c3c575b501015611bfb57611bf59291611bed91168092611aee565b60601c611aee565b60601c90565b8260601b91600160601b93808404851490151715611b0157611c1f91168092611b17565b8060601b928184041490151715611b0157611c3991611b17565b90565b60e0939193813d8211611cc3575b81611c5760e093836116da565b810103126103a05780519185831683036100f25760208201518060020b036100f257611c8560408301611b37565b50611c9260608301611b37565b50611c9f60808301611b37565b5060a082015160ff8116036100f2575060c0611cbb91016119cc565b509138611bd5565b3d9150611c4a565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611d14575b81611cfb602093836116da565b810103126100f25750611d0e8491611739565b38611ba6565b3d9150611cee565b5050509056fea26469706673582212209f8113f0f34385f628c6b0927ec67d22cfc40a70a180397f47421c768b71924664736f6c63430008120033";

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

  override deploy(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<DonationMatch> {
    return super.deploy(overrides || {}) as Promise<DonationMatch>;
  }
  override getDeployTransaction(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
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
  static connect(address: string, signerOrProvider: Signer | Provider): DonationMatch {
    return new Contract(address, _abi, signerOrProvider) as DonationMatch;
  }
}
