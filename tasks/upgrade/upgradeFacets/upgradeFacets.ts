import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, logger, isLocalNetwork} from "utils";

import {ALL_FACET_NAMES} from "./constants";
import createFacetCuts from "./createFacetCuts";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";
import verify from "./verify";

type TaskArguments = {facets: string[]; verify: boolean};

task("upgrade:facets", "Will redeploy and upgrade all facets that use AccountStorage struct")
  .addVariadicPositionalParam(
    "facets",
    "List of facets to upgrade. If set to 'all', will upgrade all facets."
  )
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArguments, hre) => {
    try {
      if (taskArgs.facets.length === 0) {
        throw new Error("Must provide at least one facet name or pass 'all'");
      }

      const facetsToUpgrade = /^all$/i.test(taskArgs.facets[0]) ? ALL_FACET_NAMES : taskArgs.facets;

      const isConfirmed = await confirmAction(
        `You're about to upgrade the following facets:\n- ${facetsToUpgrade.join("\n- ")}`
      );
      if (!isConfirmed) {
        return logger.out("Aborting...");
      }

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const facets = await deployFacets(
        facetsToUpgrade,
        proxyAdmin,
        addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
        hre
      );

      const facetCuts = await createFacetCuts(facets, addresses.accounts.diamond, proxyAdmin);

      await cutDiamond(addresses.accounts.diamond, proxyAdmin, facetCuts, hre);

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        await verify(facetCuts, hre);
      }
    } catch (error) {
      logger.out(`Upgrade facets failed, reason: ${error}`, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
