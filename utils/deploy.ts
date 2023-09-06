import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
import {getContractName, logger} from ".";

type Deployment<T extends ContractFactory> = {
  constructorArguments?: Parameters<T["deploy"]>;
  contract: Awaited<ReturnType<T["deploy"]>>;
  contractName: string;
};

export async function deploy<T extends ContractFactory>(
  Type: {new (...args: any): T},
  deployer: SignerWithAddress,
  constructorArguments?: Parameters<T["deploy"]>
): Promise<Deployment<T>> {
  const contractName = getContractName(Type);
  logger.out(`Deploying ${contractName}...`);
  const Contract = new Type(deployer);
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
