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
import type {FunctionFragment, Result} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface IIncentivisedVotingLockupInterface extends utils.Interface {
  functions: {
    "balanceOf(address)": FunctionFragment;
    "balanceOfAt(address,uint256)": FunctionFragment;
    "createLock(uint256,uint256)": FunctionFragment;
    "eject(address)": FunctionFragment;
    "exit()": FunctionFragment;
    "expireContract()": FunctionFragment;
    "getLastUserPoint(address)": FunctionFragment;
    "increaseLockAmount(uint256)": FunctionFragment;
    "increaseLockLength(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "totalSupplyAt(uint256)": FunctionFragment;
    "withdraw()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balanceOf"
      | "balanceOfAt"
      | "createLock"
      | "eject"
      | "exit"
      | "expireContract"
      | "getLastUserPoint"
      | "increaseLockAmount"
      | "increaseLockLength"
      | "totalSupply"
      | "totalSupplyAt"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: "balanceOfAt",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createLock",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "eject", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "exit", values?: undefined): string;
  encodeFunctionData(functionFragment: "expireContract", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLastUserPoint",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseLockAmount",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseLockLength",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupplyAt",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOfAt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createLock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eject", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "expireContract", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getLastUserPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "increaseLockAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "increaseLockLength", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalSupplyAt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {};
}

export interface IIncentivisedVotingLockup extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IIncentivisedVotingLockupInterface;

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
    balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    eject(
      user: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    exit(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<ContractTransaction>;

    expireContract(
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

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

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdraw(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<ContractTransaction>;
  };

  balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfAt(
    owner: PromiseOrValue<string>,
    blocknumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  createLock(
    value: PromiseOrValue<BigNumberish>,
    unlocktime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  eject(
    user: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  exit(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<ContractTransaction>;

  expireContract(
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

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

  increaseLockAmount(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  increaseLockLength(
    unlocktime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupplyAt(
    blocknumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdraw(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    eject(user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    exit(overrides?: CallOverrides): Promise<void>;

    expireContract(overrides?: CallOverrides): Promise<void>;

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

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    eject(
      user: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    exit(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<BigNumber>;

    expireContract(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<BigNumber>;

    getLastUserPoint(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfAt(
      owner: PromiseOrValue<string>,
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createLock(
      value: PromiseOrValue<BigNumberish>,
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    eject(
      user: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    exit(overrides?: Overrides & {from?: PromiseOrValue<string>}): Promise<PopulatedTransaction>;

    expireContract(
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    getLastUserPoint(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    increaseLockAmount(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    increaseLockLength(
      unlocktime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupplyAt(
      blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
