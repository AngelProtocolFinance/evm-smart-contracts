import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractFactory} from "ethers";
import {
  AccountsAllowance__factory,
  AccountsCreateEndowment__factory,
  AccountsDepositWithdrawEndowments__factory,
  AccountsGasManager__factory,
  AccountsQueryEndowments__factory,
  AccountsStrategy__factory,
  AccountsSwapRouter__factory,
  AccountsUpdateEndowmentSettingsController__factory,
  AccountsUpdateEndowments__factory,
  AccountsUpdateStatusEndowments__factory,
  AccountsUpdate__factory,
  DiamondLoupeFacet__factory,
  OwnershipFacet__factory,
} from "typechain-types";
import {AddressObj} from "utils";

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
export default function getFacetFactoryEntries(deployer: SignerWithAddress): {
  factory: ContractFactory;
  addressField: keyof AddressObj["accounts"]["facets"];
}[] {
  return [
    {
      addressField: "accountsUpdate",
      factory: new AccountsUpdate__factory(deployer),
    },
    {
      addressField: "accountsQueryEndowments",
      factory: new AccountsQueryEndowments__factory(deployer),
    },
    {
      addressField: "accountsUpdateStatusEndowments",
      factory: new AccountsUpdateStatusEndowments__factory(deployer),
    },
    {
      addressField: "diamondLoupeFacet",
      factory: new DiamondLoupeFacet__factory(deployer),
    },
    {
      addressField: "ownershipFacet",
      factory: new OwnershipFacet__factory(deployer),
    },
    {
      addressField: "accountsDepositWithdrawEndowments",
      factory: new AccountsDepositWithdrawEndowments__factory(deployer),
    },
    {
      addressField: "accountsAllowance",
      factory: new AccountsAllowance__factory(deployer),
    },
    {
      addressField: "accountsCreateEndowment",
      factory: new AccountsCreateEndowment__factory(deployer),
    },
    {
      addressField: "accountsSwapRouter",
      factory: new AccountsSwapRouter__factory(deployer),
    },
    {
      addressField: "accountsUpdateEndowments",
      factory: new AccountsUpdateEndowments__factory(deployer),
    },
    {
      addressField: "accountsUpdateEndowmentSettingsController",
      factory: new AccountsUpdateEndowmentSettingsController__factory(deployer),
    },
    {
      addressField: "accountsStrategy",
      factory: new AccountsStrategy__factory(deployer),
    },
    {
      addressField: "accountsGasManager",
      factory: new AccountsGasManager__factory(deployer),
    },
  ];
}
