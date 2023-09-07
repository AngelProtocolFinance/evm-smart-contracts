import {CONFIG, FEES} from "config";
import {task, types} from "hardhat/config";
import {POLYGON, getAddresses, getChainId, getKeysTyped} from "utils";

type TaskArgs = {payoutAddress?: string; bps?: number; apTeamSignerPkey?: string};

task("manage:registrar:setAllFeeSettings")
  .addOptionalParam(
    "payoutAddress",
    "Override address of fee recipient -- will do a config lookup or assign to AP Team",
    "",
    types.string
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    for (const feeType of getKeysTyped(FEES)) {
      const fee = FEES[feeType];

      let payoutAddress = taskArguments.payoutAddress
        ? taskArguments.payoutAddress
        : fee.payoutAddress;

      // if an overriding payoutAddress isn't set in the config, set it accordingly:
      // If Network == Polygon -> PROD_CONFIG.Treasury
      // else, set to AP Team Multisig
      if (payoutAddress == "") {
        if ((await getChainId(hre)) == POLYGON) {
          payoutAddress = CONFIG.PROD_CONFIG.Treasury;
        } else {
          const addresses = await getAddresses(hre);
          payoutAddress = addresses.multiSig.apTeam.proxy;
        }
      }

      await hre.run("manage:registrar:setFeeSettings", {
        feeType: Number(feeType),
        payoutAddress: payoutAddress,
        bps: fee.bps,
        apTeamSignerPkey: taskArguments.apTeamSignerPkey,
      });
    }
  });
