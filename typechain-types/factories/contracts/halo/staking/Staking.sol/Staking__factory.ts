/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Staking,
  StakingInterface,
} from "../../../../../contracts/halo/staking/Staking.sol/Staking";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
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
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
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
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Unstaked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "haloToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "haloToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "interestRate",
            type: "uint256",
          },
        ],
        internalType: "struct Staking.InstantiateMsg",
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
    name: "interestRate",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "stake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "stakeFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakeInfos",
    outputs: [
      {
        internalType: "bool",
        name: "started",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "startTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimed",
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
        name: "",
        type: "address",
      },
    ],
    name: "stakeNumber",
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
    inputs: [],
    name: "supportsHistory",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStaked",
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
        name: "",
        type: "address",
      },
    ],
    name: "totalStakedFor",
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
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakeId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "interestRate",
        type: "uint256",
      },
    ],
    name: "updateInterestRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60803462000380576001600160401b0390604090808201838111828210176200036a5782526011815260207029ba30b5b2b2102430b637902a37b5b2b760791b81830152825193838501858110828211176200036a578452600385526214d21560ea1b8286015282518181116200036a576004928354916001958684811c941680156200035f575b838510146200034a578190601f94858111620002f4575b5083908583116001146200028c5760009262000280575b5050600019600383901b1c191690861b1784555b86519283116200026b576005938454908682811c9216801562000260575b838310146200024b575082811162000202575b508091831160011462000196575081929394956000926200018a575b5050600019600383901b1c191690831b1790555b6006805460ff1916905560075560088054336001600160a01b0319821681179092559151916001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3611aff9081620003868239f35b01519050388062000116565b90601f198316968460005282600020926000905b898210620001ea5750508386979896959610620001d0575b505050811b0190556200012a565b015160001960f88460031b161c19169055388080620001c2565b808885968294968601518155019501930190620001aa565b846000528160002083808601871c82019284871062000241575b01861c019086905b82811062000234575050620000fa565b6000815501869062000224565b925081926200021c565b602290634e487b7160e01b6000525260246000fd5b91607f1691620000e7565b604184634e487b7160e01b6000525260246000fd5b015190503880620000b5565b90889350601f1983169188600052856000209260005b87828210620002dd5750508411620002c3575b505050811b018455620000c9565b015160001960f88460031b161c19169055388080620002b5565b8385015186558c97909501949384019301620002a2565b90915086600052836000208580850160051c82019286861062000340575b918a91869594930160051c01915b828110620003305750506200009e565b600081558594508a910162000320565b9250819262000312565b602286634e487b7160e01b6000525260246000fd5b93607f169362000087565b634e487b7160e01b600052604160045260246000fd5b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146113ff57508163095ea7b3146113d55781630e89439b146111d75781630ef9635614610fd157816318160ddd14610fb257816323b872dd14610ee65781632e8ddde614610ebd578163313ce56714610ea15781633950935114610e515781633f4ba83a14610dae5781634196ace214610d765781634b341aed14610d3e5781635c975abb14610d1a5781637033e4a614610cff57816370a0823114610cc7578163715018a614610c6a578163752a50a614610bf957816377b3492714610a3c5781637c3a00fd14610a1d578163817b1cd2146109fe5781638456cb59146109965781638da5cb5b1461096d57816395d89b4114610852578163a457c2d7146107aa578163a9059cbb14610779578163cd6ef9b114610325578163dd62ed3e146102dc578163f2fde38b14610210578163fa14a50d1461019a575063fc0c546a1461016f57600080fd5b3461019657816003193601126101965760095490516001600160a01b039091168152602090f35b5080fd5b9190503461020c578060031936011261020c5760a09281906001600160a01b036101c2611531565b168152600c60205281812060243582526020522060ff8154169260018201549260028301549160038401549301549381519515158652602086015284015260608301526080820152f35b8280fd5b90503461020c57602036600319011261020c5761022b611531565b9061023461160d565b6001600160a01b0391821692831561028a575050600854826bffffffffffffffffffffffff60a01b821617600855167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b505034610196578060031936011261019657806020926102fa611531565b61030261154c565b6001600160a01b0391821683526002865283832091168252845220549051908152f35b8391503461019657606036600319011261019657803590602493843594604492833567ffffffffffffffff81116107755761036390369083016115b6565b9361036c6118fa565b338752602097600c8952848820818952895260ff85892054161561074357338852600c895284882081895289526002858920015442111561071157338852600c895284882081895289526103db6003868a200154338a52600c8b52868a20838b528b5284878b20015490611abc565b87116106e057338852600c895284882090885288528184882001610400878254611665565b9055600a548087029087820414871517156106ce576064610422910487611665565b60095485516370a0823160e01b815230858201526001600160a01b0390911691908a818781865afa9081156106c4579082918b9161068f575b5010610632578891838b928851948593849263a9059cbb60e01b8452338a8501528a8401525af1908115610628579061049b9189916105fb575b50611968565b33156105b257338752600188528387205492868410610566575050508394957faf01bfc8475df280aca00b578c4a948e6d95700f0db8c13365240f7f973c875494600e9233895260018352038388205585600354036003558683518781527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef833392a3338752818152828720610532878254611abc565b905561054086600b54611abc565b600b553387525261055b8186205491519283923396846119b5565b0390a2600160075580f35b845162461bcd60e51b81529283018990526022908301527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e9082015261636560f01b6064820152608490fd5b60217f45524332303a206275726e2066726f6d20746865207a65726f20616464726573929389608496519562461bcd60e51b8752860152840152820152607360f81b6064820152fd5b61061b91508a3d8c11610621575b6106138183611594565b810190611950565b8a610495565b503d610609565b85513d8a823e3d90fd5b855162461bcd60e51b81528085018b90526033818701527f496e73756666696369656e742068616c6f20746f6b656e2062616c616e63652081850152721a5b881cdd185ada5b99c818dbdb9d1c9858dd606a1b6064820152608490fd5b8092508c8092503d83116106bd575b6106a88183611594565b810103126106b9578190518c61045b565b8980fd5b503d61069e565b87513d8c823e3d90fd5b634e487b7160e01b8852601183528388fd5b50600e6d125b9d985b1a5908185b5bdd5b9d60921b929389606496519562461bcd60e51b8752860152840152820152fd5b50600f6e14dd185ad9481b9bdd08195b991959608a1b929389606496519562461bcd60e51b8752860152840152820152fd5b50600f6e14dd185ad9481b9bdd08199bdd5b99608a1b929389606496519562461bcd60e51b8752860152840152820152fd5b8680fd5b5050346101965780600319360112610196576020906107a3610799611531565b6024359033611688565b5160018152f35b9050823461084f578260031936011261084f576107c5611531565b918360243592338152600260205281812060018060a01b03861682526020522054908282106107fe576020856107a385850387336117f8565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b82843461084f578060031936011261084f578151918160055492600184811c91818616958615610963575b6020968785108114610950578899509688969785829a5291826000146109295750506001146108cd575b5050506108c992916108ba910385611594565b519282849384528301906114f1565b0390f35b9190869350600583527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db05b82841061091157505050820101816108ba6108c96108a7565b8054848a0186015288955087949093019281016108f8565b60ff19168782015293151560051b860190930193508492506108ba91506108c990506108a7565b634e487b7160e01b835260228a52602483fd5b92607f169261087d565b50503461019657816003193601126101965760085490516001600160a01b039091168152602090f35b50503461019657816003193601126101965760207f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258916109d46118fa565b6109dc61160d565b6109e46119d4565b600160ff19600654161760065551338152a1600160075580f35b505034610196578160031936011261019657602090600b549051908152f35b505034610196578160031936011261019657602090600a549051908152f35b90503461020c578160031936011261020c5781519082820182811067ffffffffffffffff821117610be6578352610a71611531565b82526020820191602435835284549260ff8460081c161593848095610bd9575b8015610bc2575b15610b685760ff198116600117875584610b57575b5081516001600160a01b039390841615610b22575051600a5551166bffffffffffffffffffffffff60a01b600954161760095582600b55610aec575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b606490602087519162461bcd60e51b8352820152600f60248201526e496e76616c6964206164647265737360881b6044820152fd5b61ffff191661010117865538610aad565b855162461bcd60e51b8152602081860152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b158015610a985750600160ff821614610a98565b50600160ff821610610a91565b634e487b7160e01b855260418252602485fd5b9190503461020c57602036600319011261020c57610c156118fa565b610c1d61160d565b6064823511610c2f5782600160075580f35b906020606492519162461bcd60e51b83528201526015602482015274496e76616c696420696e746572657374207261746560581b6044820152fd5b833461084f578060031936011261084f57610c8361160d565b600880546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5050346101965760203660031901126101965760209181906001600160a01b03610cef611531565b1681526001845220549051908152f35b50503461019657816003193601126101965751908152602090f35b50503461019657816003193601126101965760209060ff6006541690519015158152f35b5050346101965760203660031901126101965760209181906001600160a01b03610d66611531565b168152600e845220549051908152f35b5050346101965760203660031901126101965760209181906001600160a01b03610d9e611531565b168152600d845220549051908152f35b90503461020c578260031936011261020c57610dc86118fa565b610dd061160d565b6006549060ff821615610e17575060ff1916600655513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a1600160075580f35b606490602084519162461bcd60e51b8352820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152fd5b5050346101965780600319360112610196576107a3602092610e9a610e74611531565b338352600286528483206001600160a01b03821684528652918490205460243590611665565b90336117f8565b5050346101965781600319360112610196576020905160128152f35b50503461019657816003193601126101965760095490516001600160a01b039091168152602090f35b8391503461019657606036600319011261019657610f02611531565b610f0a61154c565b6001600160a01b03821684526002602090815285852033865290529284902054604435939260018201610f46575b6020866107a3878787611688565b848210610f6f5750918391610f64602096956107a3950333836117f8565b919394819350610f38565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346101965781600319360112610196576020906003549051908152f35b83833461019657606036600319011261019657610fec611531565b916024359260443567ffffffffffffffff811161020c5761101090369087016115b6565b6110186118fa565b6110206119d4565b60095484516323b872dd60e01b815233888201908152306020808301919091526040820189905297926001600160a01b039291899183918290036060019082908a9087165af19081156111cd579061107e9187916111b65750611968565b831692838552600d875285852061109581546119a6565b90556276a70042018042116111a3579161117281869593898b9c88829d7fc65e53b88159e7d2c0fc12a0600072e28ae53ff73b4c1715369c30f160935142998d6111318651966110e488611562565b600188528488019242845281890194855260608901958b875260808a01978289528252600c815282822090600d8152838320548352522096511515879060ff801983541691151516179055565b51600186015551600285015551600384015551910155868952600e8c5289892061115c838254611665565b905561116a82600b54611665565b600b55611a18565b838652600e895261118c87872054928851938493846119b5565b0390a28152600d8452205490600160075551908152f35b634e487b7160e01b865260118952602486fd5b61061b9150893d8b11610621576106138183611594565b87513d88823e3d90fd5b83833461019657806003193601126101965782359160243567ffffffffffffffff81116101965761120c8491369087016115b6565b6112146119d4565b61121c6118fa565b60095484516323b872dd60e01b8152338189019081523060208281019190915260408201989098529091879183916001600160a01b03169082908890829060600103925af19081156113cb57906112799185916113ae5750611968565b338352600d855283832061128d81546119a6565b90556276a700420180421161139b57907fc65e53b88159e7d2c0fc12a0600072e28ae53ff73b4c1715369c30f160935142918596978651916112ce83611562565b600183528983019042825288840190815260608401908782526080850192898452338a52600c8d528c600d8c8c2091528b8b20548b528d526113228b8b2096511515879060ff801983541691151516179055565b51600186015551600285015551600384015551910155338452600e875284842061134d848254611665565b905561135b83600b54611665565b600b556113688333611a18565b338452600e87528484205461138386519283923396846119b5565b0390a2338152600d8452205490600160075551908152f35b634e487b7160e01b845260118752602484fd5b6113c59150873d8911610621576106138183611594565b88610495565b85513d86823e3d90fd5b5050346101965780600319360112610196576020906107a36113f5611531565b60243590336117f8565b84843461019657816003193601126101965781845492600184811c918186169586156114e7575b6020968785108114610950579087899a92868b999a9b5291826000146114bd575050600114611462575b85886108c9896108ba848a0385611594565b815286935091907f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8284106114a557505050820101816108ba6108c988611450565b8054848a01860152889550879490930192810161148b565b60ff19168882015294151560051b870190940194508593506108ba92506108c99150899050611450565b92607f1692611426565b919082519283825260005b84811061151d575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016114fc565b600435906001600160a01b038216820361154757565b600080fd5b602435906001600160a01b038216820361154757565b60a0810190811067ffffffffffffffff82111761157e57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761157e57604052565b81601f820112156115475780359067ffffffffffffffff821161157e57604051926115eb601f8401601f191660200185611594565b8284526020838301011161154757816000926020809301838601378301015290565b6008546001600160a01b0316330361162157565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b9190820180921161167257565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b039081169182156117a55716918215611754576000828152600160205260408120549180831061170057604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef95876020965260018652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b039081169182156118a957169182156118595760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260028252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fd5b60026007541461190b576002600755565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b90816020910312611547575180151581036115475790565b1561196f57565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b60001981146116725760010190565b6119d193926060928252602082015281604082015201906114f1565b90565b60ff600654166119e057565b60405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606490fd5b6001600160a01b0316908115611a77577fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602082611a5a600094600354611665565b6003558484526001825260408420818154019055604051908152a3565b60405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606490fd5b919082039182116116725756fea264697066735822122068dea61597a0593967fa383278a0105f33f555ecdb5d4c934ce6a8e0761294bd64736f6c63430008120033";

type StakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Staking__factory extends ContractFactory {
  constructor(...args: StakingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Staking> {
    return super.deploy(overrides || {}) as Promise<Staking>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Staking {
    return super.attach(address) as Staking;
  }
  override connect(signer: Signer): Staking__factory {
    return super.connect(signer) as Staking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new utils.Interface(_abi) as StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Staking {
    return new Contract(address, _abi, signerOrProvider) as Staking;
  }
}
