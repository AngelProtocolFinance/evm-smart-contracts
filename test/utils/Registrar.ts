import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {upgrades} from "hardhat";
import {LocalRegistrar, LocalRegistrar__factory} from "typechain-types";

export async function deployRegistrarAsProxy(
  proxyAdmin: SignerWithAddress
): Promise<LocalRegistrar> {
  const Registrar = new LocalRegistrar__factory(proxyAdmin);
  const registrar = (await upgrades.deployProxy(Registrar)) as LocalRegistrar;
  await registrar.deployed();
  return registrar;
}
