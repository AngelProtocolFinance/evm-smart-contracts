import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike} from "ethers";
import {IMultiSigGeneric__factory} from "typechain-types";
import {getEvents, logger} from "utils";

/**
 * Submits a transaction to the designated Multisig contract and executes it if possible.
 * @param msAddress address of the Multisig contract
 * @param owner signer representing one of the Multisig owners
 * @param destination transaction target address
 * @param data transaction data payload
 * @returns boolean value indicating whether the transaction was executed or not (i.e. is pending confirmation by other owners)
 */
export async function submitMultiSigTx(
  msAddress: string,
  owner: SignerWithAddress,
  destination: string,
  data: BytesLike
): Promise<boolean> {
  logger.out(`Submitting transaction to Multisig at address: ${msAddress}...`);
  const multisig = IMultiSigGeneric__factory.connect(msAddress, owner);
  const tx = await multisig.submitTransaction(destination, 0, data, "0x");
  logger.out(`Tx hash: ${tx.hash}`);
  const receipt = await tx.wait();

  const transactionExecutedEvent = getEvents(
    receipt.events,
    multisig,
    multisig.filters.TransactionExecuted()
  ).at(0);
  if (transactionExecutedEvent) {
    return true;
  }

  const transactionSubmittedEvent = getEvents(
    receipt.events,
    multisig,
    multisig.filters.TransactionSubmitted()
  ).at(0);
  if (!transactionSubmittedEvent) {
    throw new Error(`Unexpected: ${multisig.filters.TransactionSubmitted.name} not emitted.`);
  }

  const txId = transactionSubmittedEvent.args.transactionId;

  const isConfirmed = await multisig.isConfirmed(txId);
  if (!isConfirmed) {
    logger.out(`Transaction with ID "${txId}" submitted, awaiting confirmation by other owners.`);
    return false;
  }

  // is confirmed but not executed -> requires manual execution
  logger.out(`Executing the new charity endowment with transaction ID: ${txId}...`);
  const tx2 = await multisig.executeTransaction(txId);
  logger.out(`Tx hash: ${tx2.hash}`);
  const execReceipt = await tx2.wait();

  const txExecuted = getEvents(
    execReceipt.events,
    multisig,
    multisig.filters.TransactionExecuted()
  ).at(0);
  if (!txExecuted) {
    throw new Error(`Unexpected: ${multisig.filters.TransactionExecuted.name} not emitted.`);
  }

  return true;
}
