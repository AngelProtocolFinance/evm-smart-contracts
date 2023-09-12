import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Diamond__factory} from "typechain-types";
import {Deployment} from "types";
import {AddressObj, getContractName, getSigners} from "utils";

export default async function getDiamondAddresses(
  {accounts}: AddressObj,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<ContractFactory>[]> {
  if (!accounts.diamond) {
    return [];
  }

  const {deployer} = await getSigners(hre);
  const result: Deployment<ContractFactory>[] = [
    {
      contract: Diamond__factory.connect(accounts.diamond, hre.ethers.provider),
      contractName: getContractName(Diamond__factory),
      constructorArguments: [deployer.address, accounts.facets.diamondCutFacet],
    },
  ];

  for (const [facetName, address] of Object.entries(accounts.facets)) {
    if (!address) {
      continue;
    }
    const contractName = capitalize(facetName);
    result.push({
      contract: await hre.ethers.getContractAt(contractName, address),
      contractName,
    });
  }

  return result;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
