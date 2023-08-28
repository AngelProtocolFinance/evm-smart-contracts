import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  DiamondCutFacet__factory,
  DiamondInit__factory,
  ProxyAdminMultiSig__factory,
} from "typechain-types";
import {logger} from "utils";
import {FacetCut} from "./types";

export default async function cutDiamond(
  diamondAddress: string,
  proxyAdminMultiSig: string,
  proxyAdmin: SignerWithAddress,
  facetCuts: FacetCut[]
) {
  logger.out("Updating Diamond with new facet addresses...");
  const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, proxyAdmin);
  const diamondInit = DiamondInit__factory.connect(diamondAddress, proxyAdmin);
  const proxyAdminMultisig = ProxyAdminMultiSig__factory.connect(proxyAdminMultiSig, proxyAdmin);
  const cuts = facetCuts.map((x) => x.cut);
  const payload = diamondCut.interface.encodeFunctionData("diamondCut", [
    cuts,
    diamondInit.address,
    "0x",
  ]);
  const tx = await proxyAdminMultisig.submitTransaction(diamondAddress, 0, payload, "0x");
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
}
