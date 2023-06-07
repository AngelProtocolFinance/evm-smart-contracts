/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";

export declare namespace SwapRouterMessages {
  export type InstantiateMsgStruct = {
    registrarContract: PromiseOrValue<string>;
    accountsContract: PromiseOrValue<string>;
    swapFactory: PromiseOrValue<string>;
    swapRouter: PromiseOrValue<string>;
  };

  export type InstantiateMsgStructOutput = [string, string, string, string] & {
    registrarContract: string;
    accountsContract: string;
    swapFactory: string;
    swapRouter: string;
  };
}

export interface SwapRouterInterface extends utils.Interface {
  functions: {
    "executeSwaps(address,address,uint256,uint256)": FunctionFragment;
    "initSwapRouter((address,address,address,address))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "executeSwaps" | "initSwapRouter"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeSwaps",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initSwapRouter",
    values: [SwapRouterMessages.InstantiateMsgStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "executeSwaps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initSwapRouter",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SwapRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SwapRouterInterface;

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
    executeSwaps(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  executeSwaps(
    tokenIn: PromiseOrValue<string>,
    tokenOut: PromiseOrValue<string>,
    amountIn: PromiseOrValue<BigNumberish>,
    minAmountOut: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initSwapRouter(
    details: SwapRouterMessages.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    executeSwaps(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    executeSwaps(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeSwaps(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
