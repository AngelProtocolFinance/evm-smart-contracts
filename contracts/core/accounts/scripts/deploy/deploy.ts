import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  DiamondCutFacet__factory,
  DiamondInit__factory,
  Diamond__factory,
  IERC173__factory,
} from "typechain-types";
import {Deployment, getContractName, logger, updateAddresses} from "utils";
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

  await setDiamondContractOwner(diamond.address, diamondAdmin, deployer, hre);

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
  const DiamondCutFacet = new DiamondCutFacet__factory(deployer);
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  logger.out(`DiamondCutFacet deployed at: ${diamondCutFacet.address}`);

  const constructorArguments: Parameters<Diamond__factory["deploy"]> = [
    deployer.address,
    diamondCutFacet.address,
  ];
  const Diamond = new Diamond__factory(deployer);
  const diamond = await Diamond.deploy(...constructorArguments);
  await diamond.deployed();
  logger.out(`Diamond deployed at: ${diamond.address}`);

  await updateAddresses(
    {accounts: {diamond: diamond.address, facets: {diamondCutFacet: diamondCutFacet.address}}},
    hre
  );

  return {
    diamond: {
      address: diamond.address,
      contractName: getContractName(Diamond),
      constructorArguments,
    },
    diamondCutFacet: {
      address: diamondCutFacet.address,
      contractName: getContractName(DiamondCutFacet),
    },
  };
}

/**
 * DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
 * Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
 * @param admin signer representing administrator of the contract
 */
async function deployDiamondInit(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment> {
  const DiamondInit = new DiamondInit__factory(admin);
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  logger.out(`DiamondInit deployed at: ${diamondInit.address}`);

  await updateAddresses({accounts: {facets: {diamondInitFacet: diamondInit.address}}}, hre);

  return {
    address: diamondInit.address,
    contractName: getContractName(DiamondInit),
  };
}

async function setDiamondContractOwner(
  address: string,
  newOwner: string,
  curOwner: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  logger.out(`Transferring ownership from "${curOwner}" to "${newOwner}"...`);
  const accountsDiamond = IERC173__factory.connect(address, curOwner);
  const tx = await accountsDiamond.transferOwnership(newOwner);
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
}
