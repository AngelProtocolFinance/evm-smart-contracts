import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {TestFacetProxyContract__factory, TestFacetProxyContract} from "typechain-types";
import {ADDRESS_ZERO} from "utils";

export async function deployFacetAsProxy(
  hre: HardhatRuntimeEnvironment,
  deployer: SignerWithAddress,
  proxyAdmin: SignerWithAddress,
  implementation: string
): Promise<TestFacetProxyContract> {
  let Proxy = new TestFacetProxyContract__factory(deployer);
  let proxy = await Proxy.deploy(implementation, proxyAdmin.address, []);
  await proxy.deployed();
  await proxy.setConfig({
    owner: deployer.address,
    version: "1",
    registrarContract: ADDRESS_ZERO,
    nextAccountId: 1,
    maxGeneralCategoryId: 1,
    subDao: ADDRESS_ZERO,
    gateway: ADDRESS_ZERO,
    gasReceiver: ADDRESS_ZERO,
    earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ADDRESS_ZERO},
    reentrancyGuardLocked: false,
  });
  return proxy;
}
