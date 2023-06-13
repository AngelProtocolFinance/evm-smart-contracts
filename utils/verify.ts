import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger} from ".";

type Args = {
  address: string;
  constructorArguments?: readonly any[];
  contractName?: string;
  contract?: string;
};

export async function verify(hre: HardhatRuntimeEnvironment, args: Args) {
  try {
    logger.out(`Verifying ${args.contractName ?? "contract"} at: ${args.address}...`);
    await hre.run("verify:verify", args);
  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}