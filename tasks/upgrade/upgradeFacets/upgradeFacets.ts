import {task} from "hardhat/config";
import {
  AccountDeployContract__factory,
  AccountDepositWithdrawEndowments__factory,
  AccountDonationMatch__factory,
  AccountsAllowance__factory,
  AccountsCreateEndowment__factory,
  AccountsDAOEndowments__factory,
  AccountsQueryEndowments__factory,
  AccountsSwapEndowments__factory,
  AccountsUpdateEndowmentSettingsController__factory,
  AccountsUpdateEndowments__factory,
  AccountsUpdateStatusEndowments__factory,
  AccountsUpdate__factory,
  AccountsVaultFacet__factory,
} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getContractName,
  getSigners,
  logger,
  shouldVerify,
} from "utils";
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
        ? FACET_NAMES
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

const FACET_NAMES: string[] = [
  getContractName(new AccountDeployContract__factory()),
  getContractName(
    new AccountDepositWithdrawEndowments__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(new AccountDonationMatch__factory()),
  getContractName(
    new AccountsAllowance__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(
    new AccountsCreateEndowment__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(new AccountsDAOEndowments__factory()),
  getContractName(new AccountsQueryEndowments__factory()),
  getContractName(
    new AccountsSwapEndowments__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(
    new AccountsUpdateEndowmentSettingsController__factory({
      "contracts/core/struct.sol:AngelCoreStruct": "",
    })
  ),
  getContractName(
    new AccountsUpdateEndowments__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(new AccountsUpdateStatusEndowments__factory()),
  getContractName(new AccountsUpdate__factory()),
  getContractName(
    new AccountsVaultFacet__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
];
