import {HardhatRuntimeEnvironment} from "hardhat/types";

import {DEFAULT_CONTRACT_ADDRESS_FILE_PATH, isLocalNetwork} from "..";
import {
  createEmpty as createEmptyAddressObj,
  getAddressesByNetworkId,
  saveFrontendFiles,
} from "./helpers";
import {AddressObj} from "./types";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Removes contract address for the current network from the appropriate file.
 */
export async function resetAddresses(
  hre: HardhatRuntimeEnvironment,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH
) {
  const chainId = await getChainId(hre);

  if (isLocalNetwork(hre)) {
    return saveFrontendFiles({[chainId]: createEmptyAddressObj()}, filePath);
  }

  const currentAddressObj = getAddressesByNetworkId(chainId, filePath);

  const cleaned: AddressObj = {
    ...createEmptyAddressObj(),
    uniswapSwapRouter: currentAddressObj.uniswapSwapRouter,
    tokens: {
      dai: currentAddressObj.tokens.dai,
      halo: "",
      usdc: currentAddressObj.tokens.usdc,
      wmatic: currentAddressObj.tokens.wmatic,
    },
  };

  saveFrontendFiles({[chainId]: cleaned}, filePath);
}

export async function getAddresses(
  hre: HardhatRuntimeEnvironment,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH
): Promise<AddressObj> {
  const chainId = await getChainId(hre);
  return getAddressesByNetworkId(chainId, filePath);
}

export async function updateAddresses(
  partial: DeepPartial<AddressObj>,
  hre: HardhatRuntimeEnvironment,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH
) {
  const chainId = await getChainId(hre);

  const currentAddressObj = getAddressesByNetworkId(chainId, filePath);

  const updated = updateInternal(currentAddressObj, partial);

  saveFrontendFiles({[chainId]: updated}, filePath);
}

function updateInternal<T>(original: T, partial: DeepPartial<T>): T {
  // if value to update is not an object, no need to go deeper
  if (typeof partial !== "object") {
    return partial;
  }

  const updated: T = {...original};

  for (const key in partial) {
    updated[key] = updateInternal(original[key], partial[key]!);
  }

  return updated;
}

async function getChainId(hre: HardhatRuntimeEnvironment): Promise<number> {
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  return chainId;
}
