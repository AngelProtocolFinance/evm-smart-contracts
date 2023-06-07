import config from "config";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("deploy:Router", "Will deploy Router contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {
        registrar,
        multiSig: {apTeam},
      } = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";

      await deployRouter(
        config.REGISTRAR_DATA.axelarGateway,
        config.REGISTRAR_DATA.axelarGasRecv,
        registrar.proxy,
        apTeam.proxy,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
