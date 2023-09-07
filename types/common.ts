import {ContractFactory} from "ethers";
import {ProxyContract__factory} from "typechain-types";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Deployment<T extends ContractFactory> = {
  constructorArguments?: Parameters<T["deploy"]>;
  contract: Awaited<ReturnType<T["deploy"]>>;
  contractName: string;
};

export type ProxyDeployment<T extends ContractFactory> = {
  implementation: Deployment<T>;
  proxy: Deployment<ProxyContract__factory>;
};
