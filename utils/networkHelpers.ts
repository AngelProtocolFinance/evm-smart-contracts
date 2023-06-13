import {HardhatRuntimeEnvironment, Network} from "hardhat/types";

export function isLocalNetwork(hre: HardhatRuntimeEnvironment) {
  return hre.network.name === "hardhat" || hre.network.name === "localhost";
}
