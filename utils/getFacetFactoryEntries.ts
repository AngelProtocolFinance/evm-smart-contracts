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
import {AddressObj} from "utils";

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
export async function getFacetFactoryEntries(
  diamondOwner: SignerWithAddress,
  corestruct: string
): Promise<
  {
    factory: ContractFactory;
    addressField: keyof AddressObj["accounts"]["facets"];
  }[]
> {
  return [
    // no lib
    {
      addressField: "accountDeployContract",
      factory: new AccountDeployContract__factory(diamondOwner),
    },
    {
      addressField: "accountDonationMatch",
      factory: new AccountDonationMatch__factory(diamondOwner),
    },
    {
      addressField: "accountsDAOEndowments",
      factory: new AccountsDAOEndowments__factory(diamondOwner),
    },
    {addressField: "accountsUpdate", factory: new AccountsUpdate__factory(diamondOwner)},
    {
      addressField: "accountsQueryEndowments",
      factory: new AccountsQueryEndowments__factory(diamondOwner),
    },
    {
      addressField: "accountsUpdateStatusEndowments",
      factory: new AccountsUpdateStatusEndowments__factory(diamondOwner),
    },
    {addressField: "diamondLoupeFacet", factory: new DiamondLoupeFacet__factory(diamondOwner)},
    {addressField: "ownershipFacet", factory: new OwnershipFacet__factory(diamondOwner)},
    // core lib
    {
      addressField: "accountDepositWithdrawEndowments",
      factory: new AccountDepositWithdrawEndowments__factory(
        {
          "contracts/core/struct.sol:AngelCoreStruct": corestruct,
        },
        diamondOwner
      ),
    },
    {
      addressField: "accountsAllowance",
      factory: new AccountsAllowance__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
    {
      addressField: "accountsCreateEndowment",
      factory: new AccountsCreateEndowment__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
    {
      addressField: "accountsSwapEndowments",
      factory: new AccountsSwapEndowments__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
    {
      addressField: "accountsUpdateEndowments",
      factory: new AccountsUpdateEndowments__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
    {
      addressField: "accountsUpdateEndowmentSettingsController",
      factory: new AccountsUpdateEndowmentSettingsController__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
    {
      addressField: "accountsVaultFacet",
      factory: new AccountsVaultFacet__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct},
        diamondOwner
      ),
    },
  ];
}
