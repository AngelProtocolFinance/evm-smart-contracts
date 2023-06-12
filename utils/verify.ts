import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger} from ".";
import {BaseContract} from "ethers";

type Args =
  | {
      contract: BaseContract;
      constructorArguments?: any[];
      contractPath?: string;
      address?: never; // Ensures `address` property cannot be present
    }
  | {
      address: string;
      constructorArguments?: any[];
      contractPath?: string;
      contract?: never; // Ensures `contract` property cannot be present
    };

export async function verify(hre: HardhatRuntimeEnvironment, args: Args) {
  const contractName = args.address === undefined ? args.contract.constructor.name : "contract";
  const address = args.address === undefined ? args.contract.address : args.address;

  try {
    logger.out(`Verifying ${contractName} at: ${address}...`);
    await hre.run("verify:verify", {
      address,
      constructorArguments: args.constructorArguments,
      contract: args.contractPath,
    });
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
