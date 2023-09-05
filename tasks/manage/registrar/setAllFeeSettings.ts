import { task, types } from "hardhat/config";
import { FeeTypes, getAPTeamOwner, getAddresses, getEnumKeys, logger } from "utils";
import {fees} from "config";
import { Fees } from "config/types";


type TaskArgs = { payoutAddress?: string; bps?: number; apTeamSignerPkey?: string };

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
    for(const feeName in FeeTypes) {
      const feeType = Number(feeName)
      const fee = fees[feeType as keyof Fees];

      let payoutAddress = taskArguments.payoutAddress? taskArguments.payoutAddress : fee.payoutAddress;
      // if payoutAddress isn't set in the config, set it to AP Team 
      if(payoutAddress == "") {
        const addresses = await getAddresses(hre);
        payoutAddress = addresses.multiSig.apTeam.proxy;
      }

      await hre.run("manage:registrar:setFeeSettings", 
        {
          feeType: feeType,
          payoutAddress: payoutAddress, 
          bps: fee.bps,
          apTeamSignerPkey: taskArguments.apTeamSignerPkey 
        })
    }
      
        
  }
);
