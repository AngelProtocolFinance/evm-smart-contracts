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
  AccountsStrategy__factory,
  AccountsGasManager__factory,
  DiamondLoupeFacet__factory,
  OwnershipFacet__factory,
} from "typechain-types";
import {AddressObj} from "utils";

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
export default async function getFacetFactoryEntries(diamondOwner: SignerWithAddress): Promise<
  {
    factory: ContractFactory;
    addressField: keyof AddressObj["accounts"]["facets"];
  }[]
> {
  return [
    {
      addressField: "accountsDeployContract",
      factory: new AccountsDeployContract__factory(diamondOwner),
    },
    {
      addressField: "accountsDonationMatch",
      factory: new AccountsDonationMatch__factory(diamondOwner),
    },
    {
      addressField: "accountsDaoEndowments",
      factory: new AccountsDaoEndowments__factory(diamondOwner),
    },
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
