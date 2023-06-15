import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DummyERC20__factory, DummyERC20} from "../../typechain-types";
import {AddressObj, logger} from "..";

export async function mint(token: DummyERC20, to: string, amt: number) {
  await token.mint(to, amt);
}

export async function deployDummyERC20(
  deployer: SignerWithAddress,
  recipients?: string[],
  amounts?: number[]
) {
  logger.out("Deploying dummy ERC20...");
  const Token = new DummyERC20__factory(deployer);
  const token = await Token.deploy();
  await token.deployed();
  logger.out(`Address: ${token.address}`);

  if (recipients && amounts) {
    for (var i in recipients) {
      logger.out(`Minting ${amounts[i]} tokens to ${recipients[i]}...`);
      await mint(token, recipients[i], amounts[i]);
    }
  }

  return token;
}
