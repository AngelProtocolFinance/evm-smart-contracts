import {HardhatRuntimeEnvironment, Network} from "hardhat/types";
import {TwoWayMap} from "./twoWayMap";

export function isLocalNetwork(hre: HardhatRuntimeEnvironment) {
  return hre.network.name === "hardhat" || hre.network.name === "localhost";
}

export function networkNameMatchesId(id: number, name: string) {
  return AxelarNetworks.get(id) == name;
}

export function getChainIdFromNetworkName(name: string): number {
  return AxelarNetworks.revGet(name);
}

export function getNetworkNameFromChainId(id: number): string {
  return AxelarNetworks.get(id);
}

// There are errors/mismatches in the axelar sdk jsons, so we just implement a lightweight
// version here and use this instead.
const AxelarNetworks = new TwoWayMap({
  1: "Ethereum",
  5: "ethereum-2",
  137: "Polygon",
  31337: "localhost",
  80001: "Polygon",
});
