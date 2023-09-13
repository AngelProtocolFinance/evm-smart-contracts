import {IVault} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";

export function convertVaultActionStructToArray(actionData: IVault.VaultActionDataStruct) {
  return [
    actionData.destinationChain,
    actionData.strategyId,
    actionData.selector,
    actionData.accountId,
    actionData.token,
    actionData.lockAmt,
    actionData.liqAmt,
    actionData.status,
  ];
}

export function convertArrayToVaultActionStruct(decodedData: any) {
  return {
    destinationChain: decodedData[0],
    strategyId: decodedData[1],
    selector: decodedData[2],
    accountId: decodedData[3],
    token: decodedData[4],
    lockAmt: decodedData[5],
    liqAmt: decodedData[6],
    status: decodedData[7],
  } as IVault.VaultActionDataStruct;
}
