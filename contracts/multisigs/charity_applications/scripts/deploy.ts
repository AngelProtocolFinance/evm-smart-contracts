// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplication__factory, ProxyContract__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deployCharityApplication(
  applicationsMultiSig: string,
  accountsDiamond: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying CharityApplication...");

  const {proxyAdmin} = await getSigners(hre.ethers);

  const charityApplicationLibFactory = await hre.ethers.getContractFactory(
    "CharityApplicationLib",
    proxyAdmin
  );
  const charityApplicationLib = await charityApplicationLibFactory.deploy();
  await charityApplicationLib.deployed();
  logger.out(`CharityApplicationLib deployed at: ${charityApplicationLib.address}`);

  const charityApplicationFactory = new CharityApplication__factory(
    {
      "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
        charityApplicationLib.address,
    },
    proxyAdmin
  );
  const charityApplication = await charityApplicationFactory.deploy();
  await charityApplication.deployed();
  logger.out(`CharityApplicationLib deployed at: ${charityApplication.address}`);

  const initData = charityApplication.interface.encodeFunctionData("initialize", [
    config.CHARITY_APPLICATION_DATA.expiry,
    applicationsMultiSig,
    accountsDiamond,
    config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
    config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
    config.CHARITY_APPLICATION_DATA.gasAmount,
    config.CHARITY_APPLICATION_DATA.fundSeedAsset,
    config.CHARITY_APPLICATION_DATA.seedAsset,
    config.CHARITY_APPLICATION_DATA.seedAssetAmount,
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const charityApplicationProxy = await proxyFactory.deploy(
    charityApplication.address,
    proxyAdmin.address,
    initData
  );
  await charityApplicationProxy.deployed();
  logger.out(`Proxy deployed at: ${charityApplicationProxy.address}`);

  await updateAddresses(
    {
      charityApplication: {
        implementation: charityApplication.address,
        proxy: charityApplicationProxy.address,
      },
      libraries: {
        charityApplicationLib: charityApplicationLib.address,
      },
    },
    hre
  );

  if (verify_contracts) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: charityApplication.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: charityApplicationProxy.address,
      constructorArguments: [charityApplication.address, proxyAdmin.address, initData],
    });
  }

  return {
    implementation: charityApplication,
    proxy: charityApplicationProxy,
    charityApplicationLib,
  };
}
