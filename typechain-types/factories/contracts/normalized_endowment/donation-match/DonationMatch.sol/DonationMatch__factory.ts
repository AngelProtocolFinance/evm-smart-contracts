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
  "0x6080806040523461001657611d96908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163cfcb6c5b146103a457508063d769c637146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a0916080604051610064816116bf565b8281528260208201528260408201528260608201520152604051610087816116bf565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f257366003190160c081126103a05760a0136100f25760405161011b816116bf565b6001600160a01b036004358181168103610397578252602435908082168203610397576020830191825261014d611665565b6040840190815262ffffff606435818116810361039c5760608601908152608435928484168403610397576080870193845260a43590858216808303610397576004549060ff8260081c1615998a809b61038a575b8015610373575b156103175760ff1983166001176004558894859384936101d1918e610305575b501515611716565b6004805462010000600160b01b03191660109290921b62010000600160b01b031691909117905580516102079083161515611716565b5116976bffffffffffffffffffffffff60a01b98898c5416178b55610230828251161515611716565b5116876001541617600155610249828251161515611716565b51169060035492815116156102d25762ffffff60a01b905160a01b169168ffffffffffffffffff60b81b161717600355610287828251161515611716565b51169060025416176002556102995780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101c9565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101a95750600160ff8416146101a9565b50600160ff8416106101a2565b600080fd5b8680fd5b5080fd5b9050346103a05760803660031901126103a05763ffffffff60043516600435036103a0576103d0611665565b906064356001600160a01b03811690036116615760035463e68f909d60e01b82526103e090829060049082906001600160a01b03165afa9081156116565783916113fc575b5060408101516001600160a01b0316156113b75761044060018060a01b03604083015116331461179a565b60408181015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa908115610903578491610d33575b506080810180516002811015610d1f57610cd45750506104b160018060a01b0361016083015116301461179a565b60025483546001600160a01b03908116916104d29183916024359116611b84565b906040516370a0823160e01b8152306004820152602081602481855afa801561093e5783918791610c9f575b5010610c5a5760405163095ea7b360e01b81526001600160a01b0390911660048201526024810182905260208180604481010381886064356001600160a01b03165af1908115610b8a578591610c20575b5015610be35760045484546001600160a01b0360109290921c821691869116823b156103a05760405163395b4b6560e11b81526004803563ffffffff1690820152606480356001600160a01b039081166024840152929092166044820152908101849052918290608490829084905af18015610b8a57610bd0575b50835484906001600160a01b0390811690606435168103610a3c575050602881029181830460281482151715610a28576064830480800193908410610a14578284810311610a145760405163a9059cbb60e01b81526001600160a01b0386166004820152606482046024820152602081806044810103818a6064356001600160a01b03165af1908115610a095787916109cf575b50156109985760045486959060101c6001600160a01b0316803b1561039c57604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b0390811660248401529390931660448201528284049281019290925286908290608490829084905af190811561093e578691610984575b5050604082810151905163095ea7b360e01b81526001600160a01b03909116600482015260648204602482015260208180604481010381896064356001600160a01b03165af1801561093e578690610949575b6107379150611aef565b60408201516001600160a01b0316803b15610922576040516307f740eb60e21b81526004803563ffffffff1690820152606480356001600160a01b031660248301528084046044830152909187918391829084905af190811561093e578691610926575b505060045460409092015160109290921c6001600160a01b039081169216823b1561092257604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b03908116602484015292909216604482015291819004908201529084908290608490829084905af190811561090357849161090e575b50506064356001600160a01b03163b156108ff57604051630852cd8d60e31b815282820360048201528381602481836064356001600160a01b03165af19081156109035784916108eb575b505060045460101c6001600160a01b031691823b156108e65760648492836040519586948593631ef3698760e11b855263ffffffff60043516600486015260018060a01b0386351660248601520360448401525af180156108db576108cb57505080f35b6108d4906116ac565b6100f25780f35b6040513d84823e3d90fd5b505050fd5b6108f4906116ac565b6108ff578238610867565b5050fd5b6040513d86823e3d90fd5b610917906116ac565b6108ff57823861081c565b8580fd5b61092f906116ac565b61093a57843861079b565b8480fd5b6040513d88823e3d90fd5b506020813d60201161097c575b81610963602093836116f5565b8101031261092257610977610737916119d7565b61072d565b3d9150610956565b61098d906116ac565b61093a5784386106da565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b90506020813d602011610a01575b816109ea602093836116f5565b8101031261039c576109fb906119d7565b3861065e565b3d91506109dd565b6040513d89823e3d90fd5b634e487b7160e01b86526011600452602486fd5b634e487b7160e01b85526011600452602485fd5b60405163095ea7b360e01b81526064356001600160a01b031660048201526024810184905291949391906020908290604490829089905af18015610b8a578590610b95575b610a8b9150611aef565b60408101516001600160a01b039081169390606435163b1561093a576040519363de764d2160e01b8552836004860152602485015263ffffffff60043516604485015260018060a01b03169283606482015284816084818360018060a01b03606435165af1908115610b8a578591610b76575b50506004546040909101516001600160a01b039081169160101c16803b1561093a5784928360a4926040519687958694630fabb2b560e31b865260018060a01b036064351660048701526024860152604485015263ffffffff60043516606485015260848401525af180156108db576108cb57505080f35b610b7f906116ac565b6108e6578338610afe565b6040513d87823e3d90fd5b506020813d602011610bc8575b81610baf602093836116f5565b8101031261093a57610bc3610a8b916119d7565b610a81565b3d9150610ba2565b610bdc909491946116ac565b92386105ca565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610c52575b81610c3b602093836116f5565b8101031261093a57610c4c906119d7565b3861054f565b3d9150610c2e565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610ccc575b81610cbb602093836116f5565b8101031261092257829051386104fe565b3d9150610cae565b516002811015610d0b57600114610cec575b506104b1565b6102400151610d05906001600160a01b0316301461179a565b38610ce6565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610d4482826116f5565b602081838101031261093a578051906001600160401b03821161092257610c0082820184830103126109225760405192836103e08101106001600160401b036103e0860111176113a3576103e08401604052610da1838301611754565b8452602083830101516001600160401b03811161139b57610dc99082840190858501016117d5565b6020850152604083830101516001600160401b03811161139b5760408185850101838501031261139b5760405190610e008261167b565b8085850101516001600160401b03811161139f57610e27908486019083888801010161185c565b8252602081868601010151906001600160401b03821161139f57610e539184860191878701010161185c565b602082015260408501528183016060818101519086015260800151600281101561139b57608085015260a083830101516001600160401b03811161139b57610ea29082840190858501016117d5565b60a085015260c083830101516001600160401b03811161139b57610ecd9082840190858501016117d5565b60c085015281830160e0818101519086015261010001516001600160401b03811161139b57610f0390828401908585010161193a565b61010085015261012083830101516001600160401b03811161139b57610f3090828401908585010161193a565b61012085015260c08284018284010361013f19011261039c576040518060c08101106001600160401b0360c0830111176113875760c08101604052610f7a610140858501016119d7565b8152610f8b610160858501016119e4565b6020820152610f9f610180858501016119e4565b6040820152610fb36101a0858501016119d7565b6060820152610fc76101c0858501016119e4565b6080820152610fdb6101e0858501016119e4565b60a0820152610140850152610ff5610200848401016119d7565b610160850152818301610220810151610180860152610240808201516101a0870152906110259061026001611754565b6101c086015261103a61028085850101611754565b6101e086015261104f6102a085850101611754565b6102008601526110646102c0858501016119d7565b6102208601526110796102e085850101611754565b9085015261030083830101516001600160401b03811161139b576110a49082840190858501016119f5565b61026085015261032083830101516001600160401b03811161139b576110d19082840190858501016119f5565b61028085015261034083830101516001600160401b03811161139b576110fe9082840190858501016119f5565b6102a085015261111681830161036085850101611a5b565b6102c085015261112e8183016103c085850101611a5b565b6102e085015261114681830161042085850101611a5b565b61030085015261115e81830161048085850101611a5b565b610320850152610660828401828401036104df19011261039c57604051806102208101106001600160401b036102208301111761138757610be09392918161022061137293016040526111b98285016104e087870101611a96565b81526111cd82850161054087870101611a96565b60208201526111e48285016105a087870101611a96565b60408201526111fb82850161060087870101611a96565b606082015261121282850161066087870101611a96565b60808201526112298285016106c087870101611a96565b60a082015261124082850161072087870101611a96565b60c082015261125782850161078087870101611a96565b60e082015261126e8285016107e087870101611a96565b61010082015261128682850161084087870101611a96565b61012082015261129e8285016108a087870101611a96565b6101408201526112b682850161090087870101611a96565b6101608201526112ce82850161096087870101611a96565b6101808201526112e68285016109c087870101611a96565b6101a08201526112fe828501610a2087870101611a96565b6101c0820152611316828501610a8087870101611a96565b6101e082015261132e828501610ae087870101611a96565b610200820152610340870152611349610b40858501016119e4565b61036087015261135e610b60858501016119d7565b6103808701528201610b8084840101611768565b6103a08501520101516103c082015238610483565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b90506103e03d6103e01161164f575b61141581836116f5565b81016103e08282031261164b57604051916103a0918284018481106001600160401b038211176113a357604052611641916103c09161145382611754565b865261146160208301611754565b602087015261147260408301611754565b604087015261148360608301611754565b606087015261149460808301611754565b60808701526114a560a08301611754565b60a08701526114b660c08301611754565b60c08701526114c760e08301611754565b60e08701526101006114da818401611754565b908701526101206114ec818401611754565b908701526101406114fe818401611754565b90870152610160611510818401611754565b90870152610180611522818401611754565b908701526115356101a091828401611768565b9086015261020093611548858301611754565b6101c087015261163761022091611560838501611754565b6101e089015261024096611575888601611754565b9089015261026092838501519089015261028096611594888601611754565b908901526102a0926115a7848601611754565b908901526102c0966115ba888601611754565b908901526102e0926115cd848601611754565b90890152610300966115e0888601611754565b90890152610320926115f3848601611754565b9089015261034096611606888601611754565b9089015261036092611619848601611754565b908901526103809661162c888601611754565b908901528301611754565b9086015201611754565b9082015238610415565b8380fd5b503d61140b565b6040513d85823e3d90fd5b8280fd5b604435906001600160a01b038216820361039757565b604081019081106001600160401b0382111761169657604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161169657604052565b60a081019081106001600160401b0382111761169657604052565b606081019081106001600160401b0382111761169657604052565b90601f801991011681019081106001600160401b0382111761169657604052565b1561171d57565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361039757565b919082606091031261039757604051611780816116da565b604080829480518452602081015160208501520151910152565b156117a157565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215610397578251906001600160401b038211611696576040519160209161180d601f8301601f19168401856116f5565b8184528282870101116103975760005b81811061183257508260009394955001015290565b858101830151848201840152820161181d565b6001600160401b0381116116965760051b60200190565b81601f820112156103975780519161187383611845565b9261188160405194856116f5565b808452602092838086019260051b820101928311610397578301905b8282106118ab575050505090565b8151815290830190830161189d565b9080601f83011215610397578151906118d282611845565b926118e060405194856116f5565b828452602092838086019160051b8301019280841161039757848301915b84831061190e5750505050505090565b82516001600160401b03811161039757869161192f848480948901016117d5565b8152019201916118fe565b91909160808184031261039757604051906001600160401b039060808301828111848210176116965760405282948151838111610397578161197d9184016118ba565b84526020820151838111610397578161199791840161185c565b6020850152604082015183811161039757816119b49184016118ba565b60408501526060820151928311610397576060926119d2920161185c565b910152565b5190811515820361039757565b519063ffffffff8216820361039757565b81601f8201121561039757805191611a0c83611845565b92611a1a60405194856116f5565b808452602092838086019260051b820101928311610397578301905b828210611a44575050505090565b838091611a5084611754565b815201910190611a36565b919082606091031261039757604051611a73816116da565b60406119d2818395611a8481611754565b855260208101516020860152016119d7565b80929103916060831261039757604051611aaf8161167b565b60408194611abc846119d7565b8352601f190112610397576020906040805193611ad88561167b565b611ae3848201611754565b85520151828401520152565b15611af657565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611b3f57565b634e487b7160e01b600052601160045260246000fd5b8115611b5f570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361039757565b90916001600160a01b03918216908216818114611d5a578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611d09578491600091611d1f575b5016918215611d155760e060049360405194858092633850c7bd851b82525afa928315611d0957600093611c7a575b501015611c3957611c339291611c2b91168092611b2c565b60601c611b2c565b60601c90565b8260601b91600160601b93808404851490151715611b3f57611c5d91168092611b55565b8060601b928184041490151715611b3f57611c7791611b55565b90565b60e0939193813d8211611d01575b81611c9560e093836116f5565b810103126103a05780519185831683036100f25760208201518060020b036100f257611cc360408301611b75565b50611cd060608301611b75565b50611cdd60808301611b75565b5060a082015160ff8116036100f2575060c0611cf991016119d7565b509138611c13565b3d9150611c88565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611d52575b81611d39602093836116f5565b810103126100f25750611d4c8491611754565b38611be4565b3d9150611d2c565b5050509056fea2646970667358221220c4e3a01b60616fe252727b3c40d0e8a40b5de54844aef0767a6032397e95112264736f6c63430008120033";

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
