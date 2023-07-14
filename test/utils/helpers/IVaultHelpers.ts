import type {BigNumberish, BytesLike} from "ethers";

export declare namespace IVaultHelpers {
  export type VaultActionDataStruct = {
    destinationChain: string;
    strategyId: BytesLike;
    selector: BytesLike;
    accountIds: Array<BigNumberish>;
    token: string;
    lockAmt: BigNumberish;
    liqAmt: BigNumberish;
    status: BigNumberish;
  };

  export type AngelProtocolParamsStructOutput = [
    string,
    string,
    string,
    Array<number>,
    string,
    number,
    number,
    number
  ] & {
    destinationChain: string;
    strategyId: string;
    selector: string;
    accountIds: Array<number>;
    token: string;
    lockAmt: number;
    liqAmt: number;
    status: number;
  };
}

export enum VaultType {
  LOCKED,
  LIQUID,
}

export function VaultActionStructToArray(actionData: IVaultHelpers.VaultActionDataStruct) {
  return [
    actionData.destinationChain,
    actionData.strategyId,
    actionData.selector,
    actionData.accountIds,
    actionData.token,
    actionData.lockAmt,
    actionData.liqAmt,
    actionData.status,
  ];
}

export function ArrayToVaultActionStruct(decodedData: any) {
  return {
    destinationChain: decodedData[0],
    strategyId: decodedData[1],
    selector: decodedData[2],
    accountIds: decodedData[3],
    token: decodedData[4],
    lockAmt: decodedData[5],
    liqAmt: decodedData[6],
    status: decodedData[7],
  } as IVaultHelpers.VaultActionDataStruct;
}
