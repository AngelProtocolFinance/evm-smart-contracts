/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {FunctionFragment, Result} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface StringArrayInterface extends utils.Interface {
  functions: {
    "addressToString(address)": FunctionFragment;
    "stringCompare(string,string)": FunctionFragment;
    "stringIndexOf(string[],string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "addressToString" | "stringCompare" | "stringIndexOf"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "addressToString", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: "stringCompare",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "stringIndexOf",
    values: [PromiseOrValue<string>[], PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "addressToString", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stringCompare", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stringIndexOf", data: BytesLike): Result;

  events: {};
}

export interface StringArray extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StringArrayInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addressToString(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;

    stringCompare(
      s1: PromiseOrValue<string>,
      s2: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean] & {result: boolean}>;

    stringIndexOf(
      arr: PromiseOrValue<string>[],
      searchFor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;
  };

  addressToString(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

  stringCompare(
    s1: PromiseOrValue<string>,
    s2: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  stringIndexOf(
    arr: PromiseOrValue<string>[],
    searchFor: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean]>;

  callStatic: {
    addressToString(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

    stringCompare(
      s1: PromiseOrValue<string>,
      s2: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    stringIndexOf(
      arr: PromiseOrValue<string>[],
      searchFor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;
  };

  filters: {};

  estimateGas: {
    addressToString(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    stringCompare(
      s1: PromiseOrValue<string>,
      s2: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stringIndexOf(
      arr: PromiseOrValue<string>[],
      searchFor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressToString(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stringCompare(
      s1: PromiseOrValue<string>,
      s2: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stringIndexOf(
      arr: PromiseOrValue<string>[],
      searchFor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
