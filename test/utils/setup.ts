import {logger} from "utils";

before(() => {
  logger.off();
});

after(() => {
  logger.on();
});
