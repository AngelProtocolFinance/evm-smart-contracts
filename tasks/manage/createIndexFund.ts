import {BytesLike} from "ethers";
import {task} from "hardhat/config";
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

      let submission = await multisig.submitTransaction(indexfund.address, 0, txData, "0x");
      logger.out(`Tx hash: ${submission.hash}`);
      await submission.wait();

      let txId = (await multisig.transactionCount()).sub(1);
      let confirmations = await multisig.confirmations(txId);
      logger.out(confirmations);

      let execution = await multisig.executeTransaction(txId);
      logger.out(`Tx hash: ${execution.hash}`);
      await execution.wait();
      logger.out(execution);

      let txDetails = await multisig.transactions(txId);
      logger.out(txDetails);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
