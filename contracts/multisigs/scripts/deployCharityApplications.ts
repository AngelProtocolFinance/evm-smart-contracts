import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplications__factory, ProxyContract__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployCharityApplications(
  accountsDiamond: string,
  seedAsset: string,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  const {apTeamMultisigOwners, proxyAdmin} = await getSigners(hre);

  logger.out("Deploying CharityApplications...");

  // deploy implementation
  logger.out("Deploying implementation...");
  const charityApplicationsFactory = new CharityApplications__factory(proxyAdmin);
  const charityApplications = await charityApplicationsFactory.deploy();
  await charityApplications.deployed();
  logger.out(`Address: ${charityApplications.address}`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = charityApplications.interface.encodeFunctionData("initializeApplications", [
    apTeamMultisigOwners.map((x) => x.address),
    config.CHARITY_APPLICATIONS_DATA.threshold,
    config.CHARITY_APPLICATIONS_DATA.requireExecution,
    config.CHARITY_APPLICATIONS_DATA.transactionExpiry,
    accountsDiamond,
    config.CHARITY_APPLICATIONS_DATA.gasAmount,
    config.CHARITY_APPLICATIONS_DATA.seedSplitToLiquid,
    seedAsset,
    config.CHARITY_APPLICATIONS_DATA.seedAmount,
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const charityApplicationsProxy = await proxyFactory.deploy(
    charityApplications.address,
    proxyAdmin.address,
    initData
  );
  await charityApplicationsProxy.deployed();
  logger.out(`Address: ${charityApplicationsProxy.address}`);

  // update address file & verify contracts
  await updateAddresses(
    {
      multiSig: {
        charityApplications: {
          implementation: charityApplications.address,
          proxy: charityApplicationsProxy.address,
        },
      },
    },
    hre
  );

  return {
    implementation: {
      address: charityApplications.address,
      contractName: getContractName(charityApplicationsFactory),
    },
    proxy: {
      address: charityApplicationsProxy.address,
      contractName: getContractName(proxyFactory),
    },
  };
}
