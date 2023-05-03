/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Diamond,
  DiamondInterface,
} from "../../../../../contracts/core/accounts/diamond/Diamond";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "curContractowner",
        type: "address",
      },
      {
        internalType: "address",
        name: "curDiamondcutfacet",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curInitializationcontractaddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "curCalldata",
        type: "bytes",
      },
    ],
    name: "InitializationFunctionReverted",
    type: "error",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6001600160401b03610fac6080601f38839003908101601f19168201908482118383101761072d57808391604095869485528339810103126107285761004481610781565b906100526020809201610781565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c132080546001600160a01b039485166001600160a01b031982168117909255919260009290919085167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08480a36100c6610762565b9260019081855282845b8181106107045750506100e1610762565b8281528336818301376307e4c70760e21b6100fb82610795565b5286610105610743565b9216825284848301528782015261011b85610795565b5261012584610795565b50855196828801908111888210176106f05786528287529382855b610263575b5085519460608087019080885286518092526080938489019086868560051b8c010199019588935b8585106101c057508b7f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb6738c8f6101b08e83928f8f850152838203878501526107f1565b0390a1516101219081610e2b8239f35b9091929394959699607f198c82030185528a5190828101918581511682528a810151600381101561024f578b8301528e0151818f018490528051928390528a019189918b91908601908d905b80821061022b575050819293509c01950195019396959492919061016d565b85516001600160e01b0319168352948301948c948e9493909301929091019061020c565b634e487b7160e01b8d52602160045260248dfd5b84959195518110156106e8578261027a82876107b8565b51015160038110156106d457806104035750818661029883886107b8565b515116886102a684896107b8565b5101516102b581511515610831565b6102c0821515610891565b6001600160a01b0382166000908152600080516020610f8c83398151915260205260409020546001600160601b031680156103f5575b9280949388915b610318575b50505050610310905b6107cc565b909591610140565b909192939483518310156103ee57506001600160e01b031961033a83856107b8565b5116808952600080516020610f4c83398151915288528a8c8a2054166103845761037582610370878a9897969561037b95610a46565b6108f2565b916107cc565b908495946102fd565b8b5162461bcd60e51b815260048101899052603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f60448201527f6e207468617420616c72656164792065786973747300000000000000000000006064820152608490fd5b9493610302565b6103fe83610931565b6102f6565b8083036105735750818661041783886107b8565b5151168861042584896107b8565b51015161043481511515610831565b61043f821515610891565b6001600160a01b0382166000908152600080516020610f8c83398151915260205260409020546001600160601b03168015610565575b9280949388915b61048d5750505050610310906107cc565b909192939483518310156103ee57506001600160e01b03196104af83856107b8565b5116808952600080516020610f4c83398151915288528a8c8a2054168581146104fb5782610370878a98979695856104ed6104f29761037597610b31565b610a46565b9084959461047c565b8c5162461bcd60e51b8152600481018a9052603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e20776974682073616d652066756e6374696f6e00000000000000006064820152608490fd5b61056e83610931565b610475565b600203610680578561058582876107b8565b5151168761059383886107b8565b510151906105a382511515610831565b6106165782919085835b6105bd575b5050610310906107cc565b819293915181101561060d576106049061030b6001600160e01b03196105e383876107b8565b5116808a52600080516020610f4c83398151915289528b8d8b205416610b31565b819392916105ad565b819392506105b2565b875162461bcd60e51b815260048101859052603660248201527f4c69624469616d6f6e644375743a2052656d6f7665206661636574206164647260448201527f657373206d7573742062652061646472657373283029000000000000000000006064820152608490fd5b865162461bcd60e51b815260048101849052602760248201527f4c69624469616d6f6e644375743a20496e636f727265637420466163657443756044820152663a20b1ba34b7b760c91b6064820152608490fd5b634e487b7160e01b85526021600452602485fd5b949094610145565b634e487b7160e01b84526041600452602484fd5b61070c610743565b868152868382015260608a8201528282890101520183906100d0565b600080fd5b634e487b7160e01b600052604160045260246000fd5b60405190606082016001600160401b0381118382101761072d57604052565b60408051919082016001600160401b0381118382101761072d57604052565b51906001600160a01b038216820361072857565b8051156107a25760200190565b634e487b7160e01b600052603260045260246000fd5b80518210156107a25760209160051b010190565b60001981146107db5760010190565b634e487b7160e01b600052601160045260246000fd5b919082519283825260005b84811061081d575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016107fc565b1561083857565b60405162461bcd60e51b815260206004820152602b60248201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660448201526a1858d95d081d1bc818dd5d60aa1b6064820152608490fd5b1561089857565b60405162461bcd60e51b815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201526b65206164647265737328302960a01b6064820152608490fd5b6001600160601b039081169081146107db5760010190565b600080516020610f6c83398151915280548210156107a25760005260206000200190600090565b610939610743565b602481527f4c69624469616d6f6e644375743a204e657720666163657420686173206e6f20602082015263636f646560e01b6040820152813b156109fb5750600080516020610f6c83398151915280546001600160a01b0383166000908152600080516020610f8c8339815191526020526040902060010181905591906801000000000000000083101561072d57826109da9160016109f99501905561090a565b90919082549060031b9160018060a01b03809116831b921b1916179055565b565b60405162461bcd60e51b815260206004820152908190610a1f9060248301906107f1565b0390fd5b91909180548310156107a257600052601c60206000208360031c019260021b1690565b6001600160e01b031981166000818152600080516020610f4c83398151915260208190526040822080546001600160a01b031660a09690961b6001600160a01b031916959095179094559194939092906001600160a01b0316808352600080516020610f8c8339815191526020526040832080549194919068010000000000000000821015610b1d5796610ae78260409798996001610b0495018155610a23565b90919063ffffffff83549160031b9260e01c831b921b1916179055565b82526020522080546001600160a01b0319169091179055565b634e487b7160e01b85526041600452602485fd5b9091906001600160a01b039081168015610dbf57308114610d635763ffffffff60e01b809416600092818452600080516020610f4c833981519152926020918483526040948587205460a01c90838852600080516020610f8c8339815191529586865287892054926000199b8c8501948511610d4f57908991888c898c89808703610ce1575b505090525050508787525087892080548015610ccd578c0190610bda8282610a23565b63ffffffff82549160031b1b191690555588528452868681205515610c04575b5050505050509050565b600080516020610f6c8339815191528054898101908111610cb957838852858552826001888a20015491808303610c87575b5050508054988915610c735760019798990191610c528361090a565b909182549160031b1b19169055558552528220015580388080808080610bfa565b634e487b7160e01b88526031600452602488fd5b610c909061090a565b90549060031b1c16610ca5816109da8461090a565b885285855260018789200155388281610c36565b634e487b7160e01b88526011600452602488fd5b634e487b7160e01b8b52603160045260248bfd5b610d429784610ae793610d008a9487610d169952828a52848420610a23565b90549060031b1c60e01b97889683525220610a23565b168b52838852898b2080546001600160a01b031660a09290921b6001600160a01b031916919091179055565b873880888c898c89610bb7565b634e487b7160e01b8b52601160045260248bfd5b60405162461bcd60e51b815260206004820152602e60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201526d3a30b1363290333ab731ba34b7b760911b6064820152608490fd5b60405162461bcd60e51b815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e27742065786973740000000000000000006064820152608490fdfe6080604052361560e95760007fffffffff0000000000000000000000000000000000000000000000000000000081351681527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c60205273ffffffffffffffffffffffffffffffffffffffff6040822054168015609157818091368280378136915af43d82803e15608d573d90f35b3d90fd5b7f08c379a0000000000000000000000000000000000000000000000000000000006080526020608452602060a4527f4469616d6f6e643a2046756e6374696f6e20646f6573206e6f7420657869737460c45260646080fd5b00fea26469706673582212205191544607974bf0f1db5d5a0ed51b8c1e24ea21cf7642e5c021e33da35d8b8c64736f6c63430008120033c8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131cc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131ec8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131d";

type DiamondConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Diamond__factory extends ContractFactory {
  constructor(...args: DiamondConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    curContractowner: PromiseOrValue<string>,
    curDiamondcutfacet: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<Diamond> {
    return super.deploy(
      curContractowner,
      curDiamondcutfacet,
      overrides || {}
    ) as Promise<Diamond>;
  }
  override getDeployTransaction(
    curContractowner: PromiseOrValue<string>,
    curDiamondcutfacet: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      curContractowner,
      curDiamondcutfacet,
      overrides || {}
    );
  }
  override attach(address: string): Diamond {
    return super.attach(address) as Diamond;
  }
  override connect(signer: Signer): Diamond__factory {
    return super.connect(signer) as Diamond__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondInterface {
    return new utils.Interface(_abi) as DiamondInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Diamond {
    return new Contract(address, _abi, signerOrProvider) as Diamond;
  }
}
