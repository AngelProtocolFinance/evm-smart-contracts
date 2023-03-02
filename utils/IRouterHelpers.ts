import type {
    BigNumberish,
    BytesLike
  } from "ethers";
  import type {
    PromiseOrValue,
  } from "../typechain-types/common";

export declare namespace IRouter {
    export type VaultActionDataStruct = {
      destinationChain: string;
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
      string,
      Array<number>,
      string,
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
    };


  }
  
export function VaultActionStructToArray(actionData: IRouter.VaultActionDataStruct) {
    return [
      actionData.destinationChain,
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
      destinationChain: decodedData[0],
      strategyId: decodedData[1],
      selector: decodedData[2],
      accountIds: decodedData[3],
      token: decodedData[4],
      lockAmt: decodedData[5],
      liqAmt: decodedData[6]
    } as IRouter.VaultActionDataStruct
  }