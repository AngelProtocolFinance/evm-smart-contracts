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
  "0x6080806040523461001657611ccf908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163cfcb6c5b146103a457508063d769c637146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a091608060405161006481611622565b828152826020820152826040820152826060820152015260405161008781611622565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f257366003190160c081126103a05760a0136100f25760405161011b81611622565b6001600160a01b036004358181168103610397578252602435908082168203610397576020830191825261014d6115ac565b6040840190815262ffffff606435818116810361039c5760608601908152608435928484168403610397576080870193845260a43590858216808303610397576004549060ff8260081c1615998a809b61038a575b8015610373575b156103175760ff1983166001176004558894859384936101d1918e610305575b501515611679565b6004805462010000600160b01b03191660109290921b62010000600160b01b031691909117905580516102079083161515611679565b5116976bffffffffffffffffffffffff60a01b98898c5416178b55610230828251161515611679565b5116876001541617600155610249828251161515611679565b51169060035492815116156102d25762ffffff60a01b905160a01b169168ffffffffffffffffff60b81b161717600355610287828251161515611679565b51169060025416176002556102995780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101c9565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101a95750600160ff8416146101a9565b50600160ff8416106101a2565b600080fd5b8680fd5b5080fd5b9050346103a05760803660031901126103a05763ffffffff60043516600435036103a0576103d06115ac565b906064356001600160a01b03811690036115a85760035463e68f909d60e01b82526103e0908190839060049082906001600160a01b03165afa918215610906578492611365575b505060408101516001600160a01b0316156113205761044360018060a01b0360408301511633146116fd565b60408181015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa908115610906578491610d36575b506080810180516002811015610d2257610cd75750506104b460018060a01b036101608301511630146116fd565b60025483546001600160a01b03908116916104d59183916024359116611abd565b906040516370a0823160e01b8152306004820152602081602481855afa80156109415783918791610ca2575b5010610c5d5760405163095ea7b360e01b81526001600160a01b0390911660048201526024810182905260208180604481010381886064356001600160a01b03165af1908115610b8d578591610c23575b5015610be65760045484546001600160a01b0360109290921c821691869116823b156103a05760405163395b4b6560e11b81526004803563ffffffff1690820152606480356001600160a01b039081166024840152929092166044820152908101849052918290608490829084905af18015610b8d57610bd3575b50835484906001600160a01b0390811690606435168103610a3f575050602881029181830460281482151715610a2b576064830480800193908410610a17578284810311610a175760405163a9059cbb60e01b81526001600160a01b0386166004820152606482046024820152602081806044810103818a6064356001600160a01b03165af1908115610a0c5787916109d2575b501561099b5760045486959060101c6001600160a01b0316803b1561039c57604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b0390811660248401529390931660448201528284049281019290925286908290608490829084905af1908115610941578691610987575b5050604082810151905163095ea7b360e01b81526001600160a01b03909116600482015260648204602482015260208180604481010381896064356001600160a01b03165af1801561094157869061094c575b61073a9150611a28565b60408201516001600160a01b0316803b15610925576040516307f740eb60e21b81526004803563ffffffff1690820152606480356001600160a01b031660248301528084046044830152909187918391829084905af1908115610941578691610929575b505060045460409092015160109290921c6001600160a01b039081169216823b1561092557604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b03908116602484015292909216604482015291819004908201529084908290608490829084905af1908115610906578491610911575b50506064356001600160a01b03163b1561090257604051630852cd8d60e31b815282820360048201528381602481836064356001600160a01b03165af19081156109065784916108ee575b505060045460101c6001600160a01b031691823b156108e95760648492836040519586948593631ef3698760e11b855263ffffffff60043516600486015260018060a01b0386351660248601520360448401525af180156108de576108ce57505080f35b6108d79061160f565b6100f25780f35b6040513d84823e3d90fd5b505050fd5b6108f79061160f565b61090257823861086a565b5050fd5b6040513d86823e3d90fd5b61091a9061160f565b61090257823861081f565b8580fd5b6109329061160f565b61093d57843861079e565b8480fd5b6040513d88823e3d90fd5b506020813d60201161097f575b8161096660209383611658565b810103126109255761097a61073a9161193a565b610730565b3d9150610959565b6109909061160f565b61093d5784386106dd565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b90506020813d602011610a04575b816109ed60209383611658565b8101031261039c576109fe9061193a565b38610661565b3d91506109e0565b6040513d89823e3d90fd5b634e487b7160e01b86526011600452602486fd5b634e487b7160e01b85526011600452602485fd5b60405163095ea7b360e01b81526064356001600160a01b031660048201526024810184905291949391906020908290604490829089905af18015610b8d578590610b98575b610a8e9150611a28565b60408101516001600160a01b039081169390606435163b1561093d576040519363de764d2160e01b8552836004860152602485015263ffffffff60043516604485015260018060a01b03169283606482015284816084818360018060a01b03606435165af1908115610b8d578591610b79575b50506004546040909101516001600160a01b039081169160101c16803b1561093d5784928360a4926040519687958694630fabb2b560e31b865260018060a01b036064351660048701526024860152604485015263ffffffff60043516606485015260848401525af180156108de576108ce57505080f35b610b829061160f565b6108e9578338610b01565b6040513d87823e3d90fd5b506020813d602011610bcb575b81610bb260209383611658565b8101031261093d57610bc6610a8e9161193a565b610a84565b3d9150610ba5565b610bdf9094919461160f565b92386105cd565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610c55575b81610c3e60209383611658565b8101031261093d57610c4f9061193a565b38610552565b3d9150610c31565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610ccf575b81610cbe60209383611658565b810103126109255782905138610501565b3d9150610cb1565b516002811015610d0e57600114610cef575b506104b4565b6102400151610d08906001600160a01b031630146116fd565b38610ce9565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610d478282611658565b602081838101031261093d5780516001600160401b038111610925576108a081830184840103126109255760405192610d7f846115c2565b610d8a8284016116b7565b8452602082840101516001600160401b03811161131857610db2908285019084860101611738565b6020850152604082840101516001600160401b038111611318576040818486010183860103126113185760405190610de9826115f4565b8084860101516001600160401b03811161131c57610e1090848701908387890101016117bf565b8252602081858701010151906001600160401b03821161131c57610e3c918487019186880101016117bf565b602082015260408501528282016060818101519086015260800151600281101561131857608085015260a082840101516001600160401b03811161131857610e8b908285019084860101611738565b60a085015260c082840101516001600160401b03811161131857610eb6908285019084860101611738565b60c085015282820160e0818101519086015261010001516001600160401b03811161131857610eec90828501908486010161189d565b61010085015261012082840101516001600160401b03811161131857610f1990828501908486010161189d565b61012085015260c08383018285010361013f19011261039c576040518060c08101106001600160401b0360c0830111176113045760c08101604052610f636101408486010161193a565b8152610f7461016084860101611947565b6020820152610f8861018084860101611947565b6040820152610f9c6101a08486010161193a565b6060820152610fb06101c084860101611947565b60808201526101e090610fc68285870101611947565b60a0820152610140860152610200610fe1818587010161193a565b61016087015284840161022081810151610180890152610240808301516101a08a01529390929161101590610260016116b7565b6101c089015261102a610280878901016116b7565b9088015261103d6102a0868801016116b7565b908701526110506102c08587010161193a565b908601526110636102e0848601016116b7565b9085015261030082840101516001600160401b0381116113185761108e908285019084860101611958565b61026085015261032082840101516001600160401b038111611318576110bb908285019084860101611958565b61028085015261034082840101516001600160401b038111611318576110e8908285019084860101611958565b6102a0850152611100818401610360848601016119be565b6102c08501526111188184016103c0848601016119be565b6102e0850152611130818401610420848601016119be565b6103008501526103808383018285010361047f19011261039c57604051806101c08101106001600160401b036101c083011117611304579161084091836101c06112f896950160405261118b828601610480858801016119f9565b815261119f8286016104c0858801016119f9565b60208201526111b6828601610500858801016119f9565b60408201526111cd828601610540858801016119f9565b60608201526111e4828601610580858801016119f9565b60808201526111fb8286016105c0858801016119f9565b60a0820152611212828601610600858801016119f9565b60c0820152611229828601610640858801016119f9565b60e0820152611240828601610680858801016119f9565b6101008201526112588286016106c0858801016119f9565b610120820152611270828601610700858801016119f9565b610140820152611288828601610740858801016119f9565b6101608201526112a0828601610780858801016119f9565b6101808201526112b88286016107c0858801016119f9565b6101a08201526103208701526112d361080083860101611947565b6103408701526112e86108208386010161193a565b61036087015283019201016116cb565b61038082015238610486565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b908092503d83116115a1575b61137b8183611658565b8101918183031261159d5760405191611393836115c2565b61139c826116b7565b83526113aa602083016116b7565b60208401526113bb604083016116b7565b60408401526113cc606083016116b7565b60608401526113dd608083016116b7565b60808401526113ee60a083016116b7565b60a08401526113ff60c083016116b7565b60c084015261141060e083016116b7565b60e08401526101006114238184016116b7565b908401526101206114358184016116b7565b908401526101406114478184016116b7565b908401526101606114598184016116b7565b9084015261018061146b8184016116b7565b9084015261147e6101a0918284016116cb565b908301526115926103c0610200926114978482016116b7565b6101c08601526102206114ab8183016116b7565b6101e0870152610240946114c08684016116b7565b90870152610260908183015190870152610280946114df8684016116b7565b908701526102a0906114f28284016116b7565b908701526102c0946115058684016116b7565b908701526102e0906115188284016116b7565b908701526103009461152b8684016116b7565b908701526103209061153e8284016116b7565b90870152610340946115518684016116b7565b90870152610360906115648284016116b7565b90870152610380946115778684016116b7565b908701526115886103a083016116b7565b90860152016116b7565b908201523880610417565b8380fd5b503d611371565b8280fd5b604435906001600160a01b038216820361039757565b6103a081019081106001600160401b038211176115de57604052565b634e487b7160e01b600052604160045260246000fd5b604081019081106001600160401b038211176115de57604052565b6001600160401b0381116115de57604052565b60a081019081106001600160401b038211176115de57604052565b606081019081106001600160401b038211176115de57604052565b90601f801991011681019081106001600160401b038211176115de57604052565b1561168057565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361039757565b9190826060910312610397576040516116e38161163d565b604080829480518452602081015160208501520151910152565b1561170457565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215610397578251906001600160401b0382116115de5760405191602091611770601f8301601f1916840185611658565b8184528282870101116103975760005b81811061179557508260009394955001015290565b8581018301518482018401528201611780565b6001600160401b0381116115de5760051b60200190565b81601f82011215610397578051916117d6836117a8565b926117e46040519485611658565b808452602092838086019260051b820101928311610397578301905b82821061180e575050505090565b81518152908301908301611800565b9080601f8301121561039757815190611835826117a8565b926118436040519485611658565b828452602092838086019160051b8301019280841161039757848301915b8483106118715750505050505090565b82516001600160401b03811161039757869161189284848094890101611738565b815201920191611861565b91909160808184031261039757604051906001600160401b039060808301828111848210176115de576040528294815183811161039757816118e091840161181d565b8452602082015183811161039757816118fa9184016117bf565b60208501526040820151838111610397578161191791840161181d565b604085015260608201519283116103975760609261193592016117bf565b910152565b5190811515820361039757565b519063ffffffff8216820361039757565b81601f820112156103975780519161196f836117a8565b9261197d6040519485611658565b808452602092838086019260051b820101928311610397578301905b8282106119a7575050505090565b8380916119b3846116b7565b815201910190611999565b9190826060910312610397576040516119d68161163d565b60406119358183956119e7816116b7565b8552602081015160208601520161193a565b919082604091031261039757604051611a11816115f4565b6020808294611a1f816116b7565b84520151910152565b15611a2f57565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611a7857565b634e487b7160e01b600052601160045260246000fd5b8115611a98570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361039757565b90916001600160a01b03918216908216818114611c93578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611c42578491600091611c58575b5016918215611c4e5760e060049360405194858092633850c7bd851b82525afa928315611c4257600093611bb3575b501015611b7257611b6c9291611b6491168092611a65565b60601c611a65565b60601c90565b8260601b91600160601b93808404851490151715611a7857611b9691168092611a8e565b8060601b928184041490151715611a7857611bb091611a8e565b90565b60e0939193813d8211611c3a575b81611bce60e09383611658565b810103126103a05780519185831683036100f25760208201518060020b036100f257611bfc60408301611aae565b50611c0960608301611aae565b50611c1660808301611aae565b5060a082015160ff8116036100f2575060c0611c32910161193a565b509138611b4c565b3d9150611bc1565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611c8b575b81611c7260209383611658565b810103126100f25750611c8584916116b7565b38611b1d565b3d9150611c65565b5050509056fea2646970667358221220d51f8cd293e9ea80d4a51392bf677fd71bbbbae7e8755c404c4eebb776dac99c64736f6c63430008120033";

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
