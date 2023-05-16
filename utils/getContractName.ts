import { ContractFactory } from "ethers"

export function getContractName<T extends ContractFactory>(factoryType: new (...args: any) => T): string {
    return factoryType.name.replace("__factory", "")
}
