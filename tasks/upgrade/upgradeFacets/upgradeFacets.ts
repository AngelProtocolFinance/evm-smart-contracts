import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, logger, shouldVerify} from "utils";
import createFacetCuts from "./createFacetCuts";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";
import verify from "./verify";

type TaskArguments = {facets: string[]};

task("upgrade:upgradeFacets", "Will redeploy and upgrade all facets that use AccountStorage struct")
  .addVariadicPositionalParam("facets", "List of facets to upgrade")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    try {
      const isConfirmed = await confirmAction(
        `You're about to upgrade the following facets:\n- ${taskArguments.facets.join("\n- ")}`
      );
      if (!isConfirmed) {
        return logger.out("Aborting...");
      }

      const {proxyAdmin} = await getSigners(hre.ethers);

      const addresses = await getAddresses(hre);

      const facets = await deployFacets(
        taskArguments.facets,
        proxyAdmin,
        addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
        addresses.libraries.STRING_LIBRARY
      );

      const facetCuts = await createFacetCuts(facets, addresses.accounts.diamond, proxyAdmin);

      await cutDiamond(addresses.accounts.diamond, proxyAdmin, facetCuts, hre);

      if (shouldVerify(hre.network)) {
        await verify(facetCuts, hre);
      }
    } catch (error) {
      logger.out(`Upgrade facets failed, reason: ${error}`, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
