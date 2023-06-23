import {question} from "readline-sync";

export async function confirmAction(actionDescription: string): Promise<boolean> {
  const answer = question(
    `${actionDescription}\nAre you sure you wish to perform this action? (y/N)`
  ).trim();
  return /^(y|yes)$/i.test(answer);
}
