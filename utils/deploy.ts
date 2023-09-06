import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
import {getContractName, logger} from ".";

export async function deploy<T extends ContractFactory>(
  Type: {new (...args: any): T},
  deployer: SignerWithAddress,
  constructorArguments?: Parameters<T["deploy"]>
): Promise<{
  contract: Awaited<ReturnType<T["deploy"]>>;
  constructorArguments?: Parameters<T["deploy"]>;
  contractName: string;
}> {
  const Contract = new Type(deployer);
  const contractName = getContractName(Contract);
  logger.out(`Deploying ${contractName}...`);
  const contract = await Contract.deploy(...(constructorArguments ?? []));
  try {
    await contract.deployed();
    logger.out(`Address: ${contract.address}`);
    return {
      constructorArguments,
      contractName,
      contract: contract as Awaited<ReturnType<T["deploy"]>>,
    };
  } catch (error) {
    logger.out(`Tx hash: ${contract.deployTransaction.hash}`);
    throw error;
  }
}
