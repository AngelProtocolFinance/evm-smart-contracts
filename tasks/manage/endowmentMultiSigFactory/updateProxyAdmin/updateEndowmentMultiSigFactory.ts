import {HardhatRuntimeEnvironment} from "hardhat/types";
import {submitMultiSigTx} from "tasks/helpers";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

/**
 * @param newProxyAdmin Address of the new proxy admin.
 * @param apTeamSignerPkey Private key of one of the APTeamMultiSig owners
 * @param hre @see HardhatRuntimeEnvironment
 * @returns boolean value indicating whether proxy admin was updated to `newProxyAdmin` or not
 */
export default async function updateEndowmentMultiSigFactory(
  newProxyAdmin: string,
  apTeamSignerPkey: string | undefined,
  hre: HardhatRuntimeEnvironment
): Promise<boolean> {
  const addresses = await getAddresses(hre);

  const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
    addresses.multiSig.endowment.factory,
    hre.ethers.provider
  );
  const oldProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
  if (oldProxyAdmin === newProxyAdmin) {
    logger.out(`"${newProxyAdmin}" is already the proxy admin.`);
    return true;
  }

  const apTeamOwner = await getAPTeamOwner(hre, apTeamSignerPkey);

  // submitting the Tx
  const data = endowmentMultiSigFactory.interface.encodeFunctionData("updateProxyAdmin", [
    newProxyAdmin,
  ]);
  const isExecuted = await submitMultiSigTx(
    addresses.multiSig.apTeam.proxy,
    apTeamOwner,
    endowmentMultiSigFactory.address,
    data
  );
  if (!isExecuted) {
    return false;
  }
  const updatedProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
  if (updatedProxyAdmin !== newProxyAdmin) {
    throw new Error(
      `Unexpected: expected new proxy admin "${newProxyAdmin}", but got "${updatedProxyAdmin}"`
    );
  }

  return true;
}
