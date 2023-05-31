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
import type {FunctionFragment, Result, EventFragment} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export declare namespace GiftCardsStorage {
  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    keeper: PromiseOrValue<string>;
    nextDeposit: PromiseOrValue<BigNumberish>;
  };

  export type ConfigStructOutput = [string, string, string, BigNumber] & {
    owner: string;
    registrarContract: string;
    keeper: string;
    nextDeposit: BigNumber;
  };

  export type DepositStruct = {
    sender: PromiseOrValue<string>;
    tokenAddress: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
    claimed: PromiseOrValue<boolean>;
  };

  export type DepositStructOutput = [string, string, BigNumber, boolean] & {
    sender: string;
    tokenAddress: string;
    amount: BigNumber;
    claimed: boolean;
  };
}

export declare namespace GiftCardsMessage {
  export type InstantiateMsgStruct = {
    keeper: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
  };

  export type InstantiateMsgStructOutput = [string, string] & {
    keeper: string;
    registrarContract: string;
  };
}

export interface GiftCardsInterface extends utils.Interface {
  functions: {
    "executeClaim(uint256,address)": FunctionFragment;
    "executeDepositERC20(address,address,uint256)": FunctionFragment;
    "executeSpend(uint32,address,uint256,uint256,uint256)": FunctionFragment;
    "initialize((address,address))": FunctionFragment;
    "owner()": FunctionFragment;
    "queryBalance(address,address)": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "queryDeposit(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateConfig(address,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "executeClaim"
      | "executeDepositERC20"
      | "executeSpend"
      | "initialize"
      | "owner"
      | "queryBalance"
      | "queryConfig"
      | "queryDeposit"
      | "renounceOwnership"
      | "transferOwnership"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeClaim",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeDepositERC20",
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeSpend",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [GiftCardsMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "queryBalance",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "queryConfig", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "queryDeposit",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "executeClaim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "executeDepositERC20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "executeSpend", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "updateConfig", data: BytesLike): Result;

  events: {
    "GiftCardsUpdateBalances(address,address,uint256,uint8)": EventFragment;
    "GiftCardsUpdateConfig(tuple)": EventFragment;
    "GiftCardsUpdateDeposit(uint256,tuple)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GiftCardsUpdateBalances"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GiftCardsUpdateConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GiftCardsUpdateDeposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface GiftCardsUpdateBalancesEventObject {
  addr: string;
  token: string;
  amt: BigNumber;
  action: number;
}
export type GiftCardsUpdateBalancesEvent = TypedEvent<
  [string, string, BigNumber, number],
  GiftCardsUpdateBalancesEventObject
>;

export type GiftCardsUpdateBalancesEventFilter = TypedEventFilter<GiftCardsUpdateBalancesEvent>;

export interface GiftCardsUpdateConfigEventObject {
  config: GiftCardsStorage.ConfigStructOutput;
}
export type GiftCardsUpdateConfigEvent = TypedEvent<
  [GiftCardsStorage.ConfigStructOutput],
  GiftCardsUpdateConfigEventObject
>;

export type GiftCardsUpdateConfigEventFilter = TypedEventFilter<GiftCardsUpdateConfigEvent>;

export interface GiftCardsUpdateDepositEventObject {
  depositId: BigNumber;
  deposit: GiftCardsStorage.DepositStructOutput;
}
export type GiftCardsUpdateDepositEvent = TypedEvent<
  [BigNumber, GiftCardsStorage.DepositStructOutput],
  GiftCardsUpdateDepositEventObject
>;

export type GiftCardsUpdateDepositEventFilter = TypedEventFilter<GiftCardsUpdateDepositEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface GiftCards extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GiftCardsInterface;

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
    executeClaim(
      depositId: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    executeDepositERC20(
      toAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    executeSpend(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockedPercentage: PromiseOrValue<BigNumberish>,
      liquidPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    initialize(
      details: GiftCardsMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    queryBalance(
      userAddr: PromiseOrValue<string>,
      tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    queryConfig(overrides?: CallOverrides): Promise<[GiftCardsStorage.ConfigStructOutput]>;

    queryDeposit(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[GiftCardsStorage.DepositStructOutput]>;

    renounceOwnership(
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      keeper: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;
  };

  executeClaim(
    depositId: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  executeDepositERC20(
    toAddress: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  executeSpend(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    lockedPercentage: PromiseOrValue<BigNumberish>,
    liquidPercentage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  initialize(
    details: GiftCardsMessage.InstantiateMsgStruct,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  queryBalance(
    userAddr: PromiseOrValue<string>,
    tokenAddr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  queryConfig(overrides?: CallOverrides): Promise<GiftCardsStorage.ConfigStructOutput>;

  queryDeposit(
    depositId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<GiftCardsStorage.DepositStructOutput>;

  renounceOwnership(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  updateConfig(
    owner: PromiseOrValue<string>,
    keeper: PromiseOrValue<string>,
    registrarContract: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callStatic: {
    executeClaim(
      depositId: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeDepositERC20(
      toAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeSpend(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockedPercentage: PromiseOrValue<BigNumberish>,
      liquidPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      details: GiftCardsMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    queryBalance(
      userAddr: PromiseOrValue<string>,
      tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<GiftCardsStorage.ConfigStructOutput>;

    queryDeposit(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<GiftCardsStorage.DepositStructOutput>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    updateConfig(
      owner: PromiseOrValue<string>,
      keeper: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "GiftCardsUpdateBalances(address,address,uint256,uint8)"(
      addr?: null,
      token?: null,
      amt?: null,
      action?: null
    ): GiftCardsUpdateBalancesEventFilter;
    GiftCardsUpdateBalances(
      addr?: null,
      token?: null,
      amt?: null,
      action?: null
    ): GiftCardsUpdateBalancesEventFilter;

    "GiftCardsUpdateConfig(tuple)"(config?: null): GiftCardsUpdateConfigEventFilter;
    GiftCardsUpdateConfig(config?: null): GiftCardsUpdateConfigEventFilter;

    "GiftCardsUpdateDeposit(uint256,tuple)"(
      depositId?: null,
      deposit?: null
    ): GiftCardsUpdateDepositEventFilter;
    GiftCardsUpdateDeposit(depositId?: null, deposit?: null): GiftCardsUpdateDepositEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    executeClaim(
      depositId: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    executeDepositERC20(
      toAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    executeSpend(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockedPercentage: PromiseOrValue<BigNumberish>,
      liquidPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    initialize(
      details: GiftCardsMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    queryBalance(
      userAddr: PromiseOrValue<string>,
      tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryDeposit(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    updateConfig(
      owner: PromiseOrValue<string>,
      keeper: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeClaim(
      depositId: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    executeDepositERC20(
      toAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    executeSpend(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockedPercentage: PromiseOrValue<BigNumberish>,
      liquidPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    initialize(
      details: GiftCardsMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryBalance(
      userAddr: PromiseOrValue<string>,
      tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryDeposit(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      keeper: PromiseOrValue<string>,
      registrarContract: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
