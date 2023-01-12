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
  "0x60806040523480156200001157600080fd5b506040516200252b3803806200252b8339810160408190526200003491620000fb565b6000805488919060ff19166001838181111562000055576200005562000195565b0217905550600380546001600160a01b039788166001600160a01b031991821617909155600580549688169682169690961790955560048054948716948616949094179093556000805492861661010002610100600160a81b031990931692909217909155600180549185169184169190911790556002805491909316911617905550620001ab565b80516001600160a01b0381168114620000f657600080fd5b919050565b600080600080600080600060e0888a0312156200011757600080fd5b8751600281106200012757600080fd5b96506200013760208901620000de565b95506200014760408901620000de565b94506200015760608901620000de565b93506200016760808901620000de565b92506200017760a08901620000de565b91506200018760c08901620000de565b905092959891949750929550565b634e487b7160e01b600052602160045260246000fd5b61237080620001bb6000396000f3fe60806040526004361061009c5760003560e01c806375baf37f1161006457806375baf37f146101a257806388bb447b146101c257806389a30271146101e25780639fdafa6d14610207578063c2ec3be614610227578063e52022691461023a57600080fd5b8063034afe7b146100a1578063150b7a02146100de5780631c2a709b1461012357806320dcd90b1461016c5780634dc2377214610181575b600080fd5b3480156100ad57600080fd5b506002546100c1906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100ea57600080fd5b5061010a6100f9366004611b98565b630a85bd0160e11b95945050505050565b6040516001600160e01b031990911681526020016100d5565b34801561012f57600080fd5b5061015761013e366004611c49565b6007602052600090815260409020805460019091015482565b604080519283526020830191909152016100d5565b61017f61017a366004611c6d565b610267565b005b61019461018f366004611c6d565b610717565b6040519081526020016100d5565b3480156101ae57600080fd5b5060005460ff166040516100d59190611ce2565b3480156101ce57600080fd5b5061017f6101dd366004611cf5565b610a5b565b3480156101ee57600080fd5b506000546100c19061010090046001600160a01b031681565b34801561021357600080fd5b506001546100c1906001600160a01b031681565b610194610235366004611c49565b61110a565b34801561024657600080fd5b50610194610255366004611c49565b60066020526000908152604090205481565b61026f61111b565b8061027d575061027d6111ae565b6102bd5760405162461bcd60e51b815260206004820152600c60248201526b139bdd08185c1c1c9bdd995960a21b60448201526064015b60405180910390fd5b60005482906001600160a01b0380831661010090920416146103165760405162461bcd60e51b815260206004820152601260248201527113db9b1e481554d110c81858d8d95c1d195960721b60448201526064016102b4565b6000610320611283565b905060006103326000600186856112f8565b6000546004805460405163095ea7b360e01b81529394506001600160a01b0361010090930483169363095ea7b39361036f93921691899101611d6a565b6020604051808303816000875af115801561038e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b29190611d98565b5060048054604051630b68372160e31b815260009281018390526001602482015260448101879052606481018490526001600160a01b0390911690635b41b908906084016020604051808303816000875af1158015610415573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104399190611db3565b63ffffffff8816600090815260066020526040812054919250036105be5760015460055460405163095ea7b360e01b81526001600160a01b039283169263095ea7b39261048d929116908590600401611d6a565b6020604051808303816000875af11580156104ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d09190611d98565b506005546040516310087fb160e01b81526000916001600160a01b0316906310087fb1906105049085908590600401611dcc565b6020604051808303816000875af1158015610523573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105479190611db3565b63ffffffff8916600090815260076020526040812080549293508892909190610571908490611dff565b909155505063ffffffff88166000908152600760205260408120600101805484929061059e908490611dff565b909155505063ffffffff881660009081526006602052604090205561070e565b63ffffffff87166000908152600660205260409081902054600154600554925163095ea7b360e01b815291926001600160a01b039182169263095ea7b39261060c9216908690600401611d6a565b6020604051808303816000875af115801561062b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064f9190611d98565b5060055460405163a9f4939d60e01b815260048101839052602481018490526001600160a01b039091169063a9f4939d90604401600060405180830381600087803b15801561069d57600080fd5b505af11580156106b1573d6000803e3d6000fd5b5050505063ffffffff8816600090815260076020526040812080548892906106da908490611dff565b909155505063ffffffff881660009081526007602052604081206001018054849290610707908490611dff565b9091555050505b50505050505050565b600061072161111b565b6107635760405162461bcd60e51b81526020600482015260136024820152722737ba1030b8383937bb32b2102937baba32b960691b60448201526064016102b4565b60005483906001600160a01b0380831661010090920416146107bc5760405162461bcd60e51b815260206004820152601260248201527113db9b1e481554d110c81858d8d95c1d195960721b60448201526064016102b4565b60035460408051635c77d24760e11b815290516000926001600160a01b03169163b8efa48e91600480830192869291908290030181865afa158015610805573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261082d9190810190611f6f565b9050600061083a876113a2565b905061084587611500565b60008061085289886116f2565b909250905082156108ff57600061086984846117ea565b600054604087810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb916108a5918590600401611d6a565b6020604051808303816000875af11580156108c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108e89190611d98565b6108f157600080fd5b6108fb8184612044565b9250505b63ffffffff8916600090815260076020526040812060010154908161092e69d3c21bcecceda10000008561205b565b610938919061207a565b63ffffffff8c166000908152600760205260408120549192509069d3c21bcecceda100000090610968908461205b565b610972919061207a565b63ffffffff8d1660009081526007602052604081206001018054929350869290919061099f908490612044565b909155505063ffffffff8c16600090815260076020526040812080548392906109c9908490612044565b909155505060005460a088015160405163095ea7b360e01b81526101009092046001600160a01b03169163095ea7b391610a07918990600401611d6a565b6020604051808303816000875af1158015610a26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4a9190611d98565b50939b9a5050505050505050505050565b610a6361111b565b610aa55760405162461bcd60e51b81526020600482015260136024820152722737ba1030b8383937bb32b2102937baba32b960691b60448201526064016102b4565b60035460408051635c77d24760e11b815290516000926001600160a01b03169163b8efa48e91600480830192869291908290030181865afa158015610aee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b169190810190611f6f565b905060005b8281101561110457610b52848483818110610b3857610b3861209c565b9050602002016020810190610b4d9190611c49565b611500565b6000610b83858584818110610b6957610b6961209c565b9050602002016020810190610b7e9190611c49565b6113a2565b905080156110f1576005546000906001600160a01b031663eb02c301600683898988818110610bb457610bb461209c565b9050602002016020810190610bc99190611c49565b63ffffffff1663ffffffff168152602001908152602001600020546040518263ffffffff1660e01b8152600401610c0291815260200190565b61018060405180830381865afa158015610c20573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c4491906120ca565b90506000610c596001600084600001516118bd565b9050600069d3c21bcecceda100000084838560000151610c79919061207a565b610c83919061205b565b610c8d919061207a565b90506000610c9b85836117ea565b90506000805460ff166001811115610cb557610cb5611cae565b0361102f576003546040805163edbcc59960e01b815290516000926001600160a01b03169163edbcc5999160048083019260a09291908290030181865afa158015610d04573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d28919061218b565b90506000816020015163ffffffff168385610d439190612044565b610d4d919061205b565b90506000610d8a8c8c8b818110610d6657610d6661209c565b9050602002016020810190610d7b9190611c49565b610d858487611dff565b6116f2565b5060005460408c810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb91610dc7918890600401611d6a565b6020604051808303816000875af1158015610de6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e0a9190611d98565b610e1357600080fd5b6003546040516000916001600160a01b0316906342b8c5e990610e569060200160208082526009908201526808eded8c8ccd2dcc6d60bb1b604082015260600190565b60408051601f198184030181529082905280516020909101206001600160e01b031960e084901b8116835216600482015260240160a060405180830381865afa158015610ea7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ecb9190612284565b600054602082810151015191925061010090046001600160a01b03169063a9059cbb90610ef88886612044565b6040518363ffffffff1660e01b8152600401610f15929190611d6a565b6020604051808303816000875af1158015610f34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f589190611d98565b610f6157600080fd5b8060400151602001516001600160a01b03166320dcd90b8e8e8d818110610f8a57610f8a61209c565b9050602002016020810190610f9f9190611c49565b60005461010090046001600160a01b0316610fba8987612044565b6040516001600160e01b031960e086901b16815263ffffffff9390931660048401526001600160a01b0390911660248301526044820152606401600060405180830381600087803b15801561100e57600080fd5b505af1158015611022573d6000803e3d6000fd5b50505050505050506110ec565b60006110618a8a898181106110465761104661209c565b905060200201602081019061105b9190611c49565b836116f2565b5060005460408a810151905163a9059cbb60e01b81529293506101009091046001600160a01b03169163a9059cbb9161109e918590600401611d6a565b6020604051808303816000875af11580156110bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110e19190611d98565b6110ea57600080fd5b505b505050505b50806110fc816122f2565b915050610b1b565b50505050565b600061111582611952565b92915050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611171573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111999190810190611f6f565b60a001516001600160a01b0316331492915050565b60035460405160009182916001600160a01b03909116906342b8c5e9906111f59060200160208082526009908201526808eded8c8ccd2dcc6d60bb1b604082015260600190565b60408051601f198184030181529082905280516020909101206001600160e01b031960e084901b8116835216600482015260240160a060405180830381865afa158015611246573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061126a9190612284565b60209081015101516001600160a01b0316331492915050565b600354604080516306e7f2fd60e11b815290516000926001600160a01b031691630dcfe5fa9160048083019260209291908290030181865afa1580156112cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112f1919061230b565b5151919050565b6004805460405163556d6e9f60e01b8152918201869052602482018590526044820184905260009182916001600160a01b03169063556d6e9f90606401602060405180830381865afa158015611352573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113769190611db3565b90506064611384848361205b565b61138e919061207a565b6113989082612044565b9695505050505050565b63ffffffff8116600090815260076020908152604080832054600554600690935281842054915163eb02c30160e01b815260048101929092529183916001600160a01b039091169063eb02c3019060240161018060405180830381865afa158015611411573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061143591906120ca565b60048054825160405163556d6e9f60e01b815260019381019390935260006024840181905260448401919091529293506001600160a01b03169063556d6e9f90606401602060405180830381865afa158015611495573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114b99190611db3565b90508281106114f5578269d3c21bcecceda10000006114d88284612044565b6114e2919061205b565b6114ec919061207a565b95945050505050565b506000949350505050565b60055463ffffffff821660009081526006602052604090819020549051631c4b774b60e01b81526001600160a01b0390921691631c4b774b916115499160040190815260200190565b600060405180830381600087803b15801561156357600080fd5b505af1158015611577573d6000803e3d6000fd5b50506002546040516370a0823160e01b8152306004820152600093506001600160a01b0390911691506370a0823190602401602060405180830381865afa1580156115c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115ea9190611db3565b90506000600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611641573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526116699190810190611f6f565b600254604080830151905163a9059cbb60e01b81529293506001600160a01b039091169163a9059cbb916116a1918690600401611d6a565b6020604051808303816000875af11580156116c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116e49190611d98565b6116ed57600080fd5b505050565b60055463ffffffff831660009081526006602052604080822054905163eb02c30160e01b815260048101919091529091829182916001600160a01b03169063eb02c3019060240161018060405180830381865afa158015611757573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061177b91906120ca565b905060006117906001600084600001516118bd565b90506000816117a969d3c21bcecceda10000008861205b565b6117b3919061207a565b905060006117cc60016000846117c7611283565b6112f8565b905060006117db898484611a00565b99929850919650505050505050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663b8efa48e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611840573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526118689190810190611f6f565b905069d3c21bcecceda1000000816020015163ffffffff16826000015163ffffffff168587611897919061205b565b6118a1919061205b565b6118ab919061207a565b6118b5919061207a565b949350505050565b6004805460405163556d6e9f60e01b8152918201859052602482018490526044820183905260009182916001600160a01b03169063556d6e9f90606401602060405180830381865afa158015611917573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061193b9190611db3565b9050826114e269d3c21bcecceda10000008361205b565b60055463ffffffff821660009081526006602052604080822054905163eb02c30160e01b81526004810191909152909182916001600160a01b039091169063eb02c3019060240161018060405180830381865afa1580156119b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119db91906120ca565b905060006119f36001600084600001516117c7611283565b90506118b5848360000151835b60055463ffffffff8416600090815260066020526040808220549051639e2c8a5b60e01b815291926001600160a01b031691639e2c8a5b91611a4f918790600401918252602082015260400190565b600060405180830381600087803b158015611a6957600080fd5b505af1158015611a7d573d6000803e3d6000fd5b50506001546004805460405163095ea7b360e01b81526001600160a01b03938416955063095ea7b39450611ab79390911691889101611d6a565b6020604051808303816000875af1158015611ad6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611afa9190611d98565b5060048054604051630b68372160e31b81526001928101929092526000602483015260448201859052606482018490526001600160a01b031690635b41b908906084016020604051808303816000875af1158015611b5c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b59190611db3565b6001600160a01b0381168114611b9557600080fd5b50565b600080600080600060808688031215611bb057600080fd5b8535611bbb81611b80565b94506020860135611bcb81611b80565b935060408601359250606086013567ffffffffffffffff80821115611bef57600080fd5b818801915088601f830112611c0357600080fd5b813581811115611c1257600080fd5b896020828501011115611c2457600080fd5b9699959850939650602001949392505050565b63ffffffff81168114611b9557600080fd5b600060208284031215611c5b57600080fd5b8135611c6681611c37565b9392505050565b600080600060608486031215611c8257600080fd5b8335611c8d81611c37565b92506020840135611c9d81611b80565b929592945050506040919091013590565b634e487b7160e01b600052602160045260246000fd5b60028110611b9557634e487b7160e01b600052602160045260246000fd5b60208101611cef83611cc4565b91905290565b60008060208385031215611d0857600080fd5b823567ffffffffffffffff80821115611d2057600080fd5b818501915085601f830112611d3457600080fd5b813581811115611d4357600080fd5b8660208260051b8501011115611d5857600080fd5b60209290920196919550909350505050565b6001600160a01b03929092168252602082015260400190565b80518015158114611d9357600080fd5b919050565b600060208284031215611daa57600080fd5b611c6682611d83565b600060208284031215611dc557600080fd5b5051919050565b82815260408101611ddc83611cc4565b8260208301529392505050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611e1257611e12611de9565b500190565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff81118282101715611e5057611e50611e17565b60405290565b60405160e0810167ffffffffffffffff81118282101715611e5057611e50611e17565b6040516020810167ffffffffffffffff81118282101715611e5057611e50611e17565b604051601f8201601f1916810167ffffffffffffffff81118282101715611ec557611ec5611e17565b604052919050565b8051611d9381611c37565b8051611d9381611b80565b600082601f830112611ef457600080fd5b815167ffffffffffffffff811115611f0e57611f0e611e17565b6020611f22601f8301601f19168201611e9c565b8281528582848701011115611f3657600080fd5b60005b83811015611f54578581018301518282018401528201611f39565b83811115611f655760008385840101525b5095945050505050565b600060208284031215611f8157600080fd5b815167ffffffffffffffff80821115611f9957600080fd5b9083019060c08286031215611fad57600080fd5b611fb5611e2d565b611fbe83611ecd565b8152611fcc60208401611ecd565b6020820152611fdd60408401611ed8565b6040820152606083015182811115611ff457600080fd5b61200087828601611ee3565b60608301525060808301518281111561201857600080fd5b61202487828601611ee3565b60808301525061203660a08401611ed8565b60a082015295945050505050565b60008282101561205657612056611de9565b500390565b600081600019048311821515161561207557612075611de9565b500290565b60008261209757634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052603260045260246000fd5b60028110611b9557600080fd5b8051611d93816120b2565b60008183036101808112156120de57600080fd5b6120e6611e56565b8351815260c0601f19830112156120fc57600080fd5b612104611e2d565b91506020840151825260408401516020830152606084015160408301526080840151606083015260a0840151608083015260c084015160a083015281602082015260e08401516040820152610100840151606082015261216761012085016120bf565b608082015261014084015160a08201526101609093015160c0840152509092915050565b600060a0828403121561219d57600080fd5b60405160a0810181811067ffffffffffffffff821117156121c0576121c0611e17565b6040526121cc83611d83565b815260208301516121dc81611c37565b602082015260408301516121ef81611c37565b604082015261220060608401611d83565b6060820152608083015161221381611c37565b60808201529392505050565b60006040828403121561223157600080fd5b6040516040810181811067ffffffffffffffff8211171561225457612254611e17565b80604052508091508251612267816120b2565b8152602083015161227781611b80565b6020919091015292915050565b600060a0828403121561229657600080fd5b6040516060810181811067ffffffffffffffff821117156122b9576122b9611e17565b6040526122c583611d83565b81526122d4846020850161221f565b60208201526122e6846060850161221f565b60408201529392505050565b60006001820161230457612304611de9565b5060010190565b60006020828403121561231d57600080fd5b612325611e79565b61232d611e79565b925183529182525091905056fea26469706673582212200f48731797a4192c55a3a5c2391fe73483d1fbcde172f1ac483cf455e4d41ad364736f6c634300080f0033";

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
