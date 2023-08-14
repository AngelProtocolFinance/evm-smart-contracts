import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  LocalRegistrar,
  LocalRegistrar__factory,
  Registrar,
  Registrar__factory,
  ProxyContract__factory,
} from "typechain-types";
import {DEFAULT_SPLIT_STRUCT} from "./helpers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function deployLocalRegistrarAsProxy(
  owner: SignerWithAddress,
  proxyAdmin: SignerWithAddress
): Promise<LocalRegistrar> {
  const LocalRegistrar = new LocalRegistrar__factory(proxyAdmin);
  const localRegistrarImpl = await LocalRegistrar.deploy();
  await localRegistrarImpl.deployed();
  const data = localRegistrarImpl.interface.encodeFunctionData("initialize");
  const proxyFactory = new ProxyContract__factory(owner);
  let proxy = await proxyFactory.deploy(localRegistrarImpl.address, proxyAdmin.address, data);
  await proxy.deployed();
  return LocalRegistrar__factory.connect(proxy.address, owner);
}

export async function deployRegistrarAsProxy(
  owner: SignerWithAddress,
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Registrar> {
  const Registrar = new Registrar__factory(proxyAdmin);
  const registrarImpl = await Registrar.deploy();
  await registrarImpl.deployed();
  const data = registrarImpl.interface.encodeFunctionData(
    "initialize((address,(uint256,uint256,uint256),address,address,address,string))",
    [
      {
        treasury: hre.ethers.constants.AddressZero,
        splitToLiquid: DEFAULT_SPLIT_STRUCT,
        router: hre.ethers.constants.AddressZero,
        axelarGateway: hre.ethers.constants.AddressZero,
        axelarGasService: hre.ethers.constants.AddressZero,
        networkName: "localhost",
      },
    ]
  );
  let proxyFactory = new ProxyContract__factory(owner);
  let proxy = await proxyFactory.deploy(registrarImpl.address, proxyAdmin.address, data);
  await proxy.deployed();
  return Registrar__factory.connect(proxy.address, owner);
}
