import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DonationMatchEmitter__factory, ProxyContract__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export default async function deployDonationMatchEmitter(
  accountsDiamond: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying DonationMatchEmitter...");

  const {proxyAdmin} = await getSigners(hre.ethers);

  // deploying implementation
  const factory = new DonationMatchEmitter__factory(proxyAdmin);
  const donationMatchEmitter = await factory.deploy();
  await donationMatchEmitter.deployed();
  logger.out(`Implementation deployed at: ${donationMatchEmitter.address}`);

  // deploying proxy
  const initData = donationMatchEmitter.interface.encodeFunctionData("initDonationMatchEmiiter", [
    accountsDiamond,
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const donationMatchEmitterProxy = await proxyFactory.deploy(
    donationMatchEmitter.address,
    proxyAdmin.address,
    initData
  );
  await donationMatchEmitterProxy.deployed();
  logger.out(`Proxy deployed at: ${donationMatchEmitterProxy.address}`);

  await updateAddresses(
    {
      donationMatch: {
        emitter: {
          implementation: donationMatchEmitter.address,
          proxy: donationMatchEmitterProxy.address,
        },
      },
    },
    hre
  );

  if (verify) {
    await hre.run("verify:verify", {
      address: donationMatchEmitter.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: donationMatchEmitterProxy.address,
      constructorArguments: [donationMatchEmitter.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: donationMatchEmitter, proxy: donationMatchEmitterProxy};
}
