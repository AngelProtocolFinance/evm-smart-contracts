import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {submitMultiSigTx} from "tasks/helpers";
import {DiamondCutFacet__factory, DiamondInit__factory} from "typechain-types";
import {logger} from "utils";
import {FacetCut} from "./types";
import {Wallet} from "ethers";

export default async function cutDiamond(
  diamondAddress: string,
  proxyAdminMultiSig: string,
  proxyAdmin: SignerWithAddress | Wallet,
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
