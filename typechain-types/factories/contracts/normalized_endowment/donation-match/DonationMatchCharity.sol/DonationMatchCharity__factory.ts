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
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
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
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
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
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
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
        internalType: "uint256",
        name: "endowmentId",
        type: "uint256",
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
  "0x6080806040523461001b576001600555611d5d90816100218239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c908163d5780e861461130157508063d61e991b146100f55763e68f909d1461004257600080fd5b346100f257806003193601126100f2578060a0916080604051610064816115a9565b8281528260208201528260408201528260608201520152604051610087816115a9565b600180841b0380925416918282528060015416906020830191825280600254169260408101938452816003549481608060608501948289168652019562ffffff80988b1c16875260405198895251166020880152511660408601525116606084015251166080820152f35b80fd5b50346100f25760803660031901126100f25761010f61165f565b6064356001600160a01b0381169003610583576002600554146112bc57600260055560035460405163e68f909d60e01b815291908390839060049082906001600160a01b03165afa9182156112b1578392610fb0575b5060608201516001600160a01b031615610f6b5761019060018060a01b0360608401511633146117e3565b60608201516040516354f3ce9960e01b81526004803590820152908490829060249082906001600160a01b03165afa908115610f6057849161094d575b5060e081015160048110156109085760016101e891146117e3565b6080810180516003811015610939571561091c575b516003811015610908576001146108e9575b5060025483546001600160a01b0390811692916102329184916024359116611b4b565b926040516370a0823160e01b81523060048201526020908181602481885afa80156105e557869188916108b8575b50106108745760405163095ea7b360e01b8082526001600160a01b039095166004820152602481018690528181806044810103818a6064356001600160a01b03165af19081156105e557879161083b575b50156107ff5785546040805160043581526001600160a01b036064358116602083015290921690820181905260608201879052907fedeb689ce41cb76bb0bd501ef98ddd3cc7bd27e0b41be0f39709795b1993850c90608090a16064356001600160a01b03168103610668575060288502858104602814861517156106405760649004938480018086116106545786039586116106405760405163a9059cbb60e01b81526001600160a01b038516600482015260248101869052938285806044810103818b6064356001600160a01b03165af19485156106355786956105f0575b506040805160043581526001600160a01b0360643581166020830152929092169082015260608101959095527fe08c6dab400dfe0cee41f683992822c6ce9cbeb122367a85454ed1d64bc60f649484929182918790608090a160608501516040519182526001600160a01b03166004820152602481019390935282806044810103818a6064356001600160a01b03165af19081156105e55787916105aa575b5061043c9150611ab6565b606081015185906001600160a01b0316803b1561058357816040518092630b49b2f360e11b82528183816104928a606435600435600485016040919493926060820195825260018060a01b031660208201520152565b03925af1801561058757610592575b50506060908101516040805160043581526001600160a01b03606435811660208301529092169082015290810191909152608090a16064356001600160a01b03163b1561058357604051630852cd8d60e31b81526004810182905282908181602481836064356001600160a01b03165af180156105875761056f575b50506040805160043581526064356001600160a01b03166020820152908101919091527f01ed2ab8a0c422973a1721262a1a2033bb911abbbd79675337c55bdf45fd001590606090a15b600160055580f35b610578906115f5565b61058357813861051d565b5080fd5b6040513d84823e3d90fd5b61059b906115f5565b6105a65784386104a1565b8480fd5b905081813d83116105de575b6105c0818361163e565b810103126105da576105d461043c9161177b565b38610431565b8580fd5b503d6105b6565b6040513d89823e3d90fd5b90928092955081813d831161062e575b61060a818361163e565b8101031261062a5785948593610620849361177b565b5091509192610392565b8780fd5b503d610600565b6040513d8a823e3d90fd5b634e487b7160e01b87526011600452602487fd5b634e487b7160e01b88526011600452602488fd5b6040519485526064356001600160a01b031660048601526024850186905290949293908590829060449082908a905af180156107be5786906107c9575b6106af9150611ab6565b60608101516001600160a01b039081169390606435163b156105da5760405193638ea692ef60e01b85528360048601526024850152600435604485015260018060a01b03169283606482015285816084818360018060a01b03606435165af180156107be57610782575b50917f4bcd87201f9a0aabc969c069cd1b657057cf2f636ebe7a36bae9479ce7a21f57939160c093606060018060a01b0391015116906040519330855260018060a01b03606435169085015260408401526060830152600435608083015260a0820152a1610567565b9160c09391956107b37f4bcd87201f9a0aabc969c069cd1b657057cf2f636ebe7a36bae9479ce7a21f5796946115f5565b959193509193610719565b6040513d88823e3d90fd5b508481813d83116107f8575b6107df818361163e565b810103126105da576107f36106af9161177b565b6106a5565b503d6107d5565b6064906040519062461bcd60e51b825260048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152fd5b90508181813d831161086d575b610852818361163e565b81010312610869576108639061177b565b386102b1565b8680fd5b503d610848565b6064906040519062461bcd60e51b82526004820152601a60248201527f496e73756666696369656e74205265736572766520546f6b656e0000000000006044820152fd5b809250838092503d83116108e2575b6108d1818361163e565b810103126108695785905138610260565b503d6108c7565b6102a00151610902906001600160a01b031630146117e3565b3861020f565b634e487b7160e01b85526021600452602485fd5b61093460018060a01b036101808601511630146117e3565b6101fd565b634e487b7160e01b86526021600452602486fd5b3d91508185823e61095e828261163e565b60208183810103126105a6578051906001600160401b0382116105da5761112082820184830103126105da576040519261044084018481106001600160401b03821117610f48576040526109b38383016116b8565b8452602083830101516001600160401b03811161062a576109db90828401908585010161181e565b6020850152604083830101516001600160401b03811161062a5760408185850101838501031261062a5760405190610a12826115da565b8085850101516001600160401b038111610f5c57610a39908486019083888801010161188e565b8252602081868601010151906001600160401b038211610f5c57610a659184860191878701010161188e565b602082015260408501528183016060818101519086015260800151600381101561062a57608085015260a083830101516001600160401b03811161062a57610ab490828401908585010161181e565b60a085015260c083830101516001600160401b03811161062a57610adf90828401908585010161181e565b60c085015260e08383010151600481101561062a5760e0850152610b086101008484010161177b565b610100850152610b1d6101208484010161177b565b610120850152818301610140818101519086015261016001516001600160401b03811161062a57610b5590828401908585010161196c565b61016085015261018083830101516001600160401b03811161062a57610b8290828401908585010161196c565b610180850152610b9a8183016101a085850101611788565b6101a0850152610baf6102408484010161177b565b6101c08501528183016102608101516101e08601526102808101516102008601526102a0810151610220860152610be9906102c0016116b8565b610240850152610bfe6102e0848401016116b8565b610260850152610c136103008484010161177b565b610280850152610c28610320848401016116b8565b6102a085015261034083830101516001600160401b03811161062a57610c55908284019085850101611715565b6102c085015261036083830101516001600160401b03811161062a57610c82908284019085850101611715565b6102e085015261038083830101516001600160401b03811161062a57610caf908284019085850101611715565b610300850152610cc78183016103a085850101611a00565b610320850152610cdf81830161040085850101611a00565b610340850152610cf781830161046085850101611a00565b610360850152610d0f8183016104c085850101611a00565b610380850152610b408284018284010361051f19011261086957604051806102408101106001600160401b0361024083011117610f485761110093929181610240610f339301604052610d6a82850161052087870101611a3b565b8152610d7e8285016105c087870101611a3b565b6020820152610d9582850161066087870101611a3b565b6040820152610dac82850161070087870101611a3b565b6060820152610dc38285016107a087870101611a3b565b6080820152610dda82850161084087870101611a3b565b60a0820152610df18285016108e087870101611a3b565b60c0820152610e0882850161098087870101611a3b565b60e0820152610e1f828501610a2087870101611a3b565b610100820152610e37828501610ac087870101611a3b565b610120820152610e4f828501610b6087870101611a3b565b610140820152610e67828501610c0087870101611a3b565b610160820152610e7f828501610ca087870101611a3b565b610180820152610e97828501610d4087870101611a3b565b6101a0820152610eaf828501610de087870101611a3b565b6101c0820152610ec7828501610e8087870101611a3b565b6101e0820152610edf828501610f2087870101611a3b565b610200820152610ef7828501610fc087870101611a3b565b6102208201526103a08701528284016110608101516103c0880152610f1f906110800161177b565b6103e087015282016110a0848401016116cc565b610400850152010151610420820152386101cd565b634e487b7160e01b88526041600452602488fd5b8980fd5b6040513d86823e3d90fd5b60405162461bcd60e51b815260206004820152601760248201527f4163636f756e7473204e6f7420436f6e666967757265640000000000000000006044820152606490fd5b9091503d8084833e610fc2818361163e565b8101906020818303126112ad5780516001600160401b03918282116105da5701906104e0828403126105a657604051926104209283850185811084821117610f4857604052611010816116b8565b855261101e602082016116b8565b602086015261102f604082016116b8565b6040860152611040606082016116b8565b6060860152611051608082016116b8565b608086015261106260a082016116b8565b60a086015261107360c082016116b8565b60c086015261108460e082016116b8565b60e08601526101006110978183016116b8565b908601526101206110a98183016116b8565b908601526101406110bb8183016116b8565b908601526101606110cd8183016116b8565b908601526101806110df8183016116b8565b908601526101a06110f18183016116b8565b908601526101c0611104838284016116cc565b90860152610220916111178383016116b8565b6101e087015261024061112b8184016116b8565b610200880152610260936111408585016116b8565b90880152610280906111538285016116b8565b908801526102a09384840151908801526102c0906111728285016116b8565b908801526102e0808401518681116112a9578401946020868503126112a957604051906020820182811089821117611295576040528651978811611291576111c285611286996104c09901611715565b8252890152610300916111d68386016116b8565b908901526111e961032093848601611788565b908801526103c0906111fc8285016116b8565b908801526103e09161120f8385016116b8565b90880152611232610400966112258886016116b8565b6103408a015284016116b8565b61036088015261124561044084016116b8565b61038088015261125861046084016116b8565b6103a088015261126b61048084016116b8565b9087015261127c6104a083016116b8565b90860152016116b8565b908201529038610165565b8b80fd5b634e487b7160e01b8d52604160045260248dfd5b8a80fd5b8380fd5b6040513d85823e3d90fd5b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b9050346105835760a03660031901126105835761131d816115a9565b6001600160a01b0360043581811681036112ad57825260243581811681036112ad576020830190815261134e61165f565b90604084019182526064359162ffffff908184168403610869576060860193845260843590858216820361062a576080870191825260045460ff8160081c16159788809961159c575b8015611585575b156115295760ff198216600117600455879189611517575b506113c582825116151561167a565b51169386806bffffffffffffffffffffffff60a01b9287848d5416178c556113f182825116151561167a565b5116928383600154161760015561140c82825116151561167a565b5116916003549785885116156114e4577f123a176064b6b36c0c200b28dbf437f6f42bd518b6f192505920e49ad5cd33dc988460c09962ffffff60a01b905160a01b169168ffffffffffffffffff60b81b161717948560035561147382825116151561167a565b51168092600254161760025560405195308752602087015260408601526060850152608084015260a01c1660a0820152a16114ab5780f35b61ff0019600454166004557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a180f35b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642046656560a81b6044820152606490fd5b61ffff191661010117600455386113b6565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b15801561139e5750600160ff83161461139e565b50600160ff831610611397565b60a081019081106001600160401b038211176115c457604052565b634e487b7160e01b600052604160045260246000fd5b604081019081106001600160401b038211176115c457604052565b6001600160401b0381116115c457604052565b606081019081106001600160401b038211176115c457604052565b608081019081106001600160401b038211176115c457604052565b90601f801991011681019081106001600160401b038211176115c457604052565b604435906001600160a01b038216820361167557565b600080fd5b1561168157565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606490fd5b51906001600160a01b038216820361167557565b9190826060910312611675576040516116e481611608565b604080829480518452602081015160208501520151910152565b6001600160401b0381116115c45760051b60200190565b81601f820112156116755780519161172c836116fe565b9261173a604051948561163e565b808452602092838086019260051b820101928311611675578301905b828210611764575050505090565b838091611770846116b8565b815201910190611756565b5190811515820361167557565b91908260a0910312611675576040516117a0816115a9565b60808082946117ae8161177b565b84526117bc6020820161177b565b6020850152604081015160408501526117d76060820161177b565b60608501520151910152565b156117ea57565b60405162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b6044820152606490fd5b919080601f84011215611675578251906001600160401b0382116115c45760405191602091611856601f8301601f191684018561163e565b8184528282870101116116755760005b81811061187b57508260009394955001015290565b8581018301518482018401528201611866565b81601f82011215611675578051916118a5836116fe565b926118b3604051948561163e565b808452602092838086019260051b820101928311611675578301905b8282106118dd575050505090565b815181529083019083016118cf565b9080601f8301121561167557815190611904826116fe565b92611912604051948561163e565b828452602092838086019160051b8301019280841161167557848301915b8483106119405750505050505090565b82516001600160401b0381116116755786916119618484809489010161181e565b815201920191611930565b9190608083820312611675576040519061198582611623565b81938051916001600160401b039283811161167557816119a69184016118ec565b8452602082015183811161167557816119c091840161188e565b6020850152604082015183811161167557816119dd9184016118ec565b60408501526060820151928311611675576060926119fb920161188e565b910152565b919082606091031261167557604051611a1881611608565b60406119fb818395611a29816116b8565b8552602081015160208601520161177b565b809291039160a0831261167557604051611a5481611623565b60408194611a618461177b565b8352611a6f6020850161177b565b6020840152611a7f82850161177b565b83830152605f19011261167557606090608060405193611a9e856115da565b611aa98482016116b8565b8552015160208401520152565b15611abd57565b60405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606490fd5b81810292918115918404141715611b0657565b634e487b7160e01b600052601160045260246000fd5b8115611b26570490565b634e487b7160e01b600052601260045260246000fd5b519061ffff8216820361167557565b90916001600160a01b03918216908216818114611d21578260015416602062ffffff60646003546040519485938492630b4c774160e11b845289600485015288602485015260a01c1660448301525afa8015611cd0578491600091611ce6575b5016918215611cdc5760e060049360405194858092633850c7bd851b82525afa928315611cd057600093611c41575b501015611c0057611bfa9291611bf291168092611af3565b60601c611af3565b60601c90565b8260601b91600160601b93808404851490151715611b0657611c2491168092611b1c565b8060601b928184041490151715611b0657611c3e91611b1c565b90565b60e0939193813d8211611cc8575b81611c5c60e0938361163e565b810103126105835780519185831683036100f25760208201518060020b036100f257611c8a60408301611b3c565b50611c9760608301611b3c565b50611ca460808301611b3c565b5060a082015160ff8116036100f2575060c0611cc0910161177b565b509138611bda565b3d9150611c4f565b6040513d6000823e3d90fd5b5050505050600090565b91506020823d8211611d19575b81611d006020938361163e565b810103126100f25750611d1384916116b8565b38611bab565b3d9150611cf3565b5050509056fea2646970667358221220b119e327a5d94c581d849c1d9e52475b53d267550e3df0fc444049cd7e03f09464736f6c63430008120033";

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
