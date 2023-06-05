import {Network} from "hardhat/types";
import {isLocalNetwork} from "./networkHelpers";

export function shouldVerify(network: Network): boolean {
  return !isLocalNetwork(network);
}
