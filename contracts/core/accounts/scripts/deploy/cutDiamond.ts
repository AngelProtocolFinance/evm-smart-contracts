import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DiamondCutFacet__factory, DiamondInit} from "typechain-types";
import {getNetworkName, logger} from "utils";
import {FacetCut} from "./types";

export default async function cutDiamond(
  address: string,
  diamondInit: DiamondInit,
  admin: SignerWithAddress,
  owner: string,
  registrar: string,
  facetCuts: FacetCut[],
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Cutting the Diamond with new facets...");

  const networkName = await getNetworkName(hre);
  const diamondCut = DiamondCutFacet__factory.connect(address, admin);
  const calldata = diamondInit.interface.encodeFunctionData("init", [
    owner,
    registrar,
    networkName,
  ]);

  const cuts = facetCuts.map((x) => x.cut);
  const tx = await diamondCut.diamondCut(cuts, diamondInit.address, calldata);
  logger.out(`Cutting Diamond tx: ${tx.hash}`);

  const receipt = await hre.ethers.provider.waitForTransaction(tx.hash);

  if (!receipt.status) {
    throw new Error(`Diamond cut failed: ${tx.hash}`);
  }

  logger.out("Completed Diamond cut.");
}
