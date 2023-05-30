import hre from "hardhat";
import {logger, updateAddresses} from "utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Registrar, Registrar__factory} from "typechain-types";

async function deploy() {
  const {ethers, upgrades} = hre;

  let deployer: SignerWithAddress;
  [deployer] = await ethers.getSigners();

  const network = await ethers.provider.getNetwork();

  logger.divider();
  logger.out("Deploying to: " + network.name, logger.Level.Info);
  logger.out("With chain id: " + network.chainId, logger.Level.Info);

  const Registrar = (await ethers.getContractFactory("Registrar")) as Registrar__factory;
  const registrar = (await upgrades.deployProxy(Registrar)) as Registrar;

  await registrar.deployed();
  logger.pad(30, "Deployed to:", registrar.address);
  logger.out(await registrar.getRebalanceParams());
  logger.out(await registrar.getAngelProtocolParams());

  logger.divider();
  logger.out("Writing to contract-address.json", logger.Level.Info);

  await updateAddresses({registrar: {implementation: registrar.address}}, hre);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
