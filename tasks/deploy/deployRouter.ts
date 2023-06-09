import config from "config";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployRouter} from "contracts/core/router/scripts/deploy";

task("deploy:Router", "Will deploy Router contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const {
        registrar,
        multiSig: {apTeam},
      } = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

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
