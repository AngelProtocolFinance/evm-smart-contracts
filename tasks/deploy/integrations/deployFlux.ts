import {task} from "hardhat/config";
import {FluxStrategy__factory} from "typechain-types";
import {getSigners, logger} from "utils";
import {deployStrategySet} from "./helpers";

const NAME = "flux";

task("Deploy:strategy:flux", `Will deploy ${NAME} and a pair of generic vaults`).setAction(
  async (_, hre) => {
    try {
      logger.out(`Deploying strategy: ${NAME}`);
      const {deployer} = await getSigners(hre);
      const StrategyFactory = new FluxStrategy__factory(deployer);
      await deployStrategySet(NAME, StrategyFactory, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
