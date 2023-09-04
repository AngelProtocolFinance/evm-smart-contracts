import {BytesLike} from "ethers";
import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IndexFund__factory, MultiSigGeneric__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

task("manage:createIndexFund", "Will create a new index fund")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: {apTeamSignerPkey?: string}, hre) => {
    try {
      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const addresses = await getAddresses(hre);

      const multisig = MultiSigGeneric__factory.connect(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner
      );

      const indexfund = IndexFund__factory.connect(addresses.indexFund.proxy, apTeamOwner);

      const {data} = await indexfund.populateTransaction.createIndexFund(
        "Test Index Fund",
        "Test Index Fund created from a task",
        [1],
        true,
        50,
        Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60
      );
      let txData: BytesLike = data!;

      await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        indexfund.address,
        txData
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
