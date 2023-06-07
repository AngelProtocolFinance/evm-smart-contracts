import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";

task("deploy:AccountsDiamond", "It will deploy accounts diamond contracts")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs: {verify: string}, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";
      await deployAccountsDiamond(
        addresses.multiSig.apTeam.proxy,
        addresses.registrar.proxy,
        addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
