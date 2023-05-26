// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {updateAddresses} from "utils";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {FundraisingMessage} from "typechain-types/contracts/accessory/fundraising/Fundraising";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function deployFundraising(
  FundraisingDataInput: FundraisingMessage.InstantiateMsgStruct,
  ANGEL_CORE_STRUCT: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {network, run, ethers} = hre;

    let [deployer, proxyAdmin] = await ethers.getSigners();

    const FundraisingLib = await ethers.getContractFactory("FundraisingLib", {
      libraries: {
        AngelCoreStruct: ANGEL_CORE_STRUCT,
      },
    });
    const FundraisingLibInstance = await FundraisingLib.deploy();
    await FundraisingLibInstance.deployed();
    console.log("FundraisingLib address:", FundraisingLibInstance.address);

    const Fundraising = await ethers.getContractFactory("Fundraising", {
      libraries: {
        AngelCoreStruct: ANGEL_CORE_STRUCT,
        FundraisingLib: FundraisingLibInstance.address,
      },
    });
    const FundraisingInstance = await Fundraising.deploy();
    await FundraisingInstance.deployed();

    console.log("Fundraising implementation address:", FundraisingInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const FundraisingData = FundraisingInstance.interface.encodeFunctionData("initFundraising", [
      FundraisingDataInput,
    ]);

    const FundraisingProxy = await ProxyContract.deploy(
      FundraisingInstance.address,
      proxyAdmin.address,
      FundraisingData
    );

    await FundraisingProxy.deployed();

    await updateAddresses(
      {
        fundraising: {
          proxy: FundraisingProxy.address,
          implementation: FundraisingInstance.address,
          library: FundraisingLibInstance.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await run("verify:verify", {
        address: FundraisingLibInstance.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: FundraisingInstance.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: FundraisingProxy.address,
        constructorArguments: [FundraisingInstance.address, proxyAdmin.address, FundraisingData],
      });
    }

    console.log("Fundraising Address (Proxy):", FundraisingProxy.address);

    return Promise.resolve(FundraisingProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
