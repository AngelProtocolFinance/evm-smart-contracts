import { ContractFactory } from "ethers"

export default function getContractName<T extends ContractFactory>(factoryType: new (...args: any) => T): string {
    return factoryType.name.replace("__factory", "")
}