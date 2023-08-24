import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSigFactory__factory,
  EndowmentMultiSig__factory,
  ProxyContract__factory,
} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSig(
  registrar: string,
  admin: string,
  hre: HardhatRuntimeEnvironment
): Promise<{
  emitter: {
    implementation: Deployment;
    proxy: Deployment;
  };
  factory: Deployment;
  implementation: Deployment;
}> {
  logger.out("Deploying EndowmentMultiSig contracts...");

  const {deployer} = await getSigners(hre);

  // deploy implementation contract
  logger.out("Deploying EndowmentMultiSig implementation...");
  const endowmentMultiSigFactory = new EndowmentMultiSig__factory(deployer);
  const endowmentMultiSig = await endowmentMultiSigFactory.deploy();
  await endowmentMultiSig.deployed();
  logger.out(`Address: ${endowmentMultiSig.address}`);

  // deploy factory
  logger.out("Deploying EndowmentMultiSigFactory...");
  const factoryCtorArgs: Parameters<typeof EndowmentMultiSigFactoryFactory.deploy> = [
    endowmentMultiSig.address,
    admin,
    registrar,
  ];
  const EndowmentMultiSigFactoryFactory = new EndowmentMultiSigFactory__factory(deployer);
  const EndowmentMultiSigFactory = await EndowmentMultiSigFactoryFactory.deploy(...factoryCtorArgs);
  await EndowmentMultiSigFactory.deployed();
  logger.out(`Address: ${EndowmentMultiSigFactory.address}`);

  // deploy emitter
  logger.out("Deploying EndowmentMultiSigEmitter...");

  logger.out("Deploying implementation...");
  const emitterFactory = new EndowmentMultiSigEmitter__factory(deployer);
  const emitter = await emitterFactory.deploy();
  await emitter.deployed();
  logger.out(`Address: ${emitter.address}`);

  logger.out("Deploying proxy...");
  const initData = emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
    EndowmentMultiSigFactory.address,
  ]);
  const proxyFactory = new ProxyContract__factory(deployer);
  const emitterProxy = await proxyFactory.deploy(emitter.address, admin, initData);
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
}
