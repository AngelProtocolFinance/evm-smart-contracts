import {Signer} from "ethers";
import {DummyERC20, DummyERC20__factory} from "typechain-types";
import {deploy} from "utils";

export async function deployDummyERC20(
  deployer: Signer,
  recipients?: string[],
  amounts?: number[],
  decimals?: number
): Promise<DummyERC20> {
  const decs = decimals ? decimals : 0;
  const token = await deploy(new DummyERC20__factory(deployer), [decs]);

  if (recipients && amounts) {
    for (var i in recipients) {
      const tx = await token.contract.mint(recipients[i], amounts[i]);
      await tx.wait();
    }
  }

  return token.contract;
}
