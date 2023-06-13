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

export declare namespace MultiSigStorage {
  export type TransactionStruct = {
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    destination: PromiseOrValue<string>;
    value: PromiseOrValue<BigNumberish>;
    data: PromiseOrValue<BytesLike>;
    executed: PromiseOrValue<boolean>;
    metadata: PromiseOrValue<BytesLike>;
  };

  export type TransactionStructOutput = [
    string,
    string,
    string,
    BigNumber,
    string,
    boolean,
    string
  ] & {
    title: string;
    description: string;
    destination: string;
    value: BigNumber;
    data: string;
    executed: boolean;
    metadata: string;
  };
}

export interface ApplicationsMultiSigInterface extends utils.Interface {
  functions: {
    "MAX_OWNER_COUNT()": FunctionFragment;
    "addOwner(address)": FunctionFragment;
    "changeRequireExecution(bool)": FunctionFragment;
    "changeRequirement(uint256)": FunctionFragment;
    "confirmTransaction(uint256)": FunctionFragment;
    "confirmations(uint256,address)": FunctionFragment;
    "executeTransaction(uint256)": FunctionFragment;
    "getConfirmationCount(uint256)": FunctionFragment;
    "getConfirmations(uint256)": FunctionFragment;
    "getOwners()": FunctionFragment;
    "getTransactionCount(bool,bool)": FunctionFragment;
    "getTransactionIds(uint256,uint256,bool,bool)": FunctionFragment;
    "initialize(address[],uint256,bool)": FunctionFragment;
    "isConfirmed(uint256)": FunctionFragment;
    "isOwner(address)": FunctionFragment;
    "owners(uint256)": FunctionFragment;
    "removeOwner(address)": FunctionFragment;
    "replaceOwner(address,address)": FunctionFragment;
    "requireExecution()": FunctionFragment;
    "required()": FunctionFragment;
    "revokeConfirmation(uint256)": FunctionFragment;
    "submitTransaction(string,string,address,uint256,bytes,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transactionCount()": FunctionFragment;
    "transactions(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_OWNER_COUNT"
      | "addOwner"
      | "changeRequireExecution"
      | "changeRequirement"
      | "confirmTransaction"
      | "confirmations"
      | "executeTransaction"
      | "getConfirmationCount"
      | "getConfirmations"
      | "getOwners"
      | "getTransactionCount"
      | "getTransactionIds"
      | "initialize"
      | "isConfirmed"
      | "isOwner"
      | "owners"
      | "removeOwner"
      | "replaceOwner"
      | "requireExecution"
      | "required"
      | "revokeConfirmation"
      | "submitTransaction"
      | "supportsInterface"
      | "transactionCount"
      | "transactions"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MAX_OWNER_COUNT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeRequireExecution",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeRequirement",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "confirmTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "confirmations",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfirmationCount",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfirmations",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "getOwners", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getTransactionCount",
    values: [PromiseOrValue<boolean>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTransactionIds",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isConfirmed",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "owners",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "replaceOwner",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "requireExecution",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "required", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "revokeConfirmation",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "submitTransaction",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "transactionCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transactions",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "MAX_OWNER_COUNT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeRequireExecution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeRequirement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "confirmTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "confirmations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getConfirmationCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getConfirmations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTransactionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTransactionIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isConfirmed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "replaceOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requireExecution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "required", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeConfirmation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submitTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transactionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transactions",
    data: BytesLike
  ): Result;

  events: {
    "Confirmation(address,uint256)": EventFragment;
    "Deposit(address,uint256)": EventFragment;
    "Execution(uint256)": EventFragment;
    "ExecutionFailure(uint256)": EventFragment;
    "ExecutionRequiredChange(bool)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnerAddition(address)": EventFragment;
    "OwnerRemoval(address)": EventFragment;
    "RequirementChange(uint256)": EventFragment;
    "Revocation(address,uint256)": EventFragment;
    "Submission(uint256,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Confirmation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Execution"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecutionFailure"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecutionRequiredChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnerAddition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnerRemoval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequirementChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Revocation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Submission"): EventFragment;
}

export interface ConfirmationEventObject {
  sender: string;
  transactionId: BigNumber;
}
export type ConfirmationEvent = TypedEvent<
  [string, BigNumber],
  ConfirmationEventObject
>;

export type ConfirmationEventFilter = TypedEventFilter<ConfirmationEvent>;

export interface DepositEventObject {
  sender: string;
  value: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface ExecutionEventObject {
  transactionId: BigNumber;
}
export type ExecutionEvent = TypedEvent<[BigNumber], ExecutionEventObject>;

export type ExecutionEventFilter = TypedEventFilter<ExecutionEvent>;

export interface ExecutionFailureEventObject {
  transactionId: BigNumber;
}
export type ExecutionFailureEvent = TypedEvent<
  [BigNumber],
  ExecutionFailureEventObject
>;

export type ExecutionFailureEventFilter =
  TypedEventFilter<ExecutionFailureEvent>;

export interface ExecutionRequiredChangeEventObject {
  requireExecution: boolean;
}
export type ExecutionRequiredChangeEvent = TypedEvent<
  [boolean],
  ExecutionRequiredChangeEventObject
>;

export type ExecutionRequiredChangeEventFilter =
  TypedEventFilter<ExecutionRequiredChangeEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnerAdditionEventObject {
  owner: string;
}
export type OwnerAdditionEvent = TypedEvent<[string], OwnerAdditionEventObject>;

export type OwnerAdditionEventFilter = TypedEventFilter<OwnerAdditionEvent>;

export interface OwnerRemovalEventObject {
  owner: string;
}
export type OwnerRemovalEvent = TypedEvent<[string], OwnerRemovalEventObject>;

export type OwnerRemovalEventFilter = TypedEventFilter<OwnerRemovalEvent>;

export interface RequirementChangeEventObject {
  required: BigNumber;
}
export type RequirementChangeEvent = TypedEvent<
  [BigNumber],
  RequirementChangeEventObject
>;

export type RequirementChangeEventFilter =
  TypedEventFilter<RequirementChangeEvent>;

export interface RevocationEventObject {
  sender: string;
  transactionId: BigNumber;
}
export type RevocationEvent = TypedEvent<
  [string, BigNumber],
  RevocationEventObject
>;

export type RevocationEventFilter = TypedEventFilter<RevocationEvent>;

export interface SubmissionEventObject {
  transactionId: BigNumber;
  transaction: MultiSigStorage.TransactionStructOutput;
}
export type SubmissionEvent = TypedEvent<
  [BigNumber, MultiSigStorage.TransactionStructOutput],
  SubmissionEventObject
>;

export type SubmissionEventFilter = TypedEventFilter<SubmissionEvent>;

export interface ApplicationsMultiSig extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ApplicationsMultiSigInterface;

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
    MAX_OWNER_COUNT(overrides?: CallOverrides): Promise<[BigNumber]>;

    addOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeRequireExecution(
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeRequirement(
      _required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    confirmTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    confirmations(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    executeTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getConfirmationCount(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { count: BigNumber }>;

    getConfirmations(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string[]] & { ownerConfirmations: string[] }>;

    getOwners(overrides?: CallOverrides): Promise<[string[]]>;

    getTransactionCount(
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { count: BigNumber }>;

    getTransactionIds(
      from: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<BigNumberish>,
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { transactionIds: BigNumber[] }>;

    initialize(
      _owners: PromiseOrValue<string>[],
      _required: PromiseOrValue<BigNumberish>,
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isConfirmed(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    removeOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    replaceOwner(
      _owner: PromiseOrValue<string>,
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    requireExecution(overrides?: CallOverrides): Promise<[boolean]>;

    required(overrides?: CallOverrides): Promise<[BigNumber]>;

    revokeConfirmation(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    submitTransaction(
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      destination: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      metadata: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transactionCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, boolean, string] & {
        title: string;
        description: string;
        destination: string;
        value: BigNumber;
        data: string;
        executed: boolean;
        metadata: string;
      }
    >;
  };

  MAX_OWNER_COUNT(overrides?: CallOverrides): Promise<BigNumber>;

  addOwner(
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeRequireExecution(
    _requireExecution: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeRequirement(
    _required: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  confirmTransaction(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  confirmations(
    arg0: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  executeTransaction(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getConfirmationCount(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getConfirmations(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getOwners(overrides?: CallOverrides): Promise<string[]>;

  getTransactionCount(
    pending: PromiseOrValue<boolean>,
    executed: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTransactionIds(
    from: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<BigNumberish>,
    pending: PromiseOrValue<boolean>,
    executed: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  initialize(
    _owners: PromiseOrValue<string>[],
    _required: PromiseOrValue<BigNumberish>,
    _requireExecution: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isConfirmed(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isOwner(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owners(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  removeOwner(
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  replaceOwner(
    _owner: PromiseOrValue<string>,
    _newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  requireExecution(overrides?: CallOverrides): Promise<boolean>;

  required(overrides?: CallOverrides): Promise<BigNumber>;

  revokeConfirmation(
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  submitTransaction(
    title: PromiseOrValue<string>,
    description: PromiseOrValue<string>,
    destination: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    metadata: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transactionCount(overrides?: CallOverrides): Promise<BigNumber>;

  transactions(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, string, boolean, string] & {
      title: string;
      description: string;
      destination: string;
      value: BigNumber;
      data: string;
      executed: boolean;
      metadata: string;
    }
  >;

  callStatic: {
    MAX_OWNER_COUNT(overrides?: CallOverrides): Promise<BigNumber>;

    addOwner(
      _owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeRequireExecution(
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeRequirement(
      _required: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    confirmTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    confirmations(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    executeTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getConfirmationCount(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getConfirmations(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getOwners(overrides?: CallOverrides): Promise<string[]>;

    getTransactionCount(
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTransactionIds(
      from: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<BigNumberish>,
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    initialize(
      _owners: PromiseOrValue<string>[],
      _required: PromiseOrValue<BigNumberish>,
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    isConfirmed(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    removeOwner(
      _owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    replaceOwner(
      _owner: PromiseOrValue<string>,
      _newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    requireExecution(overrides?: CallOverrides): Promise<boolean>;

    required(overrides?: CallOverrides): Promise<BigNumber>;

    revokeConfirmation(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    submitTransaction(
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      destination: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      metadata: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transactionCount(overrides?: CallOverrides): Promise<BigNumber>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, boolean, string] & {
        title: string;
        description: string;
        destination: string;
        value: BigNumber;
        data: string;
        executed: boolean;
        metadata: string;
      }
    >;
  };

  filters: {
    "Confirmation(address,uint256)"(
      sender?: PromiseOrValue<string> | null,
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ConfirmationEventFilter;
    Confirmation(
      sender?: PromiseOrValue<string> | null,
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ConfirmationEventFilter;

    "Deposit(address,uint256)"(
      sender?: PromiseOrValue<string> | null,
      value?: null
    ): DepositEventFilter;
    Deposit(
      sender?: PromiseOrValue<string> | null,
      value?: null
    ): DepositEventFilter;

    "Execution(uint256)"(
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ExecutionEventFilter;
    Execution(
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ExecutionEventFilter;

    "ExecutionFailure(uint256)"(
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ExecutionFailureEventFilter;
    ExecutionFailure(
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): ExecutionFailureEventFilter;

    "ExecutionRequiredChange(bool)"(
      requireExecution?: null
    ): ExecutionRequiredChangeEventFilter;
    ExecutionRequiredChange(
      requireExecution?: null
    ): ExecutionRequiredChangeEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnerAddition(address)"(
      owner?: PromiseOrValue<string> | null
    ): OwnerAdditionEventFilter;
    OwnerAddition(
      owner?: PromiseOrValue<string> | null
    ): OwnerAdditionEventFilter;

    "OwnerRemoval(address)"(
      owner?: PromiseOrValue<string> | null
    ): OwnerRemovalEventFilter;
    OwnerRemoval(
      owner?: PromiseOrValue<string> | null
    ): OwnerRemovalEventFilter;

    "RequirementChange(uint256)"(required?: null): RequirementChangeEventFilter;
    RequirementChange(required?: null): RequirementChangeEventFilter;

    "Revocation(address,uint256)"(
      sender?: PromiseOrValue<string> | null,
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): RevocationEventFilter;
    Revocation(
      sender?: PromiseOrValue<string> | null,
      transactionId?: PromiseOrValue<BigNumberish> | null
    ): RevocationEventFilter;

    "Submission(uint256,tuple)"(
      transactionId?: PromiseOrValue<BigNumberish> | null,
      transaction?: null
    ): SubmissionEventFilter;
    Submission(
      transactionId?: PromiseOrValue<BigNumberish> | null,
      transaction?: null
    ): SubmissionEventFilter;
  };

  estimateGas: {
    MAX_OWNER_COUNT(overrides?: CallOverrides): Promise<BigNumber>;

    addOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeRequireExecution(
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeRequirement(
      _required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    confirmTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    confirmations(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    executeTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getConfirmationCount(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getConfirmations(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwners(overrides?: CallOverrides): Promise<BigNumber>;

    getTransactionCount(
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTransactionIds(
      from: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<BigNumberish>,
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _owners: PromiseOrValue<string>[],
      _required: PromiseOrValue<BigNumberish>,
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isConfirmed(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    replaceOwner(
      _owner: PromiseOrValue<string>,
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    requireExecution(overrides?: CallOverrides): Promise<BigNumber>;

    required(overrides?: CallOverrides): Promise<BigNumber>;

    revokeConfirmation(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    submitTransaction(
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      destination: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      metadata: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transactionCount(overrides?: CallOverrides): Promise<BigNumber>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_OWNER_COUNT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeRequireExecution(
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeRequirement(
      _required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    confirmTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    confirmations(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    executeTransaction(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getConfirmationCount(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getConfirmations(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTransactionCount(
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTransactionIds(
      from: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<BigNumberish>,
      pending: PromiseOrValue<boolean>,
      executed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _owners: PromiseOrValue<string>[],
      _required: PromiseOrValue<BigNumberish>,
      _requireExecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isConfirmed(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    replaceOwner(
      _owner: PromiseOrValue<string>,
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    requireExecution(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    required(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    revokeConfirmation(
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    submitTransaction(
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      destination: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      metadata: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transactionCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
