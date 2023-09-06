import {ContractFactory} from "ethers";
import {
  AccountsDepositWithdrawEndowments__factory,
  AccountsAllowance__factory,
  AccountsCreateEndowment__factory,
  AccountsQueryEndowments__factory,
  AccountsSwapRouter__factory,
  AccountsUpdateEndowmentSettingsController__factory,
  AccountsUpdateEndowments__factory,
  AccountsUpdateStatusEndowments__factory,
  AccountsUpdate__factory,
  AccountsStrategy__factory,
  AccountsGasManager__factory,
  DiamondLoupeFacet__factory,
  OwnershipFacet__factory,
} from "typechain-types";
import {AddressObj} from "utils";

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
export default function getFacetFactoryEntries(): {
  factory: typeof ContractFactory;
  addressField: keyof AddressObj["accounts"]["facets"];
}[] {
  return [
    {
      addressField: "accountsUpdate",
      factory: AccountsUpdate__factory,
    },
    {
      addressField: "accountsQueryEndowments",
      factory: AccountsQueryEndowments__factory,
    },
    {
      addressField: "accountsUpdateStatusEndowments",
      factory: AccountsUpdateStatusEndowments__factory,
    },
    {
      addressField: "diamondLoupeFacet",
      factory: DiamondLoupeFacet__factory,
    },
    {
      addressField: "ownershipFacet",
      factory: OwnershipFacet__factory,
    },
    {
      addressField: "accountsDepositWithdrawEndowments",
      factory: AccountsDepositWithdrawEndowments__factory,
    },
    {
      addressField: "accountsAllowance",
      factory: AccountsAllowance__factory,
    },
    {
      addressField: "accountsCreateEndowment",
      factory: AccountsCreateEndowment__factory,
    },
    {
      addressField: "accountsSwapRouter",
      factory: AccountsSwapRouter__factory,
    },
    {
      addressField: "accountsUpdateEndowments",
      factory: AccountsUpdateEndowments__factory,
    },
    {
      addressField: "accountsUpdateEndowmentSettingsController",
      factory: AccountsUpdateEndowmentSettingsController__factory,
    },
    {
      addressField: "accountsStrategy",
      factory: AccountsStrategy__factory,
    },
    {
      addressField: "accountsGasManager",
      factory: AccountsGasManager__factory,
    },
  ];
}
