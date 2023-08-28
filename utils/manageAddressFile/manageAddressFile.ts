import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeepPartial} from "utils/types";
import {DEFAULT_CONTRACT_ADDRESS_FILE_PATH, getChainId, isLocalNetwork} from "..";
import {createEmptyAddressObj, getAddressesByNetworkId, saveFrontendFiles} from "./helpers";
import {AddressObj} from "./types";

/**
 * Removes contract address for the current network from the appropriate file.
 */
export async function resetContractAddresses(
  hre: HardhatRuntimeEnvironment,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH
) {
  const chainId = await getChainId(hre);

  const emptyAddressObj = createEmptyAddressObj();

  if (isLocalNetwork(hre)) {
    return saveFrontendFiles({[chainId]: emptyAddressObj}, filePath);
  }

  const currentAddressObj = getAddressesByNetworkId(chainId, filePath);

  const cleaned: AddressObj = {
    ...emptyAddressObj,
    axelar: currentAddressObj.axelar,
    tokens: {...currentAddressObj.tokens, halo: "", reserveToken: ""},
    uniswap: currentAddressObj.uniswap,
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
