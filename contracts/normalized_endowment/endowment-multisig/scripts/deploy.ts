import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSig__factory,
  MultiSigWalletFactory__factory,
  ProxyContract__factory,
} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSig(hre: HardhatRuntimeEnvironment): Promise<
  | {
      emitter: Deployment;
      factory: Deployment;
      implementation: Deployment;
    }
  | undefined
> {
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

    logger.out("Deploying proxy...");
    const initData = emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
      multiSigWalletFactory.address,
    ]);
    const proxyFactory = new ProxyContract__factory(proxyAdmin);
    const emitterProxy = await proxyFactory.deploy(emitter.address, proxyAdmin.address, initData);
    await emitterProxy.deployed();
    logger.out(`Address: ${emitterProxy.address}`);

    // update address file & verify contracts
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

    return {
      emitter: {
        address: emitterProxy.address,
        contractName: getContractName(emitterFactory),
      },
      factory: {
        address: multiSigWalletFactory.address,
        constructorArguments: [endowmentMultiSig.address, proxyAdmin.address],
        contractName: getContractName(multiSigWalletFactoryFactory),
      },
      implementation: {
        address: endowmentMultiSig.address,
        contractName: getContractName(endowmentMultiSigFactory),
      },
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
