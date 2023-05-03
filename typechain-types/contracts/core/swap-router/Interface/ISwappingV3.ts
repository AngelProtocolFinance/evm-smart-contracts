/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface ISwappingV3Interface extends utils.Interface {
  functions: {
    "executeSwapOperations(address[],address,uint256[],uint256)": FunctionFragment;
    "swapEthToAnyToken(address)": FunctionFragment;
    "swapEthToToken()": FunctionFragment;
    "swapTokenToUsdc(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "executeSwapOperations"
      | "swapEthToAnyToken"
      | "swapEthToToken"
      | "swapTokenToUsdc"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeSwapOperations",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapEthToAnyToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "swapEthToToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "swapTokenToUsdc",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "executeSwapOperations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapEthToAnyToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapEthToToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapTokenToUsdc",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ISwappingV3 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISwappingV3Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    executeSwapOperations(
      curTokenin: PromiseOrValue<string>[],
      curTokenout: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>[],
      curAmountout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapEthToToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapTokenToUsdc(
      curTokena: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  executeSwapOperations(
    curTokenin: PromiseOrValue<string>[],
    curTokenout: PromiseOrValue<string>,
    curAmountin: PromiseOrValue<BigNumberish>[],
    curAmountout: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapEthToAnyToken(
    token: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapEthToToken(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapTokenToUsdc(
    curTokena: PromiseOrValue<string>,
    curAmountin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    executeSwapOperations(
      curTokenin: PromiseOrValue<string>[],
      curTokenout: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>[],
      curAmountout: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapEthToToken(overrides?: CallOverrides): Promise<BigNumber>;

    swapTokenToUsdc(
      curTokena: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    executeSwapOperations(
      curTokenin: PromiseOrValue<string>[],
      curTokenout: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>[],
      curAmountout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapEthToToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapTokenToUsdc(
      curTokena: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeSwapOperations(
      curTokenin: PromiseOrValue<string>[],
      curTokenout: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>[],
      curAmountout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapEthToToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapTokenToUsdc(
      curTokena: PromiseOrValue<string>,
      curAmountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
