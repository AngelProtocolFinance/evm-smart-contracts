import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {task} from "hardhat/config";
import {Registrar} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

task("manage:verifyRegistrar", "Will create a new charity endowment").setAction(
  async (_taskArguments, hre) => {
    try {
      const addresses = await getAddresses(hre);

      let registrar = (await hre.ethers.getContractAt(
        "Registrar",
        addresses.registrar.proxy
      )) as Registrar;

      let registrarConfig = await registrar.queryConfig();
      logger.out(`Registrar owner: ${registrarConfig.proxyAdmin}`);

      await hre.run("verify:verify", {
        address: addresses.registrar.implementation,
        constructorArguments: [],
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
