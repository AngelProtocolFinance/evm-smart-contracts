import {ContractFactory} from "ethers";

export function getContractName(factory: ContractFactory): string;
export function getContractName<T extends ContractFactory>(
  factoryType: new (...args: any) => T
): string;

export function getContractName<T extends ContractFactory>(
  factory: ContractFactory | (new (...args: any) => T)
): string {
  return factory.constructor.name.replace("__factory", "");
}
