import {task} from "hardhat/config";
import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {getAddresses, getSigners, logger} from "utils";

task("Deploy:deployRegistrar", "Will deploy Registrar contract")
  .addParam("verify", "Want to verify contract")
  .addParam("strlib", "Address of the string Library contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {
        multiSig: {apTeam},
      } = await getAddresses(hre);
      const {treasuryAdmin, routerAdmin} = await getSigners(hre.ethers);
      const registrarData = {
        treasury: treasuryAdmin.address,
        splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
        router: routerAdmin.address,
        axelarGateway: config.REGISTRAR_DATA.axelarGateway,
        axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv,
      };
      var isTrueSet = taskArgs.verify === "true";
      await deployRegistrar(taskArgs.strlib, registrarData, apTeam.proxy, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
