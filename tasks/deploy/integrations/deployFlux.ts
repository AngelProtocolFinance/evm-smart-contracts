import {task} from "hardhat/config";
import {FluxStrategy__factory} from "typechain-types";
import {getSigners, logger} from "utils";
import {deployStrategySet} from "./helpers";

const NAME = "flux";

type TaskArgs = {
  apTeamSignerPkey?: string;
};

task("Deploy:strategy:flux", `Will deploy ${NAME} and a pair of generic vaults`)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out(`Deploying strategy: ${NAME}`);
      const {deployer} = await getSigners(hre);
      const StrategyFactory = new FluxStrategy__factory(deployer);
      const signerPkey = taskArgs.apTeamSignerPkey ? taskArgs.apTeamSignerPkey : "";
      await deployStrategySet(NAME, StrategyFactory, signerPkey, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
