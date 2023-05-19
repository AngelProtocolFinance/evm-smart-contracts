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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace AngelCoreStruct {
  export type VeTypeDataStruct = {
    value: PromiseOrValue<BigNumberish>;
    scale: PromiseOrValue<BigNumberish>;
    slope: PromiseOrValue<BigNumberish>;
    power: PromiseOrValue<BigNumberish>;
  };

  export type VeTypeDataStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    value: BigNumber;
    scale: BigNumber;
    slope: BigNumber;
    power: BigNumber;
  };

  export type VeTypeStruct = {
    ve_type: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.VeTypeDataStruct;
  };

  export type VeTypeStructOutput = [
    number,
    AngelCoreStruct.VeTypeDataStructOutput
  ] & { ve_type: number; data: AngelCoreStruct.VeTypeDataStructOutput };

  export type DaoTokenDataStruct = {
    existingCw20Data: PromiseOrValue<string>;
    newCw20InitialSupply: PromiseOrValue<BigNumberish>;
    newCw20Name: PromiseOrValue<string>;
    newCw20Symbol: PromiseOrValue<string>;
    bondingveveType: AngelCoreStruct.VeTypeStruct;
    bondingveName: PromiseOrValue<string>;
    bondingveSymbol: PromiseOrValue<string>;
    bondingveDecimals: PromiseOrValue<BigNumberish>;
    bondingveReserveDenom: PromiseOrValue<string>;
    bondingveReserveDecimals: PromiseOrValue<BigNumberish>;
    bondingveUnbondingPeriod: PromiseOrValue<BigNumberish>;
  };

  export type DaoTokenDataStructOutput = [
    string,
    BigNumber,
    string,
    string,
    AngelCoreStruct.VeTypeStructOutput,
    string,
    string,
    BigNumber,
    string,
    BigNumber,
    BigNumber
  ] & {
    existingCw20Data: string;
    newCw20InitialSupply: BigNumber;
    newCw20Name: string;
    newCw20Symbol: string;
    bondingveveType: AngelCoreStruct.VeTypeStructOutput;
    bondingveName: string;
    bondingveSymbol: string;
    bondingveDecimals: BigNumber;
    bondingveReserveDenom: string;
    bondingveReserveDecimals: BigNumber;
    bondingveUnbondingPeriod: BigNumber;
  };

  export type DaoTokenStruct = {
    token: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.DaoTokenDataStruct;
  };

  export type DaoTokenStructOutput = [
    number,
    AngelCoreStruct.DaoTokenDataStructOutput
  ] & { token: number; data: AngelCoreStruct.DaoTokenDataStructOutput };
}

export declare namespace SubDaoMessage {
  export type InstantiateMsgStruct = {
    id: PromiseOrValue<BigNumberish>;
    owner: PromiseOrValue<string>;
    quorum: PromiseOrValue<BigNumberish>;
    threshold: PromiseOrValue<BigNumberish>;
    votingPeriod: PromiseOrValue<BigNumberish>;
    timelockPeriod: PromiseOrValue<BigNumberish>;
    expirationPeriod: PromiseOrValue<BigNumberish>;
    proposalDeposit: PromiseOrValue<BigNumberish>;
    snapshotPeriod: PromiseOrValue<BigNumberish>;
    token: AngelCoreStruct.DaoTokenStruct;
    endowType: PromiseOrValue<BigNumberish>;
    endowOwner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
  };

  export type InstantiateMsgStructOutput = [
    number,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.DaoTokenStructOutput,
    number,
    string,
    string
  ] & {
    id: number;
    owner: string;
    quorum: BigNumber;
    threshold: BigNumber;
    votingPeriod: BigNumber;
    timelockPeriod: BigNumber;
    expirationPeriod: BigNumber;
    proposalDeposit: BigNumber;
    snapshotPeriod: BigNumber;
    token: AngelCoreStruct.DaoTokenStructOutput;
    endowType: number;
    endowOwner: string;
    registrarContract: string;
  };

