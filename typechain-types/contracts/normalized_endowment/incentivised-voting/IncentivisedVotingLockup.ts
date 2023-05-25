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

export interface IncentivisedVotingLockupInterface extends utils.Interface {
  functions: {
    "END()": FunctionFragment;
    "MAXTIME()": FunctionFragment;
    "admin()": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balanceOfAt(address,uint256)": FunctionFragment;
    "checkpoint()": FunctionFragment;
    "createLock(uint256,uint256)": FunctionFragment;
    "decimals()": FunctionFragment;
    "eject(address)": FunctionFragment;
    "exit()": FunctionFragment;
    "expireContract()": FunctionFragment;
    "expired()": FunctionFragment;
    "getLastUserPoint(address)": FunctionFragment;
    "getVestedAmount(address)": FunctionFragment;
    "globalEpoch()": FunctionFragment;
    "increaseLockAmount(uint256)": FunctionFragment;
    "increaseLockLength(uint256)": FunctionFragment;
    "initialize(address,string,string)": FunctionFragment;
    "lastUpdateTime()": FunctionFragment;
    "locked(address)": FunctionFragment;
    "name()": FunctionFragment;
    "periodFinish()": FunctionFragment;
    "pointHistory(uint256)": FunctionFragment;
    "rewardPerTokenStored()": FunctionFragment;
    "rewardRate()": FunctionFragment;
    "rewards(address)": FunctionFragment;
    "rewardsPaid(address)": FunctionFragment;
    "slopeChanges(uint256)": FunctionFragment;
    "stakingToken()": FunctionFragment;
    "staticBalanceOf(address)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalStaticWeight()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "totalSupplyAt(uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "userPointEpoch(address)": FunctionFragment;
    "userPointHistory(address,uint256)": FunctionFragment;
    "userRewardPerTokenPaid(address)": FunctionFragment;
    "withdraw()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "END"
      | "MAXTIME"
      | "admin"
      | "balanceOf"
      | "balanceOfAt"
      | "checkpoint"
      | "createLock"
      | "decimals"
      | "eject"
      | "exit"
      | "expireContract"
      | "expired"
      | "getLastUserPoint"
      | "getVestedAmount"
      | "globalEpoch"
      | "increaseLockAmount"
      | "increaseLockLength"
      | "initialize"
      | "lastUpdateTime"
      | "locked"
      | "name"
      | "periodFinish"
      | "pointHistory"
      | "rewardPerTokenStored"
      | "rewardRate"
      | "rewards"
      | "rewardsPaid"
      | "slopeChanges"
      | "stakingToken"
      | "staticBalanceOf"
      | "symbol"
      | "totalStaticWeight"
      | "totalSupply"
      | "totalSupplyAt"
      | "transferOwnership"
      | "userPointEpoch"
      | "userPointHistory"
      | "userRewardPerTokenPaid"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "END", values?: undefined): string;
  encodeFunctionData(functionFragment: "MAXTIME", values?: undefined): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfAt",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "checkpoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createLock",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "eject",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "exit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "expireContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "expired", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLastUserPoint",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestedAmount",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "globalEpoch",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseLockAmount",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseLockLength",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "lastUpdateTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "locked",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "periodFinish",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pointHistory",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerTokenStored",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewards",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsPaid",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "slopeChanges",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "stakingToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "staticBalanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalStaticWeight",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupplyAt",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "userPointEpoch",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "userPointHistory",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "userRewardPerTokenPaid",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(functionFragment: "END", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "MAXTIME", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "checkpoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createLock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eject", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "expireContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "expired", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLastUserPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "globalEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseLockAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseLockLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastUpdateTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "locked", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "periodFinish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pointHistory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerTokenStored",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsPaid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "slopeChanges",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "staticBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalStaticWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupplyAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userPointEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userPointHistory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userRewardPerTokenPaid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Deposit(address,uint256,uint256,uint8,uint256)": EventFragment;
    "Ejected(address,address,uint256)": EventFragment;
    "Expired()": EventFragment;
    "RewardAdded(uint256)": EventFragment;
    "RewardPaid(address,uint256)": EventFragment;
    "Withdraw(address,uint256,uint256)": EventFragment;
    "WithdrawVested(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Ejected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Expired"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawVested"): EventFragment;
}

export interface DepositEventObject {
  provider: string;
  value: BigNumber;
  locktime: BigNumber;
  action: number;
  ts: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, BigNumber, BigNumber, number, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EjectedEventObject {
  ejected: string;
  ejector: string;
  ts: BigNumber;
}
export type EjectedEvent = TypedEvent<
  [string, string, BigNumber],
  EjectedEventObject
>;

export type EjectedEventFilter = TypedEventFilter<EjectedEvent>;

export interface ExpiredEventObject {}
export type ExpiredEvent = TypedEvent<[], ExpiredEventObject>;

export type ExpiredEventFilter = TypedEventFilter<ExpiredEvent>;

export interface RewardAddedEventObject {
  reward: BigNumber;
}
export type RewardAddedEvent = TypedEvent<[BigNumber], RewardAddedEventObject>;

export type RewardAddedEventFilter = TypedEventFilter<RewardAddedEvent>;

export interface RewardPaidEventObject {
  user: string;
  reward: BigNumber;
}
export type RewardPaidEvent = TypedEvent<
  [string, BigNumber],
  RewardPaidEventObject
>;

export type RewardPaidEventFilter = TypedEventFilter<RewardPaidEvent>;

export interface WithdrawEventObject {
  provider: string;
  value: BigNumber;
  ts: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface WithdrawVestedEventObject {
  provider: string;
  value: BigNumber;
  ts: BigNumber;
}
export type WithdrawVestedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  WithdrawVestedEventObject
>;

export type WithdrawVestedEventFilter = TypedEventFilter<WithdrawVestedEvent>;

export interface IncentivisedVotingLockup extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IncentivisedVotingLockupInterface;

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
    END(overrides?: CallOverrides): Promise<[BigNumber]>;

    MAXTIME(overrides?: CallOverrides): Promise<[BigNumber]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    checkpoint(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    decimals(overrides?: CallOverrides): Promise<[BigNumber]>;

    eject(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    exit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    expireContract(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    expired(overrides?: CallOverrides): Promise<[boolean]>;

    getLastUserPoint(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
      }
    >;

    getVestedAmount(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    globalEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      stakingtoken: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lastUpdateTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    locked(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amount: BigNumber;
        end: BigNumber;
        start: BigNumber;
      }
    >;

    name(overrides?: CallOverrides): Promise<[string]>;

    periodFinish(overrides?: CallOverrides): Promise<[BigNumber]>;

    pointHistory(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    rewardsPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    slopeChanges(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    staticBalanceOf(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalStaticWeight(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    transferOwnership(
      newowner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    userPointEpoch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    userPointHistory(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    userRewardPerTokenPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  END(overrides?: CallOverrides): Promise<BigNumber>;

  MAXTIME(overrides?: CallOverrides): Promise<BigNumber>;

  admin(overrides?: CallOverrides): Promise<string>;

  balanceOf(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfAt(
    owner: PromiseOrValue<string>,
    blocknumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  checkpoint(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createLock(
    value: PromiseOrValue<BigNumberish>,
    unlocktime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  eject(
    addr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  exit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  expireContract(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  expired(overrides?: CallOverrides): Promise<boolean>;

  getLastUserPoint(
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      bias: BigNumber;
      slope: BigNumber;
      ts: BigNumber;
    }
  >;

  getVestedAmount(
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  globalEpoch(overrides?: CallOverrides): Promise<BigNumber>;

  increaseLockAmount(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  increaseLockLength(
    unlocktime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    stakingtoken: PromiseOrValue<string>,
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

  locked(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      amount: BigNumber;
      end: BigNumber;
      start: BigNumber;
    }
  >;

  name(overrides?: CallOverrides): Promise<string>;

  periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

  pointHistory(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      bias: BigNumber;
      slope: BigNumber;
      ts: BigNumber;
      blk: BigNumber;
    }
  >;

  rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

  rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

  rewards(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  rewardsPaid(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  slopeChanges(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  staticBalanceOf(
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalStaticWeight(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupplyAt(
    blocknumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  transferOwnership(
    newowner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  userPointEpoch(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  userPointHistory(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      bias: BigNumber;
      slope: BigNumber;
      ts: BigNumber;
      blk: BigNumber;
    }
  >;

  userRewardPerTokenPaid(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdraw(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    END(overrides?: CallOverrides): Promise<BigNumber>;

    MAXTIME(overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<string>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    checkpoint(overrides?: CallOverrides): Promise<void>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    eject(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    exit(overrides?: CallOverrides): Promise<void>;

    expireContract(overrides?: CallOverrides): Promise<void>;

    expired(overrides?: CallOverrides): Promise<boolean>;

    getLastUserPoint(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
      }
    >;

    getVestedAmount(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      stakingtoken: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    locked(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amount: BigNumber;
        end: BigNumber;
        start: BigNumber;
      }
    >;

    name(overrides?: CallOverrides): Promise<string>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    pointHistory(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slopeChanges(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    staticBalanceOf(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalStaticWeight(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newowner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    userPointEpoch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userPointHistory(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    userRewardPerTokenPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "Deposit(address,uint256,uint256,uint8,uint256)"(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      locktime?: null,
      action?: PromiseOrValue<BigNumberish> | null,
      ts?: null
    ): DepositEventFilter;
    Deposit(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      locktime?: null,
      action?: PromiseOrValue<BigNumberish> | null,
      ts?: null
    ): DepositEventFilter;

    "Ejected(address,address,uint256)"(
      ejected?: PromiseOrValue<string> | null,
      ejector?: null,
      ts?: null
    ): EjectedEventFilter;
    Ejected(
      ejected?: PromiseOrValue<string> | null,
      ejector?: null,
      ts?: null
    ): EjectedEventFilter;

    "Expired()"(): ExpiredEventFilter;
    Expired(): ExpiredEventFilter;

    "RewardAdded(uint256)"(reward?: null): RewardAddedEventFilter;
    RewardAdded(reward?: null): RewardAddedEventFilter;

    "RewardPaid(address,uint256)"(
      user?: PromiseOrValue<string> | null,
      reward?: null
    ): RewardPaidEventFilter;
    RewardPaid(
      user?: PromiseOrValue<string> | null,
      reward?: null
    ): RewardPaidEventFilter;

    "Withdraw(address,uint256,uint256)"(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      ts?: null
    ): WithdrawEventFilter;
    Withdraw(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      ts?: null
    ): WithdrawEventFilter;

    "WithdrawVested(address,uint256,uint256)"(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      ts?: null
    ): WithdrawVestedEventFilter;
    WithdrawVested(
      provider?: PromiseOrValue<string> | null,
      value?: null,
      ts?: null
    ): WithdrawVestedEventFilter;
  };

  estimateGas: {
    END(overrides?: CallOverrides): Promise<BigNumber>;

    MAXTIME(overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    checkpoint(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    eject(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    exit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    expireContract(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    expired(overrides?: CallOverrides): Promise<BigNumber>;

    getLastUserPoint(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestedAmount(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      stakingtoken: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    locked(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    pointHistory(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slopeChanges(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    staticBalanceOf(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalStaticWeight(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newowner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    userPointEpoch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userPointHistory(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userRewardPerTokenPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    END(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAXTIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    checkpoint(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    eject(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    exit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    expireContract(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    expired(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLastUserPoint(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestedAmount(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    globalEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      stakingtoken: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lastUpdateTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locked(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    periodFinish(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pointHistory(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardPerTokenStored(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    slopeChanges(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    staticBalanceOf(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalStaticWeight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newowner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    userPointEpoch(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userPointHistory(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userRewardPerTokenPaid(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
