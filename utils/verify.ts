import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger} from ".";

export async function verify(
  hre: HardhatRuntimeEnvironment,
  address: string,
  constructorArguments: any[] = []
) {
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments,
    });
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
