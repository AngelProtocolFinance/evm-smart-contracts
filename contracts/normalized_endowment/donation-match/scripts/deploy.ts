import {HardhatRuntimeEnvironment} from "hardhat/types";
import deployDonationMatch from "./deployDonationMatch";
import deployDonationMatchCharity from "./deployDonationMatchCharity";
import deployDonationMatchEmitter from "./deployDonationMatchEmitter";

export async function deployDonationMatchContracts(
  accountsDiamond: string,
  registrar: string,
  usdcAddress: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const donationMatchCharity = await deployDonationMatchCharity(
    registrar,
    usdcAddress,
    verify,
    hre
  );
  const donationMatchEmitter = await deployDonationMatchEmitter(accountsDiamond, verify, hre);

  const donationMatch = await deployDonationMatch(
    donationMatchEmitter.proxy.address,
    registrar,
    usdcAddress,
    verify,
    hre
  );

  return {donationMatch, donationMatchCharity, donationMatchEmitter};
}
