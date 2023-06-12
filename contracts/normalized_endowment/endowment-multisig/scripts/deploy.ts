import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSig__factory,
  MultiSigWalletFactory__factory,
  ProxyContract__factory,
} from "typechain-types";
import {ADDRESS_ZERO, getContractName, getSigners, logger, updateAddresses, verify} from "utils";

export async function deployEndowmentMultiSig(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying EndowmentMultiSig contracts...");

    // deploy implementation contract
    logger.out("Deploying EndowmentMultiSig implementation...");
    const endowmentMultiSigFactory = new EndowmentMultiSig__factory(proxyAdmin);
    const endowmentMultiSig = await endowmentMultiSigFactory.deploy();
    await endowmentMultiSig.deployed();
    logger.out(`Address: ${endowmentMultiSig.address}`);

    // deploy factory
    logger.out("Deploying EndowmentMultiSigFactory...");
    const multiSigWalletFactoryFactory = new MultiSigWalletFactory__factory(proxyAdmin);
    const multiSigWalletFactory = await multiSigWalletFactoryFactory.deploy(
      endowmentMultiSig.address,
      proxyAdmin.address
    );
    await multiSigWalletFactory.deployed();
    logger.out(`Address: ${multiSigWalletFactory.address}`);

    // deploy emitter
    logger.out("Deploying EndowmentMultiSigEmitter...");

    logger.out("Deploying implementation...");
    const emitterFactory = new EndowmentMultiSigEmitter__factory(proxyAdmin);
    const emitter = await emitterFactory.deploy();
    await emitter.deployed();
    logger.out(`Address: ${emitter.address}`);

    logger.out("Deploying Proxy...");
    const initData = emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
      multiSigWalletFactory.address,
    ]);
    const proxyFactory = new ProxyContract__factory(proxyAdmin);
    const emitterProxy = await proxyFactory.deploy(emitter.address, proxyAdmin.address, initData);
    await emitterProxy.deployed();
    logger.out(`Address: ${emitterProxy.address}`);

    // update addresses and verify
    await updateAddresses(
      {
        multiSig: {
          endowment: {
            emitter: {
              implementation: emitter.address,
              proxy: emitterProxy.address,
            },
            factory: multiSigWalletFactory.address,
            implementation: endowmentMultiSig.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {
        address: emitter.address,
        contractName: getContractName(emitterFactory),
      });
      await verify(hre, {
        address: emitterProxy.address,
        constructorArguments: [emitter.address, proxyAdmin.address, initData],
        contractName: `${getContractName(emitterFactory)} proxy`,
      });
      await verify(hre, {
        address: endowmentMultiSig.address,
        contractName: getContractName(endowmentMultiSigFactory),
      });
      await verify(hre, {
        address: multiSigWalletFactory.address,
        constructorArguments: [endowmentMultiSig.address, proxyAdmin.address],
        contractName: getContractName(multiSigWalletFactoryFactory),
      });
    }

    return {
      emitter: {
        implementation: emitter,
        proxy: emitterProxy,
      },
      factory: multiSigWalletFactory,
      implementation: endowmentMultiSig,
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      emitter: {
        implementation: EndowmentMultiSigEmitter__factory.connect(ADDRESS_ZERO, proxyAdmin),
        proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
      },
      factory: MultiSigWalletFactory__factory.connect(ADDRESS_ZERO, proxyAdmin),
      implementation: EndowmentMultiSig__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
