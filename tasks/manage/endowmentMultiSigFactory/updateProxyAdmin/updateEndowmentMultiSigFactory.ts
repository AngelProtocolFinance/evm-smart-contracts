import {HardhatRuntimeEnvironment} from "hardhat/types";
import {submitMultiSigTx} from "tasks/helpers";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

export default async function updateEndowmentMultiSigFactory(
  targetAddress: string,
  apTeamSignerPkey: string | undefined,
  hre: HardhatRuntimeEnvironment
): Promise<boolean> {
  const addresses = await getAddresses(hre);

  const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
    addresses.multiSig.endowment.factory,
    hre.ethers.provider
  );
  const oldProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
  if (oldProxyAdmin === targetAddress) {
    logger.out(`"${targetAddress}" is already the proxy admin.`);
    return true;
  }

  const apTeamOwner = await getAPTeamOwner(hre, apTeamSignerPkey);

  // submitting the Tx
  const data = endowmentMultiSigFactory.interface.encodeFunctionData("updateProxyAdmin", [
    targetAddress,
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
  const newProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
  if (newProxyAdmin !== targetAddress) {
    throw new Error(
      `Unexpected: expected new proxy admin "${targetAddress}", but got "${newProxyAdmin}"`
    );
  }

  return true;
}
