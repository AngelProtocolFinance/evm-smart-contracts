import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DummyWMATIC__factory, DummyWMATIC} from "typechain-types";

export async function deployDummyWMATIC(deployer: SignerWithAddress): Promise<DummyWMATIC> {
  let Token = new DummyWMATIC__factory(deployer);
  const token = await Token.deploy();
  await token.deployed();
  return token;
}
