import {ContractFactory} from "ethers";

export function getContractName<T extends ContractFactory>(
  factory: T | {new (...args: any): T}
): string {
  const factoryName = "name" in factory ? factory.name : factory.constructor.name;
  return factoryName.replace("__factory", "");
}
