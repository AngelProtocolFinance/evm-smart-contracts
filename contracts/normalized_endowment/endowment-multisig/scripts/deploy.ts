// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses} from "utils";

const deployEndowmentMultiSigEmitter = async (
  proxyAdmin: string,
  factoryAddress: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    // Getting Proxy contract
    const {ethers, run, network} = hre;
    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const EndowmentMultiSigEmitter = await ethers.getContractFactory("EndowmentMultiSigEmitter");
    const EndowmentMultiSigEmitterImplementation = await EndowmentMultiSigEmitter.deploy();
    await EndowmentMultiSigEmitterImplementation.deployed();

    console.log(
      "EndowmentMultiSigEmitter Address (Implementation):",
      EndowmentMultiSigEmitterImplementation.address
    );

    const EndowmentMultiSigEmitterData =
      EndowmentMultiSigEmitterImplementation.interface.encodeFunctionData(
        "initEndowmentMultiSigEmitter",
        [factoryAddress]
      );

    const EndowmentMultiSigEmitterProxy = await ProxyContract.deploy(
      EndowmentMultiSigEmitterImplementation.address,
      proxyAdmin,
      EndowmentMultiSigEmitterData
    );

    await EndowmentMultiSigEmitterProxy.deployed();

    console.log(
      "EndowmentMultiSigEmitterProxy Address (Proxy):",
      EndowmentMultiSigEmitterProxy.address
    );

    if (verify) {
      await run("verify:verify", {
        address: EndowmentMultiSigEmitterImplementation.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: EndowmentMultiSigEmitterProxy.address,
        constructorArguments: [
          EndowmentMultiSigEmitterImplementation.address,
          proxyAdmin,
          EndowmentMultiSigEmitterData,
        ],
      });
    }

    return Promise.resolve({
      implementation: EndowmentMultiSigEmitterImplementation.address,
      proxy: EndowmentMultiSigEmitterProxy.address,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function deployEndowmentMultiSig(verify: boolean, hre: HardhatRuntimeEnvironment) {
  try {
    const {ethers, run, network} = hre;
    const {proxyAdmin} = await getSigners(ethers);
    const EndowmentMultiSig = await ethers.getContractFactory("EndowmentMultiSig");
    const EndowmentMultiSigInstance = await EndowmentMultiSig.deploy();
    await EndowmentMultiSigInstance.deployed();

    console.log("EndowmentMultiSig implementation address:", EndowmentMultiSigInstance.address);

    const MultiSigWalletFactory = await ethers.getContractFactory("MultiSigWalletFactory");
    const MultiSigWalletFactoryInstance = await MultiSigWalletFactory.deploy(
      EndowmentMultiSigInstance.address,
      proxyAdmin.address
    );
    await MultiSigWalletFactoryInstance.deployed();

    console.log("MultiSigWalletFactory address:", MultiSigWalletFactoryInstance.address);

    const EndowmentMultiSigEmitterAddresses = await deployEndowmentMultiSigEmitter(
      proxyAdmin.address,
      MultiSigWalletFactoryInstance.address,
      verify,
      hre
    );

    logger.out("Saving addresses to contract-address.json...");
    await updateAddresses(
      {
        multiSig: {
          endowment: {
            emitter: {...EndowmentMultiSigEmitterAddresses},
            factory: MultiSigWalletFactoryInstance.address,
            implementation: EndowmentMultiSigInstance.address,
          },
        },
      },
      hre
    );

    if (verify) {
      await run("verify:verify", {
        address: EndowmentMultiSigInstance.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: MultiSigWalletFactoryInstance.address,
        constructorArguments: [EndowmentMultiSigInstance.address, proxyAdmin.address],
      });
    }

    return Promise.resolve({
      MultiSigWalletFactory: MultiSigWalletFactoryInstance.address,
      EndowmentMultiSigEmitter: EndowmentMultiSigEmitterAddresses.proxy,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
