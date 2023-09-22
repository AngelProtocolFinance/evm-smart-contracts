import {CONFIG} from "config";
import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplications__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, getSigners, updateAddresses} from "utils";

export async function deployCharityApplications(
  accountsDiamond: string,
  proxyAdmin: string,
  seedAsset: string,
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<CharityApplications__factory>> {
  const {charityApplicationsOwners} = await getSigners(hre);
  const owners = !charityApplicationsOwners
    ? CONFIG.PROD_CONFIG.CharityApplicationsOwners
    : await Promise.all(charityApplicationsOwners.map((x) => x.getAddress()));

  // data setup
  const initData = CharityApplications__factory.createInterface().encodeFunctionData(
    "initializeApplications",
    [
      owners,
      CONFIG.CHARITY_APPLICATIONS_DATA.threshold,
      CONFIG.CHARITY_APPLICATIONS_DATA.requireExecution,
      CONFIG.CHARITY_APPLICATIONS_DATA.transactionExpiry,
      accountsDiamond,
      CONFIG.CHARITY_APPLICATIONS_DATA.gasAmount,
      CONFIG.CHARITY_APPLICATIONS_DATA.seedSplitToLiquid,
      seedAsset,
      CONFIG.CHARITY_APPLICATIONS_DATA.seedAmount,
    ]
  );
  // deploy
  const {implementation, proxy} = await deployBehindProxy(
    new CharityApplications__factory(deployer),
    proxyAdmin,
    initData
  );

  // update address file
  await updateAddresses(
    {
      multiSig: {
        charityApplications: {
          implementation: implementation.contract.address,
          proxy: proxy.contract.address,
        },
      },
    },
    hre
  );

  return {implementation, proxy};
}
