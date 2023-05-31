import hre from "hardhat";
import {getSigners, logger, updateAddresses} from "utils";
import {Halo__factory} from "typechain-types";
import {BigNumber} from "ethers";

async function deploy() {
  const {proxyAdmin} = await getSigners(hre.ethers);

  // @TODO replace these with valid values
  let SUPPLY = BigNumber.from(10).pow(27); // 1 Billion tokens with 18 decimals
  let recipient: string = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth
  const network = await hre.ethers.provider.getNetwork();

  logger.divider();
  logger.out("Deploying to: " + network.name, logger.Level.Info);
  logger.out("With chain id: " + network.chainId, logger.Level.Info);

  const Halo = (await hre.ethers.getContractFactory("Halo", proxyAdmin)) as Halo__factory;
  const halo = await Halo.deploy(recipient, SUPPLY);

  await halo.deployed();
  logger.pad(30, "Deployed to:", halo.address);

  logger.divider();
  logger.out("Writing to contract-address.json", logger.Level.Info);

  await updateAddresses({tokens: {halo: halo.address}}, hre);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
