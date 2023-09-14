import {HardhatRuntimeEnvironment} from "hardhat/types";
import {TwoWayMap} from "./twoWayMap";
import {ChainID} from "types";
import {logger} from "utils";

const PROD_NETWORKS = [ChainID.ethereum, ChainID.polygon];

// There are errors/mismatches in the axelar sdk jsons, so we just implement a lightweight
// version here and use this instead.
const AxelarNetworks = new TwoWayMap({
  [ChainID.ethereum]: "Ethereum",
  [ChainID.goerli]: "ethereum-2",
  [ChainID.polygon]: "Polygon",
  [ChainID.hardhat]: "localhost",
  [ChainID.mumbai]: "Polygon",
});

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
  if (!(chainId in ChainID)) {
    logger.out(`Chain ID: '${chainId}' is not among the ones we have contracts deployed to`);
  }
  return chainId;
}

export async function isProdNetwork(
  hreOrChainId: HardhatRuntimeEnvironment | number
): Promise<boolean> {
  const thisChainId =
    typeof hreOrChainId === "number" ? hreOrChainId : await getChainId(hreOrChainId);
  return PROD_NETWORKS.includes(thisChainId);
}
