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
  "0x6080806040523461001657611d0f908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c8063cfcb6c5b146103a0578063d769c637146100f15763e68f909d1461003e57600080fd5b346100ee57806003193601126100ee578060a091608060405161006081611662565b828152826020820152826040820152826060820152015260405161008381611662565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100ee57366003190160c0811261039c5760a0136100ee5760405161011781611662565b6001600160a01b0360043581811681036103935782526024359080821682036103935760208301918252610149611608565b6040840190815262ffffff60643581811681036103985760608601908152608435928484168403610393576080870193845260a43590858216808303610393576004549060ff8260081c1615998a809b610386575b801561036f575b156103135760ff1983166001176004558894859384936101cd918e610301575b5015156116b9565b6004805462010000600160b01b03191660109290921b62010000600160b01b0316919091179055805161020390831615156116b9565b5116976bffffffffffffffffffffffff60a01b98898c5416178b5561022c8282511615156116b9565b51168760015416176001556102458282511615156116b9565b51169060035492815116156102ce5762ffffff60a01b905160a01b169168ffffffffffffffffff60b81b1617176003556102838282511615156116b9565b51169060025416176002556102955780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101c5565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101a55750600160ff8416146101a5565b50600160ff84161061019e565b600080fd5b8680fd5b5080fd5b50346100ee5760803660031901126100ee5763ffffffff60043516600435036100ee576103cb611608565b6064356001600160a01b038116900361039c5760035463e68f909d60e01b60809081526103e09182919060049082906001600160a01b03165afa9081156115fd57839161139b575b5060408101516001600160a01b0316156113565761043e60018060a01b03604083015116331461173d565b60408181015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa908115610901578491610d31575b506080810180516002811015610d1d57610cd25750506104af60018060a01b0361016083015116301461173d565b60025483546001600160a01b03908116916104d09183916024359116611afd565b906040516370a0823160e01b8152306004820152602081602481855afa801561093c5783918791610c9d575b5010610c585760405163095ea7b360e01b81526001600160a01b0390911660048201526024810182905260208180604481010381886064356001600160a01b03165af1908115610b88578591610c1e575b5015610be15760045484546001600160a01b0360109290921c821691869116823b1561039c5760405163395b4b6560e11b81526004803563ffffffff1690820152606480356001600160a01b039081166024840152929092166044820152908101849052918290608490829084905af18015610b8857610bce575b50835484906001600160a01b0390811690606435168103610a3a575050602881029181830460281482151715610a26576064830480800193908410610a12578284810311610a125760405163a9059cbb60e01b81526001600160a01b0386166004820152606482046024820152602081806044810103818a6064356001600160a01b03165af1908115610a075787916109cd575b50156109965760045486959060101c6001600160a01b0316803b1561039857604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b0390811660248401529390931660448201528284049281019290925286908290608490829084905af190811561093c578691610982575b5050604082810151905163095ea7b360e01b81526001600160a01b03909116600482015260648204602482015260208180604481010381896064356001600160a01b03165af1801561093c578690610947575b6107359150611a68565b60408201516001600160a01b0316803b15610920576040516307f740eb60e21b81526004803563ffffffff1690820152606480356001600160a01b031660248301528084046044830152909187918391829084905af190811561093c578691610924575b505060045460409092015160109290921c6001600160a01b039081169216823b1561092057604051631facad4560e11b81526004803563ffffffff1690820152606480356001600160a01b03908116602484015292909216604482015291819004908201529084908290608490829084905af190811561090157849161090c575b50506064356001600160a01b03163b156108fd57604051630852cd8d60e31b815282820360048201528381602481836064356001600160a01b03165af19081156109015784916108e9575b505060045460101c6001600160a01b031691823b156108e45760648492836040519586948593631ef3698760e11b855263ffffffff60043516600486015260018060a01b0386351660248601520360448401525af180156108d9576108c957505080f35b6108d29061164f565b6100ee5780f35b6040513d84823e3d90fd5b505050fd5b6108f29061164f565b6108fd578238610865565b5050fd5b6040513d86823e3d90fd5b6109159061164f565b6108fd57823861081a565b8580fd5b61092d9061164f565b610938578438610799565b8480fd5b6040513d88823e3d90fd5b506020813d60201161097a575b8161096160209383611698565b81010312610920576109756107359161197a565b61072b565b3d9150610954565b61098b9061164f565b6109385784386106d8565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b90506020813d6020116109ff575b816109e860209383611698565b81010312610398576109f99061197a565b3861065c565b3d91506109db565b6040513d89823e3d90fd5b634e487b7160e01b86526011600452602486fd5b634e487b7160e01b85526011600452602485fd5b60405163095ea7b360e01b81526064356001600160a01b031660048201526024810184905291949391906020908290604490829089905af18015610b88578590610b93575b610a899150611a68565b60408101516001600160a01b039081169390606435163b15610938576040519363de764d2160e01b8552836004860152602485015263ffffffff60043516604485015260018060a01b03169283606482015284816084818360018060a01b03606435165af1908115610b88578591610b74575b50506004546040909101516001600160a01b039081169160101c16803b156109385784928360a4926040519687958694630fabb2b560e31b865260018060a01b036064351660048701526024860152604485015263ffffffff60043516606485015260848401525af180156108d9576108c957505080f35b610b7d9061164f565b6108e4578338610afc565b6040513d87823e3d90fd5b506020813d602011610bc6575b81610bad60209383611698565b8101031261093857610bc1610a899161197a565b610a7f565b3d9150610ba0565b610bda9094919461164f565b92386105c8565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610c50575b81610c3960209383611698565b8101031261093857610c4a9061197a565b3861054d565b3d9150610c2c565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610cca575b81610cb960209383611698565b8101031261092057829051386104fc565b3d9150610cac565b516002811015610d0957600114610cea575b506104af565b6102400151610d03906001600160a01b0316301461173d565b38610ce4565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610d428282611698565b6020818381010312610938578051906001600160401b038211610920576108c082820184830103126109205760405192836103c08101106001600160401b036103c086011117611342576103c08401604052610d9f8383016116f7565b8452602083830101516001600160401b03811161133a57610dc7908284019085850101611778565b6020850152604083830101516001600160401b03811161133a5760408185850101838501031261133a5760405190610dfe8261161e565b8085850101516001600160401b03811161133e57610e2590848601908388880101016117ff565b8252602081868601010151906001600160401b03821161133e57610e51918486019187870101016117ff565b602082015260408501528183016060818101519086015260800151600281101561133a57608085015260a083830101516001600160401b03811161133a57610ea0908284019085850101611778565b60a085015260c083830101516001600160401b03811161133a57610ecb908284019085850101611778565b60c085015281830160e0818101519086015261010001516001600160401b03811161133a57610f019082840190858501016118dd565b61010085015261012083830101516001600160401b03811161133a57610f2e9082840190858501016118dd565b61012085015260c08284018284010361013f190112610398576040518060c08101106001600160401b0360c0830111176113265760c08101604052610f786101408585010161197a565b8152610f8961016085850101611987565b6020820152610f9d61018085850101611987565b6040820152610fb16101a08585010161197a565b6060820152610fc56101c085850101611987565b60808201526101e090610fdb8286860101611987565b60a0820152610140860152610200610ff6818686010161197a565b61016087015283850161022081810151610180890152610240808301516101a08a01529390929161102a90610260016116f7565b6101c089015261103f610280888801016116f7565b908801526110526102a0878701016116f7565b908701526110656102c08686010161197a565b908601526110786102e0858501016116f7565b9085015261030083830101516001600160401b03811161133a576110a3908284019085850101611998565b61026085015261032083830101516001600160401b03811161133a576110d0908284019085850101611998565b61028085015261034083830101516001600160401b03811161133a576110fd908284019085850101611998565b6102a0850152611115818301610360858501016119fe565b6102c085015261112d8183016103c0858501016119fe565b6102e0850152611145818301610420858501016119fe565b6103008501526103808284018284010361047f19011261039857604051806101c08101106001600160401b036101c083011117611326576108a0939291816101c061131193016040526111a082850161048087870101611a39565b81526111b48285016104c087870101611a39565b60208201526111cb82850161050087870101611a39565b60408201526111e282850161054087870101611a39565b60608201526111f982850161058087870101611a39565b60808201526112108285016105c087870101611a39565b60a082015261122782850161060087870101611a39565b60c082015261123e82850161064087870101611a39565b60e082015261125582850161068087870101611a39565b61010082015261126d8285016106c087870101611a39565b61012082015261128582850161070087870101611a39565b61014082015261129d82850161074087870101611a39565b6101608201526112b582850161078087870101611a39565b6101808201526112cd8285016107c087870101611a39565b6101a08201526103208701526112e861080085850101611987565b6103408701526112fd6108208585010161197a565b61036087015282016108408484010161170b565b6103808501520101516103a082015238610481565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b9050803d81116115f5575b6113b1826080611698565b81126115f15760405190816103a08101106001600160401b036103a0840111176115dd576103a082016040526113e760806116f7565b82526113f360a06116f7565b602083015261140260c06116f7565b604083015261141160e06116f7565b60608301526114216101006116f7565b60808301526114316101206116f7565b60a08301526114416101406116f7565b60c08301526114516101606116f7565b60e08301526101006114646101806116f7565b908301526101206114766101a06116f7565b908301526101406114886101c06116f7565b9083015261016061149a6101e06116f7565b908301526101806114ac6102006116f7565b908301526101a0906114c39060800161022061170b565b908201526102006114d56102806116f7565b6101c08301526102206114e96102a06116f7565b6101e0840152610240916114fe6102c06116f7565b908401526102e05190830152610280906102609061151d6103006116f7565b908401526102a0906115306103206116f7565b908401526102c0916115436103406116f7565b908401526102e0906115566103606116f7565b90840152610300916115696103806116f7565b908401526103209061157c6103a06116f7565b908401526103409161158f6103c06116f7565b90840152610360906115a26103e06116f7565b90840152610380916115b56104006116f7565b908401526115c46104206116f7565b908301526115d36104406116f7565b9082015238610413565b634e487b7160e01b84526041600452602484fd5b8280fd5b3d91506113a6565b6040513d85823e3d90fd5b604435906001600160a01b038216820361039357565b604081019081106001600160401b0382111761163957604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161163957604052565b60a081019081106001600160401b0382111761163957604052565b606081019081106001600160401b0382111761163957604052565b90601f801991011681019081106001600160401b0382111761163957604052565b156116c057565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361039357565b9190826060910312610393576040516117238161167d565b604080829480518452602081015160208501520151910152565b1561174457565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215610393578251906001600160401b03821161163957604051916020916117b0601f8301601f1916840185611698565b8184528282870101116103935760005b8181106117d557508260009394955001015290565b85810183015184820184015282016117c0565b6001600160401b0381116116395760051b60200190565b81601f8201121561039357805191611816836117e8565b926118246040519485611698565b808452602092838086019260051b820101928311610393578301905b82821061184e575050505090565b81518152908301908301611840565b9080601f8301121561039357815190611875826117e8565b926118836040519485611698565b828452602092838086019160051b8301019280841161039357848301915b8483106118b15750505050505090565b82516001600160401b0381116103935786916118d284848094890101611778565b8152019201916118a1565b91909160808184031261039357604051906001600160401b039060808301828111848210176116395760405282948151838111610393578161192091840161185d565b84526020820151838111610393578161193a9184016117ff565b60208501526040820151838111610393578161195791840161185d565b604085015260608201519283116103935760609261197592016117ff565b910152565b5190811515820361039357565b519063ffffffff8216820361039357565b81601f82011215610393578051916119af836117e8565b926119bd6040519485611698565b808452602092838086019260051b820101928311610393578301905b8282106119e7575050505090565b8380916119f3846116f7565b8152019101906119d9565b919082606091031261039357604051611a168161167d565b6040611975818395611a27816116f7565b8552602081015160208601520161197a565b919082604091031261039357604051611a518161161e565b6020808294611a5f816116f7565b84520151910152565b15611a6f57565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611ab857565b634e487b7160e01b600052601160045260246000fd5b8115611ad8570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361039357565b90916001600160a01b03918216908216818114611cd3578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611c82578491600091611c98575b5016918215611c8e5760e060049360405194858092633850c7bd851b82525afa928315611c8257600093611bf3575b501015611bb257611bac9291611ba491168092611aa5565b60601c611aa5565b60601c90565b8260601b91600160601b93808404851490151715611ab857611bd691168092611ace565b8060601b928184041490151715611ab857611bf091611ace565b90565b60e0939193813d8211611c7a575b81611c0e60e09383611698565b8101031261039c5780519185831683036100ee5760208201518060020b036100ee57611c3c60408301611aee565b50611c4960608301611aee565b50611c5660808301611aee565b5060a082015160ff8116036100ee575060c0611c72910161197a565b509138611b8c565b3d9150611c01565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611ccb575b81611cb260209383611698565b810103126100ee5750611cc584916116f7565b38611b5d565b3d9150611ca5565b5050509056fea2646970667358221220ff6591ce37d54febfe79a5d027e69e706823afbaf9bc6e06326d5f3b9b4e955064736f6c63430008120033";

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
