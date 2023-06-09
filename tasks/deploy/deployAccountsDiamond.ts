import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";

task("deploy:AccountsDiamond", "It will deploy accounts diamond contracts")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
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
