// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplication, CharityApplication__factory} from "typechain-types";
import {ParametersExceptLast, logger, updateAddresses} from "utils";

export async function charityApplications(
  CharityApplicationDataInput: ParametersExceptLast<CharityApplication["initialize"]>,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {run, ethers} = hre;

    let [_deployer, proxyAdmin] = await ethers.getSigners();
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
      [...CharityApplicationDataInput]
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
