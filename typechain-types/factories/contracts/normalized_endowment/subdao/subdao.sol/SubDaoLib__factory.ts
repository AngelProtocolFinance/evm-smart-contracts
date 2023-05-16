/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  SubDaoLib,
  SubDaoLibInterface,
} from "../../../../../contracts/normalized_endowment/subdao/subdao.sol/SubDaoLib";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "curVeaddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "curAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curBlocknumber",
        type: "uint256",
      },
    ],
    name: "queryAddressVotingBalanceAtBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curVeaddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curBlocknumber",
        type: "uint256",
      },
    ],
    name: "queryTotalVotingBalanceAtBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "utfStringLength",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
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
        name: "curDescription",
        type: "string",
      },
    ],
    name: "validateDescription",
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
        internalType: "string",
        name: "curLink",
        type: "string",
      },
    ],
    name: "validateLink",
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
        name: "curQuorum",
        type: "uint256",
      },
    ],
    name: "validateQuorum",
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
        name: "curThreshold",
        type: "uint256",
      },
    ],
    name: "validateThreshold",
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
        internalType: "string",
        name: "curTitle",
        type: "string",
      },
    ],
    name: "validateTitle",
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
] as const;

const _bytecode =
  "0x6080806040523461001d57613cc890816100238239308161049e0152f35b600080fdfe608060405260043610156200001357600080fd5b6000803560e01c80630326c06b14620012b257806313708d99146200121c578063463e604f146200049a5780637365e751146200043057806375ea6969146200037557806387f672b2146200030b578063a69722de146200022e578063cabf798f14620001605763de6f9cf2146200008a57600080fd5b60203660031901126200015d576004356001600160401b0381116200015957620000b990369060040162001366565b6004620000c68262001433565b11156200012257620000da60409162001433565b1015620000ec57602060405160018152f35b60405162461bcd60e51b815260206004820152600e60248201526d5469746c6520746f6f206c6f6e6760901b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e151a5d1b19481d1bdbc81cda1bdc9d608a1b6044820152606490fd5b5080fd5b80fd5b5060203660031901126200015d576004356001600160401b03811162000159576200019090369060040162001366565b600c6200019d8262001433565b1115620001f857620001b160809162001433565b1015620001c357602060405160018152f35b60405162461bcd60e51b815260206004820152600d60248201526c4c696e6b20746f6f206c6f6e6760981b6044820152606490fd5b60405162461bcd60e51b815260206004820152600e60248201526d131a5b9ac81d1bdbc81cda1bdc9d60921b6044820152606490fd5b5060203660031901126200015d576004356001600160401b03811162000159576200025e90369060040162001366565b60046200026b8262001433565b1115620002ce57620002806104009162001433565b10156200029257602060405160018152f35b60405162461bcd60e51b81526020600482015260146024820152734465736372697074696f6e20746f6f206c6f6e6760601b6044820152606490fd5b60405162461bcd60e51b815260206004820152601560248201527411195cd8dc9a5c1d1a5bdb881d1bdbc81cda1bdc9d605a1b6044820152606490fd5b5060203660031901126200015d57606460043510156200033057602060405160018152f35b60405162461bcd60e51b815260206004820152601760248201527f71756f72756d206d757374206265203020746f203130300000000000000000006044820152606490fd5b5060603660031901126200015d576200038d620013c1565b6001600160a01b039190602435838116919082900362000416576044602092604051958693849263277166bf60e11b8452600484015283356024840152165afa908115620004245790620003e7575b602090604051908152f35b506020813d82116200041b575b81620004036020938362001344565b81010312620004165760209051620003dc565b600080fd5b3d9150620003f4565b604051903d90823e3d90fd5b5060203660031901126200015d57606460043510156200045557602060405160018152f35b60405162461bcd60e51b815260206004820152601a60248201527f7468726573686f6c64206d757374206265203020746f203130300000000000006044820152606490fd5b50307f0000000000000000000000000000000000000000000000000000000000000000146200015d5760031960a0368201126200015957600435906001600160401b038211620011f8576040818336030112620011f857604051916200050083620012f6565b80600401356003811015620011eb57835260248101356001600160401b038111620011eb576101e0818301360393840112620011eb576040519261016084018481106001600160401b03821117620012005760405262000565600483850101620013d8565b845282820160248101356020860152604401356001600160401b03811162001218576200059b9060043691858701010162001366565b6040850152606482840101356001600160401b0381116200121857620005ca9060043691858701010162001366565b606085015260a0608319820112620011fc5760405190620005eb82620012f6565b608483850101359060038210156200121457608091835260a3190112620011fc576040518060808101106001600160401b036080830111176200120057608081016040526200063f60a484860101620013ed565b815283830160c481013560208301526200065c9060e401620013ed565b60408201526200067261010484860101620013ed565b60608201526020820152608084015261012481830101356001600160401b038111620011fc57620006ac9060043691848601010162001366565b60a08401526101448183010135916001600160401b038311620011fc57620006e06101c49360043691858501010162001366565b60c085015280820161016481013560e0860152620007029061018401620013d8565b610100850152016101a481013561012084015201356101408201526020820152600260243510159081620011f8576044356001600160a01b0381169003620011f8576084356001600160a01b0381169003620011f8576064355460405163e68f909d60e01b815292906103e090849060049082906001600160a01b03165afa92831562000ad857849362000f0d575b5081516200079f8162001576565b620007aa8162001576565b158062000efe575b1562000ae3575060643554602082810151516040516302b05ecb60e11b81526001600160a01b0391821660048201529283916024918391165afa90811562000ad857849162000a92575b501562000a5857602001515160643560020180546001600160a01b0319166001600160a01b03929092169190911790555b60026064350154604051639065714760e01b60208201526001600160a01b03909116602482015260606044820152600560848201526404c563930360dc1b60a4820152620008b081620008a160c48201828103602319016064840152600581526404c563930360dc1b602082015260400190565b03601f19810183528262001344565b61038082015161032090920151604051926001600160a01b0391821691166001600160401b03610cb285019081119085111762000a44579162000903918493610cb26200167d8639610cb285016200164e565b039082f0801562000a375760643560030180546001600160a01b0319166001600160a01b0383811691909117909155608435163b15620001595760405163f79aa74560e01b81526064803580546001600160a01b0390811660048086019190915260018301548216602486015260028301548216604486015294811692840192909252928301548116608480840191909152600584015460a4840152600684015460c4840152600784015460e484015260088401546101048401526009840154610124840152600a840154610144840152600b9093015461016483015290918391839161018491839185919035165af1801562000a2c5762000a03575080f35b6001600160401b03811162000a185760405280f35b634e487b7160e01b82526041600452602482fd5b6040513d84823e3d90fd5b50604051903d90823e3d90fd5b634e487b7160e01b85526041600452602485fd5b60405162461bcd60e51b81526020600482015260126024820152714e6f74496e417070726f766564436f696e7360701b6044820152606490fd5b90506020813d60201162000acf575b8162000ab06020938362001344565b8101031262000acb5751801515810362000acb5738620007fc565b8380fd5b3d915062000aa1565b6040513d86823e3d90fd5b806001835162000af38162001576565b62000afe8162001576565b14908162000eea575b501562000c32575062000b98602062000b5692015160408101519062000b696020606083015192015191604051958694630ab751b360e01b602087015260a0602487015260c486019062001597565b8481036023190160448601529062001597565b6044356001600160a01b03166064840152608483019190915260a4820186905203601f19810183528262001344565b60a082015161032083015160405192916001600160a01b0391821691166001600160401b03610cb285019081119085111762000c1e579162000bea918493610cb26200232f8639610cb285016200164e565b039083f0801562000a2c5760643560020180546001600160a01b0319166001600160a01b039092169190911790556200082d565b634e487b7160e01b86526041600452602486fd5b806002835162000c428162001576565b62000c4d8162001576565b14908162000ec2575b501562000d45575062000cf3816020620008a193015160a08101519160c0820151916101406020608060018060a01b0361010085015116930151519362000c9d8562001576565b01510151926040519462000cb18662001328565b85526020850152604084015262000cc88162001576565b606083015260808201526040516326cd832b60e21b60208201529283916084359060248401620015d9565b60c082015161032083015160405192916001600160a01b0391821691166001600160401b03610cb285019081119085111762000c1e579162000bea918493610cb262002fe18639610cb285016200164e565b6002825162000d548162001576565b62000d5f8162001576565b14908162000e9c575b501562000e67576101c08201516001600160a01b03161562000e125762000cf36020620008a192015160a08101519060c081015190608060018060a01b036101c088015116910151519162000dbd8362001576565b6040519362000dcc8562001328565b84526020840152604083015262000de38162001576565b6060820152621baf8060808201526040516326cd832b60e21b60208201529283916084359060248401620015d9565b60405162461bcd60e51b815260206004820152602760248201527f52656769737472617227732048414c4f20746f6b656e206164647265737320696044820152667320656d70747960c81b6064820152608490fd5b60405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964496e7075747360981b6044820152606490fd5b905062000eae57602435153862000d68565b634e487b7160e01b83526021600452602483fd5b905062000ed6576001602435148162000c56565b634e487b7160e01b84526021600452602484fd5b905062000ed6576001602435148162000b07565b505082600160243514620007b2565b9092506103e0903d6103e011620011ef575b62000f2b828262001344565b6103e0818381010312620011eb5760405191826103a08101106001600160401b036103a08501111762000c1e576060906103a0840160405262000f6e8362001561565b845262000f7e6020840162001561565b602085015262000f916040840162001561565b604085015262000fa382840162001561565b8285015262000fb56080840162001561565b608085015262000fc860a0840162001561565b60a085015262000fdb60c0840162001561565b60c085015262000fee60e0840162001561565b60e085015262001002610100840162001561565b61010085015262001017610120840162001561565b6101208501526200102c610140840162001561565b61014085015262001041610160840162001561565b6101608501526101806200105781850162001561565b90850152820182900361019f190112620011eb57604051908160608101106001600160401b0360608401111762000c1e576103c0620011df91606084016040526101a0938482015181526101c0948583015160208301526101e0830151604083015286015261020093620010cd85830162001561565b90860152610220620010e181830162001561565b6101e087015261024094620010f886840162001561565b90870152610260908183015190870152610280946200111986840162001561565b908701526102a0906200112e82840162001561565b908701526102c0946200114386840162001561565b908701526102e0906200115882840162001561565b90870152610300946200116d86840162001561565b90870152610320906200118282840162001561565b90870152610340946200119786840162001561565b9087015261036090620011ac82840162001561565b9087015261038094620011c186840162001561565b90870152620011d46103a0830162001561565b908601520162001561565b90820152913862000791565b8480fd5b3d915062000f1f565b8280fd5b8580fd5b634e487b7160e01b87526041600452602487fd5b8780fd5b8680fd5b5060403660031901126200015d576024602062001238620013c1565b604051630981b24d60e41b81528335600482015292839182906001600160a01b03165afa90811562000a2c57829162001277575b602082604051908152f35b90506020813d8211620012a9575b81620012946020938362001344565b8101031262000159576020915051386200126c565b3d915062001285565b5060203660031901126200015d57600435906001600160401b0382116200015d576020620012ee620012e8366004860162001366565b62001433565b604051908152f35b604081019081106001600160401b038211176200131257604052565b634e487b7160e01b600052604160045260246000fd5b60a081019081106001600160401b038211176200131257604052565b90601f801991011681019081106001600160401b038211176200131257604052565b81601f8201121562000416578035906001600160401b0382116200131257604051926200139e601f8401601f19166020018562001344565b828452602083830101116200041657816000926020809301838601378301015290565b600435906001600160a01b03821682036200041657565b35906001600160a01b03821682036200041657565b35906fffffffffffffffffffffffffffffffff821682036200041657565b9081518110156200141d570160200190565b634e487b7160e01b600052603260045260246000fd5b60008091825b81518110156200155a57600160f81b6200145482846200140b565b5160071c166200149457600181018091116200148057915b600019811462001480576001019162001439565b634e487b7160e01b84526011600452602484fd5b600360f91b600760f81b620014aa83856200140b565b5160051c1603620014c857600281018091116200148057916200146c565b620014d481836200140b565b51600490811c600f60f81b16600760f91b03620015125760038201809211620014ff5750916200146c565b634e487b7160e01b855260119052602484fd5b600f60f91b601f60f81b6200152884866200140b565b5160031c16036200154657808201809211620014ff5750916200146c565b60018201809211620014ff5750916200146c565b5050919050565b51906001600160a01b03821682036200041657565b600311156200158157565b634e487b7160e01b600052602160045260246000fd5b919082519283825260005b848110620015c4575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201620015a2565b90602090939293604083526200161662001600825160a0604087015260e086019062001597565b82840151858203603f1901606087015262001597565b608060018060a01b0392836040820151168287015260608101516200163b8162001576565b60a0870152015160c08501529416910152565b6001600160a01b03918216815291166020820152606060408201819052620016799291019062001597565b9056fe604060808152346200030c5762000cb2803803806200001e8162000311565b9283398101906060818303126200030c576200003a816200034d565b916020926200004b8484016200034d565b8584015190936001600160401b0391908282116200030c57019280601f850112156200030c5783519362000089620000838662000362565b62000311565b94808652878601928882840101116200030c578288620000aa93016200037e565b823b15620002b2577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b03199081166001600160a01b0386811691821790935590959194600093909290917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8580a2805115801590620002aa575b620001fb575b50505050507fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103937f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f86865493815196818616885216958684820152a18315620001a95750161790555161085590816200045d8239f35b60849086519062461bcd60e51b82526004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b895194606086019081118682101762000296578a52602785527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c89860152660819985a5b195960ca1b8a86015251620002809493929183918291845af4903d156200028c573d62000270620000838262000362565b90815280938a3d92013e620003a3565b50388080808062000133565b60609250620003a3565b634e487b7160e01b85526041600452602485fd5b50836200012d565b865162461bcd60e51b815260048101879052602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200033757604052565b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200030c57565b6001600160401b0381116200033757601f01601f191660200190565b60005b838110620003925750506000910152565b818101518382015260200162000381565b91929015620004085750815115620003b9575090565b3b15620003c35790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156200041c5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526200044e81518092816024860152602086860191016200037e565b601f01601f19168101030190fdfe60806040526004361015610018575b366100a6576100a6565b6000803560e01c80636e9960c3146100725763aaf10f421461003a575061000e565b3461006f578060031936011261006f57600080516020610800833981519152546040516001600160a01b039091168152602090f35b80fd5b503461006f578060031936011261006f576000805160206107e0833981519152546001600160a01b03166080908152602090f35b6000805160206107e0833981519152546001600160a01b031633036101c6576000356001600160e01b031916631b2ce7f360e11b81036100f157506100e9610426565b602081519101f35b63278f794360e11b810361010d57506101086105c8565b6100e9565b6308f2839760e41b81036101245750610108610350565b6303e1469160e61b810361013b5750610108610275565b635c60da1b60e01b03610150576101086102ae565b60405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a490fd5b60008051602061080083398151915254600090819081906001600160a01b0316368280378136915af43d82803e156101fc573d90f35b3d90fd5b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761023257604052565b610200565b6020810190811067ffffffffffffffff82111761023257604052565b90601f8019910116810190811067ffffffffffffffff82111761023257604052565b61027d610659565b60018060a01b036000805160206107e08339815191525416604051906020820152602081526102ab81610216565b90565b6102b6610659565b60018060a01b036000805160206108008339815191525416604051906020820152602081526102ab81610216565b600435906001600160a01b03821682036102fa57565b600080fd5b60209060031901126102fa576004356001600160a01b03811681036102fa5790565b67ffffffffffffffff811161023257601f01601f191660200190565b6040519061034a82610237565b60008252565b610358610659565b366004116102fa576001600160a01b0380610372366102ff565b166000805160206107e0833981519152917f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f604084549281519084168152846020820152a181156103d2576001600160a01b0319161790556102ab61033d565b60405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b61042e610659565b366004116102fa576001600160a01b03610447366102ff565b166040519061045582610237565b60008252803b156104ec5760008051602061080083398151915280546001600160a01b03191682179055807fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906104e4575b6104ca575b50506040516104c381610237565b6000815290565b6104dc916104d6610660565b916106ba565b5038806104b5565b5060006104b0565b60405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b803b156104ec5760008051602061080083398151915280546001600160a01b0319166001600160a01b0383169081179091557fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906105c0575b6105b1575050565b6105bd916104d6610660565b50565b5060016105a9565b366004116102fa5760403660031901126102fa576105e46102e4565b6024359067ffffffffffffffff82116102fa57366023830112156102fa5781600401359061061182610321565b9161061f6040519384610253565b80835236602482860101116102fa576020816000926024610651970183870137840101526001600160a01b0316610547565b6102ab61033d565b346102fa57565b604051906060820182811067ffffffffffffffff8211176102325760405260278252660819985a5b195960ca1b6040837f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c60208201520152565b6000806102ab9493602081519101845af43d156106f9573d916106dc83610321565b926106ea6040519485610253565b83523d6000602085013e61074d565b60609161074d565b1561070857565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b9192901561076d5750815115610761575090565b6102ab903b1515610701565b8251909150156107805750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b8285106107c6575050604492506000838284010152601f80199101168101030190fd5b84810182015186860160440152938101938593506107a356feb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca2646970667358221220c61acf3b60fe54f1c7b5e35eb3227d4fadb64a46e27a14985085e09c0322a78c64736f6c63430008120033604060808152346200030c5762000cb2803803806200001e8162000311565b9283398101906060818303126200030c576200003a816200034d565b916020926200004b8484016200034d565b8584015190936001600160401b0391908282116200030c57019280601f850112156200030c5783519362000089620000838662000362565b62000311565b94808652878601928882840101116200030c578288620000aa93016200037e565b823b15620002b2577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b03199081166001600160a01b0386811691821790935590959194600093909290917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8580a2805115801590620002aa575b620001fb575b50505050507fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103937f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f86865493815196818616885216958684820152a18315620001a95750161790555161085590816200045d8239f35b60849086519062461bcd60e51b82526004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b895194606086019081118682101762000296578a52602785527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c89860152660819985a5b195960ca1b8a86015251620002809493929183918291845af4903d156200028c573d62000270620000838262000362565b90815280938a3d92013e620003a3565b50388080808062000133565b60609250620003a3565b634e487b7160e01b85526041600452602485fd5b50836200012d565b865162461bcd60e51b815260048101879052602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200033757604052565b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200030c57565b6001600160401b0381116200033757601f01601f191660200190565b60005b838110620003925750506000910152565b818101518382015260200162000381565b91929015620004085750815115620003b9575090565b3b15620003c35790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156200041c5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526200044e81518092816024860152602086860191016200037e565b601f01601f19168101030190fdfe60806040526004361015610018575b366100a6576100a6565b6000803560e01c80636e9960c3146100725763aaf10f421461003a575061000e565b3461006f578060031936011261006f57600080516020610800833981519152546040516001600160a01b039091168152602090f35b80fd5b503461006f578060031936011261006f576000805160206107e0833981519152546001600160a01b03166080908152602090f35b6000805160206107e0833981519152546001600160a01b031633036101c6576000356001600160e01b031916631b2ce7f360e11b81036100f157506100e9610426565b602081519101f35b63278f794360e11b810361010d57506101086105c8565b6100e9565b6308f2839760e41b81036101245750610108610350565b6303e1469160e61b810361013b5750610108610275565b635c60da1b60e01b03610150576101086102ae565b60405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a490fd5b60008051602061080083398151915254600090819081906001600160a01b0316368280378136915af43d82803e156101fc573d90f35b3d90fd5b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761023257604052565b610200565b6020810190811067ffffffffffffffff82111761023257604052565b90601f8019910116810190811067ffffffffffffffff82111761023257604052565b61027d610659565b60018060a01b036000805160206107e08339815191525416604051906020820152602081526102ab81610216565b90565b6102b6610659565b60018060a01b036000805160206108008339815191525416604051906020820152602081526102ab81610216565b600435906001600160a01b03821682036102fa57565b600080fd5b60209060031901126102fa576004356001600160a01b03811681036102fa5790565b67ffffffffffffffff811161023257601f01601f191660200190565b6040519061034a82610237565b60008252565b610358610659565b366004116102fa576001600160a01b0380610372366102ff565b166000805160206107e0833981519152917f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f604084549281519084168152846020820152a181156103d2576001600160a01b0319161790556102ab61033d565b60405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b61042e610659565b366004116102fa576001600160a01b03610447366102ff565b166040519061045582610237565b60008252803b156104ec5760008051602061080083398151915280546001600160a01b03191682179055807fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906104e4575b6104ca575b50506040516104c381610237565b6000815290565b6104dc916104d6610660565b916106ba565b5038806104b5565b5060006104b0565b60405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b803b156104ec5760008051602061080083398151915280546001600160a01b0319166001600160a01b0383169081179091557fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906105c0575b6105b1575050565b6105bd916104d6610660565b50565b5060016105a9565b366004116102fa5760403660031901126102fa576105e46102e4565b6024359067ffffffffffffffff82116102fa57366023830112156102fa5781600401359061061182610321565b9161061f6040519384610253565b80835236602482860101116102fa576020816000926024610651970183870137840101526001600160a01b0316610547565b6102ab61033d565b346102fa57565b604051906060820182811067ffffffffffffffff8211176102325760405260278252660819985a5b195960ca1b6040837f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c60208201520152565b6000806102ab9493602081519101845af43d156106f9573d916106dc83610321565b926106ea6040519485610253565b83523d6000602085013e61074d565b60609161074d565b1561070857565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b9192901561076d5750815115610761575090565b6102ab903b1515610701565b8251909150156107805750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b8285106107c6575050604492506000838284010152601f80199101168101030190fd5b84810182015186860160440152938101938593506107a356feb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca2646970667358221220c61acf3b60fe54f1c7b5e35eb3227d4fadb64a46e27a14985085e09c0322a78c64736f6c63430008120033604060808152346200030c5762000cb2803803806200001e8162000311565b9283398101906060818303126200030c576200003a816200034d565b916020926200004b8484016200034d565b8584015190936001600160401b0391908282116200030c57019280601f850112156200030c5783519362000089620000838662000362565b62000311565b94808652878601928882840101116200030c578288620000aa93016200037e565b823b15620002b2577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b03199081166001600160a01b0386811691821790935590959194600093909290917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8580a2805115801590620002aa575b620001fb575b50505050507fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103937f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f86865493815196818616885216958684820152a18315620001a95750161790555161085590816200045d8239f35b60849086519062461bcd60e51b82526004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b895194606086019081118682101762000296578a52602785527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c89860152660819985a5b195960ca1b8a86015251620002809493929183918291845af4903d156200028c573d62000270620000838262000362565b90815280938a3d92013e620003a3565b50388080808062000133565b60609250620003a3565b634e487b7160e01b85526041600452602485fd5b50836200012d565b865162461bcd60e51b815260048101879052602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200033757604052565b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200030c57565b6001600160401b0381116200033757601f01601f191660200190565b60005b838110620003925750506000910152565b818101518382015260200162000381565b91929015620004085750815115620003b9575090565b3b15620003c35790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156200041c5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526200044e81518092816024860152602086860191016200037e565b601f01601f19168101030190fdfe60806040526004361015610018575b366100a6576100a6565b6000803560e01c80636e9960c3146100725763aaf10f421461003a575061000e565b3461006f578060031936011261006f57600080516020610800833981519152546040516001600160a01b039091168152602090f35b80fd5b503461006f578060031936011261006f576000805160206107e0833981519152546001600160a01b03166080908152602090f35b6000805160206107e0833981519152546001600160a01b031633036101c6576000356001600160e01b031916631b2ce7f360e11b81036100f157506100e9610426565b602081519101f35b63278f794360e11b810361010d57506101086105c8565b6100e9565b6308f2839760e41b81036101245750610108610350565b6303e1469160e61b810361013b5750610108610275565b635c60da1b60e01b03610150576101086102ae565b60405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a490fd5b60008051602061080083398151915254600090819081906001600160a01b0316368280378136915af43d82803e156101fc573d90f35b3d90fd5b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761023257604052565b610200565b6020810190811067ffffffffffffffff82111761023257604052565b90601f8019910116810190811067ffffffffffffffff82111761023257604052565b61027d610659565b60018060a01b036000805160206107e08339815191525416604051906020820152602081526102ab81610216565b90565b6102b6610659565b60018060a01b036000805160206108008339815191525416604051906020820152602081526102ab81610216565b600435906001600160a01b03821682036102fa57565b600080fd5b60209060031901126102fa576004356001600160a01b03811681036102fa5790565b67ffffffffffffffff811161023257601f01601f191660200190565b6040519061034a82610237565b60008252565b610358610659565b366004116102fa576001600160a01b0380610372366102ff565b166000805160206107e0833981519152917f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f604084549281519084168152846020820152a181156103d2576001600160a01b0319161790556102ab61033d565b60405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b61042e610659565b366004116102fa576001600160a01b03610447366102ff565b166040519061045582610237565b60008252803b156104ec5760008051602061080083398151915280546001600160a01b03191682179055807fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906104e4575b6104ca575b50506040516104c381610237565b6000815290565b6104dc916104d6610660565b916106ba565b5038806104b5565b5060006104b0565b60405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b803b156104ec5760008051602061080083398151915280546001600160a01b0319166001600160a01b0383169081179091557fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600080a28151158015906105c0575b6105b1575050565b6105bd916104d6610660565b50565b5060016105a9565b366004116102fa5760403660031901126102fa576105e46102e4565b6024359067ffffffffffffffff82116102fa57366023830112156102fa5781600401359061061182610321565b9161061f6040519384610253565b80835236602482860101116102fa576020816000926024610651970183870137840101526001600160a01b0316610547565b6102ab61033d565b346102fa57565b604051906060820182811067ffffffffffffffff8211176102325760405260278252660819985a5b195960ca1b6040837f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c60208201520152565b6000806102ab9493602081519101845af43d156106f9573d916106dc83610321565b926106ea6040519485610253565b83523d6000602085013e61074d565b60609161074d565b1561070857565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b9192901561076d5750815115610761575090565b6102ab903b1515610701565b8251909150156107805750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b8285106107c6575050604492506000838284010152601f80199101168101030190fd5b84810182015186860160440152938101938593506107a356feb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca2646970667358221220c61acf3b60fe54f1c7b5e35eb3227d4fadb64a46e27a14985085e09c0322a78c64736f6c63430008120033a2646970667358221220bcc33562e939dc7bdad5339987b613ed1f84b2555c831652dc424c4a6be5403a64736f6c63430008120033";

type SubDaoLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SubDaoLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SubDaoLib__factory extends ContractFactory {
  constructor(...args: SubDaoLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SubDaoLib> {
    return super.deploy(overrides || {}) as Promise<SubDaoLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SubDaoLib {
    return super.attach(address) as SubDaoLib;
  }
  override connect(signer: Signer): SubDaoLib__factory {
    return super.connect(signer) as SubDaoLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SubDaoLibInterface {
    return new utils.Interface(_abi) as SubDaoLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SubDaoLib {
    return new Contract(address, _abi, signerOrProvider) as SubDaoLib;
  }
}
