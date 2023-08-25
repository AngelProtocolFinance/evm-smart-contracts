import {FacetCutAction} from "contracts/core/accounts/scripts/libraries/diamond";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";
import {ALL_FACET_NAMES} from "./constants";
import createFacetCuts from "./createFacetCuts";
import cutDiamond from "./cutDiamond";
import deployFacets from "./deployFacets";

type TaskArgs = {
  accountsDiamond?: string;
  facets: string[];
  skipVerify: boolean;
  yes: boolean;
};

// Sample syntax: npx hardhat upgrade:facets --yes --network mumbai "AccountsStrategy"

task("upgrade:facets", "Will redeploy and upgrade all facets that use AccountStorage struct")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )

  .addVariadicPositionalParam(
    "facets",
    "List of facets to upgrade. If set to 'all', will upgrade all facets."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      if (taskArgs.facets.length === 0) {
        throw new Error("Must provide at least one facet name or pass 'all'");
      }

      const facetsToUpgrade = /^all$/i.test(taskArgs.facets[0]) ? ALL_FACET_NAMES : taskArgs.facets;

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Upgrade the following facets:\n- ${facetsToUpgrade.join("\n- ")}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer, proxyAdminSigner} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;

      const facets = await deployFacets(facetsToUpgrade, deployer, hre);

      const facetCuts = await createFacetCuts(facets, accountsDiamond, deployer);

      await cutDiamond(accountsDiamond, addresses.proxyAdmin, proxyAdminSigner, facetCuts, hre);

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        const facetsToVerify = facetCuts.filter((cut) => cut.cut.action !== FacetCutAction.Remove);
        for (const {facetName, cut} of facetsToVerify) {
          await verify(hre, {address: cut.facetAddress.toString(), contractName: facetName});
        }
      }
    } catch (error) {
      logger.out(`Upgrade facets failed, reason: ${error}`, logger.Level.Error);
    }
  });
