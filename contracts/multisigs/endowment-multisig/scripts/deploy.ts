import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSig__factory,
  EndowmentMultiSigFactory__factory,
  ProxyContract__factory,
} from "typechain-types";
import {
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
  validateAddress,
} from "utils";

export async function deployEndowmentMultiSig(
  registrar = "",
  hre: HardhatRuntimeEnvironment
): Promise<
  | {
      emitter: {
        implementation: Deployment;
        proxy: Deployment;
      };
      factory: Deployment;
      implementation: Deployment;
    }
  | undefined
> {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying EndowmentMultiSig contracts...");
    validateAddress(registrar, "registrar");

    // deploy implementation contract
    logger.out("Deploying EndowmentMultiSig implementation...");
    const endowmentMultiSigFactory = new EndowmentMultiSig__factory(proxyAdmin);
    const endowmentMultiSig = await endowmentMultiSigFactory.deploy();
    await endowmentMultiSig.deployed();
    logger.out(`Address: ${endowmentMultiSig.address}`);

    // deploy factory
    logger.out("Deploying EndowmentMultiSigFactory...");
    const factoryCtorArgs: Parameters<typeof EndowmentMultiSigFactoryFactory.deploy> = [
      endowmentMultiSig.address,
      proxyAdmin.address,
      registrar,
    ];
    const EndowmentMultiSigFactoryFactory = new EndowmentMultiSigFactory__factory(proxyAdmin);
    const EndowmentMultiSigFactory = await EndowmentMultiSigFactoryFactory.deploy(
      ...factoryCtorArgs
    );
    await EndowmentMultiSigFactory.deployed();
    logger.out(`Address: ${EndowmentMultiSigFactory.address}`);

    // deploy emitter
    logger.out("Deploying EndowmentMultiSigEmitter...");

    logger.out("Deploying implementation...");
    const emitterFactory = new EndowmentMultiSigEmitter__factory(proxyAdmin);
    const emitter = await emitterFactory.deploy();
    await emitter.deployed();
    logger.out(`Address: ${emitter.address}`);

    logger.out("Deploying proxy...");
    const initData = emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
      EndowmentMultiSigFactory.address,
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
            factory: EndowmentMultiSigFactory.address,
            implementation: endowmentMultiSig.address,
          },
        },
      },
      hre
    );

    return {
      emitter: {
        implementation: {
          address: emitter.address,
          contractName: getContractName(emitterFactory),
        },
        proxy: {
          address: emitterProxy.address,
          contractName: getContractName(proxyFactory),
        },
      },
      factory: {
        address: EndowmentMultiSigFactory.address,
        constructorArguments: factoryCtorArgs,
        contractName: getContractName(EndowmentMultiSigFactoryFactory),
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
