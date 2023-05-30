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
} from "../../common";

export interface DummyGatewayInterface extends utils.Interface {
  functions: {
    "adminEpoch()": FunctionFragment;
    "adminThreshold(uint256)": FunctionFragment;
    "admins(uint256)": FunctionFragment;
    "allTokensFrozen()": FunctionFragment;
    "authModule()": FunctionFragment;
    "callContract(string,string,bytes)": FunctionFragment;
    "callContractWithToken(string,string,bytes,string,uint256)": FunctionFragment;
    "execute(bytes)": FunctionFragment;
    "implementation()": FunctionFragment;
    "isCommandExecuted(bytes32)": FunctionFragment;
    "isContractCallAndMintApproved(bytes32,string,string,address,bytes32,string,uint256)": FunctionFragment;
    "isContractCallApproved(bytes32,string,string,address,bytes32)": FunctionFragment;
    "sendToken(string,string,string,uint256)": FunctionFragment;
    "setTestTokenAddress(address)": FunctionFragment;
    "setTokenMintLimits(string[],uint256[])": FunctionFragment;
    "setup(bytes)": FunctionFragment;
    "tokenAddresses(string)": FunctionFragment;
    "tokenDeployer()": FunctionFragment;
    "tokenFrozen(string)": FunctionFragment;
    "tokenMintAmount(string)": FunctionFragment;
    "tokenMintLimit(string)": FunctionFragment;
    "upgrade(address,bytes32,bytes)": FunctionFragment;
    "validateContractCall(bytes32,string,string,bytes32)": FunctionFragment;
    "validateContractCallAndMint(bytes32,string,string,bytes32,string,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "adminEpoch"
      | "adminThreshold"
      | "admins"
      | "allTokensFrozen"
      | "authModule"
      | "callContract"
      | "callContractWithToken"
      | "execute"
      | "implementation"
      | "isCommandExecuted"
      | "isContractCallAndMintApproved"
      | "isContractCallApproved"
      | "sendToken"
      | "setTestTokenAddress"
      | "setTokenMintLimits"
      | "setup"
      | "tokenAddresses"
      | "tokenDeployer"
      | "tokenFrozen"
      | "tokenMintAmount"
      | "tokenMintLimit"
      | "upgrade"
      | "validateContractCall"
      | "validateContractCallAndMint"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "adminEpoch", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "adminThreshold",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "admins", values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: "allTokensFrozen", values?: undefined): string;
  encodeFunctionData(functionFragment: "authModule", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "callContract",
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "callContractWithToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "execute", values: [PromiseOrValue<BytesLike>]): string;
  encodeFunctionData(functionFragment: "implementation", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isCommandExecuted",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "isContractCallAndMintApproved",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isContractCallApproved",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "sendToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTestTokenAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenMintLimits",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(functionFragment: "setup", values: [PromiseOrValue<BytesLike>]): string;
  encodeFunctionData(functionFragment: "tokenAddresses", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "tokenDeployer", values?: undefined): string;
  encodeFunctionData(functionFragment: "tokenFrozen", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "tokenMintAmount", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "tokenMintLimit", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: "upgrade",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "validateContractCall",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "validateContractCallAndMint",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "adminEpoch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "adminThreshold", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allTokensFrozen", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "authModule", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "callContract", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "callContractWithToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "implementation", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isCommandExecuted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isContractCallAndMintApproved", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isContractCallApproved", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sendToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setTestTokenAddress", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setTokenMintLimits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setup", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenAddresses", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenDeployer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenFrozen", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenMintAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenMintLimit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upgrade", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "validateContractCall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "validateContractCallAndMint", data: BytesLike): Result;

  events: {
    "ContractCall(address,string,string,bytes32,bytes)": EventFragment;
    "ContractCallApproved(bytes32,string,string,address,bytes32,bytes32,uint256)": EventFragment;
    "ContractCallApprovedWithMint(bytes32,string,string,address,bytes32,string,uint256,bytes32,uint256)": EventFragment;
    "ContractCallWithToken(address,string,string,bytes32,bytes,string,uint256)": EventFragment;
    "Executed(bytes32)": EventFragment;
    "OperatorshipTransferred(bytes)": EventFragment;
    "TokenDeployed(string,address)": EventFragment;
    "TokenMintLimitUpdated(string,uint256)": EventFragment;
    "TokenSent(address,string,string,string,uint256)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ContractCall"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContractCallApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContractCallApprovedWithMint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContractCallWithToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Executed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorshipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenDeployed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenMintLimitUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export interface ContractCallEventObject {
  sender: string;
  destinationChain: string;
  destinationContractAddress: string;
  payloadHash: string;
  payload: string;
}
export type ContractCallEvent = TypedEvent<
  [string, string, string, string, string],
  ContractCallEventObject
>;

export type ContractCallEventFilter = TypedEventFilter<ContractCallEvent>;

export interface ContractCallApprovedEventObject {
  commandId: string;
  sourceChain: string;
  sourceAddress: string;
  contractAddress: string;
  payloadHash: string;
  sourceTxHash: string;
  sourceEventIndex: BigNumber;
}
export type ContractCallApprovedEvent = TypedEvent<
  [string, string, string, string, string, string, BigNumber],
  ContractCallApprovedEventObject
>;

export type ContractCallApprovedEventFilter = TypedEventFilter<ContractCallApprovedEvent>;

export interface ContractCallApprovedWithMintEventObject {
  commandId: string;
  sourceChain: string;
  sourceAddress: string;
  contractAddress: string;
  payloadHash: string;
  symbol: string;
  amount: BigNumber;
  sourceTxHash: string;
  sourceEventIndex: BigNumber;
}
export type ContractCallApprovedWithMintEvent = TypedEvent<
  [string, string, string, string, string, string, BigNumber, string, BigNumber],
  ContractCallApprovedWithMintEventObject
>;

export type ContractCallApprovedWithMintEventFilter =
  TypedEventFilter<ContractCallApprovedWithMintEvent>;

export interface ContractCallWithTokenEventObject {
  sender: string;
  destinationChain: string;
  destinationContractAddress: string;
  payloadHash: string;
  payload: string;
  symbol: string;
  amount: BigNumber;
}
export type ContractCallWithTokenEvent = TypedEvent<
  [string, string, string, string, string, string, BigNumber],
  ContractCallWithTokenEventObject
>;

export type ContractCallWithTokenEventFilter = TypedEventFilter<ContractCallWithTokenEvent>;

export interface ExecutedEventObject {
  commandId: string;
}
export type ExecutedEvent = TypedEvent<[string], ExecutedEventObject>;

export type ExecutedEventFilter = TypedEventFilter<ExecutedEvent>;

export interface OperatorshipTransferredEventObject {
  newOperatorsData: string;
}
export type OperatorshipTransferredEvent = TypedEvent<[string], OperatorshipTransferredEventObject>;

export type OperatorshipTransferredEventFilter = TypedEventFilter<OperatorshipTransferredEvent>;

export interface TokenDeployedEventObject {
  symbol: string;
  tokenAddresses: string;
}
export type TokenDeployedEvent = TypedEvent<[string, string], TokenDeployedEventObject>;

export type TokenDeployedEventFilter = TypedEventFilter<TokenDeployedEvent>;

export interface TokenMintLimitUpdatedEventObject {
  symbol: string;
  limit: BigNumber;
}
export type TokenMintLimitUpdatedEvent = TypedEvent<
  [string, BigNumber],
  TokenMintLimitUpdatedEventObject
>;

export type TokenMintLimitUpdatedEventFilter = TypedEventFilter<TokenMintLimitUpdatedEvent>;

export interface TokenSentEventObject {
  sender: string;
  destinationChain: string;
  destinationAddress: string;
  symbol: string;
  amount: BigNumber;
}
export type TokenSentEvent = TypedEvent<
  [string, string, string, string, BigNumber],
  TokenSentEventObject
>;

export type TokenSentEventFilter = TypedEventFilter<TokenSentEvent>;

export interface UpgradedEventObject {
  implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface DummyGateway extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DummyGatewayInterface;

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
    adminEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;

    adminThreshold(
      epoch: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    admins(epoch: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string[]]>;

    allTokensFrozen(overrides?: CallOverrides): Promise<[boolean]>;

    authModule(overrides?: CallOverrides): Promise<[string]>;

    callContract(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    callContractWithToken(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    execute(
      input: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    implementation(overrides?: CallOverrides): Promise<[string]>;

    isCommandExecuted(
      commandId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isContractCallAndMintApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      arg5: PromiseOrValue<string>,
      arg6: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isContractCallApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    sendToken(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    setTestTokenAddress(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    setTokenMintLimits(
      symbols: PromiseOrValue<string>[],
      limits: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    setup(
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    tokenAddresses(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;

    tokenDeployer(overrides?: CallOverrides): Promise<[string]>;

    tokenFrozen(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;

    tokenMintAmount(
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenMintLimit(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    upgrade(
      newImplementation: PromiseOrValue<string>,
      newImplementationCodeHash: PromiseOrValue<BytesLike>,
      setupParams: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    validateContractCall(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    validateContractCallAndMint(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      arg4: PromiseOrValue<string>,
      arg5: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  adminEpoch(overrides?: CallOverrides): Promise<BigNumber>;

  adminThreshold(
    epoch: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  admins(epoch: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string[]>;

  allTokensFrozen(overrides?: CallOverrides): Promise<boolean>;

  authModule(overrides?: CallOverrides): Promise<string>;

  callContract(
    destinationChain: PromiseOrValue<string>,
    contractAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callContractWithToken(
    destinationChain: PromiseOrValue<string>,
    contractAddress: PromiseOrValue<string>,
    payload: PromiseOrValue<BytesLike>,
    symbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  execute(
    input: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  implementation(overrides?: CallOverrides): Promise<string>;

  isCommandExecuted(
    commandId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isContractCallAndMintApproved(
    commandId: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<string>,
    arg3: PromiseOrValue<string>,
    arg4: PromiseOrValue<BytesLike>,
    arg5: PromiseOrValue<string>,
    arg6: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isContractCallApproved(
    commandId: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<string>,
    arg3: PromiseOrValue<string>,
    arg4: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  sendToken(
    destinationChain: PromiseOrValue<string>,
    destinationAddress: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  setTestTokenAddress(
    _addr: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  setTokenMintLimits(
    symbols: PromiseOrValue<string>[],
    limits: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  setup(
    params: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  tokenAddresses(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

  tokenDeployer(overrides?: CallOverrides): Promise<string>;

  tokenFrozen(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

  tokenMintAmount(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  tokenMintLimit(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  upgrade(
    newImplementation: PromiseOrValue<string>,
    newImplementationCodeHash: PromiseOrValue<BytesLike>,
    setupParams: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  validateContractCall(
    commandId: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<string>,
    arg3: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  validateContractCallAndMint(
    commandId: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<string>,
    arg3: PromiseOrValue<BytesLike>,
    arg4: PromiseOrValue<string>,
    arg5: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    adminEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    adminThreshold(
      epoch: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admins(epoch: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string[]>;

    allTokensFrozen(overrides?: CallOverrides): Promise<boolean>;

    authModule(overrides?: CallOverrides): Promise<string>;

    callContract(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    callContractWithToken(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    execute(input: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;

    implementation(overrides?: CallOverrides): Promise<string>;

    isCommandExecuted(
      commandId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isContractCallAndMintApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      arg5: PromiseOrValue<string>,
      arg6: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isContractCallApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    sendToken(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTestTokenAddress(_addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setTokenMintLimits(
      symbols: PromiseOrValue<string>[],
      limits: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setup(params: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;

    tokenAddresses(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

    tokenDeployer(overrides?: CallOverrides): Promise<string>;

    tokenFrozen(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

    tokenMintAmount(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    tokenMintLimit(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    upgrade(
      newImplementation: PromiseOrValue<string>,
      newImplementationCodeHash: PromiseOrValue<BytesLike>,
      setupParams: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    validateContractCall(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    validateContractCallAndMint(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      arg4: PromiseOrValue<string>,
      arg5: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "ContractCall(address,string,string,bytes32,bytes)"(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationContractAddress?: null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      payload?: null
    ): ContractCallEventFilter;
    ContractCall(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationContractAddress?: null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      payload?: null
    ): ContractCallEventFilter;

    "ContractCallApproved(bytes32,string,string,address,bytes32,bytes32,uint256)"(
      commandId?: PromiseOrValue<BytesLike> | null,
      sourceChain?: null,
      sourceAddress?: null,
      contractAddress?: PromiseOrValue<string> | null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      sourceTxHash?: null,
      sourceEventIndex?: null
    ): ContractCallApprovedEventFilter;
    ContractCallApproved(
      commandId?: PromiseOrValue<BytesLike> | null,
      sourceChain?: null,
      sourceAddress?: null,
      contractAddress?: PromiseOrValue<string> | null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      sourceTxHash?: null,
      sourceEventIndex?: null
    ): ContractCallApprovedEventFilter;

    "ContractCallApprovedWithMint(bytes32,string,string,address,bytes32,string,uint256,bytes32,uint256)"(
      commandId?: PromiseOrValue<BytesLike> | null,
      sourceChain?: null,
      sourceAddress?: null,
      contractAddress?: PromiseOrValue<string> | null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      symbol?: null,
      amount?: null,
      sourceTxHash?: null,
      sourceEventIndex?: null
    ): ContractCallApprovedWithMintEventFilter;
    ContractCallApprovedWithMint(
      commandId?: PromiseOrValue<BytesLike> | null,
      sourceChain?: null,
      sourceAddress?: null,
      contractAddress?: PromiseOrValue<string> | null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      symbol?: null,
      amount?: null,
      sourceTxHash?: null,
      sourceEventIndex?: null
    ): ContractCallApprovedWithMintEventFilter;

    "ContractCallWithToken(address,string,string,bytes32,bytes,string,uint256)"(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationContractAddress?: null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      payload?: null,
      symbol?: null,
      amount?: null
    ): ContractCallWithTokenEventFilter;
    ContractCallWithToken(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationContractAddress?: null,
      payloadHash?: PromiseOrValue<BytesLike> | null,
      payload?: null,
      symbol?: null,
      amount?: null
    ): ContractCallWithTokenEventFilter;

    "Executed(bytes32)"(commandId?: PromiseOrValue<BytesLike> | null): ExecutedEventFilter;
    Executed(commandId?: PromiseOrValue<BytesLike> | null): ExecutedEventFilter;

    "OperatorshipTransferred(bytes)"(newOperatorsData?: null): OperatorshipTransferredEventFilter;
    OperatorshipTransferred(newOperatorsData?: null): OperatorshipTransferredEventFilter;

    "TokenDeployed(string,address)"(symbol?: null, tokenAddresses?: null): TokenDeployedEventFilter;
    TokenDeployed(symbol?: null, tokenAddresses?: null): TokenDeployedEventFilter;

    "TokenMintLimitUpdated(string,uint256)"(
      symbol?: null,
      limit?: null
    ): TokenMintLimitUpdatedEventFilter;
    TokenMintLimitUpdated(symbol?: null, limit?: null): TokenMintLimitUpdatedEventFilter;

    "TokenSent(address,string,string,string,uint256)"(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationAddress?: null,
      symbol?: null,
      amount?: null
    ): TokenSentEventFilter;
    TokenSent(
      sender?: PromiseOrValue<string> | null,
      destinationChain?: null,
      destinationAddress?: null,
      symbol?: null,
      amount?: null
    ): TokenSentEventFilter;

    "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
  };

  estimateGas: {
    adminEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    adminThreshold(
      epoch: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admins(epoch: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    allTokensFrozen(overrides?: CallOverrides): Promise<BigNumber>;

    authModule(overrides?: CallOverrides): Promise<BigNumber>;

    callContract(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    callContractWithToken(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    execute(
      input: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    implementation(overrides?: CallOverrides): Promise<BigNumber>;

    isCommandExecuted(
      commandId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isContractCallAndMintApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      arg5: PromiseOrValue<string>,
      arg6: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isContractCallApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    sendToken(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    setTestTokenAddress(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    setTokenMintLimits(
      symbols: PromiseOrValue<string>[],
      limits: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    setup(
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    tokenAddresses(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    tokenDeployer(overrides?: CallOverrides): Promise<BigNumber>;

    tokenFrozen(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    tokenMintAmount(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    tokenMintLimit(symbol: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    upgrade(
      newImplementation: PromiseOrValue<string>,
      newImplementationCodeHash: PromiseOrValue<BytesLike>,
      setupParams: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    validateContractCall(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validateContractCallAndMint(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      arg4: PromiseOrValue<string>,
      arg5: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    adminEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adminThreshold(
      epoch: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    admins(
      epoch: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allTokensFrozen(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    authModule(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    callContract(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    callContractWithToken(
      destinationChain: PromiseOrValue<string>,
      contractAddress: PromiseOrValue<string>,
      payload: PromiseOrValue<BytesLike>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    execute(
      input: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    implementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isCommandExecuted(
      commandId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isContractCallAndMintApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      arg5: PromiseOrValue<string>,
      arg6: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isContractCallApproved(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<string>,
      arg4: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sendToken(
      destinationChain: PromiseOrValue<string>,
      destinationAddress: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    setTestTokenAddress(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    setTokenMintLimits(
      symbols: PromiseOrValue<string>[],
      limits: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    setup(
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    tokenAddresses(
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenDeployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenFrozen(
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenMintAmount(
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenMintLimit(
      symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    upgrade(
      newImplementation: PromiseOrValue<string>,
      newImplementationCodeHash: PromiseOrValue<BytesLike>,
      setupParams: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    validateContractCall(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validateContractCallAndMint(
      commandId: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      arg4: PromiseOrValue<string>,
      arg5: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
