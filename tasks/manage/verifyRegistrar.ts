import {task} from "hardhat/config";
import {getAddresses, logger, verify} from "utils";

task("manage:verifyRegistrar", "Will verify the Registrar implementation contract").setAction(
  async (_, hre) => {
    try {
      const addresses = await getAddresses(hre);
      await verify(hre, {address: addresses.registrar.implementation, contractName: "Registrar"});
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
