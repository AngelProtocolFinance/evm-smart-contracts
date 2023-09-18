import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {VaultEmitter__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, updateAddresses} from "utils";

export async function deployVaultEmitter(
  proxyAdmin: string,
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<VaultEmitter__factory>> {
  // data setup
  const Emitter = new VaultEmitter__factory(deployer);
  const initData = Emitter.interface.encodeFunctionData("initialize");
  // deploy
  const {implementation, proxy} = await deployBehindProxy(Emitter, proxyAdmin, initData);

  // update address file
  await updateAddresses(
    {
      vaultEmitter: {
        implementation: implementation.contract.address,
        proxy: proxy.contract.address,
      },
    },
    hre
  );

  return {implementation, proxy};
}
