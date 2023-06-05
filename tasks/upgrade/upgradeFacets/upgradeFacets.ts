import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, logger, shouldVerify} from "utils";
import {ALL_FACET_NAMES} from "./constants";
import createFacetCuts from "./createFacetCuts";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";
import verify from "./verify";

type TaskArguments = {facets: string[]};

task("upgrade:facets", "Will redeploy and upgrade all facets that use AccountStorage struct")
  .addVariadicPositionalParam(
    "facets",
    "List of facets to upgrade. If set to 'all', will upgrade all facets."
  )
  .setAction(async (taskArguments: TaskArguments, hre) => {
    try {
      if (taskArguments.facets.length === 0) {
        throw new Error("Must provide at least one facet name or pass 'all'");
      }

      const facetsToUpgrade = /^all$/i.test(taskArguments.facets[0])
        ? ALL_FACET_NAMES
        : taskArguments.facets;

      const isConfirmed = await confirmAction(
        `You're about to upgrade the following facets:\n- ${facetsToUpgrade.join("\n- ")}`
      );
      if (!isConfirmed) {
        return logger.out("Aborting...");
      }

      const {proxyAdmin} = await getSigners(hre.ethers);

      const addresses = await getAddresses(hre);

      const facets = await deployFacets(
        facetsToUpgrade,
        proxyAdmin,
        addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
        hre
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
