import {Signer} from "@ethersproject/abstract-signer";
import {task} from "hardhat/config";
import {logger} from "utils";

task("accounts", "Prints the list of all accounts", async (_, hre) => {
  const accounts: Signer[] = await hre.ethers.getSigners();

  for (const account of accounts) {
    logger.out(await account.getAddress());
  }
});
