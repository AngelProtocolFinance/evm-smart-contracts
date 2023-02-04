/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Registrar, RegistrarInterface } from "../../contracts/Registrar";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct IRegistrar.AngelProtocolParams",
        name: "newAngelProtocolParams",
        type: "tuple",
      },
    ],
    name: "AngelProtocolParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_gasFee",
        type: "uint256",
      },
    ],
    name: "GasFeeUpdated",
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
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct IRegistrar.RebalanceParams",
        name: "newRebalanceParams",
        type: "tuple",
      },
    ],
    name: "RebalanceParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "enum IRegistrar.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
      },
    ],
    name: "StrategyApprovalChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_lockAddr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_liqAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IRegistrar.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
      },
    ],
    name: "StrategyParamsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAccepted",
        type: "bool",
      },
    ],
    name: "TokenAcceptanceChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "angelProtocolParams",
    outputs: [
      {
        internalType: "uint32",
        name: "protocolTaxRate",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "protocolTaxBasis",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "protocolTaxCollector",
        type: "address",
      },
      {
        internalType: "string",
        name: "primaryChain",
        type: "string",
      },
      {
        internalType: "string",
        name: "primaryChainRouter",
        type: "string",
      },
      {
        internalType: "address",
        name: "routerAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "refundAddr",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "apGoldfinch",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "allowedSlippage",
            type: "uint256",
          },
        ],
        internalType: "struct APGoldfinchConfigLib.CRVParams",
        name: "crvParams",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAPGoldfinchParams",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "allowedSlippage",
                type: "uint256",
              },
            ],
            internalType: "struct APGoldfinchConfigLib.CRVParams",
            name: "crvParams",
            type: "tuple",
          },
        ],
        internalType: "struct APGoldfinchConfigLib.APGoldfinchConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAngelProtocolParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        internalType: "struct IRegistrar.AngelProtocolParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
    ],
    name: "getGasByToken",
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
    name: "getRebalanceParams",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        internalType: "struct IRegistrar.RebalanceParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
    ],
    name: "getStrategyApprovalState",
    outputs: [
      {
        internalType: "enum IRegistrar.StrategyApprovalState",
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
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
    ],
    name: "getStrategyParamsById",
    outputs: [
      {
        components: [
          {
            internalType: "enum IRegistrar.StrategyApprovalState",
            name: "approvalState",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "enum IVault.VaultType",
                name: "Type",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "vaultAddr",
                type: "address",
              },
            ],
            internalType: "struct IRegistrar.VaultParams",
            name: "Locked",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "enum IVault.VaultType",
                name: "Type",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "vaultAddr",
                type: "address",
              },
            ],
            internalType: "struct IRegistrar.VaultParams",
            name: "Liquid",
            type: "tuple",
          },
        ],
        internalType: "struct IRegistrar.StrategyParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
    ],
    name: "isTokenAccepted",
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
    name: "rebalanceParams",
    outputs: [
      {
        internalType: "bool",
        name: "rebalanceLiquidProfits",
        type: "bool",
      },
      {
        internalType: "uint32",
        name: "lockedRebalanceToLiquid",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "interestDistribution",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "lockedPrincipleToLiquid",
        type: "bool",
      },
      {
        internalType: "uint32",
        name: "principleDistribution",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "basis",
        type: "uint32",
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
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "allowedSlippage",
                type: "uint256",
              },
            ],
            internalType: "struct APGoldfinchConfigLib.CRVParams",
            name: "crvParams",
            type: "tuple",
          },
        ],
        internalType: "struct APGoldfinchConfigLib.APGoldfinchConfig",
        name: "_apGoldfinch",
        type: "tuple",
      },
    ],
    name: "setAPGoldfinchParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "protocolTaxRate",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "protocolTaxBasis",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "protocolTaxCollector",
            type: "address",
          },
          {
            internalType: "string",
            name: "primaryChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "primaryChainRouter",
            type: "string",
          },
          {
            internalType: "address",
            name: "routerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundAddr",
            type: "address",
          },
        ],
        internalType: "struct IRegistrar.AngelProtocolParams",
        name: "_angelProtocolParams",
        type: "tuple",
      },
    ],
    name: "setAngelProtocolParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_gasFee",
        type: "uint256",
      },
    ],
    name: "setGasByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "rebalanceLiquidProfits",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "lockedRebalanceToLiquid",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "interestDistribution",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "lockedPrincipleToLiquid",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "principleDistribution",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "basis",
            type: "uint32",
          },
        ],
        internalType: "struct IRegistrar.RebalanceParams",
        name: "_rebalanceParams",
        type: "tuple",
      },
    ],
    name: "setRebalanceParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        internalType: "enum IRegistrar.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
      },
    ],
    name: "setStrategyApprovalState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_strategyId",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "_lockAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_liqAddr",
        type: "address",
      },
      {
        internalType: "enum IRegistrar.StrategyApprovalState",
        name: "_approvalState",
        type: "uint8",
      },
    ],
    name: "setStrategyParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isAccepted",
        type: "bool",
      },
    ],
    name: "setTokenAccepted",
    outputs: [],
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611c10806100206000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806372b1df29116100b8578063b7644fd91161007c578063b7644fd914610363578063b8efa48e1461037e578063bb39200214610393578063c5ec133a146103a6578063edbcc599146103cc578063f2fde38b146104ca57600080fd5b806372b1df29146102e35780638129fc1c146102f65780638da5cb5b146102fe5780639aa1650c14610319578063afd44bcc1461032c57600080fd5b806342b8c5e9116100ff57806342b8c5e91461025b5780634349597a1461027b5780634df988ae1461028e5780636f2da657146102c8578063715018a6146102db57600080fd5b80630560bd961461013c5780630dcfe5fa1461017d578063296b5cc8146101b05780632e360914146101c557806338f2e95c146101d8575b600080fd5b61016861014a366004611158565b6001600160a01b03166000908152606c602052604090205460ff1690565b60405190151581526020015b60405180910390f35b60408051808201825260006020808301918252915281518083018352606e54818301818152909152915191825201610174565b6101c36101be3660046111a3565b6104dd565b005b6101c36101d33660046111fb565b61068c565b60655461021e9060ff8082169163ffffffff6101008204811692650100000000008304821692600160481b810490911691600160501b8204811691600160701b90041686565b60408051961515875263ffffffff9586166020880152938516938601939093529015156060850152821660808401521660a082015260c001610174565b61026e610269366004611213565b6106de565b6040516101749190611280565b6101c36102893660046112cd565b6107ef565b6102bb61029c366004611213565b6001600160e01b0319166000908152606b602052604090205460ff1690565b6040516101749190611306565b6101c36102d636600461131a565b610857565b6101c36108ac565b6101c36102f1366004611346565b6108c0565b6101c36108d3565b6033546040516001600160a01b039091168152602001610174565b6101c3610327366004611358565b610b5e565b61035561033a366004611158565b6001600160a01b03166000908152606d602052604090205490565b604051908152602001610174565b61036b610ba5565b60405161017497969594939291906113e0565b610386610d08565b6040516101749190611449565b6101c36103a13660046114ee565b610ecf565b6040805160208101909152606e5481526103bd9081565b60405190518152602001610174565b61046a6040805160c081018252600080825260208201819052918101829052606081018290526080810182905260a0810191909152506040805160c08101825260655460ff8082161515835263ffffffff610100830481166020850152650100000000008304811694840194909452600160481b82041615156060830152600160501b810483166080830152600160701b900490911660a082015290565b6040516101749190600060c082019050825115158252602083015163ffffffff80821660208501528060408601511660408501526060850151151560608501528060808601511660808501528060a08601511660a0850152505092915050565b6101c36104d8366004611158565b610f4c565b6104e5610fc2565b60408051808201825260008082526001600160a01b0386166020830152825180840190935290918060018152602001856001600160a01b0316815250905060405180606001604052808460038111156105405761054061122e565b8152602080820185905260409182018490526001600160e01b031989166000908152606b9091522081518154829060ff191660018360038111156105865761058661122e565b02179055506020820151805160018084018054909291839160ff19169083818111156105b4576105b461122e565b02179055506020919091015181546001600160a01b0390911661010002610100600160a81b031990911617905560408201518051600283018054909190829060ff19166001838181111561060a5761060a61122e565b0217905550602091909101518154610100600160a81b0319166101006001600160a01b039283160217909155604051878216935090881691506001600160e01b03198916907ffa06e62a5e92c6354ccefe5daec331c8025e54e73ab99084cc91cb5dca242f2a9061067c908890611306565b60405180910390a4505050505050565b610694610fc2565b8060656106a1828261154d565b9050507f9ba2671e8e8451ccaa99b5ba3b232e5a1b174450f12aa494675d0941fa4c17f9816040516106d3919061166c565b60405180910390a150565b6106e66110e7565b6001600160e01b031982166000908152606b6020526040908190208151606081019092528054829060ff1660038111156107225761072261122e565b60038111156107335761073361122e565b815260408051808201909152600183810180546020909401939091839160ff16908111156107635761076361122e565b60018111156107745761077461122e565b8152905461010090046001600160a01b0316602091820152908252604080518082019091526002840180549390920192909190829060ff1660018111156107bd576107bd61122e565b60018111156107ce576107ce61122e565b8152905461010090046001600160a01b031660209091015290525092915050565b6107f7610fc2565b6001600160a01b0382166000818152606c6020908152604091829020805460ff191685151590811790915591519182527f1527477b814a609b77a3a52f49fae682370acb615a0212d9e5229186cd66e94d91015b60405180910390a25050565b61085f610fc2565b6001600160a01b0382166000818152606d602052604090819020839055517f0fc88453320e48dee70566020e32b04f9c148fdf565be3b7d7d9c2838a06d7339061084b9084815260200190565b6108b4610fc2565b6108be600061101c565b565b80606e6108ce828290359055565b505050565b600054610100900460ff16158080156108f35750600054600160ff909116105b8061090d5750303b15801561090d575060005460ff166001145b6109755760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff191660011790558015610998576000805461ff0019166101001790555b6109a061106e565b6040805160c080820183526000808352604b60208085019190915260148486015260608085018390526080808601849052606460a0968701819052606580546e640000000000000000140000004b0071ffffffffffffffffffffffffffffffffffff19909116179055875160e081018952600281528085019182528089018681528951808b018b5260078152662837b63cb3b7b760c91b8188015294820194855289519586019099528585529182019390935294850183905292840191909152825160668054925195516001600160a01b0316600160401b02600160401b600160e01b031963ffffffff9788166401000000000267ffffffffffffffff199095169390971692909217929092179490941693909317835551909190606790610ac89082611796565b5060808201516002820190610add9082611796565b5060a08201516003820180546001600160a01b03199081166001600160a01b039384161790915560c0909301516004909201805490931691161790558015610b5b576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498906020016106d3565b50565b610b66610fc2565b806066610b738282611992565b9050507f39f1d4da4932f2706d6123372a54358f7ff2484b7805b9b0549cfd73a923e07b816040516106d39190611afb565b606680546067805463ffffffff80841694640100000000850490911693600160401b90046001600160a01b0316929091610bde90611714565b80601f0160208091040260200160405190810160405280929190818152602001828054610c0a90611714565b8015610c575780601f10610c2c57610100808354040283529160200191610c57565b820191906000526020600020905b815481529060010190602001808311610c3a57829003601f168201915b505050505090806002018054610c6c90611714565b80601f0160208091040260200160405190810160405280929190818152602001828054610c9890611714565b8015610ce55780601f10610cba57610100808354040283529160200191610ce5565b820191906000526020600020905b815481529060010190602001808311610cc857829003601f168201915b50505050600383015460049093015491926001600160a01b039081169216905087565b6040805160e0810182526000808252602082018190529181018290526060808201819052608082015260a0810182905260c08101919091526040805160e0810182526066805463ffffffff80821684526401000000008204166020840152600160401b90046001600160a01b03169282019290925260678054919291606084019190610d9390611714565b80601f0160208091040260200160405190810160405280929190818152602001828054610dbf90611714565b8015610e0c5780601f10610de157610100808354040283529160200191610e0c565b820191906000526020600020905b815481529060010190602001808311610def57829003601f168201915b50505050508152602001600282018054610e2590611714565b80601f0160208091040260200160405190810160405280929190818152602001828054610e5190611714565b8015610e9e5780601f10610e7357610100808354040283529160200191610e9e565b820191906000526020600020905b815481529060010190602001808311610e8157829003601f168201915b505050918352505060038201546001600160a01b039081166020830152600490920154909116604090910152919050565b610ed7610fc2565b6001600160e01b031982166000908152606b60205260409020805482919060ff19166001836003811115610f0d57610f0d61122e565b0217905550816001600160e01b0319167fc29dfab8aee1ae5a857c884f518353e5f8a0d8e0649c8708f6b21bc92f4209ca8260405161084b9190611306565b610f54610fc2565b6001600160a01b038116610fb95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161096c565b610b5b8161101c565b6033546001600160a01b031633146108be5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161096c565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166110d95760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b606482015260840161096c565b6108be3361101c565b905290565b60408051606081019091528060008152602001611114604080518082019091526000808252602082015290565b81526020016110e2604080518082019091526000808252602082015290565b6001600160a01b0381168114610b5b57600080fd5b803561115381611133565b919050565b60006020828403121561116a57600080fd5b813561117581611133565b9392505050565b80356001600160e01b03198116811461115357600080fd5b80356004811061115357600080fd5b600080600080608085870312156111b957600080fd5b6111c28561117c565b935060208501356111d281611133565b925060408501356111e281611133565b91506111f060608601611194565b905092959194509250565b600060c0828403121561120d57600080fd5b50919050565b60006020828403121561122557600080fd5b6111758261117c565b634e487b7160e01b600052602160045260246000fd5b600481106112545761125461122e565b9052565b80516002811061126a5761126a61122e565b82526020908101516001600160a01b0316910152565b600060a082019050611293828451611244565b60208301516112a56020840182611258565b5060408301516112b86060840182611258565b5092915050565b8015158114610b5b57600080fd5b600080604083850312156112e057600080fd5b82356112eb81611133565b915060208301356112fb816112bf565b809150509250929050565b602081016113148284611244565b92915050565b6000806040838503121561132d57600080fd5b823561133881611133565b946020939093013593505050565b60006020828403121561120d57600080fd5b60006020828403121561136a57600080fd5b813567ffffffffffffffff81111561138157600080fd5b820160e0818503121561117557600080fd5b6000815180845260005b818110156113b95760208185018101518683018201520161139d565b818111156113cb576000602083870101525b50601f01601f19169290920160200192915050565b63ffffffff8881168252871660208201526001600160a01b03868116604083015260e0606083018190526000919061141a90840188611393565b838103608085015261142c8188611393565b95821660a0850152509290921660c0909101525095945050505050565b60208152600063ffffffff8084511660208401528060208501511660408401525060018060a01b036040840151166060830152606083015160e06080840152611496610100840182611393565b90506080840151601f198483030160a08501526114b38282611393565b91505060a08401516114d060c08501826001600160a01b03169052565b5060c08401516001600160a01b03811660e08501525b509392505050565b6000806040838503121561150157600080fd5b61150a8361117c565b915061151860208401611194565b90509250929050565b60008135611314816112bf565b63ffffffff81168114610b5b57600080fd5b600081356113148161152e565b8135611558816112bf565b815460ff19811691151560ff16918217835560208401356115788161152e565b64ffffffff008160081b169050808364ffffffffff1984161717845560408501356115a28161152e565b68ffffffff00000000008160281b168468ffffffffffffffffff198516178317178555505050506116026115d860608401611521565b82805469ff000000000000000000191691151560481b69ff00000000000000000016919091179055565b61163561161160808401611540565b82805463ffffffff60501b191660509290921b63ffffffff60501b16919091179055565b61166861164460a08401611540565b82805463ffffffff60701b191660709290921b63ffffffff60701b16919091179055565b5050565b60c08101823561167b816112bf565b15158252602083013561168d8161152e565b63ffffffff90811660208401526040840135906116a98261152e565b90811660408401526060840135906116c0826112bf565b90151560608401526080840135906116d78261152e565b908116608084015260a0840135906116ee8261152e565b80821660a0850152505092915050565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061172857607f821691505b60208210810361120d57634e487b7160e01b600052602260045260246000fd5b601f8211156108ce57600081815260208120601f850160051c8101602086101561176f5750805b601f850160051c820191505b8181101561178e5782815560010161177b565b505050505050565b815167ffffffffffffffff8111156117b0576117b06116fe565b6117c4816117be8454611714565b84611748565b602080601f8311600181146117f957600084156117e15750858301515b600019600386901b1c1916600185901b17855561178e565b600085815260208120601f198616915b8281101561182857888601518255948401946001909101908401611809565b50858210156118465787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6000813561131481611133565b6000808335601e1984360301811261187a57600080fd5b83018035915067ffffffffffffffff82111561189557600080fd5b6020019150368190038213156118aa57600080fd5b9250929050565b67ffffffffffffffff8311156118c9576118c96116fe565b6118dd836118d78354611714565b83611748565b6000601f84116001811461191157600085156118f95750838201355b600019600387901b1c1916600186901b17835561196b565b600083815260209020601f19861690835b828110156119425786850135825560209485019460019092019101611922565b508682101561195f5760001960f88860031b161c19848701351681555b505060018560011b0183555b5050505050565b80546001600160a01b0319166001600160a01b0392909216919091179055565b813561199d8161152e565b63ffffffff8116905081548163ffffffff19821617835560208401356119c28161152e565b67ffffffff000000008160201b168367ffffffffffffffff19841617178455505050611a226119f360408401611856565b828054600160401b600160e01b03191660409290921b68010000000000000000600160e01b0316919091179055565b611a2f6060830183611863565b611a3d8183600186016118b1565b5050611a4c6080830183611863565b611a5a8183600286016118b1565b5050611a74611a6b60a08401611856565b60038301611972565b611668611a8360c08401611856565b60048301611972565b6000808335601e19843603018112611aa357600080fd5b830160208101925035905067ffffffffffffffff811115611ac357600080fd5b8036038213156118aa57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260008235611b0c8161152e565b63ffffffff81166020840152506020830135611b278161152e565b63ffffffff8116604084015250611b4060408401611148565b6001600160a01b038116606084015250611b5d6060840184611a8c565b60e06080850152611b7361010085018284611ad2565b915050611b836080850185611a8c565b848303601f190160a0860152611b9a838284611ad2565b92505050611baa60a08501611148565b6001600160a01b03811660c085015250611bc660c08501611148565b6001600160a01b03811660e08501526114e656fea26469706673582212205c10d517890335e0c88f11c286c1548a59197e155ecb4ab4bc95435eccf33e0064736f6c634300080f0033";

type RegistrarConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RegistrarConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Registrar__factory extends ContractFactory {
  constructor(...args: RegistrarConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Registrar> {
    return super.deploy(overrides || {}) as Promise<Registrar>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Registrar {
    return super.attach(address) as Registrar;
  }
  override connect(signer: Signer): Registrar__factory {
    return super.connect(signer) as Registrar__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RegistrarInterface {
    return new utils.Interface(_abi) as RegistrarInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Registrar {
    return new Contract(address, _abi, signerOrProvider) as Registrar;
  }
}
