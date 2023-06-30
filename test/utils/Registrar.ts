import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { hrtime } from "process";
import {
  LocalRegistrar, 
  LocalRegistrar__factory,
  Registrar,
  Registrar__factory,
  ProxyContract__factory
} from "typechain-types"
import { DEFAULT_SPLIT_STRUCT } from "./helpers";

export async function deployLocalRegistrarAsProxy(
  owner: SignerWithAddress, 
  proxyAdmin: SignerWithAddress
): Promise<LocalRegistrar> {
  const LocalRegistrar = new LocalRegistrar__factory(proxyAdmin)
  const localRegistrarImpl = await LocalRegistrar.deploy()
  const data = localRegistrarImpl.interface.encodeFunctionData("initialize");
  const proxyFactory = new ProxyContract__factory(owner);
  let proxy = await proxyFactory.deploy(localRegistrarImpl.address, proxyAdmin.address, data);
  await proxy.deployed()
  return LocalRegistrar__factory.connect(proxy.address, owner);
}

export async function deployRegistrarAsProxy(
  owner: SignerWithAddress, 
  proxyAdmin: SignerWithAddress
): Promise<Registrar> {
  const Registrar = new Registrar__factory(proxyAdmin)
  const registrarImpl = await Registrar.deploy()
  await registrarImpl.deployed()
  const data = registrarImpl.interface.encodeFunctionData(
    "initialize((address,(uint256,uint256,uint256),address,address,address))",
    [
      {
        treasury: ethers.constants.AddressZero,
        splitToLiquid: DEFAULT_SPLIT_STRUCT,
        router: ethers.constants.AddressZero,
        axelarGateway: ethers.constants.AddressZero,
        axelarGasRecv: ethers.constants.AddressZero,
      },
    ]
  );
  let proxyFactory = new ProxyContract__factory(owner)
  let proxy = await proxyFactory.deploy(registrarImpl.address, proxyAdmin.address, data)
  await proxy.deployed()
  return Registrar__factory.connect(proxy.address, owner)
}