import {HardhatRuntimeEnvironment, Network} from "hardhat/types";

export function isLocalNetwork(hre: HardhatRuntimeEnvironment) {
  return hre.network.name === "hardhat" || hre.network.name === "localhost";
}

export function networkNameMatchesId(id: number, name: string) {
  return AxelarNetworks[id] == name;
}

const AxelarNetworks: Record<number, string> = {
  1: "Ethereum",
  5: "ethereum-2",
  137: "Polygon",
  80001: "Polygon",
};
