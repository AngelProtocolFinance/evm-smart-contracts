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
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace IRouter {
  export type VaultActionDataStruct = {
    destinationChain: PromiseOrValue<string>;
    strategyId: PromiseOrValue<BytesLike>;
    selector: PromiseOrValue<BytesLike>;
    accountIds: PromiseOrValue<BigNumberish>[];
    token: PromiseOrValue<string>;
    lockAmt: PromiseOrValue<BigNumberish>;
    liqAmt: PromiseOrValue<BigNumberish>;
  };

  export type VaultActionDataStructOutput = [
    string,
    string,
    string,
    number[],
    string,
    BigNumber,
    BigNumber
  ] & {
    destinationChain: string;
    strategyId: string;
    selector: string;
    accountIds: number[];
    token: string;
    lockAmt: BigNumber;
    liqAmt: BigNumber;
  };
}

export interface IRouterInterface extends utils.Interface {
  functions: {
    "execute(bytes32,string,string,bytes)": FunctionFragment;
    "executeLocal(string,string,bytes)": FunctionFragment;
    "executeWithToken(bytes32,string,string,bytes,string,uint256)": FunctionFragment;
    "executeWithTokenLocal(string,string,bytes,string,uint256)": FunctionFragment;
    "gateway()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "execute"
      | "executeLocal"
      | "executeWithToken"
      | "executeWithTokenLocal"
      | "gateway"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "execute",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeLocal",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeWithToken",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeWithTokenLocal",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "gateway", values?: undefined): string;

  decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeLocal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeWithToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeWithTokenLocal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gateway", data: BytesLike): Result;

  events: {
    "Deposit(tuple)": EventFragment;
    "FallbackRefund(tuple,uint256)": EventFragment;
    "Harvest(tuple)": EventFragment;
    "LogError(tuple,string)": EventFragment;
    "LogErrorBytes(tuple,bytes)": EventFragment;
    "Redemption(tuple,uint256)": EventFragment;
    "TokensSent(tuple,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FallbackRefund"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Harvest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogError"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogErrorBytes"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redemption"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensSent"): EventFragment;
}

export interface DepositEventObject {
  action: IRouter.VaultActionDataStructOutput;
}
export type DepositEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface FallbackRefundEventObject {
  action: IRouter.VaultActionDataStructOutput;
  amount: BigNumber;
}
export type FallbackRefundEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput, BigNumber],
  FallbackRefundEventObject
>;

export type FallbackRefundEventFilter = TypedEventFilter<FallbackRefundEvent>;

export interface HarvestEventObject {
  action: IRouter.VaultActionDataStructOutput;
}
export type HarvestEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput],
  HarvestEventObject
>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface LogErrorEventObject {
  action: IRouter.VaultActionDataStructOutput;
  message: string;
}
export type LogErrorEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput, string],
  LogErrorEventObject
>;

export type LogErrorEventFilter = TypedEventFilter<LogErrorEvent>;

export interface LogErrorBytesEventObject {
  action: IRouter.VaultActionDataStructOutput;
  data: string;
}
export type LogErrorBytesEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput, string],
  LogErrorBytesEventObject
>;

export type LogErrorBytesEventFilter = TypedEventFilter<LogErrorBytesEvent>;

export interface RedemptionEventObject {
  action: IRouter.VaultActionDataStructOutput;
  amount: BigNumber;
}
export type RedemptionEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput, BigNumber],
  RedemptionEventObject
>;

export type RedemptionEventFilter = TypedEventFilter<RedemptionEvent>;

export interface TokensSentEventObject {
  action: IRouter.VaultActionDataStructOutput;
  amount: BigNumber;
}
export type TokensSentEvent = TypedEvent<
  [IRouter.VaultActionDataStructOutput, BigNumber],
  TokensSentEventObject
>;

export type TokensSentEventFilter = TypedEventFilter<TokensSentEvent>;

export interface IRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRouterInterface;

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
    execute(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeWithToken(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeWithTokenLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    gateway(overrides?: CallOverrides): Promise<[string]>;
  };

  execute(
    commandId: PromiseOrValue<BytesLike>,
    sourceChain: PromiseOrValue<string>,
    sourceAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeLocal(
    sourceChain: PromiseOrValue<string>,
    sourceAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeWithToken(
    commandId: PromiseOrValue<BytesLike>,
    sourceChain: PromiseOrValue<string>,
    sourceAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    tokenSymbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeWithTokenLocal(
    sourceChain: PromiseOrValue<string>,
    sourceAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    tokenSymbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  gateway(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    execute(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<IRouter.VaultActionDataStructOutput>;

    executeWithToken(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeWithTokenLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IRouter.VaultActionDataStructOutput>;

    gateway(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Deposit(tuple)"(action?: null): DepositEventFilter;
    Deposit(action?: null): DepositEventFilter;

    "FallbackRefund(tuple,uint256)"(
      action?: null,
      amount?: null
    ): FallbackRefundEventFilter;
    FallbackRefund(action?: null, amount?: null): FallbackRefundEventFilter;

    "Harvest(tuple)"(action?: null): HarvestEventFilter;
    Harvest(action?: null): HarvestEventFilter;

    "LogError(tuple,string)"(
      action?: null,
      message?: null
    ): LogErrorEventFilter;
    LogError(action?: null, message?: null): LogErrorEventFilter;

    "LogErrorBytes(tuple,bytes)"(
      action?: null,
      data?: null
    ): LogErrorBytesEventFilter;
    LogErrorBytes(action?: null, data?: null): LogErrorBytesEventFilter;

    "Redemption(tuple,uint256)"(
      action?: null,
      amount?: null
    ): RedemptionEventFilter;
    Redemption(action?: null, amount?: null): RedemptionEventFilter;

    "TokensSent(tuple,uint256)"(
      action?: null,
      amount?: null
    ): TokensSentEventFilter;
    TokensSent(action?: null, amount?: null): TokensSentEventFilter;
  };

  estimateGas: {
    execute(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeWithToken(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeWithTokenLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    gateway(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    execute(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeWithToken(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeWithTokenLocal(
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    gateway(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
