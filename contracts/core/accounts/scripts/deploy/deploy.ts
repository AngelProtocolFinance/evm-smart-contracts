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
import deployFacets from "./deployFacets";
import updateDiamond from "./updateDiamond";
import verify from "./verify";
import {getSigners, logger, updateAddresses} from "utils";

export async function deployDiamond(
  owner: string,
  registrar: string,
  ANGEL_CORE_STRUCT: string,
  STRING_LIBRARY: string,
  hre: HardhatRuntimeEnvironment,
  verify_contracts = false
) {
  try {
    const {proxyAdmin} = await getSigners(hre.ethers);
    const diamondCut = await deployDiamondCutFacet(proxyAdmin);

    const diamond = await _deployDiamond(proxyAdmin, diamondCut.address, hre);

    const diamondInit = await deployDiamondInit(proxyAdmin);

    const cuts = await deployFacets(proxyAdmin, ANGEL_CORE_STRUCT, STRING_LIBRARY);

    await updateDiamond(diamond.address, diamondInit, proxyAdmin, owner, registrar, cuts, hre);

    if (verify_contracts) {
      await verify(diamond.address, diamondCut.address, cuts, proxyAdmin, hre);
    }

    return Promise.resolve(diamond.address);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function deployDiamondCutFacet(admin: SignerWithAddress): Promise<DiamondCutFacet> {
  const DiamondCutFacet = new DiamondCutFacet__factory(admin);
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  console.log("DiamondCutFacet deployed:", diamondCutFacet.address);
  return diamondCutFacet;
}

async function _deployDiamond(
  admin: SignerWithAddress,
  diamondCut: string,
  hre: HardhatRuntimeEnvironment
): Promise<Diamond> {
  const Diamond = new Diamond__factory(admin);
  const diamond = await Diamond.deploy(admin.address, diamondCut);
  await diamond.deployed();
  console.log("Diamond deployed:", diamond.address);

  logger.out("Saving address to contract-address.json...");
  await updateAddresses({accounts: {diamond: diamond.address}}, hre);

  return diamond;
}

/**
 * DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
 * Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
 * @param admin signer representing administrator of the contract
 */
async function deployDiamondInit(admin: SignerWithAddress): Promise<DiamondInit> {
  const DiamondInit = new DiamondInit__factory(admin);
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  console.log("DiamondInit deployed:", diamondInit.address, "\n");
  return diamondInit;
}
