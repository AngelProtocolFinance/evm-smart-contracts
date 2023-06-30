import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {MockERC20__factory, MockERC20} from "typechain-types";
import {logger} from "utils";

export async function mint(token: MockERC20, to: string, amt: number) {
  await token.mint(to, amt);
}

export async function deployDummyERC20(
  deployer: SignerWithAddress,
  recipients?: string[],
  amounts?: number[]
) {
  logger.out("Deploying dummy ERC20...");
  const Token = new MockERC20__factory(deployer);
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
