import {createInterface} from "node:readline/promises";

export async function confirmAction(description: string) {
  const readline = createInterface({input: process.stdin, output: process.stdout});
  const answer = await readline.question(`${description}\nAre you sure you wish to do this? (Y/y)`);
  if (!/^(|y|yes)$/i.test(answer)) {
    throw new Error("Confirmation denied. Operation canceled.");
  }
}
