import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses, verify} from "utils";

import {GovMessage} from "typechain-types/contracts/halo/gov/Gov";

export async function deployGov(
  GovDataInput: GovMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const {proxyAdmin} = await getSigners(hre);
    const Gov = await ethers.getContractFactory("Gov");
    const GovInstance = await Gov.deploy();
    await GovInstance.deployed();
    logger.out(`Gov implementation address: ${GovInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const GovData = GovInstance.interface.encodeFunctionData("initialize", [GovDataInput]);
    const GovProxy = await ProxyContract.deploy(GovInstance.address, proxyAdmin.address, GovData);
    await GovProxy.deployed();
    logger.out(`Gov Address (Proxy): ${GovProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          gov: {
            proxy: GovProxy.address,
            implementation: GovInstance.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {address: GovInstance.address});
      await verify(hre, {
        address: GovProxy.address,
        constructorArguments: [GovInstance.address, proxyAdmin.address, GovData],
      });
    }

    return Promise.resolve(GovProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
