import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DiamondCutFacet__factory, DiamondInit__factory} from "typechain-types";
import {getAxlNetworkName, logger} from "utils";
import {FacetCut} from "./types";

export default async function cutDiamond(
  address: string,
  diamondInit: string,
  admin: Signer,
  owner: string,
  registrar: string,
  facetCuts: FacetCut[],
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Cutting the Diamond with new facets...");

  const networkName = await getAxlNetworkName(hre);
  const diamondCut = DiamondCutFacet__factory.connect(address, admin);
  const calldata = DiamondInit__factory.createInterface().encodeFunctionData("init", [
    owner,
    registrar,
    networkName,
  ]);

  const tx = await diamondCut.diamondCut(
    facetCuts.map((x) => x.cut),
    diamondInit,
    calldata
  );
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();

  logger.out("Completed Diamond cut.");
}
