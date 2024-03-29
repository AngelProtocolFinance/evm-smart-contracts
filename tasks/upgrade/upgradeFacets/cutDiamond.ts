import {Signer} from "ethers";
import {submitMultiSigTx} from "tasks/helpers";
import {DiamondCutFacet__factory, DiamondInit__factory} from "typechain-types";
import {logger} from "utils";
import {FacetCut} from "./types";

export default async function cutDiamond(
  diamondAddress: string,
  proxyAdminMultiSig: string,
  proxyAdmin: Signer,
  facetCuts: FacetCut[]
) {
  logger.out("Updating Diamond with new facet addresses...");
  const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, proxyAdmin);
  const diamondInit = DiamondInit__factory.connect(diamondAddress, proxyAdmin);
  const cuts = facetCuts.map((x) => x.cut);
  const payload = diamondCut.interface.encodeFunctionData("diamondCut", [
    cuts,
    diamondInit.address,
    "0x",
  ]);
  await submitMultiSigTx(proxyAdminMultiSig, proxyAdmin, diamondAddress, payload);
}
