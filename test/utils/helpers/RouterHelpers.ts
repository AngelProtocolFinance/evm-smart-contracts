import {IVaultHelpers, VaultActionStructToArray, ArrayToVaultActionStruct} from "./IVaultHelpers";
import {ethers} from "hardhat";

export async function packActionData(
  _actionData: IVaultHelpers.VaultActionDataStruct
): Promise<string> {
  const TypeList = ["string", "bytes4", "bytes4", "uint[]", "address", "uint", "uint", "uint"];
  return ethers.utils.defaultAbiCoder.encode(TypeList, VaultActionStructToArray(_actionData));
}

export async function unpackActionData(
  _encodedActionData: string
): Promise<IVaultHelpers.VaultActionDataStruct> {
  const TypeList = ["string", "string", "string", "uint[]", "string", "uint", "uint", "uint"];
  let decoded = ethers.utils.defaultAbiCoder.decode(TypeList, _encodedActionData);
  return ArrayToVaultActionStruct(decoded);
}
