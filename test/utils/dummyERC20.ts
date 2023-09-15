import {Signer} from "ethers";
import {DummyERC20__factory, DummyERC20} from "typechain-types";

export async function mint(token: DummyERC20, to: string, amt: number) {
  await token.mint(to, amt);
}

export async function deployDummyERC20(deployer: Signer, decimals?: number): Promise<DummyERC20> {
  const decs = decimals ? decimals : 0;
  let Token = new DummyERC20__factory(deployer);
  const token = await Token.deploy(decs);
  await token.deployed();
  return token;
}
