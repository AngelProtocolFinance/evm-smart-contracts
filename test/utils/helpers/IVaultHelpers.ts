import {IVault} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";

export function convertVaultActionStructToArray(actionData: IVault.VaultActionDataStruct) {
  return [
    actionData.destinationChain,
    actionData.strategySelector,
    actionData.selector,
    actionData.accountIds,
    actionData.token,
    actionData.lockAmt,
    actionData.liqAmt,
    actionData.status,
  ];
}

export function convertArrayToVaultActionStruct(decodedData: any) {
  return {
    destinationChain: decodedData[0],
    strategySelector: decodedData[1],
    selector: decodedData[2],
    accountIds: decodedData[3],
    token: decodedData[4],
    lockAmt: decodedData[5],
    liqAmt: decodedData[6],
    status: decodedData[7],
  } as IVault.VaultActionDataStruct;
}
