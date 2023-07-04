declare module Chai {
  import {LibAccounts} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

  export interface Assertion {
    equalFee(fee: LibAccounts.FeeSettingStruct): Assertion;
  }
}
