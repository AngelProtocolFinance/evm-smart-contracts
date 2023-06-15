import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
import {
  AccountsDeployContract__factory,
  AccountsDepositWithdrawEndowments__factory,
  AccountsDonationMatch__factory,
  AccountsAllowance__factory,
  AccountsCreateEndowment__factory,
  AccountsDaoEndowments__factory,
  AccountsQueryEndowments__factory,
  AccountsSwapRouter__factory,
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
export default async function getFacetFactoryEntries(
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
      addressField: "accountsDeployContract",
      factory: new AccountsDeployContract__factory(diamondOwner),
    },
    {
      addressField: "accountsDonationMatch",
      factory: new AccountsDonationMatch__factory(diamondOwner),
    },
    {
      addressField: "accountsDAOEndowments",
      factory: new AccountsDaoEndowments__factory(diamondOwner),
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
      addressField: "accountsDepositWithdrawEndowments",
      factory: new AccountsDepositWithdrawEndowments__factory(
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
      addressField: "accountsSwapRouter",
      factory: new AccountsSwapRouter__factory(
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
