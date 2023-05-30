type Head<T extends any[]> = Required<T> extends [...infer Head, any] ? Head : never;

export type ParametersExceptLast<F extends (...args: any) => any> = Head<Parameters<F>>;
