import {Network} from "hardhat/types";

export function isLocalNetwork(network: Network) {
  return network.name === "hardhat" || network.name === "localhost";
}
