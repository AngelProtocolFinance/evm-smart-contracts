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
} from "../common";

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

export declare namespace IRegistrar {
  export type VaultParamsStruct = {
    Type: PromiseOrValue<BigNumberish>;
    vaultAddr: PromiseOrValue<string>;
  };

  export type VaultParamsStructOutput = [number, string] & {
    Type: number;
    vaultAddr: string;
  };

  export type StrategyParamsStruct = {
    approvalState: PromiseOrValue<BigNumberish>;
    Locked: IRegistrar.VaultParamsStruct;
    Liquid: IRegistrar.VaultParamsStruct;
  };

  export type StrategyParamsStructOutput = [
    number,
    IRegistrar.VaultParamsStructOutput,
    IRegistrar.VaultParamsStructOutput
  ] & {
    approvalState: number;
    Locked: IRegistrar.VaultParamsStructOutput;
    Liquid: IRegistrar.VaultParamsStructOutput;
  };
}

export interface RouterInterface extends utils.Interface {
  functions: {
    "chain()": FunctionFragment;
    "deposit((uint8,(uint8,address),(uint8,address)),(string,bytes4,bytes4,uint32[],address,uint256,uint256),string,uint256)": FunctionFragment;
    "execute(bytes32,string,string,bytes)": FunctionFragment;
    "executeWithToken(bytes32,string,string,bytes,string,uint256)": FunctionFragment;
    "gasReceiver()": FunctionFragment;
    "gateway()": FunctionFragment;
    "initialize(string,address,address,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "registrar()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "sendTokens(string,string,bytes,string,uint256,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "chain"
      | "deposit"
      | "execute"
      | "executeWithToken"
      | "gasReceiver"
      | "gateway"
      | "initialize"
      | "owner"
      | "registrar"
      | "renounceOwnership"
      | "sendTokens"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "chain", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      IRegistrar.StrategyParamsStruct,
      IRouter.VaultActionDataStruct,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
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
    functionFragment: "gasReceiver",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "gateway", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "registrar", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sendTokens",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "chain", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeWithToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "gasReceiver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gateway", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registrar", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Deposit(tuple)": EventFragment;
    "FallbackRefund(tuple,uint256)": EventFragment;
    "Harvest(tuple)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "LogError(tuple,string)": EventFragment;
    "LogErrorBytes(tuple,bytes)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Redemption(tuple,uint256)": EventFragment;
    "TokensSent(tuple,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FallbackRefund"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Harvest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogError"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogErrorBytes"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
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

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

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

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

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

export interface Router extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RouterInterface;

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
    chain(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      params: IRegistrar.StrategyParamsStruct,
      action: IRouter.VaultActionDataStruct,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    execute(
      commandId: PromiseOrValue<BytesLike>,
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

    gasReceiver(overrides?: CallOverrides): Promise<[string]>;

    gateway(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _chain: PromiseOrValue<string>,
      _gateway: PromiseOrValue<string>,
      _gasReceiver: PromiseOrValue<string>,
      _registrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    registrar(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sendTokens(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      gasToken: PromiseOrValue<string>,
      gasFeeAmt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  chain(overrides?: CallOverrides): Promise<string>;

  deposit(
    params: IRegistrar.StrategyParamsStruct,
    action: IRouter.VaultActionDataStruct,
    tokenSymbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  execute(
    commandId: PromiseOrValue<BytesLike>,
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

  gasReceiver(overrides?: CallOverrides): Promise<string>;

  gateway(overrides?: CallOverrides): Promise<string>;

  initialize(
    _chain: PromiseOrValue<string>,
    _gateway: PromiseOrValue<string>,
    _gasReceiver: PromiseOrValue<string>,
    _registrar: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  registrar(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sendTokens(
    destinationChain: PromiseOrValue<string>,
    destinationAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    symbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    gasToken: PromiseOrValue<string>,
    gasFeeAmt: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    chain(overrides?: CallOverrides): Promise<string>;

    deposit(
      params: IRegistrar.StrategyParamsStruct,
      action: IRouter.VaultActionDataStruct,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    execute(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeWithToken(
      commandId: PromiseOrValue<BytesLike>,
      sourceChain: PromiseOrValue<string>,
      sourceAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    gasReceiver(overrides?: CallOverrides): Promise<string>;

    gateway(overrides?: CallOverrides): Promise<string>;

    initialize(
      _chain: PromiseOrValue<string>,
      _gateway: PromiseOrValue<string>,
      _gasReceiver: PromiseOrValue<string>,
      _registrar: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    registrar(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sendTokens(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      gasToken: PromiseOrValue<string>,
      gasFeeAmt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
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

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

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

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

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
    chain(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      params: IRegistrar.StrategyParamsStruct,
      action: IRouter.VaultActionDataStruct,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    execute(
      commandId: PromiseOrValue<BytesLike>,
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

    gasReceiver(overrides?: CallOverrides): Promise<BigNumber>;

    gateway(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _chain: PromiseOrValue<string>,
      _gateway: PromiseOrValue<string>,
      _gasReceiver: PromiseOrValue<string>,
      _registrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    registrar(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sendTokens(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      gasToken: PromiseOrValue<string>,
      gasFeeAmt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    chain(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      params: IRegistrar.StrategyParamsStruct,
      action: IRouter.VaultActionDataStruct,
      tokenSymbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    execute(
      commandId: PromiseOrValue<BytesLike>,
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

    gasReceiver(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    gateway(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _chain: PromiseOrValue<string>,
      _gateway: PromiseOrValue<string>,
      _gasReceiver: PromiseOrValue<string>,
      _registrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registrar(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sendTokens(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      gasToken: PromiseOrValue<string>,
      gasFeeAmt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
