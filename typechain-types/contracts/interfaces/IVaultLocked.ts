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

export interface IVaultLockedInterface extends utils.Interface {
  functions: {
    "deposit(uint32,address,uint256)": FunctionFragment;
    "getVaultType()": FunctionFragment;
    "harvest(uint32[])": FunctionFragment;
    "redeem(uint32,address,uint256)": FunctionFragment;
    "redeemAll(uint32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "deposit"
      | "getVaultType"
      | "harvest"
      | "redeem"
      | "redeemAll"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getVaultType",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "harvest",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemAll",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getVaultType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "harvest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemAll", data: BytesLike): Result;

  events: {
    "DepositMade(uint32,uint8,address,uint256,address)": EventFragment;
    "Harvest(uint32[])": EventFragment;
    "Redemption(uint32,uint8,address,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DepositMade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Harvest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redemption"): EventFragment;
}

export interface DepositMadeEventObject {
  accountId: number;
  vaultType: number;
  tokenDeposited: string;
  amtDeposited: BigNumber;
  stakingContract: string;
}
export type DepositMadeEvent = TypedEvent<
  [number, number, string, BigNumber, string],
  DepositMadeEventObject
>;

export type DepositMadeEventFilter = TypedEventFilter<DepositMadeEvent>;

export interface HarvestEventObject {
  accountIds: number[];
}
export type HarvestEvent = TypedEvent<[number[]], HarvestEventObject>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface RedemptionEventObject {
  accountId: number;
  vaultType: number;
  tokenRedeemed: string;
  amtRedeemed: BigNumber;
  stakingContract: string;
}
export type RedemptionEvent = TypedEvent<
  [number, number, string, BigNumber, string],
  RedemptionEventObject
>;

export type RedemptionEventFilter = TypedEventFilter<RedemptionEvent>;

export interface IVaultLocked extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVaultLockedInterface;

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
    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getVaultType(overrides?: CallOverrides): Promise<[number]>;

    harvest(
      accountIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeemAll(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  deposit(
    accountId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amt: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getVaultType(overrides?: CallOverrides): Promise<number>;

  harvest(
    accountIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeem(
    accountId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amt: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeemAll(
    accountId: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getVaultType(overrides?: CallOverrides): Promise<number>;

    harvest(
      accountIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemAll(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "DepositMade(uint32,uint8,address,uint256,address)"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenDeposited?: null,
      amtDeposited?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): DepositMadeEventFilter;
    DepositMade(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenDeposited?: null,
      amtDeposited?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): DepositMadeEventFilter;

    "Harvest(uint32[])"(
      accountIds?: PromiseOrValue<BigNumberish>[] | null
    ): HarvestEventFilter;
    Harvest(
      accountIds?: PromiseOrValue<BigNumberish>[] | null
    ): HarvestEventFilter;

    "Redemption(uint32,uint8,address,uint256,address)"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenRedeemed?: null,
      amtRedeemed?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): RedemptionEventFilter;
    Redemption(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenRedeemed?: null,
      amtRedeemed?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): RedemptionEventFilter;
  };

  estimateGas: {
    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getVaultType(overrides?: CallOverrides): Promise<BigNumber>;

    harvest(
      accountIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeemAll(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getVaultType(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    harvest(
      accountIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeemAll(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
