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
  await proxy.setConfig({
    owner: deployer.address,
    version: "1",
    registrarContract: hre.ethers.constants.AddressZero,
    nextAccountId: 1,
    maxGeneralCategoryId: 1,
    subDao: hre.ethers.constants.AddressZero,
    gateway: hre.ethers.constants.AddressZero,
    gasReceiver: hre.ethers.constants.AddressZero,
    earlyLockedWithdrawFee: {bps: 1000, payoutAddress: hre.ethers.constants.AddressZero},
    reentrancyGuardLocked: false,
  });
  return proxy;
}
