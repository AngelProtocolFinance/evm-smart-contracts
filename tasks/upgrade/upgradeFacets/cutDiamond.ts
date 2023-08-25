import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DiamondCutFacet__factory, DiamondInit__factory, ProxyAdmin__factory} from "typechain-types";
import {logger} from "utils";

import {FacetCut} from "./types";

export default async function cutDiamond(
  diamondAddress: string,
  diamondOwner: string,
  signer: SignerWithAddress, 
  facetCuts: FacetCut[],
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Updating Diamond with new facet addresses...");
  const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, signer);
  const diamondInit = DiamondInit__factory.connect(diamondAddress, signer);
  const proxyAdminMultisig = ProxyAdmin__factory.connect(diamondOwner, signer);
  const cuts = facetCuts.map((x) => x.cut);
  const payload = diamondCut.interface.encodeFunctionData("diamondCut", [cuts, diamondInit.address, "0x"])
  const tx = await proxyAdminMultisig.submitTransaction(
    diamondAddress, 
    0,
    payload,
    "0x"
  );
  const receipt = await hre.ethers.provider.waitForTransaction(tx.hash);

  if (!receipt.status) {
    throw new Error("Diamond cut failed.");
  }
}
