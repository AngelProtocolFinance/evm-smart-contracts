// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses, verify} from "utils";

import {FundraisingMessage} from "typechain-types/contracts/accessory/fundraising/Fundraising";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function deployFundraising(
  FundraisingDataInput: FundraisingMessage.InstantiateMsgStruct,
  AngelCoreStruct: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {network, run, ethers} = hre;

    const {proxyAdmin} = await getSigners(hre);

    const FundraisingLib = await ethers.getContractFactory("FundraisingLib", {
      libraries: {AngelCoreStruct},
    });
    const FundraisingLibInstance = await FundraisingLib.deploy();
    await FundraisingLibInstance.deployed();
    logger.out(`FundraisingLib address: ${FundraisingLibInstance.address}`);

    const Fundraising = await ethers.getContractFactory("Fundraising", {
      libraries: {
        AngelCoreStruct,
        FundraisingLib: FundraisingLibInstance.address,
      },
    });
    const FundraisingInstance = await Fundraising.deploy();
    await FundraisingInstance.deployed();

    logger.out(`Fundraising implementation address: ${FundraisingInstance.address}`);

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

    // update address file & verify contracts
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
      await verify(hre, {address: FundraisingLibInstance.address});
      await verify(hre, {address: FundraisingInstance.address});
      await verify(hre, {
        address: FundraisingProxy.address,
        constructorArguments: [FundraisingInstance.address, proxyAdmin.address, FundraisingData],
      });
    }

    logger.out(`Fundraising Address (Proxy): ${FundraisingProxy.address}`);

    return Promise.resolve(FundraisingProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
