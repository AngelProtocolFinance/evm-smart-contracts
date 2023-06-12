import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSig__factory,
  MultiSigWalletFactory__factory,
  ProxyContract__factory,
} from "typechain-types";
import {ADDRESS_ZERO, getSigners, logger, updateAddresses} from "utils";
import deployEndowmentMultiSigEmitter from "./deployEndowmentMultiSigEmitter";

export async function deployEndowmentMultiSig(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying EndowmentMultiSig contracts...");

    logger.out("Deploying EndowmentMultiSig implementation...");
    const endowmentMultiSigFactory = new EndowmentMultiSig__factory(proxyAdmin);
    const endowmentMultiSig = await endowmentMultiSigFactory.deploy();
    await endowmentMultiSig.deployed();
    logger.out(`Address: ${endowmentMultiSig.address}`);

    logger.out("Deploying EndowmentMultiSigFactory...");
    const multiSigWalletFactoryFactory = new MultiSigWalletFactory__factory(proxyAdmin);
    const multiSigWalletFactory = await multiSigWalletFactoryFactory.deploy(
      endowmentMultiSig.address,
      proxyAdmin.address
    );
    await multiSigWalletFactory.deployed();
    logger.out(`Address: ${multiSigWalletFactory.address}`);

    const emitter = await deployEndowmentMultiSigEmitter(proxyAdmin, multiSigWalletFactory.address);

    await updateAddresses(
      {
        multiSig: {
          endowment: {
            emitter: {
              implementation: emitter.implementation.address,
              proxy: emitter.proxy.contract.address,
            },
            factory: multiSigWalletFactory.address,
            implementation: endowmentMultiSig.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      logger.out("Verifying EndowmentMultiSigEmitter...");
      await hre.run("verify:verify", {
        address: emitter.implementation.address,
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: emitter.proxy.contract.address,
        constructorArguments: emitter.proxy.constructorArguments,
      });
      logger.out("Verifying EndowmentMultiSig...");
      await hre.run("verify:verify", {
        address: endowmentMultiSig.address,
        constructorArguments: [],
      });
      logger.out("Verifying MultiSigWalletFactory...");
      await hre.run("verify:verify", {
        address: multiSigWalletFactory.address,
        constructorArguments: [endowmentMultiSig.address, proxyAdmin.address],
      });
    }

    return {emitter, factory: multiSigWalletFactory, implementation: endowmentMultiSig};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      emitter: {
        implementation: EndowmentMultiSigEmitter__factory.connect(ADDRESS_ZERO, proxyAdmin),
        proxy: {
          contract: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
          contructorArguments: [],
        },
      },
      factory: MultiSigWalletFactory__factory.connect(ADDRESS_ZERO, proxyAdmin),
      implementation: EndowmentMultiSig__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
