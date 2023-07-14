declare module Chai {
  import {
    LibAccounts,
    LocalRegistrarLib,
  } from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

  export interface Assertion {
    equalFee(fee: LibAccounts.FeeSettingStruct | LibAccounts.FeeSettingStructOutput): Assertion;
    equalRebalance(
      fee: LocalRegistrarLib.RebalanceParamsStruct | LocalRegistrarLib.RebalanceParamsStructOutput
    ): Assertion;
    equalSettingsPermission(
      fee: LibAccounts.SettingsPermissionStruct | LibAccounts.SettingsPermissionStructOutput
    ): Assertion;
  }
}
