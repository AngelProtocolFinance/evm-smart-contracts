import {BigNumber} from "ethers";

export interface StateVariable {
  name: string;
  slot: string;
  offset: number;
  type: string;
  idx: number;
  artifact: string;
  numberOfBytes: string;
}

export interface Row {
  name: string;
  stateVariables: StateVariable[];
}

export interface Table {
  contracts: Row[];
}

export type StorageChunk = {
  start: string | BigNumber;
  slot: string | BigNumber;
  length: number;
};

export type NestedStorageChunk = {
  start: string | BigNumber;
  slot: string | BigNumber;
  length: number;
  depth: number;
  innerChunk: StorageChunk | NestedStorageChunk;
};
