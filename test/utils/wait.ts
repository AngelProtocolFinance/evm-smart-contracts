import {ContractReceipt, ContractTransaction} from "ethers";

export async function wait(
  tx: ContractTransaction | Promise<ContractTransaction>
): Promise<ContractReceipt> {
  return (await tx).wait();
}
