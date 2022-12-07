/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  GoldfinchVault,
  GoldfinchVaultInterface,
} from "../../../../contracts/integrations/goldfinch/GoldfinchVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "enum IVault.VaultType",
        name: "_vaultType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_registrar",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakingPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_crvPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fidu",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gfi",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenDeposited",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtDeposited",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "stakingContract",
        type: "address",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "Harvest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenRedeemed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtRedeemed",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "stakingContract",
        type: "address",
      },
    ],
    name: "Redemption",
    type: "event",
  },
  {
    inputs: [],
    name: "FIDU",
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
    name: "GFI",
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
    name: "USDC",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultType",
    outputs: [
      {
        internalType: "enum IVault.VaultType",
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
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "harvest",
    outputs: [],
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "principleByAccountId",
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
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "tokenIdByAccountId",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002e1438038062002e14833981810160405281019062000037919062000288565b866000806101000a81548160ff021916908360018111156200005e576200005d6200033b565b5b021790555085600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050505050506200036a565b600080fd5b600281106200020957600080fd5b50565b6000815190506200021d81620001fb565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620002508262000223565b9050919050565b620002628162000243565b81146200026e57600080fd5b50565b600081519050620002828162000257565b92915050565b600080600080600080600060e0888a031215620002aa57620002a9620001f6565b5b6000620002ba8a828b016200020c565b9750506020620002cd8a828b0162000271565b9650506040620002e08a828b0162000271565b9550506060620002f38a828b0162000271565b9450506080620003068a828b0162000271565b93505060a0620003198a828b0162000271565b92505060c06200032c8a828b0162000271565b91505092959891949750929550565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b612a9a806200037a6000396000f3fe6080604052600436106100915760003560e01c806375baf37f1161005957806375baf37f1461018757806388bb447b146101b257806389a30271146101db5780639fdafa6d14610206578063e52022691461023157610091565b8063034afe7b14610096578063150b7a02146100c15780631c2a709b146100fe57806320dcd90b1461013b5780634dc2377214610157575b600080fd5b3480156100a257600080fd5b506100ab61026e565b6040516100b89190611bb4565b60405180910390f35b3480156100cd57600080fd5b506100e860048036038101906100e39190611caa565b610294565b6040516100f59190611d6d565b60405180910390f35b34801561010a57600080fd5b5061012560048036038101906101209190611dc4565b6102a9565b6040516101329190611e00565b60405180910390f35b61015560048036038101906101509190611e1b565b6102c1565b005b610171600480360381019061016c9190611e1b565b6108cb565b60405161017e9190611e00565b60405180910390f35b34801561019357600080fd5b5061019c610be2565b6040516101a99190611ee5565b60405180910390f35b3480156101be57600080fd5b506101d960048036038101906101d49190611f56565b610bf8565b005b3480156101e757600080fd5b506101f0610f85565b6040516101fd9190611bb4565b60405180910390f35b34801561021257600080fd5b5061021b610fab565b6040516102289190611bb4565b60405180910390f35b34801561023d57600080fd5b5061025860048036038101906102539190611dc4565b610fd1565b6040516102659190611e00565b60405180910390f35b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600063150b7a0260e01b905095945050505050565b60076020528060005260406000206000915090505481565b6102c9610fe9565b610308576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ff90612000565b60405180910390fd5b81600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610399576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103909061206c565b60405180910390fd5b60006103a36110bd565b905060006103b560006001868561115d565b9050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16866040518363ffffffff1660e01b815260040161043692919061208c565b6020604051808303816000875af1158015610455573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047991906120ed565b506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635b41b9086000600188866040518563ffffffff1660e01b81526004016104df949392919061219a565b6020604051808303816000875af11580156104fe573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052291906121f4565b90506000600660008963ffffffff1663ffffffff16815260200190815260200160002054141561071457600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16876040518363ffffffff1660e01b81526004016105cb92919061208c565b6020604051808303816000875af11580156105ea573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061060e91906120ed565b506000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166310087fb18360006040518363ffffffff1660e01b815260040161066f929190612269565b6020604051808303816000875af115801561068e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106b291906121f4565b905085600760008a63ffffffff1663ffffffff16815260200190815260200160002060008282546106e391906122c1565b9250508190555080600660008a63ffffffff1663ffffffff16815260200190815260200160002081905550506108c2565b6000600660008963ffffffff1663ffffffff168152602001908152602001600020549050600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518363ffffffff1660e01b81526004016107b792919061208c565b6020604051808303816000875af11580156107d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107fa91906120ed565b50600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9f4939d82846040518363ffffffff1660e01b8152600401610858929190612317565b600060405180830381600087803b15801561087257600080fd5b505af1158015610886573d6000803e3d6000fd5b5050505085600760008a63ffffffff1663ffffffff16815260200190815260200160002060008282546108b991906122c1565b92505081905550505b50505050505050565b60006108d5610fe9565b610914576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161090b90612000565b60405180910390fd5b82600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146109a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161099c9061206c565b60405180910390fd5b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610a14573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610a3d91906125b1565b90506000610a4a87611230565b9050610a5587611402565b6000610a618887611692565b90506000821115610b2f576000610a7883836119c2565b9050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8560400151836040518363ffffffff1660e01b8152600401610adb92919061208c565b6020604051808303816000875af1158015610afa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b1e91906120ed565b508082610b2b91906125fa565b9150505b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b38460a00151836040518363ffffffff1660e01b8152600401610b9092919061208c565b6020604051808303816000875af1158015610baf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bd391906120ed565b50809450505050509392505050565b60008060009054906101000a900460ff16905090565b610c00610fe9565b610c3f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3690612000565b60405180910390fd5b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610cae573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610cd791906125b1565b905060005b83839050811015610f7f57610d17848483818110610cfd57610cfc61262e565b5b9050602002016020810190610d129190611dc4565b611402565b6000610d49858584818110610d2f57610d2e61262e565b5b9050602002016020810190610d449190611dc4565b611230565b90506000811115610f6b576000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663eb02c30160066000898988818110610dab57610daa61262e565b5b9050602002016020810190610dc09190611dc4565b63ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b8152600401610df79190611e00565b61018060405180830381865afa158015610e15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e3991906127db565b90506000610e4e600160008460000151611aaa565b90506000620f424084838560000151610e679190612838565b610e719190612869565b610e7b9190612838565b90506000610e8985836119c2565b90506000610ebe8a8a89818110610ea357610ea261262e565b5b9050602002016020810190610eb89190611dc4565b83611692565b9050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8960400151836040518363ffffffff1660e01b8152600401610f2192919061208c565b6020604051808303816000875af1158015610f40573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f6491906120ed565b5050505050505b508080610f77906128c3565b915050610cdc565b50505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60066020528060005260406000206000915090505481565b600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611059573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061108291906125b1565b90503373ffffffffffffffffffffffffffffffffffffffff168160a0015173ffffffffffffffffffffffffffffffffffffffff161491505090565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630dcfe5fa6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561112c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111509190612984565b6000015160000151905090565b600080600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663556d6e9f8787876040518463ffffffff1660e01b81526004016111bf939291906129b1565b602060405180830381865afa1580156111dc573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061120091906121f4565b9050606483826112109190612869565b61121a9190612838565b8161122591906125fa565b915050949350505050565b600080600760008463ffffffff1663ffffffff1681526020019081526020016000205490506000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663eb02c301600660008763ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b81526004016112d19190611e00565b61018060405180830381865afa1580156112ef573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061131391906127db565b90506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663556d6e9f6001600085600001516040518463ffffffff1660e01b815260040161137c939291906129e8565b602060405180830381865afa158015611399573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113bd91906121f4565b90508281106113f55782620f424084836113d791906125fa565b6113e19190612869565b6113eb9190612838565b93505050506113fd565b600093505050505b919050565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631c4b774b600660008463ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b815260040161147c9190611e00565b600060405180830381600087803b15801561149657600080fd5b505af11580156114aa573d6000803e3d6000fd5b505050506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161150b9190611bb4565b602060405180830381865afa158015611528573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061154c91906121f4565b90506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156115bd573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906115e691906125b1565b9050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8260400151846040518363ffffffff1660e01b815260040161164992919061208c565b6020604051808303816000875af1158015611668573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061168c91906120ed565b50505050565b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663eb02c301600660008763ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b815260040161170f9190611e00565b61018060405180830381865afa15801561172d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061175191906127db565b90506000611766600160008460000151611aaa565b9050600081620f42408661177a9190612869565b6117849190612838565b9050600061179d60016000846117986110bd565b61115d565b9050600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639e2c8a5b600660008a63ffffffff1663ffffffff16815260200190815260200160002054846040518363ffffffff1660e01b815260040161181b929190612317565b600060405180830381600087803b15801561183557600080fd5b505af1158015611849573d6000803e3d6000fd5b50505050600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518363ffffffff1660e01b81526004016118cc92919061208c565b6020604051808303816000875af11580156118eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061190f91906120ed565b50600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635b41b9086001600085856040518563ffffffff1660e01b81526004016119739493929190612a1f565b6020604051808303816000875af1158015611992573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119b691906121f4565b94505050505092915050565b600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611a32573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190611a5b91906125b1565b9050620f4240816020015163ffffffff16826000015163ffffffff168587611a839190612869565b611a8d9190612869565b611a979190612838565b611aa19190612838565b91505092915050565b600080600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663556d6e9f8686866040518463ffffffff1660e01b8152600401611b0c939291906129b1565b602060405180830381865afa158015611b29573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b4d91906121f4565b905082620f424082611b5f9190612869565b611b699190612838565b9150509392505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611b9e82611b73565b9050919050565b611bae81611b93565b82525050565b6000602082019050611bc96000830184611ba5565b92915050565b6000604051905090565b600080fd5b600080fd5b611bec81611b93565b8114611bf757600080fd5b50565b600081359050611c0981611be3565b92915050565b6000819050919050565b611c2281611c0f565b8114611c2d57600080fd5b50565b600081359050611c3f81611c19565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f840112611c6a57611c69611c45565b5b8235905067ffffffffffffffff811115611c8757611c86611c4a565b5b602083019150836001820283011115611ca357611ca2611c4f565b5b9250929050565b600080600080600060808688031215611cc657611cc5611bd9565b5b6000611cd488828901611bfa565b9550506020611ce588828901611bfa565b9450506040611cf688828901611c30565b935050606086013567ffffffffffffffff811115611d1757611d16611bde565b5b611d2388828901611c54565b92509250509295509295909350565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611d6781611d32565b82525050565b6000602082019050611d826000830184611d5e565b92915050565b600063ffffffff82169050919050565b611da181611d88565b8114611dac57600080fd5b50565b600081359050611dbe81611d98565b92915050565b600060208284031215611dda57611dd9611bd9565b5b6000611de884828501611daf565b91505092915050565b611dfa81611c0f565b82525050565b6000602082019050611e156000830184611df1565b92915050565b600080600060608486031215611e3457611e33611bd9565b5b6000611e4286828701611daf565b9350506020611e5386828701611bfa565b9250506040611e6486828701611c30565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60028110611eae57611ead611e6e565b5b50565b6000819050611ebf82611e9d565b919050565b6000611ecf82611eb1565b9050919050565b611edf81611ec4565b82525050565b6000602082019050611efa6000830184611ed6565b92915050565b60008083601f840112611f1657611f15611c45565b5b8235905067ffffffffffffffff811115611f3357611f32611c4a565b5b602083019150836020820283011115611f4f57611f4e611c4f565b5b9250929050565b60008060208385031215611f6d57611f6c611bd9565b5b600083013567ffffffffffffffff811115611f8b57611f8a611bde565b5b611f9785828601611f00565b92509250509250929050565b600082825260208201905092915050565b7f4e6f7420617070726f76656420526f7574657200000000000000000000000000600082015250565b6000611fea601383611fa3565b9150611ff582611fb4565b602082019050919050565b6000602082019050818103600083015261201981611fdd565b9050919050565b7f4f6e6c7920555344432061636365707465640000000000000000000000000000600082015250565b6000612056601283611fa3565b915061206182612020565b602082019050919050565b6000602082019050818103600083015261208581612049565b9050919050565b60006040820190506120a16000830185611ba5565b6120ae6020830184611df1565b9392505050565b60008115159050919050565b6120ca816120b5565b81146120d557600080fd5b50565b6000815190506120e7816120c1565b92915050565b60006020828403121561210357612102611bd9565b5b6000612111848285016120d8565b91505092915050565b6000819050919050565b6000819050919050565b600061214961214461213f8461211a565b612124565b611c0f565b9050919050565b6121598161212e565b82525050565b6000819050919050565b600061218461217f61217a8461215f565b612124565b611c0f565b9050919050565b61219481612169565b82525050565b60006080820190506121af6000830187612150565b6121bc602083018661218b565b6121c96040830185611df1565b6121d66060830184611df1565b95945050505050565b6000815190506121ee81611c19565b92915050565b60006020828403121561220a57612209611bd9565b5b6000612218848285016121df565b91505092915050565b6002811061223257612231611e6e565b5b50565b600081905061224382612221565b919050565b600061225382612235565b9050919050565b61226381612248565b82525050565b600060408201905061227e6000830185611df1565b61228b602083018461225a565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006122cc82611c0f565b91506122d783611c0f565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561230c5761230b612292565b5b828201905092915050565b600060408201905061232c6000830185611df1565b6123396020830184611df1565b9392505050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61238e82612345565b810181811067ffffffffffffffff821117156123ad576123ac612356565b5b80604052505050565b60006123c0611bcf565b90506123cc8282612385565b919050565b600080fd5b6000815190506123e581611d98565b92915050565b6000815190506123fa81611be3565b92915050565b600080fd5b600067ffffffffffffffff8211156124205761241f612356565b5b61242982612345565b9050602081019050919050565b60005b83811015612454578082015181840152602081019050612439565b83811115612463576000848401525b50505050565b600061247c61247784612405565b6123b6565b90508281526020810184848401111561249857612497612400565b5b6124a3848285612436565b509392505050565b600082601f8301126124c0576124bf611c45565b5b81516124d0848260208601612469565b91505092915050565b600060c082840312156124ef576124ee612340565b5b6124f960c06123b6565b90506000612509848285016123d6565b600083015250602061251d848285016123d6565b6020830152506040612531848285016123eb565b604083015250606082015167ffffffffffffffff811115612555576125546123d1565b5b612561848285016124ab565b606083015250608082015167ffffffffffffffff811115612585576125846123d1565b5b612591848285016124ab565b60808301525060a06125a5848285016123eb565b60a08301525092915050565b6000602082840312156125c7576125c6611bd9565b5b600082015167ffffffffffffffff8111156125e5576125e4611bde565b5b6125f1848285016124d9565b91505092915050565b600061260582611c0f565b915061261083611c0f565b92508282101561262357612622612292565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600060c0828403121561267357612672612340565b5b61267d60c06123b6565b9050600061268d848285016121df565b60008301525060206126a1848285016121df565b60208301525060406126b5848285016121df565b60408301525060606126c9848285016121df565b60608301525060806126dd848285016121df565b60808301525060a06126f1848285016121df565b60a08301525092915050565b6002811061270a57600080fd5b50565b60008151905061271c816126fd565b92915050565b6000610180828403121561273957612738612340565b5b61274360e06123b6565b90506000612753848285016121df565b60008301525060206127678482850161265d565b60208301525060e061277b848285016121df565b604083015250610100612790848285016121df565b6060830152506101206127a58482850161270d565b6080830152506101406127ba848285016121df565b60a0830152506101606127cf848285016121df565b60c08301525092915050565b600061018082840312156127f2576127f1611bd9565b5b600061280084828501612722565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061284382611c0f565b915061284e83611c0f565b92508261285e5761285d612809565b5b828204905092915050565b600061287482611c0f565b915061287f83611c0f565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156128b8576128b7612292565b5b828202905092915050565b60006128ce82611c0f565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561290157612900612292565b5b600182019050919050565b60006020828403121561292257612921612340565b5b61292c60206123b6565b9050600061293c848285016121df565b60008301525092915050565b60006020828403121561295e5761295d612340565b5b61296860206123b6565b905060006129788482850161290c565b60008301525092915050565b60006020828403121561299a57612999611bd9565b5b60006129a884828501612948565b91505092915050565b60006060820190506129c66000830186611df1565b6129d36020830185611df1565b6129e06040830184611df1565b949350505050565b60006060820190506129fd600083018661218b565b612a0a6020830185612150565b612a176040830184611df1565b949350505050565b6000608082019050612a34600083018761218b565b612a416020830186612150565b612a4e6040830185611df1565b612a5b6060830184611df1565b9594505050505056fea26469706673582212202463371b18f22e3928234d76229c68ef7f7b2fd5b94d05e855a27c0be61cb23964736f6c634300080a0033";

type GoldfinchVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GoldfinchVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GoldfinchVault__factory extends ContractFactory {
  constructor(...args: GoldfinchVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _vaultType: PromiseOrValue<BigNumberish>,
    _registrar: PromiseOrValue<string>,
    _stakingPool: PromiseOrValue<string>,
    _crvPool: PromiseOrValue<string>,
    _usdc: PromiseOrValue<string>,
    _fidu: PromiseOrValue<string>,
    _gfi: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GoldfinchVault> {
    return super.deploy(
      _vaultType,
      _registrar,
      _stakingPool,
      _crvPool,
      _usdc,
      _fidu,
      _gfi,
      overrides || {}
    ) as Promise<GoldfinchVault>;
  }
  override getDeployTransaction(
    _vaultType: PromiseOrValue<BigNumberish>,
    _registrar: PromiseOrValue<string>,
    _stakingPool: PromiseOrValue<string>,
    _crvPool: PromiseOrValue<string>,
    _usdc: PromiseOrValue<string>,
    _fidu: PromiseOrValue<string>,
    _gfi: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vaultType,
      _registrar,
      _stakingPool,
      _crvPool,
      _usdc,
      _fidu,
      _gfi,
      overrides || {}
    );
  }
  override attach(address: string): GoldfinchVault {
    return super.attach(address) as GoldfinchVault;
  }
  override connect(signer: Signer): GoldfinchVault__factory {
    return super.connect(signer) as GoldfinchVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GoldfinchVaultInterface {
    return new utils.Interface(_abi) as GoldfinchVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GoldfinchVault {
    return new Contract(address, _abi, signerOrProvider) as GoldfinchVault;
  }
}
