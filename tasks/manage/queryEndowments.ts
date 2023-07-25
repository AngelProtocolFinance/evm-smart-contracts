import {task, types} from "hardhat/config";
import {
  AccountsCreateEndowment__factory,
  AccountsQueryEndowments__factory,
  CharityApplications__factory,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/multisigs/CharityApplications";
import {getAddresses, getSigners, logger, structToObject} from "utils";

type TaskArgs = {id: number};

task("manage:queryEndowments", "Will create a new endowment")
  .addParam("id", "the endowment id", 0, types.int)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {apTeam1} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeam1
      );

      logger.out(await queryEndowmentFacet.queryEndowmentDetails(taskArgs.id))
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
