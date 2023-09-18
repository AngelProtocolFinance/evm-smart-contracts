import {ContractFactory, Signer} from "ethers";
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
export default function getFacetFactoryEntries(diamondOwner: Signer): {
  factory: ContractFactory;
  addressField: keyof AddressObj["accounts"]["facets"];
}[] {
  return [
    {
      addressField: "accountsUpdate",
      factory: new AccountsUpdate__factory(diamondOwner),
    },
    {
      addressField: "accountsQueryEndowments",
      factory: new AccountsQueryEndowments__factory(diamondOwner),
    },
    {
      addressField: "accountsUpdateStatusEndowments",
      factory: new AccountsUpdateStatusEndowments__factory(diamondOwner),
    },
    {
      addressField: "diamondLoupeFacet",
      factory: new DiamondLoupeFacet__factory(diamondOwner),
    },
    {
      addressField: "ownershipFacet",
      factory: new OwnershipFacet__factory(diamondOwner),
    },
    {
      addressField: "accountsDepositWithdrawEndowments",
      factory: new AccountsDepositWithdrawEndowments__factory(diamondOwner),
    },
    {
      addressField: "accountsAllowance",
      factory: new AccountsAllowance__factory(diamondOwner),
    },
    {
      addressField: "accountsCreateEndowment",
      factory: new AccountsCreateEndowment__factory(diamondOwner),
    },
    {
      addressField: "accountsSwapRouter",
      factory: new AccountsSwapRouter__factory(diamondOwner),
    },
    {
      addressField: "accountsUpdateEndowments",
      factory: new AccountsUpdateEndowments__factory(diamondOwner),
    },
    {
      addressField: "accountsUpdateEndowmentSettingsController",
      factory: new AccountsUpdateEndowmentSettingsController__factory(diamondOwner),
    },
    {
      addressField: "accountsStrategy",
      factory: new AccountsStrategy__factory(diamondOwner),
    },
    {
      addressField: "accountsGasManager",
      factory: new AccountsGasManager__factory(diamondOwner),
    },
  ];
}
