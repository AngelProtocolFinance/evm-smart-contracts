import {CONFIG} from "config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplications__factory, ProxyContract__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployCharityApplications(
  accountsDiamond: string,
  proxyAdmin: string,
  seedAsset: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying CharityApplications...");

  const {charityApplicationsOwners} = await getSigners(hre);
  const owners = !charityApplicationsOwners
    ? CONFIG.PROD_CONFIG.CharityApplicationsOwners
    : charityApplicationsOwners.map((x) => x.address);

  // deploy implementation
  logger.out("Deploying implementation...");
  const charityApplicationsFactory = new CharityApplications__factory(deployer);
  const charityApplications = await charityApplicationsFactory.deploy();
  await charityApplications.deployed();
  logger.out(`Address: ${charityApplications.address}`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = charityApplications.interface.encodeFunctionData("initializeApplications", [
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
  const proxyFactory = new ProxyContract__factory(deployer);
  const charityApplicationsProxy = await proxyFactory.deploy(
    charityApplications.address,
    proxyAdmin,
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
