type Wrap<T> = {[K in keyof T]-?: [T[K]]};
type Unwrap<T> = {[K in keyof T]: Extract<T[K], [any]>[0]};

export type ParametersExceptLast<F extends (...args: any) => any> = Wrap<Parameters<F>> extends [
  ...infer InitPs,
  any
]
  ? Unwrap<InitPs>
  : never;
