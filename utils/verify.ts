import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment, logger} from ".";

export async function verify(hre: HardhatRuntimeEnvironment, deployment: Deployment) {
  try {
    logger.out(`Verifying ${deployment.contractName} at: ${deployment.address}...`);
    const tenderlyVerif = hre.tenderly.verify({
      name: deployment.contractName,
      address: deployment.address,
    });
    const etherscanVerif = hre.run("verify:verify", deployment);
    await Promise.allSettled([tenderlyVerif, etherscanVerif]);
  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}
