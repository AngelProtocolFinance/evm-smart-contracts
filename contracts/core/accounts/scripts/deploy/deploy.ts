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
import {getSigners, logger, updateAddresses} from "utils";

import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";
import verify from "./verify";

export async function deployAccountsDiamond(
  owner: string,
  registrar: string,
  ANGEL_CORE_STRUCT: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying and setting up Accounts Diamond and all its facets...");

  const {proxyAdmin} = await getSigners(hre);

  const {diamond, diamondCutFacet} = await deployDiamond(proxyAdmin, hre);

  const diamondInit = await deployDiamondInit(proxyAdmin, hre);

  const cuts = await deployFacets(proxyAdmin, ANGEL_CORE_STRUCT, hre);

  await cutDiamond(diamond.address, diamondInit, proxyAdmin, owner, registrar, cuts, hre);

  if (verify_contracts) {
    await verify(diamond.address, diamondCutFacet.address, cuts, proxyAdmin, hre);
  }

  return diamond;
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
