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
  "0x6080806040523461001b576001600555611ca690816100218239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163cfcb6c5b146103ae57508063d5780e86146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a09160806040516100648161160d565b82815282602082015282604082015282606082015201526040516100878161160d565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f25760a03660031901126100f2576040516101138161160d565b6001600160a01b0360043581811681036103a55782526024359080821682036103a557602083019182526101456115b3565b90604084019182526064359262ffffff9081851685036103aa57606086019485526084359083821682036103a5576080870191825260045460ff8160081c161597888099610398575b8015610381575b156103255760ff1982166001176004558591829182918b610313575b506101c0828251161515611649565b5116926bffffffffffffffffffffffff60a01b93848c5416178b556101e9828251161515611649565b51169586836001541617600155610204828251161515611649565b5116906003549584885116156102e0578560c097847f123a176064b6b36c0c200b28dbf437f6f42bd518b6f192505920e49ad5cd33dc9a62ffffff60a01b905160a01b169168ffffffffffffffffff60b81b161717948560035561026c828251161515611649565b511680926002541617600255604051953087528a5416602087015260408601526060850152608084015260a01c1660a0820152a16102a75780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386101b1565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156101955750600160ff831614610195565b50600160ff83161061018e565b600080fd5b8680fd5b9050346108665760803660031901126108665763ffffffff6004351660043503610866576103da6115b3565b906064356001600160a01b03811690036115af5760026005541461156d5750600260055560035460405163e68f909d60e01b815291906103e090839060049082906001600160a01b03165afa9182156115625783926112f3575b5060408201516001600160a01b0316156112ae5761045f60018060a01b0360408401511633146116dd565b60408281015190516364ce479160e11b81526004803563ffffffff1690820152908490829060249082906001600160a01b03165afa9081156112a3578491610c2f575b506080810180516002811015610c1b57610bd05750506104d060018060a01b036101608401511630146116dd565b60025483546001600160a01b0390811693916104f29185916024359116611a94565b926040516370a0823160e01b8152306004820152602081602481855afa80156108cc5785918791610b9b575b5010610b565760405163095ea7b360e01b81526001600160a01b0390911660048201526024810184905260208180604481010381886064356001600160a01b03165af1908115610a99578591610b1c575b5015610adf5783546040805160043563ffffffff1681526001600160a01b036064358116602083015290921690820181905260608201859052907f4a3ad0dbd85a4cac2e1c00b96464bc06036951251508d9b62ca51b886caaaff790608090a16064356001600160a01b0316810361093b57509060288302838104602814841517156109135760649004918280018084116109275784039384116109135760405163a9059cbb60e01b81526001600160a01b0383166004820152602481018490529160208380604481010381896064356001600160a01b03165af19283156108cc5784936108d7575b506040805163ffffffff6004351681526001600160a01b0360643581166020830152929092169082015260608101939093527ff8277fe14d65517ce640ccce16352b0e58a41454407dc2268b071132222065e2928390608090a1604081810151905163095ea7b360e01b81526001600160a01b0390911660048201526024810183905260208180604481010381896064356001600160a01b03165af180156108cc57869061088d575b61070b91506119ff565b604081015185906001600160a01b0316803b15610866578160405180926307f740eb60e21b82528183816107678a6064356004356004850160409194939263ffffffff606083019616825260018060a01b031660208201520152565b03925af1801561086a57610875575b5050604090810151815160043563ffffffff1681526001600160a01b0360643581166020830152909116918101919091526060810191909152608090a16064356001600160a01b03163b1561086657604051630852cd8d60e31b81526004810182905282908181602481836064356001600160a01b03165af1801561086a57610852575b50506040805160043563ffffffff1681526064356001600160a01b03166020820152908101919091527fda9b11b27beb64dea29f65d97a0e9490c9bb41bbf5e75535ebfc8c246cf7e61b90606090a15b600160055580f35b61085b906115fa565b6108665781386107fa565b5080fd5b6040513d84823e3d90fd5b61087e906115fa565b610889578438610776565b8480fd5b506020813d6020116108c4575b816108a760209383611628565b810103126108c0576108bb61070b9161191a565b610701565b8580fd5b3d915061089a565b6040513d88823e3d90fd5b92506020833d60201161090b575b816108f260209383611628565b810103126108c057610904849361191a565b5038610658565b3d91506108e5565b634e487b7160e01b85526011600452602485fd5b634e487b7160e01b86526011600452602486fd5b60405163095ea7b360e01b81526064356001600160a01b0316600482015260248101859052906020908290604490829089905af18015610a99578590610aa4575b61098691506119ff565b60408101516001600160a01b039081169290606435163b15610889576040519263de764d2160e01b8452846004850152602484015263ffffffff60043516604484015260018060a01b03169182606482015284816084818360018060a01b03606435165af18015610a9957610a5f575b5060409081015181513081526001600160a01b03606435811660208301529281019490945216606083015263ffffffff60043516608083015260a08201527f47adb03c0fd8d6563b7649bdf746d6ec42aa57fff4e14d543fdef3474a5de4b49060c090a161084a565b917f47adb03c0fd8d6563b7649bdf746d6ec42aa57fff4e14d543fdef3474a5de4b4939194610a8f60c0946115fa565b94919350916109f6565b6040513d87823e3d90fd5b506020813d602011610ad7575b81610abe60209383611628565b8101031261088957610ad26109869161191a565b61097c565b3d9150610ab1565b60405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606490fd5b90506020813d602011610b4e575b81610b3760209383611628565b8101031261088957610b489061191a565b3861056f565b3d9150610b2a565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152606490fd5b9150506020813d602011610bc8575b81610bb760209383611628565b810103126108c0578490513861051e565b3d9150610baa565b516002811015610c0757600114610be8575b506104d0565b6102400151610c01906001600160a01b031630146116dd565b38610be2565b634e487b7160e01b85526021600452602485fd5b634e487b7160e01b86526021600452602486fd5b3d91508185823e610c408282611628565b6020818381010312610889578051906001600160401b0382116108c057610b8082820184830103126108c05760405192836103e08101106001600160401b036103e08601111761128f576103e08401604052610c9d838301611687565b8452602083830101516001600160401b03811161128757610cc5908284019085850101611718565b6020850152604083830101516001600160401b038111611287578383010160408183850103126112875760405190610cfc826115c9565b80516001600160401b03811161128b57610d1b9084860190830161179f565b82526020810151906001600160401b03821161128b57610d3f91848601910161179f565b602082015260408501528183016060818101519086015260800151600281101561128757608085015260a083830101516001600160401b03811161128757610d8e908284019085850101611718565b60a085015260c083830101516001600160401b03811161128757610db9908284019085850101611718565b60c085015281830160e0818101519086015261010001516001600160401b03811161128757610def90828401908585010161187d565b61010085015261012083830101516001600160401b03811161128757610e1c90828401908585010161187d565b61012085015260c08284018284010361013f1901126103aa576040518060c08101106001600160401b0360c0830111176112735760c08101604052610e666101408585010161191a565b8152610e7761016085850101611927565b6020820152610e8b61018085850101611927565b6040820152610e9f6101a08585010161191a565b6060820152610eb36101c085850101611927565b6080820152610ec76101e085850101611927565b60a0820152610140850152610ee16102008484010161191a565b6101608501528183016102208101516101808601526102408101516101a0860152610f0f9061026001611687565b6101c0850152610f2461028084840101611687565b6101e0850152610f396102a084840101611687565b610200850152610f4e6102c08484010161191a565b610220850152610f636102e084840101611687565b61024085015261030083830101516001600160401b03811161128757610f90908284019085850101611938565b61026085015261032083830101516001600160401b03811161128757610fbd908284019085850101611938565b61028085015261034083830101516001600160401b03811161128757610fea908284019085850101611938565b6102a08501526110028183016103608585010161199e565b6102c085015261101a8183016103a08585010161199e565b6102e08501526110328183016103e08585010161199e565b61030085015261104a8183016104208585010161199e565b6103208501526106608284018284010361045f1901126103aa57604051806102208101106001600160401b036102208301111761127357610b609392918161022061125e93016040526110a5828501610460878701016119cd565b81526110b98285016104c0878701016119cd565b60208201526110d0828501610520878701016119cd565b60408201526110e7828501610580878701016119cd565b60608201526110fe8285016105e0878701016119cd565b6080820152611115828501610640878701016119cd565b60a082015261112c8285016106a0878701016119cd565b60c0820152611143828501610700878701016119cd565b60e082015261115a828501610760878701016119cd565b6101008201526111728285016107c0878701016119cd565b61012082015261118a828501610820878701016119cd565b6101408201526111a2828501610880878701016119cd565b6101608201526111ba8285016108e0878701016119cd565b6101808201526111d2828501610940878701016119cd565b6101a08201526111ea8285016109a0878701016119cd565b6101c0820152611202828501610a00878701016119cd565b6101e082015261121a828501610a60878701016119cd565b610200820152610340870152611235610ac085850101611927565b61036087015261124a610ae08585010161191a565b6103808701528201610b008484010161169b565b6103a08501520101516103c0820152386104a2565b634e487b7160e01b88526041600452602488fd5b8780fd5b8980fd5b634e487b7160e01b87526041600452602487fd5b6040513d86823e3d90fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b9091506103e03d6103e01161155b575b61130d8183611628565b8101906103e08183031261155757604051916103a083018381106001600160401b038211176115435760405261134282611687565b835261135060208301611687565b602084015261136160408301611687565b604084015261137260608301611687565b606084015261138360808301611687565b608084015261139460a08301611687565b60a08401526113a560c08301611687565b60c08401526113b660e08301611687565b60e08401526101006113c9818401611687565b908401526101206113db818401611687565b908401526101406113ed818401611687565b908401526101606113ff818401611687565b90840152610180611411818401611687565b908401526114246101a09182840161169b565b908301526115386103c06102009261143d848201611687565b6101c0860152610220611451818301611687565b6101e087015261024094611466868401611687565b9087015261026090818301519087015261028094611485868401611687565b908701526102a090611498828401611687565b908701526102c0946114ab868401611687565b908701526102e0906114be828401611687565b90870152610300946114d1868401611687565b90870152610320906114e4828401611687565b90870152610340946114f7868401611687565b908701526103609061150a828401611687565b908701526103809461151d868401611687565b9087015261152e6103a08301611687565b9086015201611687565b908201529038610434565b634e487b7160e01b86526041600452602486fd5b8380fd5b503d611303565b6040513d85823e3d90fd5b62461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b8280fd5b604435906001600160a01b03821682036103a557565b604081019081106001600160401b038211176115e457604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b0381116115e457604052565b60a081019081106001600160401b038211176115e457604052565b90601f801991011681019081106001600160401b038211176115e457604052565b1561165057565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b03821682036103a557565b91908260609103126103a557604051606081018181106001600160401b038211176115e457604052604080829480518452602081015160208501520151910152565b156116e457565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f840112156103a5578251906001600160401b0382116115e45760405191602091611750601f8301601f1916840185611628565b8184528282870101116103a55760005b81811061177557508260009394955001015290565b8581018301518482018401528201611760565b6001600160401b0381116115e45760051b60200190565b81601f820112156103a5578051916117b683611788565b926117c46040519485611628565b808452602092838086019260051b8201019283116103a5578301905b8282106117ee575050505090565b815181529083019083016117e0565b9080601f830112156103a55781519061181582611788565b926118236040519485611628565b828452602092838086019160051b830101928084116103a557848301915b8483106118515750505050505090565b82516001600160401b0381116103a557869161187284848094890101611718565b815201920191611841565b9190916080818403126103a557604051906001600160401b039060808301828111848210176115e457604052829481518381116103a557816118c09184016117fd565b845260208201518381116103a557816118da91840161179f565b602085015260408201518381116103a557816118f79184016117fd565b604085015260608201519283116103a557606092611915920161179f565b910152565b519081151582036103a557565b519063ffffffff821682036103a557565b81601f820112156103a55780519161194f83611788565b9261195d6040519485611628565b808452602092838086019260051b8201019283116103a5578301905b828210611987575050505090565b83809161199384611687565b815201910190611979565b91908260409103126103a5576040516119b6816115c9565b60208082946119c481611687565b84520151910152565b91906060838203126103a5576020611915604051926119eb846115c9565b8284966119f78161191a565b86520161199e565b15611a0657565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611a4f57565b634e487b7160e01b600052601160045260246000fd5b8115611a6f570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff821682036103a557565b90916001600160a01b03918216908216818114611c6a578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611c19578491600091611c2f575b5016918215611c255760e060049360405194858092633850c7bd851b82525afa928315611c1957600093611b8a575b501015611b4957611b439291611b3b91168092611a3c565b60601c611a3c565b60601c90565b8260601b91600160601b93808404851490151715611a4f57611b6d91168092611a65565b8060601b928184041490151715611a4f57611b8791611a65565b90565b60e0939193813d8211611c11575b81611ba560e09383611628565b810103126108665780519185831683036100f25760208201518060020b036100f257611bd360408301611a85565b50611be060608301611a85565b50611bed60808301611a85565b5060a082015160ff8116036100f2575060c0611c09910161191a565b509138611b23565b3d9150611b98565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611c62575b81611c4960209383611628565b810103126100f25750611c5c8491611687565b38611af4565b3d9150611c3c565b5050509056fea2646970667358221220561127f79a141110cd8dfd34972bb0616cf6a535928198e0f9ca49f67a21210d64736f6c63430008120033";

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
