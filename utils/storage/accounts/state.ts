import {BigNumber} from "@ethersproject/bignumber";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DIAMOND_STORAGE_POSITION} from "./constants";
import {StorageChunk, NestedStorageChunk} from "../types";
import {getAddresses} from "../../manageAddressFile";
import {getStorageForSlots} from "../helpers";
import * as logger from "../../logger";

export const CONFIG_CHUNK: StorageChunk = {
  start: DIAMOND_STORAGE_POSITION.add(6),
  slot: DIAMOND_STORAGE_POSITION.add(6),
  length: 13,
};

export const DAO_TOKEN_BALANCE_CHUNK: StorageChunk = {
  start: DIAMOND_STORAGE_POSITION,
  slot: "",
  length: 1,
};

export const ENDOWMENT_STATE_CHUNK: NestedStorageChunk = {
  start: DIAMOND_STORAGE_POSITION.add(1),
  slot: "",
  length: 8,
  depth: 1,
  innerChunk: {
    start: "",
    slot: "",
    length: 1
  }
};

export const ENDOWMENTS_CHUNK: StorageChunk = {
  start: DIAMOND_STORAGE_POSITION.add(2),
  slot: "",
  length: 81,
};

export const ALLOWANCES_CHUNK: NestedStorageChunk = {
  start: DIAMOND_STORAGE_POSITION.add(3),
  slot: "",
  length: 1,
  depth: 2,
  innerChunk: {
    start: "",
    slot: "",
    length: 2,
    depth: 1,
    innerChunk: {
      start: "",
      slot: "",
      length: 1,
    },
  },
};

export async function getMappingChunk(
  hre: HardhatRuntimeEnvironment,
  chunk: StorageChunk,
  key: BigNumber | number
): Promise<string[]> {
  const abiCoder = new hre.ethers.utils.AbiCoder();
  const encoded = abiCoder.encode(["uint256", "uint256"], [key, chunk.start]);
  chunk.slot = hre.ethers.utils.keccak256(encoded);
  logger.out(chunk.slot);
  const addresses = await getAddresses(hre);
  return await getStorageForSlots(hre, addresses.accounts.diamond, chunk)
  // return await getStorageForSlots(hre, "0xE2e48880d780c4Fa36655EC9014DBbdA1164C0cA", chunk);
}

export async function getNestedMappingChunk(
  hre: HardhatRuntimeEnvironment,
  chunk: NestedStorageChunk,
  keys: BigNumber[] | number[] | string[]
) : Promise<string[]> {
  const abiCoder = new hre.ethers.utils.AbiCoder();
  if(typeof keys[0] === `string`) [
    keys.forEach((e,i) => {keys[i] = BigNumber.from(e)})
  ]
  let salt = abiCoder.encode(["uint256", "uint256"], [keys[0], chunk.start]);
  for (let i = chunk.depth; i == 0; i--) {
    salt = abiCoder.encode(["uint256", "bytes"], [keys[i], salt]);
  }
}