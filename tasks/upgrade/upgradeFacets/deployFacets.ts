import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
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
  DiamondLoupeFacet__factory,
  OwnershipFacet__factory,
} from "typechain-types";
import {getContractName, logger} from "utils";
import {Facet} from "./types";

export default async function deployFacets(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  corestruct: string
): Promise<Facet[]> {
  const facets: Facet[] = [];

  logger.out("Instantiating factories...");

  const facetFactories = await getFacetFactories(facetNames, diamondOwner, corestruct);

  logger.out("Deploying facets...");

  for (const facetFactory of facetFactories) {
    const {facetName, factory} = facetFactory;
    try {
      const facet = await factory.deploy();
      await facet.deployed();
      logger.out(`${facetName} deployed: ${facet.address}`);
      facets.push({name: facetName, contract: facet});
    } catch (error) {
      logger.out(`Failed to deploy ${facetName}, reason: ${error}`, logger.Level.Error);
    }
  }
  return facets;
}

type FacetFactory = {facetName: string; factory: ContractFactory};

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
async function getFacetFactories(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  corestruct: string
): Promise<FacetFactory[]> {
  const factories: FacetFactory[] = [];
  const nonExistentFacets: string[] = [];

  facetNames.forEach((facetName) => {
    const factory = getFacetFactory(facetName, diamondOwner, corestruct);
    if (typeof factory === "string") {
      nonExistentFacets.push(factory);
    } else {
      factories.push({facetName, factory});
    }
  });

  if (!nonExistentFacets.length) {
    return factories;
  }

  throw new Error(`Nonexistent facets detected: ${nonExistentFacets.join(", ")}.`);
}

function getFacetFactory(
  facetName: string,
  diamondOwner: SignerWithAddress,
  corestruct: string
): ContractFactory | string {
  switch (facetName) {
    // no lib
    case getContractName(AccountDeployContract__factory):
      return new AccountDeployContract__factory(diamondOwner);
    case getContractName(AccountDonationMatch__factory):
      return new AccountDonationMatch__factory(diamondOwner);
    case getContractName(AccountsDAOEndowments__factory):
      return new AccountsDAOEndowments__factory(diamondOwner);
    case getContractName(AccountsQueryEndowments__factory):
      return new AccountsQueryEndowments__factory(diamondOwner);
    case getContractName(AccountsUpdate__factory):
      return new AccountsUpdate__factory(diamondOwner);
    case getContractName(OwnershipFacet__factory):
      return new OwnershipFacet__factory(diamondOwner);
    case getContractName(DiamondLoupeFacet__factory):
      return new DiamondLoupeFacet__factory(diamondOwner);
    // core lib
    case getContractName(AccountDepositWithdrawEndowments__factory):
      return new AccountDepositWithdrawEndowments__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsAllowance__factory):
      return new AccountsAllowance__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsCreateEndowment__factory):
      return new AccountsCreateEndowment__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsSwapEndowments__factory):
      return new AccountsSwapEndowments__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsUpdateEndowments__factory):
      return new AccountsUpdateEndowments__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsUpdateEndowmentSettingsController__factory):
      return new AccountsUpdateEndowmentSettingsController__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    case getContractName(AccountsUpdateStatusEndowments__factory):
      return new AccountsUpdateStatusEndowments__factory(diamondOwner);
    case getContractName(AccountsVaultFacet__factory):
      return new AccountsVaultFacet__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      );
    default:
      return facetName;
  }
}
