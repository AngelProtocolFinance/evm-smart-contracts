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
} from "../../../common";

export declare namespace CollectorStorage {
  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
    timelockContract: PromiseOrValue<string>;
    govContract: PromiseOrValue<string>;
    swapFactory: PromiseOrValue<string>;
    distributorContract: PromiseOrValue<string>;
    rewardFactor: PromiseOrValue<BigNumberish>;
  };

  export type ConfigStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    owner: string;
    registrarContract: string;
    haloToken: string;
    timelockContract: string;
    govContract: string;
    swapFactory: string;
    distributorContract: string;
    rewardFactor: BigNumber;
  };
}

export declare namespace CollectorMessage {
  export type InstantiateMsgStruct = {
    registrarContract: PromiseOrValue<string>;
    timelockContract: PromiseOrValue<string>;
    govContract: PromiseOrValue<string>;
    swapFactory: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
    distributorContract: PromiseOrValue<string>;
    rewardFactor: PromiseOrValue<BigNumberish>;
  };

  export type InstantiateMsgStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    registrarContract: string;
    timelockContract: string;
    govContract: string;
    swapFactory: string;
    haloToken: string;
    distributorContract: string;
    rewardFactor: BigNumber;
  };

  export type ConfigResponseStruct = {
    owner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
    govContract: PromiseOrValue<string>;
    timelockContract: PromiseOrValue<string>;
    swapFactory: PromiseOrValue<string>;
    distributorContract: PromiseOrValue<string>;
    rewardFactor: PromiseOrValue<BigNumberish>;
  };

  export type ConfigResponseStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    owner: string;
    registrarContract: string;
    haloToken: string;
    govContract: string;
    timelockContract: string;
    swapFactory: string;
    distributorContract: string;
    rewardFactor: BigNumber;
  };
}

export interface CollectorInterface extends utils.Interface {
  functions: {
    "initialize((address,address,address,address,address,address,uint256))": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "sweep(address)": FunctionFragment;
    "updateConfig(uint256,address,address,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "initialize"
      | "queryConfig"
      | "sweep"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "initialize",
    values: [CollectorMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "queryConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sweep",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateConfig",
    data: BytesLike
  ): Result;

  events: {
    "CollectedConfigUpdated(tuple)": EventFragment;
    "CollecterInitialized(tuple)": EventFragment;
    "CollectorSweeped(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectedConfigUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CollecterInitialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CollectorSweeped"): EventFragment;
}

export interface CollectedConfigUpdatedEventObject {
  config: CollectorStorage.ConfigStructOutput;
}
export type CollectedConfigUpdatedEvent = TypedEvent<
  [CollectorStorage.ConfigStructOutput],
  CollectedConfigUpdatedEventObject
>;

export type CollectedConfigUpdatedEventFilter =
  TypedEventFilter<CollectedConfigUpdatedEvent>;

export interface CollecterInitializedEventObject {
  details: CollectorMessage.InstantiateMsgStructOutput;
}
export type CollecterInitializedEvent = TypedEvent<
  [CollectorMessage.InstantiateMsgStructOutput],
  CollecterInitializedEventObject
>;

export type CollecterInitializedEventFilter =
  TypedEventFilter<CollecterInitializedEvent>;

export interface CollectorSweepedEventObject {
  tokenSwept: string;
  amountSwept: BigNumber;
  haloOut: BigNumber;
}
export type CollectorSweepedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  CollectorSweepedEventObject
>;

export type CollectorSweepedEventFilter =
  TypedEventFilter<CollectorSweepedEvent>;

export interface Collector extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CollectorInterface;

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
    initialize(
      details: CollectorMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[CollectorMessage.ConfigResponseStructOutput]>;

    sweep(
      sweepToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateConfig(
      rewardFactor: PromiseOrValue<BigNumberish>,
      timelockContract: PromiseOrValue<string>,
      govContract: PromiseOrValue<string>,
      swapFactory: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  initialize(
    details: CollectorMessage.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<CollectorMessage.ConfigResponseStructOutput>;

  sweep(
    sweepToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateConfig(
    rewardFactor: PromiseOrValue<BigNumberish>,
    timelockContract: PromiseOrValue<string>,
    govContract: PromiseOrValue<string>,
    swapFactory: PromiseOrValue<string>,
    registrarContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    initialize(
      details: CollectorMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<CollectorMessage.ConfigResponseStructOutput>;

    sweep(
      sweepToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateConfig(
      rewardFactor: PromiseOrValue<BigNumberish>,
      timelockContract: PromiseOrValue<string>,
      govContract: PromiseOrValue<string>,
      swapFactory: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "CollectedConfigUpdated(tuple)"(
      config?: null
    ): CollectedConfigUpdatedEventFilter;
    CollectedConfigUpdated(config?: null): CollectedConfigUpdatedEventFilter;

    "CollecterInitialized(tuple)"(
      details?: null
    ): CollecterInitializedEventFilter;
    CollecterInitialized(details?: null): CollecterInitializedEventFilter;

    "CollectorSweeped(address,uint256,uint256)"(
      tokenSwept?: null,
      amountSwept?: null,
      haloOut?: null
    ): CollectorSweepedEventFilter;
    CollectorSweeped(
      tokenSwept?: null,
      amountSwept?: null,
      haloOut?: null
    ): CollectorSweepedEventFilter;
  };

  estimateGas: {
    initialize(
      details: CollectorMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    sweep(
      sweepToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateConfig(
      rewardFactor: PromiseOrValue<BigNumberish>,
      timelockContract: PromiseOrValue<string>,
      govContract: PromiseOrValue<string>,
      swapFactory: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    initialize(
      details: CollectorMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sweep(
      sweepToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateConfig(
      rewardFactor: PromiseOrValue<BigNumberish>,
      timelockContract: PromiseOrValue<string>,
      govContract: PromiseOrValue<string>,
      swapFactory: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
