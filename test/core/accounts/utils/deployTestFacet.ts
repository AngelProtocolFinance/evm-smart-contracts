import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {TestFacetProxyContract__factory, TestFacetProxyContract} from "typechain-types";
export async function deployFacetAsProxy(
  hre: HardhatRuntimeEnvironment,
  deployer: Signer,
  proxyAdmin: Signer,
  implementation: string
): Promise<TestFacetProxyContract> {
  let Proxy = new TestFacetProxyContract__factory(deployer);
  let proxy = await Proxy.deploy(implementation, await proxyAdmin.getAddress(), []);
  await proxy.deployed();
  return proxy;
}
