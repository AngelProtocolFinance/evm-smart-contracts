import {HardhatRuntimeEnvironment} from "hardhat/types";
import deployDonationMatchEmitter from "./deployDonationMatchEmitter";
import deployDonationMatchCharity from "./deployDonationMatchCharity";

export async function deployDonationMatch(
  accountsDiamond: string,
  registrar: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const donationMatchCharity = await deployDonationMatchCharity(registrar, verify, hre);
  const donationMatchEmitter = await deployDonationMatchEmitter(accountsDiamond, verify, hre);

  return {donationMatchCharity, donationMatchEmitter};
}
