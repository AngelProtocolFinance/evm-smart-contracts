import {createInterface} from "node:readline/promises";

export async function confirmAction(actionDescription: string): Promise<boolean> {
  const readline = createInterface({input: process.stdin, output: process.stdout});
  const answer = await readline
    .question(`${actionDescription}\nAre you sure you wish to perform this action? (y/N)`)
    .then((input) => input.trim());
  return /^(y|yes)$/i.test(answer);
}
