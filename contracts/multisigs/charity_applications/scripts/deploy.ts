// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplication__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function charityApplications(
  applicationsMultiSig: string,
  accountsDiamond: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {run, ethers} = hre;

    const {proxyAdmin} = await getSigners(ethers);
    const CharityApplicationLib = await ethers.getContractFactory("CharityApplicationLib");
    const CharityApplicationLibInstance = await CharityApplicationLib.deploy();
    await CharityApplicationLibInstance.deployed();

    const CharityApplication = (await ethers.getContractFactory("CharityApplication", {
      libraries: {
        CharityApplicationLib: CharityApplicationLibInstance.address,
      },
    })) as CharityApplication__factory;
    const CharityApplicationInstance = await CharityApplication.deploy();
    await CharityApplicationInstance.deployed();

    console.log("CharityApplication implementation address:", CharityApplicationInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const CharityApplicationData = CharityApplicationInstance.interface.encodeFunctionData(
      "initialize",
      [
        config.CHARITY_APPLICATION_DATA.expiry,
        applicationsMultiSig,
        accountsDiamond,
        config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
        config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
        config.CHARITY_APPLICATION_DATA.gasAmount,
        config.CHARITY_APPLICATION_DATA.fundSeedAsset,
        config.CHARITY_APPLICATION_DATA.seedAsset,
        config.CHARITY_APPLICATION_DATA.seedAssetAmount,
      ]
    );

    const CharityApplicationProxy = await ProxyContract.deploy(
      CharityApplicationInstance.address,
      proxyAdmin.address,
      CharityApplicationData
    );

    await CharityApplicationProxy.deployed();

    console.log("CharityApplication Address (Proxy):", CharityApplicationProxy.address);

    logger.out("Saving addresses to contract-address.json...");
    await updateAddresses(
      {
        charityApplication: {
          proxy: CharityApplicationProxy.address,
          implementation: CharityApplicationInstance.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await run(`verify:verify`, {
        address: CharityApplicationInstance.address,
        constructorArguments: [],
      });
      await run(`verify:verify`, {
        address: CharityApplicationProxy.address,
        constructorArguments: [
          CharityApplicationInstance.address,
          proxyAdmin.address,
          CharityApplicationData,
        ],
      });
    }

    return Promise.resolve(CharityApplicationProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
