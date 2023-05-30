import {setupNetwork} from "@axelar-network/axelar-local-dev";

import fs from "fs";

import {Wallet} from "ethers";
import {envConfig} from "utils";

async function setUp() {
  try {
    const ethereum = await setupNetwork(envConfig.GANACHE_RPC_URL, {
      ownerKey: new Wallet(envConfig.GANACHE_PRIVATE_KEY),
      chainId: 8454,
    });

    let cloneInfo = ethereum.getCloneInfo();

    // deploy ethereum token
    let usdcAddress = await ethereum.deployToken("USDC", "USDC", 6, BigInt(100_000e6));

    const cloneInfoWithUSDC = {
      ...cloneInfo,
      usdcAddress: usdcAddress.address,
    };
    fs.writeFileSync("ethereum.json", JSON.stringify(cloneInfoWithUSDC));

    return Promise.resolve(ethereum);
  } catch (error) {
    return Promise.reject(error);
  }
}

setUp()
  .then(() => {
    console.log("Setup complete");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });
