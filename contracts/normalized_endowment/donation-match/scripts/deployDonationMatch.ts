import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DonationMatch__factory, ProxyContract__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export default async function deployDonationMatch(
  donationMatchEmitter: string,
  registrar: string,
  usdcAddress: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying DonationMatch...");

  const {proxyAdmin} = await getSigners(hre.ethers);

  // deploy implementation
  const factory = new DonationMatch__factory(proxyAdmin);
  const donationMatch = await factory.deploy();
  await donationMatch.deployed();
  logger.out(`Implementation deployed at: ${donationMatch.address}`);

  const initData = donationMatch.interface.encodeFunctionData("initialize", [
    {
      reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
      uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
      registrarContract: registrar,
      poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
      usdcAddress,
    },
    donationMatchEmitter,
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const donationMatchProxy = await proxyFactory.deploy(
    donationMatch.address,
    proxyAdmin.address,
    initData
  );
  await donationMatchProxy.deployed();
  logger.out(`Proxy deployed at: ${donationMatchProxy.address}`);

  await updateAddresses(
    {donationMatch: {implementation: donationMatch.address, proxy: donationMatchProxy.address}},
    hre
  );

  if (verify) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: donationMatch.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: donationMatchProxy.address,
      constructorArguments: [donationMatch.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: donationMatch, proxy: donationMatchProxy};
}
