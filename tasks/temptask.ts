import {task} from "hardhat/config";
import {getAddresses, getSigners, verify} from "utils";

task("temptask", "Task to use for some temporary operations", async (_, hre) => {
  const addresses = await getAddresses(hre);
  const {proxyAdmin} = await getSigners(hre);

  const facets = Object.values(addresses.accounts.facets);

  for (let i = 0; i < facets.length; i++) {
    const address = facets[i];
    await verify(hre, {address});
  }
});
