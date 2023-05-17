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

export interface EndowmentMultiSigEmitterInterface extends utils.Interface {
  functions: {
    "addOwnerEndowment(uint256,address)": FunctionFragment;
    "confirmEndowment(uint256,address,uint256)": FunctionFragment;
    "createMultisig(address,uint256,address,address[],uint256,bool)": FunctionFragment;
    "depositEndowment(uint256,address,uint256)": FunctionFragment;
    "executeEndowment(uint256,uint256)": FunctionFragment;
    "executeFailureEndowment(uint256,uint256)": FunctionFragment;
    "initEndowmentMultiSigEmitter(address)": FunctionFragment;
    "removeOwnerEndowment(uint256,address)": FunctionFragment;
    "requirementChangeEndowment(uint256,uint256)": FunctionFragment;
    "revokeEndowment(uint256,address,uint256)": FunctionFragment;
    "submitEndowment(uint256,uint256,(string,string,address,uint256,bytes,bool,bytes))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addOwnerEndowment"
      | "confirmEndowment"
      | "createMultisig"
      | "depositEndowment"
      | "executeEndowment"
      | "executeFailureEndowment"
      | "initEndowmentMultiSigEmitter"
      | "removeOwnerEndowment"
      | "requirementChangeEndowment"
      | "revokeEndowment"
      | "submitEndowment"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addOwnerEndowment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "confirmEndowment",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createMultisig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "depositEndowment",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeEndowment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeFailureEndowment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "initEndowmentMultiSigEmitter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeOwnerEndowment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "requirementChangeEndowment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeEndowment",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "submitEndowment",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      MultiSigStorage.TransactionStruct
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addOwnerEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "confirmEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createMultisig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeFailureEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initEndowmentMultiSigEmitter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeOwnerEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requirementChangeEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeEndowment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submitEndowment",
    data: BytesLike
  ): Result;

