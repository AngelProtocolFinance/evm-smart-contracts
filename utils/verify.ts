import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment} from "types";
import {logger} from ".";

/**
 * Verifies contract on Tenderly and the connected Etherscan-like explorer.
 *
 * NOTE: Always verify implementation first and then proxy, because otherwise 'verify' task
 * passes proxy's ctor args as if they are implementation's, causing verification to fail.
 *
 * @param hre HardhatRuntimeEnvironment
 * @param deployment Deployment<T> data
 */
export async function verify<T extends ContractFactory>(
  hre: HardhatRuntimeEnvironment,
  deployment: Deployment<T>,
  includeTenderly?: boolean
) {
  try {
    const {
      contract: {address},
      contractName,
      constructorArguments,
    } = deployment;

    logger.out(`Verifying ${contractName} at: ${address}...`);

    let promises:Promise<any>[] = [];
    if(includeTenderly) {
      promises.push(hre.tenderly.verify({
        address: address,
        name: contractName,
      }));
    }
    promises.push(hre.run("verify:verify", {
      address,
      constructorArguments,
      contractName,
    }));

    await Promise.allSettled(promises);

  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}
