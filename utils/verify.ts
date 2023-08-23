import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment, logger} from ".";

export async function verify(hre: HardhatRuntimeEnvironment, deployment: Deployment) {
  try {
    logger.out(`Verifying ${deployment.contractName ?? "contract"} at: ${deployment.address}...`);
    await hre.tenderly.verify({
      name: deployment.contractName,
      address: deployment.address,
    });
    await hre.run("verify:verify", deployment);
  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}
