import {IVault} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {convertVaultActionStructToArray, convertArrayToVaultActionStruct} from "./IVaultHelpers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export function packActionData(
  _actionData: IVault.VaultActionDataStruct,
  {ethers}: HardhatRuntimeEnvironment
): string {
  const TypeList = ["string", "bytes4", "bytes4", "uint", "address", "uint", "uint", "uint"];
  return ethers.utils.defaultAbiCoder.encode(
    TypeList,
    convertVaultActionStructToArray(_actionData)
  );
}

export function unpackActionData(
  _encodedActionData: string,
  {ethers}: HardhatRuntimeEnvironment
): IVault.VaultActionDataStruct {
  const TypeList = ["string", "string", "string", "uint", "string", "uint", "uint", "uint"];
  let decoded = ethers.utils.defaultAbiCoder.decode(TypeList, _encodedActionData);
  return convertArrayToVaultActionStruct(decoded);
}
