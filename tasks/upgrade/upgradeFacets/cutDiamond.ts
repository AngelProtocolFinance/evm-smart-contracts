import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {submitMultiSigTx} from "tasks/helpers";
import {DiamondCutFacet__factory, DiamondInit__factory, IDiamondCut} from "typechain-types";
import {logger} from "utils";

export default async function cutDiamond(
  diamondAddress: string,
  proxyAdminMultiSig: string,
  proxyAdmin: SignerWithAddress,
  facetCuts: IDiamondCut.FacetCutStruct[]
) {
  logger.out("Updating Diamond with new facet addresses...");
  const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, proxyAdmin);
  const diamondInit = DiamondInit__factory.connect(diamondAddress, proxyAdmin);
  const payload = diamondCut.interface.encodeFunctionData("diamondCut", [
    facetCuts,
    diamondInit.address,
    "0x",
  ]);
  await submitMultiSigTx(proxyAdminMultiSig, proxyAdmin, diamondAddress, payload);
}
