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

export async function getAxlNetworkName(hre: HardhatRuntimeEnvironment): Promise<string> {
  const chainId = await getChainId(hre);
  return AxelarNetworks.get(chainId);
}

export async function getChainId(hre: HardhatRuntimeEnvironment): Promise<number> {
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  return chainId;
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
