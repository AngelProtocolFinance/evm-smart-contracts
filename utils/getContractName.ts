import {ContractFactory} from "ethers";

export function getContractName<T extends ContractFactory>(factory: T): string {
  return factory.constructor.name.replace("__factory", "");
}
