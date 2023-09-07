import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CONFIG} from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplications__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, getSigners, updateAddresses} from "utils";

export async function deployCharityApplications(
  accountsDiamond: string,
  proxyAdmin: string,
  seedAsset: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<CharityApplications__factory>> {
  const {charityApplicationsOwners} = await getSigners(hre);
  const owners = !charityApplicationsOwners
    ? CONFIG.PROD_CONFIG.CharityApplicationsOwners
    : charityApplicationsOwners.map((x) => x.address);

  // data setup
  const CharityApplications = new CharityApplications__factory(deployer);
  const initData = CharityApplications.interface.encodeFunctionData("initializeApplications", [
    owners,
    CONFIG.CHARITY_APPLICATIONS_DATA.threshold,
    CONFIG.CHARITY_APPLICATIONS_DATA.requireExecution,
    CONFIG.CHARITY_APPLICATIONS_DATA.transactionExpiry,
    accountsDiamond,
    CONFIG.CHARITY_APPLICATIONS_DATA.gasAmount,
    CONFIG.CHARITY_APPLICATIONS_DATA.seedSplitToLiquid,
    seedAsset,
    CONFIG.CHARITY_APPLICATIONS_DATA.seedAmount,
  ]);
  // deploy
  const {implementation, proxy} = await deployBehindProxy(
    CharityApplications,
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
