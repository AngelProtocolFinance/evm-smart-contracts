import type {
    BigNumberish,
    BytesLike
  } from "ethers";
  import type {
    PromiseOrValue,
  } from "../typechain-types/common";

export declare namespace IRouter {
    export type VaultActionDataStruct = {
      strategyId: BytesLike;
      selector: BytesLike;
      accountIds: Array<BigNumberish>;
      token: string;
      lockAmt: BigNumberish;
      liqAmt: BigNumberish;
    };
  
    export type AngelProtocolParamsStructOutput = [
      string,
      string,
      Array<number>,
      string,
      number,
      number
    ] & {
      strategyId: string;
      selector: string;
      accountIds: Array<number>;
      token: string;
      lockAmt: number;
      liqAmt: number;
    };


  }
  
export function VaultActionStructToArray(actionData: IRouter.VaultActionDataStruct) {
    return [
      actionData.strategyId,
      actionData.selector,
      actionData.accountIds,
      actionData.token,
      actionData.lockAmt,
      actionData.liqAmt
    ]
  }

export function ArrayToVaultActionStruct(decodedData: any) {
    return {
      strategyId: decodedData[0],
      selector: decodedData[1],
      accountIds: decodedData[2],
      token: decodedData[3],
      lockAmt: decodedData[4],
      liqAmt: decodedData[5]
    } as IRouter.VaultActionDataStruct
  }