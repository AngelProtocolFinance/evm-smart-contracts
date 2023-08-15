import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {wait} from "test/utils";
import {DummyERC20__factory} from "typechain-types";

export async function deployDummyERC20(
  deployer: SignerWithAddress,
  recipients?: string[],
  amounts?: number[],
  decimals?: number
) {
  const Token = new DummyERC20__factory(deployer);
  const decs = decimals ? decimals : 0;
  const token = await Token.deploy(decs);
  await token.deployed();

  if (recipients && amounts) {
    for (var i in recipients) {
      await wait(token.mint(recipients[i], amounts[i]));
    }
  }

  return token;
}
