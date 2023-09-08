import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike, Wallet} from "ethers";
import {CharityApplications__factory} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/multisigs/CharityApplications";
import {filterEvents, logger} from "utils";

/**
 * Submits a proposal to CharityApplications contract and executes it if possible.
 * @param charAppsAddress address of the CharityApplications contract
 * @param owner signer representing one of the CharityApplications owners
 * @param applicationRequest charity application request data
 * @param metadata metadata
 * @returns boolean value indicating whether the proposal was executed or not (i.e. is pending confirmation by other multisig owners)
 */
export async function proposeCharityApplication(
  charAppsAddress: string,
  owner: SignerWithAddress | Wallet,
  applicationRequest: AccountMessages.CreateEndowmentRequestStruct,
  metadata: BytesLike = "0x"
): Promise<boolean> {
  logger.out("Creating a charity applications proposal...");
  const charApps = CharityApplications__factory.connect(charAppsAddress, owner);
  const tx = await charApps.proposeApplication(applicationRequest, metadata);
  logger.out(`Tx hash: ${tx.hash}`);
  const receipt = await tx.wait();

  const applicationExecutedEvent = filterEvents(
    receipt.events,
    charApps,
    charApps.filters.ApplicationExecuted()
  ).at(0);
  if (applicationExecutedEvent) {
    return true;
  }

  const applicationProposedEvent = filterEvents(
    receipt.events,
    charApps,
    charApps.filters.ApplicationProposed()
  ).at(0);
  if (!applicationProposedEvent) {
    throw new Error(`Unexpected: ${charApps.filters.ApplicationProposed.name} not emitted.`);
  }

  const proposalId = applicationProposedEvent.args.proposalId;

  const isConfirmed = await charApps.isProposalConfirmed(proposalId);
  if (!isConfirmed) {
    logger.out(
      `Proposal with ID "${proposalId}" submitted, awaiting confirmation by other owners.`
    );
    return false;
  }

  // is confirmed but not executed -> requires manual execution
  logger.out(`Executing Proposal with ID: ${proposalId}...`);
  const tx2 = await charApps.executeProposal(proposalId);
  logger.out(`Tx hash: ${tx2.hash}`);
  const execReceipt = await tx2.wait();

  const txExecuted = filterEvents(
    execReceipt.events,
    charApps,
    charApps.filters.ApplicationExecuted()
  ).at(0);
  if (!txExecuted) {
    throw new Error(`Unexpected: ${charApps.filters.ApplicationExecuted.name} not emitted.`);
  }

  return true;
}
