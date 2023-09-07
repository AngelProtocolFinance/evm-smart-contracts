import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment} from "types";
import {logger} from ".";

export async function verify<T extends ContractFactory>(
  hre: HardhatRuntimeEnvironment,
  {contract: {address}, contractName, constructorArguments}: Deployment<T>
) {
  try {
    logger.out(`Verifying ${contractName} at: ${address}...`);
    const tenderlyVerif = hre.tenderly.verify({
      address: address,
      name: contractName,
    });
    const etherscanVerif = hre.run("verify:verify", {
      address,
      constructorArguments,
      contractName,
    });
    await Promise.allSettled([tenderlyVerif, etherscanVerif]);
  } catch (error) {
    logger.out(error, logger.Level.Warn);
  }
}
