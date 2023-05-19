/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  UniswapUtils,
  UniswapUtilsInterface,
} from "../../../../contracts/mock/uniswapUtils.sol/UniswapUtils";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenA",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "uniswapFee",
            type: "uint24",
          },
          {
            internalType: "uint256",
            name: "amountA",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceX96",
            type: "uint160",
          },
          {
            internalType: "int24",
            name: "tickLower",
            type: "int24",
          },
          {
            internalType: "int24",
            name: "tickUpper",
            type: "int24",
          },
        ],
        internalType: "struct UniswapUtils.createUniswapPoolArgs",
        name: "details",
        type: "tuple",
      },
    ],
    name: "createPoolAndMintPosition",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "projectToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "usdcToken",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "uniswapFee",
            type: "uint24",
          },
          {
            internalType: "uint256",
            name: "amountA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountB",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceX96",
            type: "uint160",
          },
          {
            internalType: "int24",
            name: "tickLower",
            type: "int24",
          },
          {
            internalType: "int24",
            name: "tickUpper",
            type: "int24",
          },
        ],
        internalType: "struct UniswapUtils.createUniswapPoolERC20Args",
        name: "details",
        type: "tuple",
      },
    ],
    name: "createPoolAndMintPositionErC20",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nonfungiblePositionManager",
    outputs: [
      {
        internalType: "contract INonfungiblePositionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461003c57600080546001600160a01b03191673c36442b4a4522e871399cd717abdd847ab11fe8817905561176d90816100428239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c80630ff1c332146100475780633e9c9fa5146100425763b44a27221461003d57600080fd5b61025f565b6101e1565b346100de57610100806003193601126100de57610065610180604052565b61006d610169565b608052610078610178565b60a052610083610185565b60c05260643560e0526084359052610099610197565b610120526100a56101b1565b610140526100b16101c1565b610160526100da6100c0610743565b6040516001600160a01b0390911681529081906020820190565b0390f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b60e0810190811067ffffffffffffffff82111761011557604052565b6100e3565b6040810190811067ffffffffffffffff82111761011557604052565b90601f8019910116810190811067ffffffffffffffff82111761011557604052565b6001600160a01b038116036100de57565b6004359061017682610158565b565b6024359061017682610158565b6044359062ffffff821682036100de57565b60a4359061017682610158565b6084359061017682610158565b60c435908160020b82036100de57565b60e435908160020b82036100de57565b60a435908160020b82036100de57565b60e03660031901126100de576100da6100c06040516101ff816100f9565b60043561020b81610158565b815260243561021981610158565b6020820152610226610185565b6040820152606435606082015261023b6101a4565b60808201526102486101d1565b60a08201526102556101b1565b60c082015261109c565b346100de5760003660031901126100de576000546040516001600160a01b039091168152602090f35b908160209103126100de575190565b6040513d6000823e3d90fd5b156102aa57565b60405162461bcd60e51b815260206004820152602160248201527f496e73756666696369656e742070726f6a656374546f6b656e2062616c616e636044820152606560f81b6064820152608490fd5b1561030057565b60405162461bcd60e51b815260206004820152601e60248201527f496e73756666696369656e742075736463546f6b656e2062616c616e636500006044820152606490fd5b908160209103126100de575180151581036100de5790565b1561036457565b60405162461bcd60e51b81526020600482015260136024820152721d1c985b9cd9995c919c9bdb4819985a5b1959606a1b6044820152606490fd5b156103a657565b60405162461bcd60e51b815260206004820152600e60248201526d185c1c1c9bdd994819985a5b195960921b6044820152606490fd5b67ffffffffffffffff81116101155760051b60200190565b604090815191606080840184811067ffffffffffffffff821117610115578252600284528360005b8381106104295750505050565b808360208093850101520161041c565b8051156104465760200190565b634e487b7160e01b600052603260045260246000fd5b8051600110156104465760400190565b634e487b7160e01b600052601160045260246000fd5b906107d0820180921161049157565b61046c565b67ffffffffffffffff811161011557601f01601f191660200190565b60005b8381106104c55750506000910152565b81810151838201526020016104b5565b60209081818403126100de57805167ffffffffffffffff918282116100de57019083601f830112156100de57815161050c816103dc565b9460409261051c84519788610136565b828752858088019360051b860101948286116100de57868101935b86851061054957505050505050505090565b84518381116100de5782019084603f830112156100de57888201519061056e82610496565b61057a89519182610136565b828152868984860101116100de5761059b8b949385948b86850191016104b2565b815201940193610537565b906020916105bf815180928185528580860191016104b2565b601f01601f1916010190565b602080820190808352835180925260408301928160408460051b8301019501936000915b8483106105ff5750505050505090565b909192939495848061061d600193603f198682030187528a516105a6565b98019301930191949392906105ef565b908160209103126100de575161064281610158565b90565b91908260809103126100de5781519160208101516fffffffffffffffffffffffffffffffff811681036100de57916060604083015192015190565b9190820391821161049157565b6040519061069a8261011a565b600b82526a0526566756e6420616d74360ac1b6020830152565b156106bb57565b60405162461bcd60e51b815260206004820152600f60248201526e1d1c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b604051906106ff8261011a565b600b82526a526566756e6420616d743160a81b6020830152565b604051906107268261011a565b600e82526d031b932b0ba32b2103837b7b61d160951b6020830152565b608080516107679061075b906001600160a01b031681565b6001600160a01b031690565b604080516370a0823160e01b80825233600480840191909152602094919390918590849060249082905afa928315610d4057600093610f45575b506107b160e093845111156102a3565b60a091856107cb61075b61075b865160018060a01b031690565b8351968752338388019081528791908290819060200103915afa948515610d4057600095610f16575b5061080561010095865111156102f9565b865161081b9061075b906001600160a01b031681565b845183516323b872dd60e01b808252338583019081523060208201526040810193909352909992909189918b918290600090829060600103925af1908115610d405761087489926108b99b600091610eff575b5061035d565b855161088a9061075b906001600160a01b031681565b88518651928352338684019081523060208201526040810191909152919a8b9283916000918391606090910190565b03925af1978815610d40576000986108d7918a91610ee2575061035d565b80516108ed9061075b906001600160a01b031681565b948761093961090561075b8c5460018060a01b031690565b97835187519c8d8094819363095ea7b360e01b9d8e84528b840160209093929193604081019460018060a01b031681520152565b03925af1988915610d40576109b69961095a91600091610ecb575b5061039f565b845188906109729061075b906001600160a01b031681565b600054610987906001600160a01b031661075b565b9089519160008a89519e8f958694859384528b840160209093929193604081019460018060a01b031681520152565b03925af1918215610d40576109d7610b359360009b8c91610e69575061039f565b89610b848a87610b418c6109e96103f4565b93610a158d610a0f610a018b5160018060a01b031690565b91516001600160a01b031690565b90610f64565b9b90959091898d14610ec3578b51945b8d8b14610ebb57515b60c0516101205184516309f56ab160e11b888201526001600160a01b0385811660248301528b8116604483015262ffffff909316606482015291166084808301919091528152601f199690610a8460a482610136565b610a8d8b610439565b52610a978a610439565b5060c05162ffffff166101405160020b6101605160020b5b91610ab942610482565b96519b8c99634418b22b60e11b908b0152309660248b01959194909998979362ffffff610140989461016089019c60018060a01b0398898092168b521660208a015216604088015260020b606087015260020b608086015260a085015260c0840152600160e08401526001610100840152166101208201520152565b03908101835282610136565b610b4a8261045c565b52610b548161045c565b508254610b69906001600160a01b031661075b565b9088519d8e80948193631592ca1b60e31b83528b83016105cb565b03925af1998a15610d405760009a610e86575b50610bd1610bc2610bbc61075b610bad8e610439565b518d808251830101910161062d565b9b61045c565b518a8082518301019101610645565b9591509150600014610e80575b82518110610d62575b50505085518110610c0b575b5050505050505061064281610c06610719565b6116e9565b8351610c69958891610c279061075b906001600160a01b031681565b600054610c3c906001600160a01b031661075b565b86519283526001600160a01b03168583019081526000602082018190529298899384929091839160400190565b03925af1908115610d405761075b61075b610c9f610cbe93610ce99a610c996000978e9c8991610d45575061039f565b51610680565b96610cb188610cac6106f2565b6116a6565b516001600160a01b031690565b925163a9059cbb60e01b81523392810192835260208301949094529294859384929091839160400190565b03925af1908115610d4057610d0792600092610d13575b50506106b4565b38808080808080610bf3565b610d329250803d10610d39575b610d2a8183610136565b810190610345565b3880610d00565b503d610d20565b610297565b610d5c91508d803d10610d3957610d2a8183610136565b38610954565b8151610dc092908b90610d7f9061075b906001600160a01b031681565b600054610d94906001600160a01b031661075b565b908b60008b5180988195829483528d83016020600091939293604081019460018060a01b031681520152565b03925af1918215610d405761075b61075b610df1610dfe938f9798610c99610e289860009b8c91610e69575061039f565b93610cb185610cac61068d565b875163a9059cbb60e01b815233888201908152602081019390935294859391928492839160400190565b03925af18015610d4057610e4491600091610e4c575b506106b4565b388080610be7565b610e639150893d8b11610d3957610d2a8183610136565b38610e3e565b610d5c91508b3d8d11610d3957610d2a8183610136565b92610bde565b610bc2610bbc61075b610eb1610bd194610bad9f3d8091833e610ea98183610136565b8101906104d5565b9d50505050610b97565b508b51610a2e565b845194610a25565b610d5c91508a3d8c11610d3957610d2a8183610136565b610ef99150893d8b11610d3957610d2a8183610136565b3861086e565b610ef99150843d8611610d3957610d2a8183610136565b610f37919550863d8811610f3e575b610f2f8183610136565b810190610288565b93386107f4565b503d610f25565b610f5d919350853d8711610f3e57610f2f8183610136565b91386107a1565b90916001600160a01b039190828416838316808214610fd4571015610fc95760019193925b841615610f9257565b60405162461bcd60e51b815260206004820152600f60248201526e6e6f2061646472657373207a65726f60881b6044820152606490fd5b909160009190610f89565b60405162461bcd60e51b815260206004820152600a60248201526939b0b6b2903a37b5b2b760b11b6044820152606490fd5b1561100d57565b60405162461bcd60e51b815260206004820152601b60248201527f496e73756666696369656e7420746f6b656e412062616c616e636500000000006044820152606490fd5b6040519061105f8261011a565b60068252651c99599d5b9960d21b6020830152565b604051906110818261011a565b600c82526b706f6f6c206164647265737360a01b6020830152565b80516110b29061075b906001600160a01b031681565b604080516370a0823160e01b81523360048083019190915260209491939192918590859060249082905afa908115610d40576000948592611630575b50611100606085019283511115611006565b8351869061114e9061111c9061075b906001600160a01b031681565b845186516323b872dd60e01b815233868201908152306020820152604081019290925298899384928391606090910190565b03925af1948515610d405760009561116c918791611619575061035d565b83516111829061075b906001600160a01b031681565b91866111ce61119a61075b895460018060a01b031690565b9483518751998a8094819363095ea7b360e01b9a8b84528a840160209093929193604081019460018060a01b031681520152565b03925af1958615610d40576000966111ec918891611602575061039f565b868501908761124a61120a61075b61075b865160018060a01b031690565b895461121e906001600160a01b031661075b565b88518881526001600160a01b03909116878201908152346020820152909a8b9384928391604090910190565b03925af1958615610d405761126d610b35976113b899600091610e69575061039f565b60006112776103f4565b87611377848d6112a0611290835160018060a01b031690565b8a516001600160a01b0316610a0f565b9e909590918f8981146115fb578b51905b8a146115f35734905b61135a8488018a6113296112e560806112d6855162ffffff1690565b9c01516001600160a01b031690565b88516309f56ab160e11b8c8201526001600160a01b03808a166024830152938416604482015262ffffff909c1660648d01529190911660848b0152899060a4820190565b039861133d601f199a8b8101835282610136565b6113468d610439565b526113508c610439565b505162ffffff1690565b8c610aaf60c061136e60a084015160020b90565b92015160020b90565b6113808261045c565b5261138a8161045c565b50815461139f906001600160a01b031661075b565b885180809c8194631592ca1b60e31b83528a83016105cb565b039134905af1978815610d40576000986115d8575b506113da610bc28961045c565b99915091506000146115d2575b825181106114e9575b50505034851061142e575b505050505061141e9161141061075b92610439565b51805181018201910161062d565b610642611429611074565b61164f565b9186949391600061144f61075b61075b61148e9b975160018060a01b031690565b8154909390611466906001600160a01b031661075b565b9451998a9586948593845283016020600091939293604081019460018060a01b031681520152565b03925af1928315610d40576114c96114c1611410936114bb61075b9761141e996000916114d2575061039f565b34610680565b610cac611052565b928294386113fb565b610d5c9150883d8a11610d3957610d2a8183610136565b815161154792908b906115069061075b906001600160a01b031681565b60005461151b906001600160a01b031661075b565b908960008c5180988195829483528d83016020600091939293604081019460018060a01b031681520152565b03925af1918215610d405761075b61075b611578611585938f9798610c996115af9860009b8c91610e69575061039f565b93610cb185610cac611052565b885163a9059cbb60e01b815233888201908152602081019390935294859391928492839160400190565b03925af18015610d40576115ca91600091610e4c57506106b4565b3880806113f0565b966113e7565b6115ec91983d8091833e610ea98183610136565b96386113cd565b8b51906112ba565b34906112b1565b610d5c9150893d8b11610d3957610d2a8183610136565b610ef99150883d8a11610d3957610d2a8183610136565b611648919250863d8811610f3e57610f2f8183610136565b90386110ee565b61167d61168b6101769260405192839163104c13eb60e21b60208401526020602484015260448301906105a6565b03601f198101835282610136565b600080916020815191016a636f6e736f6c652e6c6f675afa50565b61168b6116d59161017693604051938492632d839cb360e21b60208501526040602485015260648401906105a6565b90604483015203601f198101835282610136565b61168b611718916101769360405193849263319af33360e01b60208501526040602485015260648401906105a6565b6001600160a01b0391909116604483015203601f19810183528261013656fea2646970667358221220cb74f0588328ca325a2eeea62eb7e4ca501eba334d4b1a3c0976d87996d9434464736f6c63430008120033";

type UniswapUtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UniswapUtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UniswapUtils__factory extends ContractFactory {
  constructor(...args: UniswapUtilsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UniswapUtils> {
    return super.deploy(overrides || {}) as Promise<UniswapUtils>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): UniswapUtils {
    return super.attach(address) as UniswapUtils;
  }
  override connect(signer: Signer): UniswapUtils__factory {
    return super.connect(signer) as UniswapUtils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapUtilsInterface {
    return new utils.Interface(_abi) as UniswapUtilsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapUtils {
    return new Contract(address, _abi, signerOrProvider) as UniswapUtils;
  }
}
