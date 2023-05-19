/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  DonationMatchCharity,
  DonationMatchCharityInterface,
} from "../../../../../contracts/normalized_endowment/donation-match/DonationMatchCharity.sol/DonationMatchCharity";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DonationMatchCharityErc20ApprovalGiven",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DonationMatchCharityErc20Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DonationMatchCharityErc20Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donationMatch",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "accountsContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "endowmentId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "DonationMatchCharityExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donationMatch",
        type: "address",
      },
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
        indexed: false,
        internalType: "struct DonationMatchStorage.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "DonationMatchCharityInitialized",
    type: "event",
  },
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
  "0x6080806040523461001b576001600555611c3a90816100218239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163cfcb6c5b146103ae57508063d5780e86146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a09160806040516100648161158d565b82815282602082015282604082015282606082015201526040516100878161158d565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f25760a03660031901126100f2576040516101138161158d565b6001600160a01b0360043581811681036103a55782526024359080821682036103a55760208301918252610145611533565b90604084019182526064359262ffffff9081851685036103aa57606086019485526084359083821682036103a5576080870191825260045460ff8160081c161597888099610398575b8015610381575b156103255760ff1982166001176004558591829182918b610313575b506101c08282511615156115e4565b5116926bffffffffffffffffffffffff60a01b93848c5416178b556101e98282511615156115e4565b511695868360015416176001556102048282511615156115e4565b5116906003549584885116156102e0578560c097847f123a176064b6b36c0c200b28dbf437f6f42bd518b6f192505920e49ad5cd33dc9a62ffffff60a01b905160a01b169168ffffffffffffffffff60b81b161717948560035561026c8282511615156115e4565b511680926002541617600255604051953087528a5416602087015260408601526060850152608084015260a01c1660a0820152a16102a75780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101b1565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101955750600160ff831614610195565b50600160ff83161061018e565b600080fd5b8680fd5b9050346108685760803660031901126108685763ffffffff6004351660043503610868576103da611533565b906064356001600160a01b038116900361152f576002600554146114ed5750600260055560035460405163e68f909d60e01b81526103e092918390829060049082906001600160a01b03165afa928315611245578493611295575b505060408201516001600160a01b0316156112505761046160018060a01b036040840151163314611668565b60408281015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa908115611245578491610c31575b506080810180516002811015610c1d57610bd25750506104d260018060a01b03610160840151163014611668565b60025483546001600160a01b0390811693916104f49185916024359116611a28565b926040516370a0823160e01b8152306004820152602081602481855afa80156108ce5785918791610b9d575b5010610b585760405163095ea7b360e01b81526001600160a01b0390911660048201526024810184905260208180604481010381886064356001600160a01b03165af1908115610a9b578591610b1e575b5015610ae15783546040805160043563ffffffff1681526001600160a01b036064358116602083015290921690820181905260608201859052907f4a3ad0dbd85a4cac2e1c00b96464bc06036951251508d9b62ca51b886caaaff790608090a16064356001600160a01b0316810361093d57509060288302838104602814841517156109155760649004918280018084116109295784039384116109155760405163a9059cbb60e01b81526001600160a01b0383166004820152602481018490529160208380604481010381896064356001600160a01b03165af19283156108ce5784936108d9575b506040805163ffffffff6004351681526001600160a01b0360643581166020830152929092169082015260608101939093527ff8277fe14d65517ce640ccce16352b0e58a41454407dc2268b071132222065e2928390608090a1604081810151905163095ea7b360e01b81526001600160a01b0390911660048201526024810183905260208180604481010381896064356001600160a01b03165af180156108ce57869061088f575b61070d9150611993565b604081015185906001600160a01b0316803b15610868578160405180926307f740eb60e21b82528183816107698a6064356004356004850160409194939263ffffffff606083019616825260018060a01b031660208201520152565b03925af1801561086c57610877575b5050604090810151815160043563ffffffff1681526001600160a01b0360643581166020830152909116918101919091526060810191909152608090a16064356001600160a01b03163b1561086857604051630852cd8d60e31b81526004810182905282908181602481836064356001600160a01b03165af1801561086c57610854575b50506040805160043563ffffffff1681526064356001600160a01b03166020820152908101919091527fda9b11b27beb64dea29f65d97a0e9490c9bb41bbf5e75535ebfc8c246cf7e61b90606090a15b600160055580f35b61085d9061157a565b6108685781386107fc565b5080fd5b6040513d84823e3d90fd5b6108809061157a565b61088b578438610778565b8480fd5b506020813d6020116108c6575b816108a9602093836115c3565b810103126108c2576108bd61070d916118a5565b610703565b8580fd5b3d915061089c565b6040513d88823e3d90fd5b92506020833d60201161090d575b816108f4602093836115c3565b810103126108c25761090684936118a5565b503861065a565b3d91506108e7565b634e487b7160e01b85526011600452602485fd5b634e487b7160e01b86526011600452602486fd5b60405163095ea7b360e01b81526064356001600160a01b0316600482015260248101859052906020908290604490829089905af18015610a9b578590610aa6575b6109889150611993565b60408101516001600160a01b039081169290606435163b1561088b576040519263de764d2160e01b8452846004850152602484015263ffffffff60043516604484015260018060a01b03169182606482015284816084818360018060a01b03606435165af18015610a9b57610a61575b5060409081015181513081526001600160a01b03606435811660208301529281019490945216606083015263ffffffff60043516608083015260a08201527f47adb03c0fd8d6563b7649bdf746d6ec42aa57fff4e14d543fdef3474a5de4b49060c090a161084c565b917f47adb03c0fd8d6563b7649bdf746d6ec42aa57fff4e14d543fdef3474a5de4b4939194610a9160c09461157a565b94919350916109f8565b6040513d87823e3d90fd5b506020813d602011610ad9575b81610ac0602093836115c3565b8101031261088b57610ad4610988916118a5565b61097e565b3d9150610ab3565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610b50575b81610b39602093836115c3565b8101031261088b57610b4a906118a5565b38610571565b3d9150610b2c565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610bca575b81610bb9602093836115c3565b810103126108c25784905138610520565b3d9150610bac565b516002811015610c0957600114610bea575b506104d2565b6102400151610c03906001600160a01b03163014611668565b38610be4565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610c4282826115c3565b602081838101031261088b578051906001600160401b0382116108c2576108c082820184830103126108c25760405192836103c08101106001600160401b036103c086011117611231576103c08401604052610c9f838301611622565b8452602083830101516001600160401b03811161122957610cc79082840190858501016116a3565b6020850152604083830101516001600160401b038111611229578383010160408183850103126112295760405190610cfe82611549565b80516001600160401b03811161122d57610d1d9084860190830161172a565b82526020810151906001600160401b03821161122d57610d4191848601910161172a565b602082015260408501528183016060818101519086015260800151600281101561122957608085015260a083830101516001600160401b03811161122957610d909082840190858501016116a3565b60a085015260c083830101516001600160401b03811161122957610dbb9082840190858501016116a3565b60c085015281830160e0818101519086015261010001516001600160401b03811161122957610df1908284019085850101611808565b61010085015261012083830101516001600160401b03811161122957610e1e908284019085850101611808565b61012085015260c08284018284010361013f1901126103aa576040518060c08101106001600160401b0360c0830111176112155760c08101604052610e68610140858501016118a5565b8152610e79610160858501016118b2565b6020820152610e8d610180858501016118b2565b6040820152610ea16101a0858501016118a5565b6060820152610eb56101c0858501016118b2565b6080820152610ec96101e0858501016118b2565b60a0820152610140850152610ee3610200848401016118a5565b6101608501528183016102208101516101808601526102408101516101a0860152610f119061026001611622565b6101c0850152610f2661028084840101611622565b6101e0850152610f3b6102a084840101611622565b610200850152610f506102c0848401016118a5565b610220850152610f656102e084840101611622565b61024085015261030083830101516001600160401b03811161122957610f929082840190858501016118c3565b61026085015261032083830101516001600160401b03811161122957610fbf9082840190858501016118c3565b61028085015261034083830101516001600160401b03811161122957610fec9082840190858501016118c3565b6102a085015261100481830161036085850101611929565b6102c085015261101c8183016103c085850101611929565b6102e085015261103481830161042085850101611929565b6103008501526103808284018284010361047f1901126103aa57604051806101c08101106001600160401b036101c083011117611215576108a0939291816101c0611200930160405261108f82850161048087870101611964565b81526110a38285016104c087870101611964565b60208201526110ba82850161050087870101611964565b60408201526110d182850161054087870101611964565b60608201526110e882850161058087870101611964565b60808201526110ff8285016105c087870101611964565b60a082015261111682850161060087870101611964565b60c082015261112d82850161064087870101611964565b60e082015261114482850161068087870101611964565b61010082015261115c8285016106c087870101611964565b61012082015261117482850161070087870101611964565b61014082015261118c82850161074087870101611964565b6101608201526111a482850161078087870101611964565b6101808201526111bc8285016107c087870101611964565b6101a08201526103208701526111d7610800858501016118b2565b6103408701526111ec610820858501016118a5565b610360870152820161084084840101611636565b6103808501520101516103a0820152386104a4565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b6040513d86823e3d90fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b80919293503d82116114e6575b6112ac81846115c3565b820190828203126114e257604051916103a0918284018481106001600160401b03821117611231576040526114d6916103c0916112e882611622565b86526112f660208301611622565b602087015261130760408301611622565b604087015261131860608301611622565b606087015261132960808301611622565b608087015261133a60a08301611622565b60a087015261134b60c08301611622565b60c087015261135c60e08301611622565b60e087015261010061136f818401611622565b90870152610120611381818401611622565b90870152610140611393818401611622565b908701526101606113a5818401611622565b908701526101806113b7818401611622565b908701526113ca6101a091828401611636565b90860152610200936113dd858301611622565b6101c08701526114cc610220916113f5838501611622565b6101e08901526102409661140a888601611622565b9089015261026092838501519089015261028096611429888601611622565b908901526102a09261143c848601611622565b908901526102c09661144f888601611622565b908901526102e092611462848601611622565b9089015261030096611475888601611622565b9089015261032092611488848601611622565b908901526103409661149b888601611622565b90890152610360926114ae848601611622565b90890152610380966114c1888601611622565b908901528301611622565b9086015201611622565b90820152903880610435565b8380fd5b503d6112a2565b62461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b8280fd5b604435906001600160a01b03821682036103a557565b604081019081106001600160401b0382111761156457604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161156457604052565b60a081019081106001600160401b0382111761156457604052565b606081019081106001600160401b0382111761156457604052565b90601f801991011681019081106001600160401b0382111761156457604052565b156115eb57565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b03821682036103a557565b91908260609103126103a55760405161164e816115a8565b604080829480518452602081015160208501520151910152565b1561166f57565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f840112156103a5578251906001600160401b03821161156457604051916020916116db601f8301601f19168401856115c3565b8184528282870101116103a55760005b81811061170057508260009394955001015290565b85810183015184820184015282016116eb565b6001600160401b0381116115645760051b60200190565b81601f820112156103a55780519161174183611713565b9261174f60405194856115c3565b808452602092838086019260051b8201019283116103a5578301905b828210611779575050505090565b8151815290830190830161176b565b9080601f830112156103a5578151906117a082611713565b926117ae60405194856115c3565b828452602092838086019160051b830101928084116103a557848301915b8483106117dc5750505050505090565b82516001600160401b0381116103a55786916117fd848480948901016116a3565b8152019201916117cc565b9190916080818403126103a557604051906001600160401b0390608083018281118482101761156457604052829481518381116103a5578161184b918401611788565b845260208201518381116103a5578161186591840161172a565b602085015260408201518381116103a55781611882918401611788565b604085015260608201519283116103a5576060926118a0920161172a565b910152565b519081151582036103a557565b519063ffffffff821682036103a557565b81601f820112156103a5578051916118da83611713565b926118e860405194856115c3565b808452602092838086019260051b8201019283116103a5578301905b828210611912575050505090565b83809161191e84611622565b815201910190611904565b91908260609103126103a557604051611941816115a8565b60406118a081839561195281611622565b855260208101516020860152016118a5565b91908260409103126103a55760405161197c81611549565b602080829461198a81611622565b84520151910152565b1561199a57565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b818102929181159184041417156119e357565b634e487b7160e01b600052601160045260246000fd5b8115611a03570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff821682036103a557565b90916001600160a01b03918216908216818114611bfe578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611bad578491600091611bc3575b5016918215611bb95760e060049360405194858092633850c7bd851b82525afa928315611bad57600093611b1e575b501015611add57611ad79291611acf911680926119d0565b60601c6119d0565b60601c90565b8260601b91600160601b938084048514901517156119e357611b01911680926119f9565b8060601b9281840414901517156119e357611b1b916119f9565b90565b60e0939193813d8211611ba5575b81611b3960e093836115c3565b810103126108685780519185831683036100f25760208201518060020b036100f257611b6760408301611a19565b50611b7460608301611a19565b50611b8160808301611a19565b5060a082015160ff8116036100f2575060c0611b9d91016118a5565b509138611ab7565b3d9150611b2c565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611bf6575b81611bdd602093836115c3565b810103126100f25750611bf08491611622565b38611a88565b3d9150611bd0565b5050509056fea2646970667358221220908806de0fe0e6bdbdf47acd534b4ee7cd3384bcd49bc3f1244899264265b4a664736f6c63430008120033";

type DonationMatchCharityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DonationMatchCharityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DonationMatchCharity__factory extends ContractFactory {
  constructor(...args: DonationMatchCharityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DonationMatchCharity> {
    return super.deploy(overrides || {}) as Promise<DonationMatchCharity>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DonationMatchCharity {
    return super.attach(address) as DonationMatchCharity;
  }
  override connect(signer: Signer): DonationMatchCharity__factory {
    return super.connect(signer) as DonationMatchCharity__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DonationMatchCharityInterface {
    return new utils.Interface(_abi) as DonationMatchCharityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DonationMatchCharity {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DonationMatchCharity;
  }
}
