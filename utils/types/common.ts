import {Overrides} from "ethers";
import {PromiseOrValue} from "typechain-types/common";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Head<T extends any[]> = Required<T> extends [
  ...infer Head,
  Overrides & {from?: PromiseOrValue<string>},
]
  ? Head
  : never;

export type ContractFunctionParams<F extends (...args: any) => any> = Head<Parameters<F>>;

export type Deployment = {
  address: string;
  contractName?: string;
  constructorArguments?: readonly any[];
  contract?: string;
};
