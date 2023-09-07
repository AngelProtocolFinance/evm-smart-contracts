import {task} from "hardhat/config";
import {Registrar__factory} from "typechain-types";
import {getAddresses, logger, verify} from "utils";

task("manage:verifyRegistrar", "Will verify the Registrar implementation contract").setAction(
  async (_, hre) => {
    try {
      const addresses = await getAddresses(hre);
      await verify(hre, {
        contract: Registrar__factory.connect(
          addresses.registrar.implementation,
          hre.ethers.provider
        ),
        contractName: "Registrar",
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
