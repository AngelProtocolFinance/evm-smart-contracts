import {logger} from "utils";
import {LibAccounts} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {Assertion, util} from "chai";
import {BigNumber} from "ethers";

before(() => {
  logger.off();
});

after(() => {
  logger.on();
});

Assertion.addMethod("equalFee", function (fee: LibAccounts.FeeSettingStruct) {
  var obj: LibAccounts.FeeSettingStructOutput = util.flag(this, "object");
  new Assertion(obj.bps).to.equal(BigNumber.from(fee.bps));
  new Assertion(obj.payoutAddress).to.equal(fee.payoutAddress);
});
