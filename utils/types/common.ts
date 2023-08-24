export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Deployment = {
  address: string;
  contractName: string;
  constructorArguments?: readonly any[];
  contract?: string;
};
