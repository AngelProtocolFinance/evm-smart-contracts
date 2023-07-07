import * as crypto from "crypto";
import {ethers, logger} from "ethers";

import {pad} from "./logger";

export function genWallet(printToConsole: Boolean = false) {
  pad(1, "Generating a new wallet");
  var id = crypto.randomBytes(32).toString("hex");
  var privateKey = "0x" + id;
  var wallet = new ethers.Wallet(privateKey);
  if (printToConsole) {
    pad(10, "PKEY:", privateKey);
    pad(10, "Address: " + wallet.address);
  }
  return wallet;
}
