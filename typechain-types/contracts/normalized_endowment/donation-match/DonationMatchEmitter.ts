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

export declare namespace DonationMatchStorage {
  export type ConfigStruct = {
    reserveToken: PromiseOrValue<string>;
    uniswapFactory: PromiseOrValue<string>;
    usdcAddress: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    poolFee: PromiseOrValue<BigNumberish>;
  };

  export type ConfigStructOutput = [string, string, string, string, number] & {
    reserveToken: string;
    uniswapFactory: string;
    usdcAddress: string;
    registrarContract: string;
    poolFee: number;
  };
}

export interface DonationMatchEmitterInterface extends utils.Interface {
  functions: {
    "burnErC20(uint256,address,uint256)": FunctionFragment;
    "executeDonorMatch(address,uint256,address,uint256,address)": FunctionFragment;
    "giveApprovalErC20(uint256,address,address,uint256)": FunctionFragment;
    "initDonationMatchEmiiter(address)": FunctionFragment;
    "initializeDonationMatch(uint256,address,(address,address,address,address,uint24))": FunctionFragment;
    "isDonationMatch(address)": FunctionFragment;
    "transferErC20(uint256,address,address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "burnErC20"
      | "executeDonorMatch"
      | "giveApprovalErC20"
      | "initDonationMatchEmiiter"
      | "initializeDonationMatch"
      | "isDonationMatch"
      | "transferErC20"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "burnErC20",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeDonorMatch",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "giveApprovalErC20",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initDonationMatchEmiiter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeDonationMatch",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      DonationMatchStorage.ConfigStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isDonationMatch",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferErC20",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "burnErC20", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeDonorMatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "giveApprovalErC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initDonationMatchEmiiter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeDonationMatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isDonationMatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferErC20",
    data: BytesLike
  ): Result;

  events: {
    "DonationMatchExecuted(address,address,uint256,address,uint256,address)": EventFragment;
    "DonationMatchInitialized(uint256,address,tuple)": EventFragment;
    "Erc20ApprovalGiven(uint256,address,address,uint256)": EventFragment;
    "Erc20Burned(uint256,address,uint256)": EventFragment;
    "Erc20Transfer(uint256,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DonationMatchExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationMatchInitialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Erc20ApprovalGiven"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Erc20Burned"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Erc20Transfer"): EventFragment;
}

export interface DonationMatchExecutedEventObject {
  donationMatch: string;
  tokenAddress: string;
  amount: BigNumber;
  accountsContract: string;
  endowmentId: BigNumber;
  donor: string;
}
export type DonationMatchExecutedEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber, string],
  DonationMatchExecutedEventObject
>;

export type DonationMatchExecutedEventFilter =
  TypedEventFilter<DonationMatchExecutedEvent>;

export interface DonationMatchInitializedEventObject {
  endowmentId: BigNumber;
  donationMatch: string;
  config: DonationMatchStorage.ConfigStructOutput;
}
export type DonationMatchInitializedEvent = TypedEvent<
  [BigNumber, string, DonationMatchStorage.ConfigStructOutput],
  DonationMatchInitializedEventObject
>;

export type DonationMatchInitializedEventFilter =
  TypedEventFilter<DonationMatchInitializedEvent>;

export interface Erc20ApprovalGivenEventObject {
  endowmentId: BigNumber;
  tokenAddress: string;
  spender: string;
  amount: BigNumber;
}
export type Erc20ApprovalGivenEvent = TypedEvent<
  [BigNumber, string, string, BigNumber],
  Erc20ApprovalGivenEventObject
>;

export type Erc20ApprovalGivenEventFilter =
  TypedEventFilter<Erc20ApprovalGivenEvent>;

export interface Erc20BurnedEventObject {
  endowmentId: BigNumber;
  tokenAddress: string;
  amount: BigNumber;
}
export type Erc20BurnedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  Erc20BurnedEventObject
>;

export type Erc20BurnedEventFilter = TypedEventFilter<Erc20BurnedEvent>;

export interface Erc20TransferEventObject {
  endowmentId: BigNumber;
  tokenAddress: string;
  recipient: string;
  amount: BigNumber;
}
export type Erc20TransferEvent = TypedEvent<
  [BigNumber, string, string, BigNumber],
  Erc20TransferEventObject
>;

export type Erc20TransferEventFilter = TypedEventFilter<Erc20TransferEvent>;

export interface DonationMatchEmitter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DonationMatchEmitterInterface;

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
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      curAccountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initDonationMatchEmiiter(
      curAccountscontract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isDonationMatch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  burnErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeDonorMatch(
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    curAccountsContract: PromiseOrValue<string>,
    endowmentId: PromiseOrValue<BigNumberish>,
    donor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  giveApprovalErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initDonationMatchEmiiter(
    curAccountscontract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initializeDonationMatch(
    endowmentId: PromiseOrValue<BigNumberish>,
    donationMatch: PromiseOrValue<string>,
    config: DonationMatchStorage.ConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isDonationMatch(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      curAccountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    initDonationMatchEmiiter(
      curAccountscontract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    isDonationMatch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DonationMatchExecuted(address,address,uint256,address,uint256,address)"(
      donationMatch?: null,
      tokenAddress?: null,
      amount?: null,
      accountsContract?: null,
      endowmentId?: null,
      donor?: null
    ): DonationMatchExecutedEventFilter;
    DonationMatchExecuted(
      donationMatch?: null,
      tokenAddress?: null,
      amount?: null,
      accountsContract?: null,
      endowmentId?: null,
      donor?: null
    ): DonationMatchExecutedEventFilter;

    "DonationMatchInitialized(uint256,address,tuple)"(
      endowmentId?: null,
      donationMatch?: null,
      config?: null
    ): DonationMatchInitializedEventFilter;
    DonationMatchInitialized(
      endowmentId?: null,
      donationMatch?: null,
      config?: null
    ): DonationMatchInitializedEventFilter;

    "Erc20ApprovalGiven(uint256,address,address,uint256)"(
      endowmentId?: null,
      tokenAddress?: null,
      spender?: null,
      amount?: null
    ): Erc20ApprovalGivenEventFilter;
    Erc20ApprovalGiven(
      endowmentId?: null,
      tokenAddress?: null,
      spender?: null,
      amount?: null
    ): Erc20ApprovalGivenEventFilter;

    "Erc20Burned(uint256,address,uint256)"(
      endowmentId?: null,
      tokenAddress?: null,
      amount?: null
    ): Erc20BurnedEventFilter;
    Erc20Burned(
      endowmentId?: null,
      tokenAddress?: null,
      amount?: null
    ): Erc20BurnedEventFilter;

    "Erc20Transfer(uint256,address,address,uint256)"(
      endowmentId?: null,
      tokenAddress?: null,
      recipient?: null,
      amount?: null
    ): Erc20TransferEventFilter;
    Erc20Transfer(
      endowmentId?: null,
      tokenAddress?: null,
      recipient?: null,
      amount?: null
    ): Erc20TransferEventFilter;
  };

  estimateGas: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      curAccountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initDonationMatchEmiiter(
      curAccountscontract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isDonationMatch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      curAccountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initDonationMatchEmiiter(
      curAccountscontract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isDonationMatch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
