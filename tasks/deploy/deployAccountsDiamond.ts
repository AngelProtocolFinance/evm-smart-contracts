import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, logger, shouldVerify} from "utils";

task("deploy:AccountsDiamond", "It will deploy accounts diamond contracts")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const verify_contracts = shouldVerify(hre.network) && taskArgs.verify;
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
