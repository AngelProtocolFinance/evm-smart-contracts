import {Assertion, util} from "chai";
import {BigNumber} from "ethers";
import {LibAccounts} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {logger} from "utils";

before(() => {
  logger.off();
});

after(() => {
  logger.on();
});

Assertion.addMethod("equalFee", function (fee: FeeSetting) {
  var obj: FeeSetting = util.flag(this, "object");
  new Assertion(obj.bps).to.equal(BigNumber.from(fee.bps));
  new Assertion(obj.payoutAddress).to.equal(fee.payoutAddress);
});

Assertion.addMethod("equalSettingsPermission", function (actual: SettingsPermission) {
  var expected: SettingsPermission = util.flag(this, "object");
  new Assertion(expected.locked).to.equal(actual.locked);
  new Assertion(
    (!actual.delegate && !expected.delegate) || (!!actual.delegate && !!expected.delegate)
  ).to.equal(true);
  if (expected.delegate) {
    new Assertion(expected.delegate.addr).to.equal(actual.delegate.addr);
    new Assertion(expected.delegate.expires).to.equal(actual.delegate.expires);
  }
});

type FeeSetting = LibAccounts.FeeSettingStruct | LibAccounts.FeeSettingStructOutput;

type SettingsPermission =
  | LibAccounts.SettingsPermissionStruct
  | LibAccounts.SettingsPermissionStructOutput;