  export type QueryConfigResponseStruct = {
    owner: PromiseOrValue<string>;
    daoToken: PromiseOrValue<string>;
    veToken: PromiseOrValue<string>;
    swapFactory: PromiseOrValue<string>;
    quorum: PromiseOrValue<BigNumberish>;
    threshold: PromiseOrValue<BigNumberish>;
    votingPeriod: PromiseOrValue<BigNumberish>;
    timelockPeriod: PromiseOrValue<BigNumberish>;
    expirationPeriod: PromiseOrValue<BigNumberish>;
    proposalDeposit: PromiseOrValue<BigNumberish>;
    snapshotPeriod: PromiseOrValue<BigNumberish>;
  };

  export type QueryConfigResponseStructOutput = [
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    owner: string;
    daoToken: string;
    veToken: string;
    swapFactory: string;
    quorum: BigNumber;
    threshold: BigNumber;
    votingPeriod: BigNumber;
    timelockPeriod: BigNumber;
    expirationPeriod: BigNumber;
    proposalDeposit: BigNumber;
    snapshotPeriod: BigNumber;
  };
}

export declare namespace SubDaoStorage {
  export type ExecuteDataStruct = {
    order: PromiseOrValue<BigNumberish>[];
    contractAddress: PromiseOrValue<string>[];
    execution_message: PromiseOrValue<BytesLike>[];
  };

  export type ExecuteDataStructOutput = [BigNumber[], string[], string[]] & {
    order: BigNumber[];
    contractAddress: string[];
    execution_message: string[];
  };

  export type StateStruct = {
    pollCount: PromiseOrValue<BigNumberish>;
    totalShare: PromiseOrValue<BigNumberish>;
    totalDeposit: PromiseOrValue<BigNumberish>;
  };

  export type StateStructOutput = [BigNumber, BigNumber, BigNumber] & {
    pollCount: BigNumber;
    totalShare: BigNumber;
    totalDeposit: BigNumber;
  };
}

