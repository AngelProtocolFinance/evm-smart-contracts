import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {EndowmentMultiSigEmitter__factory, ProxyContract__factory} from "typechain-types";
import {logger} from "utils";

export default async function deployEndowmentMultiSigEmitter(
  proxyAdmin: SignerWithAddress,
  factoryAddress: string
) {
  logger.out("Deploying EndowmentMultiSigEmitter...");

  logger.out("Deploying implementation...");
  const emitterFactory = new EndowmentMultiSigEmitter__factory(proxyAdmin);
  const emitter = await emitterFactory.deploy();
  await emitter.deployed();
  logger.out(`Address: ${emitter.address}`);

  logger.out("Deploying Proxy...");
  const initData = emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
    factoryAddress,
  ]);
  const constructorArguments: Parameters<ProxyContract__factory["deploy"]> = [
    emitter.address,
    proxyAdmin.address,
    initData,
  ];
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const emitterProxy = await proxyFactory.deploy(...constructorArguments);
  await emitterProxy.deployed();
  logger.out(`Address: ${emitterProxy.address}`);

  return {implementation: emitter, proxy: {contract: emitterProxy, constructorArguments}};
}
