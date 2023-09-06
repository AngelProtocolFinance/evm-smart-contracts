import {ContractFactory} from "ethers";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Deployment<T extends ContractFactory> = {
  constructorArguments?: Parameters<T["deploy"]>;
  contract: Awaited<ReturnType<T["deploy"]>>;
  contractName: string;
};
