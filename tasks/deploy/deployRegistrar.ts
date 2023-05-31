import {task} from "hardhat/config";
import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {getAddresses, getSigners, logger} from "utils";

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
      var isTrueSet = taskArgs.verify === "true";
      await deployRegistrar(registrarData, apTeam.proxy, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
