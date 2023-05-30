import {Overrides} from "ethers";
import {PromiseOrValue} from "typechain-types/common";

type Head<T extends any[]> = Required<T> extends [
  ...infer Head,
  Overrides & {from?: PromiseOrValue<string>}
]
  ? Head
  : never;

export type ContractFunctionParams<F extends (...args: any) => any> = Head<Parameters<F>>;
