import {createInterface} from "node:readline/promises";

export async function confirmAction(description: string): Promise<boolean> {
  const readline = createInterface({input: process.stdin, output: process.stdout});
  const answer = await readline.question(`${description}\nAre you sure you wish to do this? (Y/y)`);
  return /^(|y|yes)$/i.test(answer);
}
