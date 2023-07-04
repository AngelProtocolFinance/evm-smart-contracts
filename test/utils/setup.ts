import {logger} from "utils";
import {Assertion, util} from "chai";
import {BigNumber} from "ethers";

before(() => {
  logger.off();
});

after(() => {
  logger.on();
});

Assertion.addMethod("equalStruct", function (struct: any) {
  var obj = util.flag(this, "object");
  Object.keys(obj)
    .filter((key) => isNaN(Number(key)))
    .forEach((key) => {
      const structVal = typeof struct[key] === "number" ? BigNumber.from(struct[key]) : struct[key];
      new Assertion(obj[key]).to.equal(structVal);
    });
  // we need to check whether `struct` has the same fields as `obj`
  Object.keys(struct).forEach((key) => {
    const structVal = typeof struct[key] === "number" ? BigNumber.from(struct[key]) : struct[key];
    new Assertion(obj[key]).to.equal(structVal);
  });
});
