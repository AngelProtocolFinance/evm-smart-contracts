import config from "config";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("deploy:Router", "Will deploy Router contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const {
        registrar,
        multiSig: {apTeam},
      } = await getAddresses(hre);

      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployRouter(
        config.REGISTRAR_DATA.axelarGateway,
        config.REGISTRAR_DATA.axelarGasRecv,
        registrar.proxy,
        apTeam.proxy,
        verify,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
