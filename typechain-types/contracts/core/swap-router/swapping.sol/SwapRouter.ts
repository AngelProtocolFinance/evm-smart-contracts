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
import type {FunctionFragment, Result} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

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
    "executeSwapOperations(address,address,uint256,uint256)": FunctionFragment;
    "intiSwapRouter((address,address,address,address))": FunctionFragment;
    "swapEthToAnyToken(address)": FunctionFragment;
    "swapEthToToken()": FunctionFragment;
    "swapTokenToUsdc(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "executeSwapOperations"
      | "intiSwapRouter"
      | "swapEthToAnyToken"
      | "swapEthToToken"
      | "swapTokenToUsdc"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeSwapOperations",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "intiSwapRouter",
    values: [SwapRouterMessages.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "swapEthToAnyToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "swapEthToToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapTokenToUsdc",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "executeSwapOperations", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "intiSwapRouter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swapEthToAnyToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swapEthToToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swapTokenToUsdc", data: BytesLike): Result;

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
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    executeSwapOperations(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    intiSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    swapEthToToken(
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    swapTokenToUsdc(
      tokena: PromiseOrValue<string>,
      amountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;
  };

  executeSwapOperations(
    tokenIn: PromiseOrValue<string>,
    tokenOut: PromiseOrValue<string>,
    amountIn: PromiseOrValue<BigNumberish>,
    amountOut: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  intiSwapRouter(
    details: SwapRouterMessages.InstantiateMsgStruct,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  swapEthToAnyToken(
    token: PromiseOrValue<string>,
    overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  swapEthToToken(
    overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  swapTokenToUsdc(
    tokena: PromiseOrValue<string>,
    amountin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callStatic: {
    executeSwapOperations(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    intiSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    swapEthToAnyToken(token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    swapEthToToken(overrides?: CallOverrides): Promise<BigNumber>;

    swapTokenToUsdc(
      tokena: PromiseOrValue<string>,
      amountin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    executeSwapOperations(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    intiSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    swapEthToToken(
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    swapTokenToUsdc(
      tokena: PromiseOrValue<string>,
      amountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeSwapOperations(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    intiSwapRouter(
      details: SwapRouterMessages.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    swapEthToAnyToken(
      token: PromiseOrValue<string>,
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    swapEthToToken(
      overrides?: PayableOverrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    swapTokenToUsdc(
      tokena: PromiseOrValue<string>,
      amountin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
