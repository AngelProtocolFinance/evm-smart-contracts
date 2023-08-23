import {task} from "hardhat/config";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger, verify} from "utils";

task("manage:verifyRegistrar", "Will verify the Registrar implementation contract").setAction(
  async (_, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const {proxyAdmin} = await getSigners(hre);

      let registrar = Registrar__factory.connect(addresses.registrar.proxy, proxyAdmin);

      let registrarConfig = await registrar.queryConfig();
      logger.out(`Registrar owner: ${registrarConfig.proxyAdmin}`);

      await verify(hre, {address: addresses.registrar.implementation, contractName: "Registrar"});
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
