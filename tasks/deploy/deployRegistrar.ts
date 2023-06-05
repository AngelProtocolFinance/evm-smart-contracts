import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("deploy:Registrar", "Will deploy Registrar contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {
        multiSig: {apTeam},
        router,
      } = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";

      const registrar = await deployRegistrar(router.proxy, apTeam.proxy, verify_contracts, hre);

      await deployRouter(
        config.REGISTRAR_DATA.axelarGateway,
        config.REGISTRAR_DATA.axelarGasRecv,
        registrar.proxy.address,
        apTeam.proxy,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