export interface ISubDaoInterface extends utils.Interface {
  functions: {
    "buildDaoTokenMesage((uint32,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,(uint8,(address,uint256,string,string,(uint8,(uint128,uint256,uint128,uint128)),string,string,uint256,address,uint256,uint256)),uint8,address,address))": FunctionFragment;
    "castVote(uint256,uint8)": FunctionFragment;
    "createPoll(address,uint256,string,string,string,(uint256[],address[],bytes[]))": FunctionFragment;
    "endPoll(uint256)": FunctionFragment;
    "executePoll(uint256)": FunctionFragment;
    "expirePoll(uint256)": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "queryState()": FunctionFragment;
    "registerContracts(address,address)": FunctionFragment;
    "updateConfig(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "buildDaoTokenMesage"
      | "castVote"
      | "createPoll"
      | "endPoll"
      | "executePoll"
      | "expirePoll"
      | "queryConfig"
      | "queryState"
      | "registerContracts"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buildDaoTokenMesage",
    values: [SubDaoMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "castVote",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createPoll",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      SubDaoStorage.ExecuteDataStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "endPoll",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executePoll",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "expirePoll",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "queryConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queryState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registerContracts",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "buildDaoTokenMesage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "castVote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createPoll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endPoll", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executePoll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "expirePoll", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "queryState", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerContracts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateConfig",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ISubDao extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISubDaoInterface;

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
    buildDaoTokenMesage(
      msg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    castVote(
      pollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createPoll(
      proposer: PromiseOrValue<string>,
      depositamount: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      link: PromiseOrValue<string>,
      executeMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    endPoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    expirePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[SubDaoMessage.QueryConfigResponseStructOutput]>;

    queryState(
      overrides?: CallOverrides
    ): Promise<[SubDaoStorage.StateStructOutput]>;

    registerContracts(
      vetoken: PromiseOrValue<string>,
      swapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      quorum: PromiseOrValue<BigNumberish>,
      threshold: PromiseOrValue<BigNumberish>,
      votingperiod: PromiseOrValue<BigNumberish>,
      timelockperiod: PromiseOrValue<BigNumberish>,
      expirationperiod: PromiseOrValue<BigNumberish>,
      proposaldeposit: PromiseOrValue<BigNumberish>,
      snapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  buildDaoTokenMesage(
    msg: SubDaoMessage.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  castVote(
    pollid: PromiseOrValue<BigNumberish>,
    vote: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createPoll(
    proposer: PromiseOrValue<string>,
    depositamount: PromiseOrValue<BigNumberish>,
    title: PromiseOrValue<string>,
    description: PromiseOrValue<string>,
    link: PromiseOrValue<string>,
    executeMsgs: SubDaoStorage.ExecuteDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  endPoll(
    pollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executePoll(
    pollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  expirePoll(
    pollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<SubDaoMessage.QueryConfigResponseStructOutput>;

  queryState(
    overrides?: CallOverrides
  ): Promise<SubDaoStorage.StateStructOutput>;

  registerContracts(
    vetoken: PromiseOrValue<string>,
    swapfactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateConfig(
    owner: PromiseOrValue<string>,
    quorum: PromiseOrValue<BigNumberish>,
    threshold: PromiseOrValue<BigNumberish>,
    votingperiod: PromiseOrValue<BigNumberish>,
    timelockperiod: PromiseOrValue<BigNumberish>,
    expirationperiod: PromiseOrValue<BigNumberish>,
    proposaldeposit: PromiseOrValue<BigNumberish>,
    snapshotperiod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buildDaoTokenMesage(
      msg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    castVote(
      pollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createPoll(
      proposer: PromiseOrValue<string>,
      depositamount: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      link: PromiseOrValue<string>,
      executeMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    endPoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    expirePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<SubDaoMessage.QueryConfigResponseStructOutput>;

    queryState(
      overrides?: CallOverrides
    ): Promise<SubDaoStorage.StateStructOutput>;

    registerContracts(
      vetoken: PromiseOrValue<string>,
      swapfactory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateConfig(
      owner: PromiseOrValue<string>,
      quorum: PromiseOrValue<BigNumberish>,
      threshold: PromiseOrValue<BigNumberish>,
      votingperiod: PromiseOrValue<BigNumberish>,
      timelockperiod: PromiseOrValue<BigNumberish>,
      expirationperiod: PromiseOrValue<BigNumberish>,
      proposaldeposit: PromiseOrValue<BigNumberish>,
      snapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    buildDaoTokenMesage(
      msg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    castVote(
      pollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createPoll(
      proposer: PromiseOrValue<string>,
      depositamount: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      link: PromiseOrValue<string>,
      executeMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    endPoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    expirePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryState(overrides?: CallOverrides): Promise<BigNumber>;

    registerContracts(
      vetoken: PromiseOrValue<string>,
      swapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateConfig(
      owner: PromiseOrValue<string>,
      quorum: PromiseOrValue<BigNumberish>,
      threshold: PromiseOrValue<BigNumberish>,
      votingperiod: PromiseOrValue<BigNumberish>,
      timelockperiod: PromiseOrValue<BigNumberish>,
      expirationperiod: PromiseOrValue<BigNumberish>,
      proposaldeposit: PromiseOrValue<BigNumberish>,
      snapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buildDaoTokenMesage(
      msg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    castVote(
      pollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createPoll(
      proposer: PromiseOrValue<string>,
      depositamount: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      link: PromiseOrValue<string>,
      executeMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    endPoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    expirePoll(
      pollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registerContracts(
      vetoken: PromiseOrValue<string>,
      swapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      quorum: PromiseOrValue<BigNumberish>,
      threshold: PromiseOrValue<BigNumberish>,
      votingperiod: PromiseOrValue<BigNumberish>,
      timelockperiod: PromiseOrValue<BigNumberish>,
      expirationperiod: PromiseOrValue<BigNumberish>,
      proposaldeposit: PromiseOrValue<BigNumberish>,
      snapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
