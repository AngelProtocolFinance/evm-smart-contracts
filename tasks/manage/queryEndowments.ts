import {task, types} from "hardhat/config";
import {AccountsQueryEndowments__factory} from "typechain-types";
import {getAddresses, getSigners, logger, structToObject} from "utils";

type TaskArgs = {id: number};

task("manage:queryEndowments", "Will query an Endowment's details")
  .addParam("id", "the endowment id", 0, types.int)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {apTeam1} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeam1
      );

      logger.out(structToObject(await queryEndowmentFacet.queryEndowmentDetails(taskArgs.id)));
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
