import {HardhatRuntimeEnvironment} from "hardhat/types";
import {BigNumber} from "@ethersproject/bignumber";
import {Row, StorageChunk, Table} from "./types";
import fs from "fs";
import * as logger from "../logger";

export async function getStorageForSlots(
  hre: HardhatRuntimeEnvironment,
  address: string,
  chunk: StorageChunk
): Promise<string[]> {
  let data: string[] = [];
  if (typeof chunk.slot === "string") {
    chunk.slot = BigNumber.from(chunk.slot);
  }
  for (let i = 0; i < chunk.length; i++) {
    data.push(await hre.ethers.provider.getStorageAt(address, chunk.slot.add(i)));
  }
  return data;
}

export async function getSingleArtifact(
  hre: HardhatRuntimeEnvironment,
  _contractName: string
): Promise<Table> {
  const buildInfos = await hre.artifacts.getBuildInfoPaths();
  const artifactsPath = hre.config.paths.artifacts;
  const artifacts = buildInfos.map((source, idx) => {
    const artifact: Buffer = fs.readFileSync(source);
    return {
      idx,
      source: source.startsWith(artifactsPath) ? source.slice(artifactsPath.length) : source,
      data: JSON.parse(artifact.toString()),
    };
  });

  let name: {sourceName: string; contractName: string} | undefined;
  for (const fullName of await hre.artifacts.getAllFullyQualifiedNames()) {
    const {sourceName, contractName} = await hre.artifacts.readArtifact(fullName);
    if (contractName == _contractName) {
      name = {sourceName: sourceName, contractName: contractName};
      break;
    }
  }

  if (!name) {
    throw new Error("No artifact found for contract name provided");
  }
  const contractName = name!.contractName;
  const sourceName = name!.sourceName;

  const data: Table = {contracts: []};
  logger.pad(10, "sourceName: ", sourceName);
  logger.pad(10, "contractName: ", contractName);
  for (const artifactJsonABI of artifacts) {
    const storage =
      artifactJsonABI.data.output?.contracts?.[sourceName]?.[contractName]?.storageLayout?.storage;
    logger.out(storage);
    if (!storage) {
      continue;
    }
    const contract: Row = {name: contractName, stateVariables: []};
    for (const stateVariable of storage) {
      contract.stateVariables.push({
        name: stateVariable.label,
        slot: stateVariable.slot,
        offset: stateVariable.offset,
        type: stateVariable.type,
        idx: artifactJsonABI.idx,
        artifact: artifactJsonABI.source,
        numberOfBytes:
          artifactJsonABI.data.output?.contracts[sourceName][contractName].storageLayout.types[
            stateVariable.type
          ].numberOfBytes,
      });
    }
    data.contracts.push(contract);
  }

  return data;
}

export async function getAllArtifacts(hre: HardhatRuntimeEnvironment): Promise<Table> {
  const buildInfos = await hre.artifacts.getBuildInfoPaths();
  const artifactsPath = hre.config.paths.artifacts;
  const artifacts = buildInfos.map((source, idx) => {
    const artifact: Buffer = fs.readFileSync(source);
    return {
      idx,
      source: source.startsWith(artifactsPath) ? source.slice(artifactsPath.length) : source,
      data: JSON.parse(artifact.toString()),
    };
  });

  const names: Array<{sourceName: string; contractName: string}> = [];
  for (const fullName of await hre.artifacts.getAllFullyQualifiedNames()) {
    const {sourceName, contractName} = await hre.artifacts.readArtifact(fullName);
    names.push({sourceName, contractName});
  }
  names.sort((a, b) => a.contractName.localeCompare(b.contractName));

  const data: Table = {contracts: []};
  for (const {sourceName, contractName} of names) {
    logger.pad(10, "sourceName: ", sourceName);
    logger.pad(10, "contractName: ", contractName);
    for (const artifactJsonABI of artifacts) {
      const storage =
        artifactJsonABI.data.output?.contracts?.[sourceName]?.[contractName]?.storageLayout
          ?.storage;
      logger.out(storage);
      if (!storage) {
        continue;
      }
      const contract: Row = {name: contractName, stateVariables: []};
      for (const stateVariable of storage) {
        contract.stateVariables.push({
          name: stateVariable.label,
          slot: stateVariable.slot,
          offset: stateVariable.offset,
          type: stateVariable.type,
          idx: artifactJsonABI.idx,
          artifact: artifactJsonABI.source,
          numberOfBytes:
            artifactJsonABI.data.output?.contracts[sourceName][contractName].storageLayout.types[
              stateVariable.type
            ].numberOfBytes,
        });
      }
      data.contracts.push(contract);
    }
  }
  return data;
}
