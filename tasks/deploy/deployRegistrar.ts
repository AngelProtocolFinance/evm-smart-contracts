import {task} from "hardhat/config";
import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {getAddresses, getSigners, isLocalNetwork, logger} from "utils";
import {deployRouter} from "contracts/core/router/scripts/deploy";

task("Deploy:Registrar", "Will deploy Registrar contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {
        multiSig: {apTeam},
        router,
      } = await getAddresses(hre);
      const {treasury} = await getSigners(hre.ethers);

      const registrarData = {
        treasury: treasury.address,
        splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
        router: router.proxy,
        axelarGateway: config.REGISTRAR_DATA.axelarGateway,
        axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv,
      };
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";

      const registrar = await deployRegistrar(registrarData, apTeam.proxy, verify_contracts, hre);

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
