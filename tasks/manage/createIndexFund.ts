import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike} from "ethers";
import {task} from "hardhat/config";
import {IndexFund, MultiSigGeneric} from "typechain-types";
import {getAddresses, logger} from "utils";

task("manage:createIndexFund", "Will create a new index fund").setAction(
  async (_taskArguments, hre) => {
    try {
      let deployer: SignerWithAddress;
      let apTeam1: SignerWithAddress;
      let apTeam2: SignerWithAddress;
      let apTeam3: SignerWithAddress;
      [deployer, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners();

      const addresses = await getAddresses(hre);

      const multisig = (await hre.ethers.getContractAt(
        "MultiSigGeneric",
        addresses.multiSig.apTeam.proxy
      )) as MultiSigGeneric;

      const indexfund = (await hre.ethers.getContractAt(
        "IndexFund",
        addresses.indexFund.proxy
      )) as IndexFund;

      const {data} = await indexfund.populateTransaction.createIndexFund(
        "",
        "",
        [1],
        true,
        50,
        Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
        34316408 + 1_000_000
      );
      let txData: BytesLike = data!;

      let submission = await multisig
        .connect(apTeam2)
        .submitTransaction(
          "create IF",
          "create a new index fund",
          indexfund.address,
          0,
          txData,
          "0x"
        );
      await hre.ethers.provider.waitForTransaction(submission.hash);

      let txId = (await multisig.transactionCount()).sub(1);
      let confirmations = await multisig.getConfirmations(txId);
      logger.out(confirmations);

      let execution = await multisig.connect(apTeam2).executeTransaction(txId);
      await hre.ethers.provider.waitForTransaction(execution.hash);
      logger.out(execution);

      let txDetails = await multisig.transactions(txId);
      logger.out(txDetails);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
