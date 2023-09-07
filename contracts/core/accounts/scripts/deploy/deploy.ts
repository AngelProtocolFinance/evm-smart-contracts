import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  DiamondCutFacet__factory,
  DiamondInit__factory,
  Diamond__factory,
  IERC173__factory,
} from "typechain-types";
import {Deployment} from "types";
import {deploy, logger, updateAddresses} from "utils";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";

export async function deployAccountsDiamond(
  owner: string,
  registrar: string,
  diamondAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  diamond: Deployment<Diamond__factory>;
  facets: Array<Deployment<ContractFactory>>;
}> {
  logger.out("Deploying and setting up Accounts Diamond and all its facets...");

  const {diamond, diamondCutFacet} = await deployDiamond(deployer, hre);

  const diamondInit = await deployDiamondInit(deployer, hre);

  const cuts = await deployFacets(deployer, hre);

  await cutDiamond(
    diamond.contract.address,
    diamondInit.contract.address,
    deployer,
    owner,
    registrar,
    cuts,
    hre
  );

  await setDiamondContractOwner(diamond.contract.address, diamondAdmin, deployer);

  return {
    diamond,
    facets: cuts
      .map<Deployment<ContractFactory>>((facetCut) => facetCut.deployment)
      .concat(diamondCutFacet, diamondInit),
  };
}

async function deployDiamond(
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  diamond: Deployment<Diamond__factory>;
  diamondCutFacet: Deployment<DiamondCutFacet__factory>;
}> {
  const diamondCutFacet = await deploy(new DiamondCutFacet__factory(deployer));

  const diamond = await deploy(new Diamond__factory(deployer), [
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
    diamond,
    diamondCutFacet,
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
): Promise<Deployment<DiamondInit__factory>> {
  const diamondInit = await deploy(new DiamondInit__factory(admin));

  await updateAddresses(
    {accounts: {facets: {diamondInitFacet: diamondInit.contract.address}}},
    hre
  );

  return diamondInit;
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
