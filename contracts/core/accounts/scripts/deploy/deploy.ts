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
import {ADDRESS_ZERO, getSigners, logger, updateAddresses, validateAddress, verify} from "utils";

import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";

export async function deployAccountsDiamond(
  owner: string,
  registrar: string,
  angelCoreStruct: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying and setting up Accounts Diamond and all its facets...");

    validateAddress(owner, "owner");
    validateAddress(registrar, "registrar");
    validateAddress(angelCoreStruct, "angelCoreStruct");

    const {diamond, diamondCutFacet} = await deployDiamond(proxyAdmin, hre);

    const diamondInit = await deployDiamondInit(proxyAdmin, hre);

    const cuts = await deployFacets(proxyAdmin, angelCoreStruct, hre);

    await cutDiamond(diamond.address, diamondInit, proxyAdmin, owner, registrar, cuts, hre);

    if (verify_contracts) {
      for (const {facetName, cut} of cuts) {
        await verify(hre, {address: cut.facetAddress.toString(), contractName: facetName});
      }
      await verify(hre, {
        address: diamond.address,
        contractName: "Diamond",
        constructorArguments: [proxyAdmin.address, diamondCutFacet.address],
      });
    }

    return diamond;
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return Diamond__factory.connect(ADDRESS_ZERO, proxyAdmin);
  }
}

async function deployDiamond(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{diamond: Diamond; diamondCutFacet: DiamondCutFacet}> {
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

  return {diamond, diamondCutFacet};
}

/**
 * DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
 * Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
 * @param admin signer representing administrator of the contract
 */
async function deployDiamondInit(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<DiamondInit> {
  const DiamondInit = new DiamondInit__factory(admin);
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  logger.out(`DiamondInit deployed at: ${diamondInit.address}`);

  await updateAddresses({accounts: {facets: {diamondInitFacet: diamondInit.address}}}, hre);

  return diamondInit;
}
