import {logger} from "utils";
import "./assertions";

before(() => {
  logger.off();
});

after(() => {
  logger.on();
});
