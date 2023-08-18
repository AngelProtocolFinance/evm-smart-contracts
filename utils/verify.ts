import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment, logger, getContractName} from ".";

export async function verify(hre: HardhatRuntimeEnvironment, deployment: Deployment) {
  try {
    logger.out(`Verifying ${deployment.contractName ?? "contract"} at: ${deployment.address}...`);
    if(!deployment.contractName) {
      throw new Error("Contract name required")
    }
    await hre.tenderly.verify({
      name: deployment.contractName,
      address: deployment.address,
    });
    await hre.run("verify:verify", deployment);
  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}
