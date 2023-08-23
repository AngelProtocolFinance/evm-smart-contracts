import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  Diamond,
  DiamondCutFacet,
  DiamondCutFacet__factory,
  DiamondInit,
  DiamondInit__factory,
  Diamond__factory,
} from "typechain-types";
import {
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
  validateAddress,
} from "utils";

import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";

export async function deployAccountsDiamond(
  owner = "",
  registrar = "",
  hre: HardhatRuntimeEnvironment
): Promise<
  | {
      diamond: Deployment;
      facets: Array<Deployment>;
    }
  | undefined
> {
  logger.out("Deploying and setting up Accounts Diamond and all its facets...");

  const {proxyAdmin} = await getSigners(hre);

  try {
    validateAddress(owner, "owner");
    validateAddress(registrar, "registrar");

    const {diamond, diamondCutFacet} = await deployDiamond(proxyAdmin, hre);

    const diamondInit = await deployDiamondInit(proxyAdmin, hre);

    const cuts = await deployFacets(proxyAdmin, hre);

    await cutDiamond(diamond.address, diamondInit.address, proxyAdmin, owner, registrar, cuts, hre);

    return {
      diamond: {
        address: diamond.address,
        contractName: "Accounts Diamond",
        constructorArguments: [proxyAdmin.address, diamondCutFacet.address],
      },
      facets: cuts
        .map<Deployment>(({cut, facetName}) => ({
          address: cut.facetAddress.toString(),
          contractName: facetName,
        }))
        .concat(diamondCutFacet, diamondInit),
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}

async function deployDiamond(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{diamond: Deployment; diamondCutFacet: Deployment}> {
  const DiamondCutFacet = new DiamondCutFacet__factory(admin);
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  logger.out(`DiamondCutFacet deployed at: ${diamondCutFacet.address}`);

  const Diamond = new Diamond__factory(admin);
  const diamond = await Diamond.deploy(admin.address, diamondCutFacet.address);
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
