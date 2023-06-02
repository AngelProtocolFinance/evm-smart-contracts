import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DonationMatchCharity__factory, ProxyContract__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export default async function deployDonationMatchCharity(
  registrar: string,
  usdcAddress: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying DonationMatchCharity...");

  const {proxyAdmin} = await getSigners(hre.ethers);

  // deploy implementation
  const factory = new DonationMatchCharity__factory(proxyAdmin);
  const donationMatchCharity = await factory.deploy();
  await donationMatchCharity.deployed();
  logger.out(`Implementation deployed at: ${donationMatchCharity.address}`);

  // deploy proxy
  const initData = donationMatchCharity.interface.encodeFunctionData("initialize", [
    {
      reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
      uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
      registrarContract: registrar,
      poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
      usdcAddress,
    },
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const donationMatchCharityProxy = await proxyFactory.deploy(
    donationMatchCharity.address,
    proxyAdmin.address,
    initData
  );
  await donationMatchCharityProxy.deployed();
  logger.out(`Proxy deployed at: ${donationMatchCharityProxy.address}`);

  await updateAddresses(
    {
      donationMatchCharity: {
        implementation: donationMatchCharity.address,
        proxy: donationMatchCharityProxy.address,
      },
    },
    hre
  );

  if (verify) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: donationMatchCharity.address,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: donationMatchCharityProxy.address,
      constructorArguments: [donationMatchCharity.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: donationMatchCharity, proxy: donationMatchCharityProxy};
}
