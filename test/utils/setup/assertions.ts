import {Assertion, util} from "chai";
import {BigNumber} from "ethers";
import {
  LibAccounts,
  LocalRegistrarLib,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

Assertion.addMethod("equalFee", function (fee: FeeSetting) {
  var obj: FeeSetting = util.flag(this, "object");
  new Assertion(obj.bps).to.equal(BigNumber.from(fee.bps));
  new Assertion(obj.payoutAddress).to.equal(fee.payoutAddress);
});

Assertion.addMethod("equalRebalance", function (rebalance: RebalanceParams) {
  var obj: RebalanceParams = util.flag(this, "object");
  new Assertion(obj.basis).to.equal(rebalance.basis);
  new Assertion(obj.interestDistribution).to.equal(rebalance.interestDistribution);
  new Assertion(obj.lockedPrincipleToLiquid).to.equal(rebalance.lockedPrincipleToLiquid);
  new Assertion(obj.lockedRebalanceToLiquid).to.equal(rebalance.lockedRebalanceToLiquid);
  new Assertion(obj.principleDistribution).to.equal(rebalance.principleDistribution);
  new Assertion(obj.rebalanceLiquidProfits).to.equal(rebalance.rebalanceLiquidProfits);
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

type RebalanceParams =
  | LocalRegistrarLib.RebalanceParamsStruct
  | LocalRegistrarLib.RebalanceParamsStructOutput;

type SettingsPermission =
  | LibAccounts.SettingsPermissionStruct
  | LibAccounts.SettingsPermissionStructOutput;
