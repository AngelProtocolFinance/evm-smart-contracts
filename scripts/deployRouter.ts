import hre from "hardhat";
import {getAddresses, getSigners, logger, updateAddresses} from "utils";
import {Router, Router__factory} from "typechain-types";

async function deploy() {
  const {ethers, upgrades} = hre;

  const {proxyAdmin} = await getSigners(ethers);

  const network = await ethers.provider.getNetwork();

  const addresses = await getAddresses(hre);

  logger.divider();
  logger.out("Deploying to: " + network.name, logger.Level.Info);
  logger.out("With chain id: " + network.chainId, logger.Level.Info);

  const gatewayAddress = "";
  const gasReceiverAddress = "";
  const registrarAddress = addresses.registrar.proxy;

  const Router = (await ethers.getContractFactory(
    "Router__factory",
    proxyAdmin
  )) as Router__factory;
  const router = (await upgrades.deployProxy(Router, [
    gatewayAddress,
    gasReceiverAddress,
    registrarAddress,
  ])) as Router;

  await router.deployed();
  logger.pad(30, "Deployed to:", router.address);

  logger.divider();
  logger.out("Writing to contract-address.json", logger.Level.Info);

  await updateAddresses({router: {implementation: router.address}}, hre);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
