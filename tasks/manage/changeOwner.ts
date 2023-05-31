import {task} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";
import {IndexFund__factory} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

task("manage:changeOwner", "Will update the owner of the specified contract").setAction(
  async (_taskArguments: TaskArguments, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const {proxyAdmin} = await getSigners(hre.ethers);
      const indexfund = IndexFund__factory.connect(addresses.indexFund.proxy, proxyAdmin);

      logger.out("Current owner:");
      let currentConfig = await indexfund.queryConfig();
      logger.out(currentConfig.owner);

      logger.out("Changing owner to:");
      logger.out(addresses.multiSig.apTeam.proxy);
      await indexfund.updateOwner(addresses.multiSig.apTeam.proxy);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
