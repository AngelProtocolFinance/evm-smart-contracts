import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  DiamondCutFacet__factory,
  DiamondInit__factory,
  Diamond__factory,
  IERC173__factory,
} from "typechain-types";
import {Deployment, deploy, logger, updateAddresses} from "utils";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";

export async function deployAccountsDiamond(
  owner: string,
  registrar: string,
  diamondAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  diamond: Deployment;
  facets: Array<Deployment>;
}> {
  logger.out("Deploying and setting up Accounts Diamond and all its facets...");

  const {diamond, diamondCutFacet} = await deployDiamond(deployer, hre);

  const diamondInit = await deployDiamondInit(deployer, hre);

  const cuts = await deployFacets(deployer, hre);

  await cutDiamond(diamond.address, diamondInit.address, deployer, owner, registrar, cuts, hre);

  await setDiamondContractOwner(diamond.address, diamondAdmin, deployer);

  return {
    diamond,
    facets: cuts
      .map<Deployment>(({cut, facetName}) => ({
        address: cut.facetAddress.toString(),
        contractName: facetName,
      }))
      .concat(diamondCutFacet, diamondInit),
  };
}

async function deployDiamond(
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{diamond: Deployment; diamondCutFacet: Deployment}> {
  const diamondCutFacet = await deploy(DiamondCutFacet__factory, deployer);

  const diamond = await deploy(Diamond__factory, deployer, [
    deployer.address,
    diamondCutFacet.contract.address,
  ]);

  await updateAddresses(
    {
      accounts: {
        diamond: diamond.contract.address,
        facets: {diamondCutFacet: diamondCutFacet.contract.address},
      },
    },
    hre
  );

  return {
    diamond: {
      address: diamond.contract.address,
      contractName: diamond.contractName,
      constructorArguments: diamond.constructorArguments,
    },
    diamondCutFacet: {
      address: diamondCutFacet.contract.address,
      contractName: diamondCutFacet.contractName,
    },
  };
}

/**
 * DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
 * Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
 * @param deployer signer representing deployer of the contract
 */
async function deployDiamondInit(
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment> {
  const diamondInit = await deploy(DiamondInit__factory, deployer);

  await updateAddresses(
    {accounts: {facets: {diamondInitFacet: diamondInit.contract.address}}},
    hre
  );

  return {
    address: diamondInit.contract.address,
    contractName: diamondInit.contractName,
    constructorArguments: diamondInit.constructorArguments,
  };
}

async function setDiamondContractOwner(
  address: string,
  newOwner: string,
  curOwner: SignerWithAddress
) {
  logger.out(`Transferring ownership from "${curOwner}" to "${newOwner}"...`);
  const accountsDiamond = IERC173__factory.connect(address, curOwner);
  const tx = await accountsDiamond.transferOwnership(newOwner);
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
}
