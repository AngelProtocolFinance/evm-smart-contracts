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
        name: "usdcP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fiduP",
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
        name: "accountId",
        type: "uint32",
      },
    ],
    name: "redeemAll",
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
  "0x60806040523480156200001157600080fd5b5060405162002635380380620026358339810160408190526200003491620000fb565b6000805488919060ff19166001838181111562000055576200005562000195565b0217905550600380546001600160a01b039788166001600160a01b031991821617909155600580549688169682169690961790955560048054948716948616949094179093556000805492861661010002610100600160a81b031990931692909217909155600180549185169184169190911790556002805491909316911617905550620001ab565b80516001600160a01b0381168114620000f657600080fd5b919050565b600080600080600080600060e0888a0312156200011757600080fd5b8751600281106200012757600080fd5b96506200013760208901620000de565b95506200014760408901620000de565b94506200015760608901620000de565b93506200016760808901620000de565b92506200017760a08901620000de565b91506200018760c08901620000de565b905092959891949750929550565b634e487b7160e01b600052602160045260246000fd5b61247a80620001bb6000396000f3fe60806040526004361061009c5760003560e01c806375baf37f1161006457806375baf37f146101a257806388bb447b146101c257806389a30271146101e25780639fdafa6d14610207578063c2ec3be614610227578063e52022691461023a57600080fd5b8063034afe7b146100a1578063150b7a02146100de5780631c2a709b1461012357806320dcd90b1461016c5780634dc2377214610181575b600080fd5b3480156100ad57600080fd5b506002546100c1906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100ea57600080fd5b5061010a6100f9366004611ca2565b630a85bd0160e11b95945050505050565b6040516001600160e01b031990911681526020016100d5565b34801561012f57600080fd5b5061015761013e366004611d53565b6007602052600090815260409020805460019091015482565b604080519283526020830191909152016100d5565b61017f61017a366004611d77565b610267565b005b61019461018f366004611d77565b610717565b6040519081526020016100d5565b3480156101ae57600080fd5b5060005460ff166040516100d59190611dec565b3480156101ce57600080fd5b5061017f6101dd366004611dff565b610a5b565b3480156101ee57600080fd5b506000546100c19061010090046001600160a01b031681565b34801561021357600080fd5b506001546100c1906001600160a01b031681565b610194610235366004611d53565b61111f565b34801561024657600080fd5b50610194610255366004611d53565b60066020526000908152604090205481565b61026f611130565b8061027d575061027d6111c3565b6102bd5760405162461bcd60e51b815260206004820152600c60248201526b139bdd08185c1c1c9bdd995960a21b60448201526064015b60405180910390fd5b60005482906001600160a01b0380831661010090920416146103165760405162461bcd60e51b815260206004820152601260248201527113db9b1e481554d110c81858d8d95c1d195960721b60448201526064016102b4565b6000610320611298565b9050600061033260006001868561130d565b6000546004805460405163095ea7b360e01b81529394506001600160a01b0361010090930483169363095ea7b39361036f93921691899101611e74565b6020604051808303816000875af115801561038e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b29190611ea2565b5060048054604051630b68372160e31b815260009281018390526001602482015260448101879052606481018490526001600160a01b0390911690635b41b908906084016020604051808303816000875af1158015610415573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104399190611ebd565b63ffffffff8816600090815260066020526040812054919250036105be5760015460055460405163095ea7b360e01b81526001600160a01b039283169263095ea7b39261048d929116908590600401611e74565b6020604051808303816000875af11580156104ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d09190611ea2565b506005546040516310087fb160e01b81526000916001600160a01b0316906310087fb1906105049085908590600401611ed6565b6020604051808303816000875af1158015610523573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105479190611ebd565b63ffffffff8916600090815260076020526040812080549293508892909190610571908490611f09565b909155505063ffffffff88166000908152600760205260408120600101805484929061059e908490611f09565b909155505063ffffffff881660009081526006602052604090205561070e565b63ffffffff87166000908152600660205260409081902054600154600554925163095ea7b360e01b815291926001600160a01b039182169263095ea7b39261060c9216908690600401611e74565b6020604051808303816000875af115801561062b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064f9190611ea2565b5060055460405163a9f4939d60e01b815260048101839052602481018490526001600160a01b039091169063a9f4939d90604401600060405180830381600087803b15801561069d57600080fd5b505af11580156106b1573d6000803e3d6000fd5b5050505063ffffffff8816600090815260076020526040812080548892906106da908490611f09565b909155505063ffffffff881660009081526007602052604081206001018054849290610707908490611f09565b9091555050505b50505050505050565b6000610721611130565b6107635760405162461bcd60e51b81526020600482015260136024820152722737ba1030b8383937bb32b2102937baba32b960691b60448201526064016102b4565b60005483906001600160a01b0380831661010090920416146107bc5760405162461bcd60e51b815260206004820152601260248201527113db9b1e481554d110c81858d8d95c1d195960721b60448201526064016102b4565b60035460408051635c77d24760e11b815290516000926001600160a01b03169163b8efa48e91600480830192869291908290030181865afa158015610805573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261082d9190810190612079565b9050600061083a876113b7565b905061084587611515565b6000806108528988611707565b909250905082156108ff576000610869848461188a565b600054604087810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb916108a5918590600401611e74565b6020604051808303816000875af11580156108c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108e89190611ea2565b6108f157600080fd5b6108fb818461214e565b9250505b63ffffffff8916600090815260076020526040812060010154908161092e69d3c21bcecceda100000085612165565b6109389190612184565b63ffffffff8c166000908152600760205260408120549192509069d3c21bcecceda1000000906109689084612165565b6109729190612184565b63ffffffff8d1660009081526007602052604081206001018054929350869290919061099f90849061214e565b909155505063ffffffff8c16600090815260076020526040812080548392906109c990849061214e565b909155505060005460a088015160405163095ea7b360e01b81526101009092046001600160a01b03169163095ea7b391610a07918990600401611e74565b6020604051808303816000875af1158015610a26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4a9190611ea2565b50939b9a5050505050505050505050565b610a63611130565b610aa55760405162461bcd60e51b81526020600482015260136024820152722737ba1030b8383937bb32b2102937baba32b960691b60448201526064016102b4565b60035460408051635c77d24760e11b815290516000926001600160a01b03169163b8efa48e91600480830192869291908290030181865afa158015610aee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b169190810190612079565b905060005b8281101561111957610b52848483818110610b3857610b386121a6565b9050602002016020810190610b4d9190611d53565b611515565b6000610b83858584818110610b6957610b696121a6565b9050602002016020810190610b7e9190611d53565b6113b7565b90508015611106576005546000906001600160a01b031663eb02c301600683898988818110610bb457610bb46121a6565b9050602002016020810190610bc99190611d53565b63ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b8152600401610c0291815260200190565b61018060405180830381865afa158015610c20573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c4491906121d4565b90506000610c5960016000846000015161195d565b9050600069d3c21bcecceda1000000848369d3c21bcecceda10000008660000151610c849190612165565b610c8e9190612184565b610c989190612165565b610ca29190612184565b90506000610cb0858361188a565b90506000805460ff166001811115610cca57610cca611db8565b03611044576003546040805163edbcc59960e01b815290516000926001600160a01b03169163edbcc5999160048083019260a09291908290030181865afa158015610d19573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3d9190612295565b90506000816020015163ffffffff168385610d58919061214e565b610d629190612165565b90506000610d9f8c8c8b818110610d7b57610d7b6121a6565b9050602002016020810190610d909190611d53565b610d9a8487611f09565b611707565b5060005460408c810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb91610ddc918890600401611e74565b6020604051808303816000875af1158015610dfb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e1f9190611ea2565b610e2857600080fd5b6003546040516000916001600160a01b0316906342b8c5e990610e6b9060200160208082526009908201526808eded8c8ccd2dcc6d60bb1b604082015260600190565b60408051601f198184030181529082905280516020909101206001600160e01b031960e084901b8116835216600482015260240160a060405180830381865afa158015610ebc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ee0919061238e565b600054602082810151015191925061010090046001600160a01b03169063a9059cbb90610f0d888661214e565b6040518363ffffffff1660e01b8152600401610f2a929190611e74565b6020604051808303816000875af1158015610f49573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f6d9190611ea2565b610f7657600080fd5b8060400151602001516001600160a01b03166320dcd90b8e8e8d818110610f9f57610f9f6121a6565b9050602002016020810190610fb49190611d53565b60005461010090046001600160a01b0316610fcf898761214e565b6040516001600160e01b031960e086901b16815263ffffffff9390931660048401526001600160a01b0390911660248301526044820152606401600060405180830381600087803b15801561102357600080fd5b505af1158015611037573d6000803e3d6000fd5b5050505050505050611101565b60006110768a8a8981811061105b5761105b6121a6565b90506020020160208101906110709190611d53565b83611707565b5060005460408a810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb916110b3918590600401611e74565b6020604051808303816000875af11580156110d2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110f69190611ea2565b6110ff57600080fd5b505b505050505b5080611111816123fc565b915050610b1b565b50505050565b600061112a826119f2565b92915050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611186573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111ae9190810190612079565b60a001516001600160a01b0316331492915050565b60035460405160009182916001600160a01b03909116906342b8c5e99061120a9060200160208082526009908201526808eded8c8ccd2dcc6d60bb1b604082015260600190565b60408051601f198184030181529082905280516020909101206001600160e01b031960e084901b8116835216600482015260240160a060405180830381865afa15801561125b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061127f919061238e565b60209081015101516001600160a01b0316331492915050565b600354604080516306e7f2fd60e11b815290516000926001600160a01b031691630dcfe5fa9160048083019260209291908290030181865afa1580156112e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113069190612415565b5151919050565b6004805460405163556d6e9f60e01b8152918201869052602482018590526044820184905260009182916001600160a01b03169063556d6e9f90606401602060405180830381865afa158015611367573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061138b9190611ebd565b905060646113998483612165565b6113a39190612184565b6113ad908261214e565b9695505050505050565b63ffffffff8116600090815260076020908152604080832054600554600690935281842054915163eb02c30160e01b815260048101929092529183916001600160a01b039091169063eb02c3019060240161018060405180830381865afa158015611426573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061144a91906121d4565b60048054825160405163556d6e9f60e01b815260019381019390935260006024840181905260448401919091529293506001600160a01b03169063556d6e9f90606401602060405180830381865afa1580156114aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114ce9190611ebd565b905082811061150a578269d3c21bcecceda10000006114ed828461214e565b6114f79190612165565b6115019190612184565b95945050505050565b506000949350505050565b60055463ffffffff821660009081526006602052604090819020549051631c4b774b60e01b81526001600160a01b0390921691631c4b774b9161155e9160040190815260200190565b600060405180830381600087803b15801561157857600080fd5b505af115801561158c573d6000803e3d6000fd5b50506002546040516370a0823160e01b8152306004820152600093506001600160a01b0390911691506370a0823190602401602060405180830381865afa1580156115db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115ff9190611ebd565b90506000600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611656573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261167e9190810190612079565b600254604080830151905163a9059cbb60e01b81529293506001600160a01b039091169163a9059cbb916116b6918690600401611e74565b6020604051808303816000875af11580156116d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116f99190611ea2565b61170257600080fd5b505050565b60055463ffffffff831660009081526006602052604080822054905163eb02c30160e01b815260048101919091529091829182916001600160a01b03169063eb02c3019060240161018060405180830381865afa15801561176c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061179091906121d4565b905060006117a560016000846000015161195d565b90506000816117be69d3c21bcecceda100000088612165565b6117c89190612184565b90506117d382611aa4565b82516117de90611aa4565b6117e781611aa4565b82518111156118425760405162461bcd60e51b815260206004820152602160248201527f43616e6e6f742072656465656d206d6f7265207468616e20617661696c61626c6044820152606560f81b60648201526084016102b4565b60006118596001600084611854611298565b61130d565b90506000611868898484611aec565b905061187382611aa4565b61187c81611aa4565b989197509095505050505050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156118e0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526119089190810190612079565b905069d3c21bcecceda1000000816020015163ffffffff16826000015163ffffffff1685876119379190612165565b6119419190612165565b61194b9190612184565b6119559190612184565b949350505050565b6004805460405163556d6e9f60e01b8152918201859052602482018490526044820183905260009182916001600160a01b03169063556d6e9f90606401602060405180830381865afa1580156119b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119db9190611ebd565b9050826114f769d3c21bcecceda100000083612165565b60055463ffffffff821660009081526006602052604080822054905163eb02c30160e01b81526004810191909152909182916001600160a01b039091169063eb02c3019060240161018060405180830381865afa158015611a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a7b91906121d4565b90506000611a93600160008460000151611854611298565b905061195584836000015183611aec565b611ae981604051602401611aba91815260200190565b60408051601f198184030181529190526020810180516001600160e01b031663f82c50f160e01b179052611c6c565b50565b60055463ffffffff8416600090815260066020526040808220549051639e2c8a5b60e01b815291926001600160a01b031691639e2c8a5b91611b3b918790600401918252602082015260400190565b600060405180830381600087803b158015611b5557600080fd5b505af1158015611b69573d6000803e3d6000fd5b50506001546004805460405163095ea7b360e01b81526001600160a01b03938416955063095ea7b39450611ba39390911691889101611e74565b6020604051808303816000875af1158015611bc2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611be69190611ea2565b5060048054604051630b68372160e31b81526001928101929092526000602483015260448201859052606482018490526001600160a01b031690635b41b908906084016020604051808303816000875af1158015611c48573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119559190611ebd565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6001600160a01b0381168114611ae957600080fd5b600080600080600060808688031215611cba57600080fd5b8535611cc581611c8d565b94506020860135611cd581611c8d565b935060408601359250606086013567ffffffffffffffff80821115611cf957600080fd5b818801915088601f830112611d0d57600080fd5b813581811115611d1c57600080fd5b896020828501011115611d2e57600080fd5b9699959850939650602001949392505050565b63ffffffff81168114611ae957600080fd5b600060208284031215611d6557600080fd5b8135611d7081611d41565b9392505050565b600080600060608486031215611d8c57600080fd5b8335611d9781611d41565b92506020840135611da781611c8d565b929592945050506040919091013590565b634e487b7160e01b600052602160045260246000fd5b60028110611ae957634e487b7160e01b600052602160045260246000fd5b60208101611df983611dce565b91905290565b60008060208385031215611e1257600080fd5b823567ffffffffffffffff80821115611e2a57600080fd5b818501915085601f830112611e3e57600080fd5b813581811115611e4d57600080fd5b8660208260051b8501011115611e6257600080fd5b60209290920196919550909350505050565b6001600160a01b03929092168252602082015260400190565b80518015158114611e9d57600080fd5b919050565b600060208284031215611eb457600080fd5b611d7082611e8d565b600060208284031215611ecf57600080fd5b5051919050565b82815260408101611ee683611dce565b8260208301529392505050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611f1c57611f1c611ef3565b500190565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff81118282101715611f5a57611f5a611f21565b60405290565b60405160e0810167ffffffffffffffff81118282101715611f5a57611f5a611f21565b6040516020810167ffffffffffffffff81118282101715611f5a57611f5a611f21565b604051601f8201601f1916810167ffffffffffffffff81118282101715611fcf57611fcf611f21565b604052919050565b8051611e9d81611d41565b8051611e9d81611c8d565b600082601f830112611ffe57600080fd5b815167ffffffffffffffff81111561201857612018611f21565b602061202c601f8301601f19168201611fa6565b828152858284870101111561204057600080fd5b60005b8381101561205e578581018301518282018401528201612043565b8381111561206f5760008385840101525b5095945050505050565b60006020828403121561208b57600080fd5b815167ffffffffffffffff808211156120a357600080fd5b9083019060c082860312156120b757600080fd5b6120bf611f37565b6120c883611fd7565b81526120d660208401611fd7565b60208201526120e760408401611fe2565b60408201526060830151828111156120fe57600080fd5b61210a87828601611fed565b60608301525060808301518281111561212257600080fd5b61212e87828601611fed565b60808301525061214060a08401611fe2565b60a082015295945050505050565b60008282101561216057612160611ef3565b500390565b600081600019048311821515161561217f5761217f611ef3565b500290565b6000826121a157634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052603260045260246000fd5b60028110611ae957600080fd5b8051611e9d816121bc565b60008183036101808112156121e857600080fd5b6121f0611f60565b8351815260c0601f198301121561220657600080fd5b61220e611f37565b91506020840151825260408401516020830152606084015160408301526080840151606083015260a0840151608083015260c084015160a083015281602082015260e08401516040820152610100840151606082015261227161012085016121c9565b608082015261014084015160a08201526101609093015160c0840152509092915050565b600060a082840312156122a757600080fd5b60405160a0810181811067ffffffffffffffff821117156122ca576122ca611f21565b6040526122d683611e8d565b815260208301516122e681611d41565b602082015260408301516122f981611d41565b604082015261230a60608401611e8d565b6060820152608083015161231d81611d41565b60808201529392505050565b60006040828403121561233b57600080fd5b6040516040810181811067ffffffffffffffff8211171561235e5761235e611f21565b80604052508091508251612371816121bc565b8152602083015161238181611c8d565b6020919091015292915050565b600060a082840312156123a057600080fd5b6040516060810181811067ffffffffffffffff821117156123c3576123c3611f21565b6040526123cf83611e8d565b81526123de8460208501612329565b60208201526123f08460608501612329565b60408201529392505050565b60006001820161240e5761240e611ef3565b5060010190565b60006020828403121561242757600080fd5b61242f611f83565b612437611f83565b925183529182525091905056fea2646970667358221220413b659a1c5477b46367d42a6ae6343c936918d267ee458d96e760b390662da864736f6c634300080f0033";

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