  events: {
    "EndowmentConfirmation(uint256,address,uint256)": EventFragment;
    "EndowmentDeposit(uint256,address,uint256)": EventFragment;
    "EndowmentExecution(uint256,uint256)": EventFragment;
    "EndowmentExecutionFailure(uint256,uint256)": EventFragment;
    "EndowmentOwnerAddition(uint256,address)": EventFragment;
    "EndowmentOwnerRemoval(uint256,address)": EventFragment;
    "EndowmentRequirementChange(uint256,uint256)": EventFragment;
    "EndowmentRevocation(uint256,address,uint256)": EventFragment;
    "EndowmentSubmission(uint256,uint256,tuple)": EventFragment;
    "MultisigCreated(address,uint256,address,address[],uint256,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EndowmentConfirmation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentDeposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentExecution"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentExecutionFailure"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentOwnerAddition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentOwnerRemoval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentRequirementChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentRevocation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentSubmission"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MultisigCreated"): EventFragment;
}

export interface EndowmentConfirmationEventObject {
  endowmentId: BigNumber;
  sender: string;
  transactionId: BigNumber;
}
export type EndowmentConfirmationEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  EndowmentConfirmationEventObject
>;

export type EndowmentConfirmationEventFilter =
  TypedEventFilter<EndowmentConfirmationEvent>;

export interface EndowmentDepositEventObject {
  endowmentId: BigNumber;
  sender: string;
  value: BigNumber;
}
export type EndowmentDepositEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  EndowmentDepositEventObject
>;

export type EndowmentDepositEventFilter =
  TypedEventFilter<EndowmentDepositEvent>;

export interface EndowmentExecutionEventObject {
  endowmentId: BigNumber;
  transactionId: BigNumber;
}
export type EndowmentExecutionEvent = TypedEvent<
  [BigNumber, BigNumber],
  EndowmentExecutionEventObject
>;

export type EndowmentExecutionEventFilter =
  TypedEventFilter<EndowmentExecutionEvent>;

export interface EndowmentExecutionFailureEventObject {
  endowmentId: BigNumber;
  transactionId: BigNumber;
}
export type EndowmentExecutionFailureEvent = TypedEvent<
  [BigNumber, BigNumber],
  EndowmentExecutionFailureEventObject
>;

export type EndowmentExecutionFailureEventFilter =
  TypedEventFilter<EndowmentExecutionFailureEvent>;

export interface EndowmentOwnerAdditionEventObject {
  endowmentId: BigNumber;
  owner: string;
}
export type EndowmentOwnerAdditionEvent = TypedEvent<
  [BigNumber, string],
  EndowmentOwnerAdditionEventObject
>;

export type EndowmentOwnerAdditionEventFilter =
  TypedEventFilter<EndowmentOwnerAdditionEvent>;

export interface EndowmentOwnerRemovalEventObject {
  endowmentId: BigNumber;
  owner: string;
}
export type EndowmentOwnerRemovalEvent = TypedEvent<
  [BigNumber, string],
  EndowmentOwnerRemovalEventObject
>;

export type EndowmentOwnerRemovalEventFilter =
  TypedEventFilter<EndowmentOwnerRemovalEvent>;

export interface EndowmentRequirementChangeEventObject {
  endowmentId: BigNumber;
  required: BigNumber;
}
export type EndowmentRequirementChangeEvent = TypedEvent<
  [BigNumber, BigNumber],
  EndowmentRequirementChangeEventObject
>;

export type EndowmentRequirementChangeEventFilter =
  TypedEventFilter<EndowmentRequirementChangeEvent>;

export interface EndowmentRevocationEventObject {
  endowmentId: BigNumber;
  sender: string;
  transactionId: BigNumber;
}
export type EndowmentRevocationEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  EndowmentRevocationEventObject
>;

export type EndowmentRevocationEventFilter =
  TypedEventFilter<EndowmentRevocationEvent>;

export interface EndowmentSubmissionEventObject {
  endowmentId: BigNumber;
  transactionId: BigNumber;
  transaction: MultiSigStorage.TransactionStructOutput;
}
export type EndowmentSubmissionEvent = TypedEvent<
  [BigNumber, BigNumber, MultiSigStorage.TransactionStructOutput],
  EndowmentSubmissionEventObject
>;

export type EndowmentSubmissionEventFilter =
  TypedEventFilter<EndowmentSubmissionEvent>;

export interface MultisigCreatedEventObject {
  multisigAddress: string;
  endowmentId: BigNumber;
  emitter: string;
  owners: string[];
  required: BigNumber;
  requireexecution: boolean;
}
export type MultisigCreatedEvent = TypedEvent<
  [string, BigNumber, string, string[], BigNumber, boolean],
  MultisigCreatedEventObject
>;

export type MultisigCreatedEventFilter = TypedEventFilter<MultisigCreatedEvent>;

export interface EndowmentMultiSigEmitter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EndowmentMultiSigEmitterInterface;

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
    addOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    confirmEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createMultisig(
      multisigAddress: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      emitter: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      requireexecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    depositEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeFailureEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initEndowmentMultiSigEmitter(
      multisigfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    requirementChangeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    submitEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      transaction: MultiSigStorage.TransactionStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addOwnerEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  confirmEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    sender: PromiseOrValue<string>,
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createMultisig(
    multisigAddress: PromiseOrValue<string>,
    endowmentId: PromiseOrValue<BigNumberish>,
    emitter: PromiseOrValue<string>,
    owners: PromiseOrValue<string>[],
    required: PromiseOrValue<BigNumberish>,
    requireexecution: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  depositEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    sender: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeFailureEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initEndowmentMultiSigEmitter(
    multisigfactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeOwnerEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  requirementChangeEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    required: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    sender: PromiseOrValue<string>,
    transactionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  submitEndowment(
    endowmentId: PromiseOrValue<BigNumberish>,
    transactionId: PromiseOrValue<BigNumberish>,
    transaction: MultiSigStorage.TransactionStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    confirmEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createMultisig(
      multisigAddress: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      emitter: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      requireexecution: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    depositEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeFailureEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    initEndowmentMultiSigEmitter(
      multisigfactory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    requirementChangeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      required: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    submitEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      transaction: MultiSigStorage.TransactionStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "EndowmentConfirmation(uint256,address,uint256)"(
      endowmentId?: null,
      sender?: null,
      transactionId?: null
    ): EndowmentConfirmationEventFilter;
    EndowmentConfirmation(
      endowmentId?: null,
      sender?: null,
      transactionId?: null
    ): EndowmentConfirmationEventFilter;

    "EndowmentDeposit(uint256,address,uint256)"(
      endowmentId?: null,
      sender?: null,
      value?: null
    ): EndowmentDepositEventFilter;
    EndowmentDeposit(
      endowmentId?: null,
      sender?: null,
      value?: null
    ): EndowmentDepositEventFilter;

    "EndowmentExecution(uint256,uint256)"(
      endowmentId?: null,
      transactionId?: null
    ): EndowmentExecutionEventFilter;
    EndowmentExecution(
      endowmentId?: null,
      transactionId?: null
    ): EndowmentExecutionEventFilter;

    "EndowmentExecutionFailure(uint256,uint256)"(
      endowmentId?: null,
      transactionId?: null
    ): EndowmentExecutionFailureEventFilter;
    EndowmentExecutionFailure(
      endowmentId?: null,
      transactionId?: null
    ): EndowmentExecutionFailureEventFilter;

    "EndowmentOwnerAddition(uint256,address)"(
      endowmentId?: null,
      owner?: null
    ): EndowmentOwnerAdditionEventFilter;
    EndowmentOwnerAddition(
      endowmentId?: null,
      owner?: null
    ): EndowmentOwnerAdditionEventFilter;

    "EndowmentOwnerRemoval(uint256,address)"(
      endowmentId?: null,
      owner?: null
    ): EndowmentOwnerRemovalEventFilter;
    EndowmentOwnerRemoval(
      endowmentId?: null,
      owner?: null
    ): EndowmentOwnerRemovalEventFilter;

    "EndowmentRequirementChange(uint256,uint256)"(
      endowmentId?: null,
      required?: null
    ): EndowmentRequirementChangeEventFilter;
    EndowmentRequirementChange(
      endowmentId?: null,
      required?: null
    ): EndowmentRequirementChangeEventFilter;

    "EndowmentRevocation(uint256,address,uint256)"(
      endowmentId?: null,
      sender?: null,
      transactionId?: null
    ): EndowmentRevocationEventFilter;
    EndowmentRevocation(
      endowmentId?: null,
      sender?: null,
      transactionId?: null
    ): EndowmentRevocationEventFilter;

    "EndowmentSubmission(uint256,uint256,tuple)"(
      endowmentId?: null,
      transactionId?: null,
      transaction?: null
    ): EndowmentSubmissionEventFilter;
    EndowmentSubmission(
      endowmentId?: null,
      transactionId?: null,
      transaction?: null
    ): EndowmentSubmissionEventFilter;

    "MultisigCreated(address,uint256,address,address[],uint256,bool)"(
      multisigAddress?: null,
      endowmentId?: null,
      emitter?: null,
      owners?: null,
      required?: null,
      requireexecution?: null
    ): MultisigCreatedEventFilter;
    MultisigCreated(
      multisigAddress?: null,
      endowmentId?: null,
      emitter?: null,
      owners?: null,
      required?: null,
      requireexecution?: null
    ): MultisigCreatedEventFilter;
  };

  estimateGas: {
    addOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    confirmEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createMultisig(
      multisigAddress: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      emitter: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      requireexecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    depositEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeFailureEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initEndowmentMultiSigEmitter(
      multisigfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    requirementChangeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    submitEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      transaction: MultiSigStorage.TransactionStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    confirmEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createMultisig(
      multisigAddress: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      emitter: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      requireexecution: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    depositEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeFailureEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initEndowmentMultiSigEmitter(
      multisigfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeOwnerEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    requirementChangeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      sender: PromiseOrValue<string>,
      transactionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    submitEndowment(
      endowmentId: PromiseOrValue<BigNumberish>,
      transactionId: PromiseOrValue<BigNumberish>,
      transaction: MultiSigStorage.TransactionStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
