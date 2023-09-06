import {HardhatRuntimeEnvironment} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ProxyContract__factory, VaultEmitter__factory} from "typechain-types";
import {Deployment, getContractName, logger, updateAddresses} from "utils";

export async function deployVaultEmitter(
  proxyAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<>> {
  logger.out("Deploying VaultEmitter...");

  logger.out("Deploying implementation...");
  const Emitter = new VaultEmitter__factory(deployer);
  const emitter = await Emitter.deploy();
  logger.out(`Tx hash: ${emitter.deployTransaction.hash}`);
  await emitter.deployed();
  logger.out(`Address: ${emitter.address}`);

  logger.out("Deploying proxy...");
  const initData = emitter.interface.encodeFunctionData("initialize");
  const Proxy = new ProxyContract__factory(deployer);
  const proxy = await Proxy.deploy(emitter.address, proxyAdmin, initData);
  logger.out(`Tx hash: ${proxy.deployTransaction.hash}`);
  await proxy.deployed();
  logger.out(`Address: ${proxy.address}`);

  // update address file
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
    implementation: {
      address: emitter.address,
      contractName: getContractName(Emitter),
    },
    proxy: {
      address: proxy.address,
      contractName: getContractName(Proxy),
    },
  };
}
