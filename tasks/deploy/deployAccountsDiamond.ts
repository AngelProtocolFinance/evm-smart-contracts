import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("Deploy:AccountsDiamond", "It will deploy accounts diamond contracts").setAction(
  async (_, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const verify_contracts = !isLocalNetwork(hre.network);
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
  }
);
