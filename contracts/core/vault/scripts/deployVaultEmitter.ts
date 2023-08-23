import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, VaultEmitter__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployVaultEmitter(
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying VaultEmitter...");

    logger.out("Deploying implementation...");
    const Emitter = new VaultEmitter__factory(proxyAdmin);
    const emitter = await Emitter.deploy();
    logger.out(`Tx hash: ${emitter.deployTransaction.hash}`);
    await emitter.deployed();
    logger.out(`Address: ${emitter.address}`);

    logger.out("Deploying proxy...");
    const initData = emitter.interface.encodeFunctionData("initialize");
    const Proxy = new ProxyContract__factory(proxyAdmin);
    const proxy = await Proxy.deploy(emitter.address, proxyAdmin.address, initData);
    logger.out(`Tx hash: ${proxy.deployTransaction.hash}`);
    await proxy.deployed();
    logger.out(`Address: ${proxy.address}`);

    // update address file & verify contracts
    await updateAddresses(
      {
        vaultEmitter: {
          implementation: emitter.address,
          proxy: proxy.address,
        },
      },
      hre
    );

    return {
      address: proxy.address,
      contractName: getContractName(Emitter),
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
