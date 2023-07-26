import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DummyERC20__factory, DummyERC20} from "typechain-types";

export async function mint(token: DummyERC20, to: string, amt: number) {
  await token.mint(to, amt);
}

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
      await mint(token, recipients[i], amounts[i]);
    }
  }

  return token;
}
