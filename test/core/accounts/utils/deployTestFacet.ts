import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {TestFacetProxyContract__factory, TestFacetProxyContract} from "typechain-types";

export async function deployFacetAsProxy(
  hre: HardhatRuntimeEnvironment,
  deployer: SignerWithAddress,
  proxyAdmin: SignerWithAddress,
  implementation: string
): Promise<TestFacetProxyContract> {
  let Proxy = new TestFacetProxyContract__factory(deployer);
  let proxy = await Proxy.deploy(implementation, proxyAdmin.address, []);
  await proxy.deployed();
  return proxy;
}
