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
import {getContractName} from "utils";

export const FACET_NAMES_USING_ANGEL_CORE_STRUCT: string[] = [
  getContractName(
    new AccountDepositWithdrawEndowments__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(
    new AccountsAllowance__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
  getContractName(
    new AccountsCreateEndowment__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
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
  getContractName(
    new AccountsVaultFacet__factory({"contracts/core/struct.sol:AngelCoreStruct": ""})
  ),
];

export const ALL_FACET_NAMES: string[] = [
  ...FACET_NAMES_USING_ANGEL_CORE_STRUCT,
  getContractName(new AccountDeployContract__factory()),
  getContractName(new AccountDonationMatch__factory()),
  getContractName(new AccountsDAOEndowments__factory()),
  getContractName(new AccountsQueryEndowments__factory()),
  getContractName(new AccountsUpdateStatusEndowments__factory()),
  getContractName(new AccountsUpdate__factory()),
];
