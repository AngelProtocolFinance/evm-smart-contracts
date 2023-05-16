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
  export type CurveTypeDataStruct = {
    value: PromiseOrValue<BigNumberish>;
    scale: PromiseOrValue<BigNumberish>;
    slope: PromiseOrValue<BigNumberish>;
    power: PromiseOrValue<BigNumberish>;
  };

  export type CurveTypeDataStructOutput = [
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

  export type CurveTypeStruct = {
    curve_type: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.CurveTypeDataStruct;
  };

  export type CurveTypeStructOutput = [
    number,
    AngelCoreStruct.CurveTypeDataStructOutput
  ] & { curve_type: number; data: AngelCoreStruct.CurveTypeDataStructOutput };

  export type DaoTokenDataStruct = {
    existingCw20Data: PromiseOrValue<string>;
    newCw20InitialSupply: PromiseOrValue<BigNumberish>;
    newCw20Name: PromiseOrValue<string>;
    newCw20Symbol: PromiseOrValue<string>;
    bondingCurveCurveType: AngelCoreStruct.CurveTypeStruct;
    bondingCurveName: PromiseOrValue<string>;
    bondingCurveSymbol: PromiseOrValue<string>;
    bondingCurveDecimals: PromiseOrValue<BigNumberish>;
    bondingCurveReserveDenom: PromiseOrValue<string>;
    bondingCurveReserveDecimals: PromiseOrValue<BigNumberish>;
    bondingCurveUnbondingPeriod: PromiseOrValue<BigNumberish>;
  };

  export type DaoTokenDataStructOutput = [
    string,
    BigNumber,
    string,
    string,
    AngelCoreStruct.CurveTypeStructOutput,
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
    bondingCurveCurveType: AngelCoreStruct.CurveTypeStructOutput;
    bondingCurveName: string;
    bondingCurveSymbol: string;
    bondingCurveDecimals: BigNumber;
    bondingCurveReserveDenom: string;
    bondingCurveReserveDecimals: BigNumber;
    bondingCurveUnbondingPeriod: BigNumber;
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
    endow_type: PromiseOrValue<BigNumberish>;
    endowOwner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
  };

  export type InstantiateMsgStructOutput = [
    BigNumber,
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
    id: BigNumber;
    owner: string;
    quorum: BigNumber;
    threshold: BigNumber;
    votingPeriod: BigNumber;
    timelockPeriod: BigNumber;
    expirationPeriod: BigNumber;
    proposalDeposit: BigNumber;
    snapshotPeriod: BigNumber;
    token: AngelCoreStruct.DaoTokenStructOutput;
    endow_type: number;
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
    "buildDaoTokenMesage((uint256,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,(uint8,(address,uint256,string,string,(uint8,(uint128,uint256,uint128,uint128)),string,string,uint256,address,uint256,uint256)),uint8,address,address))": FunctionFragment;
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
      curMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    castVote(
      curPollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createPoll(
      curProposer: PromiseOrValue<string>,
      curDepositamount: PromiseOrValue<BigNumberish>,
      curTitle: PromiseOrValue<string>,
      curDescription: PromiseOrValue<string>,
      curLink: PromiseOrValue<string>,
      curExecuteMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    endPoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    expirePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[SubDaoMessage.QueryConfigResponseStructOutput]>;

    queryState(
      overrides?: CallOverrides
    ): Promise<[SubDaoStorage.StateStructOutput]>;

    registerContracts(
      curVetoken: PromiseOrValue<string>,
      curSwapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateConfig(
      curOwner: PromiseOrValue<string>,
      curQuorum: PromiseOrValue<BigNumberish>,
      curThreshold: PromiseOrValue<BigNumberish>,
      curVotingperiod: PromiseOrValue<BigNumberish>,
      curTimelockperiod: PromiseOrValue<BigNumberish>,
      curExpirationperiod: PromiseOrValue<BigNumberish>,
      curProposaldeposit: PromiseOrValue<BigNumberish>,
      curSnapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  buildDaoTokenMesage(
    curMsg: SubDaoMessage.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  castVote(
    curPollid: PromiseOrValue<BigNumberish>,
    vote: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createPoll(
    curProposer: PromiseOrValue<string>,
    curDepositamount: PromiseOrValue<BigNumberish>,
    curTitle: PromiseOrValue<string>,
    curDescription: PromiseOrValue<string>,
    curLink: PromiseOrValue<string>,
    curExecuteMsgs: SubDaoStorage.ExecuteDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  endPoll(
    curPollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executePoll(
    curPollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  expirePoll(
    curPollid: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<SubDaoMessage.QueryConfigResponseStructOutput>;

  queryState(
    overrides?: CallOverrides
  ): Promise<SubDaoStorage.StateStructOutput>;

  registerContracts(
    curVetoken: PromiseOrValue<string>,
    curSwapfactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateConfig(
    curOwner: PromiseOrValue<string>,
    curQuorum: PromiseOrValue<BigNumberish>,
    curThreshold: PromiseOrValue<BigNumberish>,
    curVotingperiod: PromiseOrValue<BigNumberish>,
    curTimelockperiod: PromiseOrValue<BigNumberish>,
    curExpirationperiod: PromiseOrValue<BigNumberish>,
    curProposaldeposit: PromiseOrValue<BigNumberish>,
    curSnapshotperiod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buildDaoTokenMesage(
      curMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    castVote(
      curPollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createPoll(
      curProposer: PromiseOrValue<string>,
      curDepositamount: PromiseOrValue<BigNumberish>,
      curTitle: PromiseOrValue<string>,
      curDescription: PromiseOrValue<string>,
      curLink: PromiseOrValue<string>,
      curExecuteMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    endPoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    expirePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<SubDaoMessage.QueryConfigResponseStructOutput>;

    queryState(
      overrides?: CallOverrides
    ): Promise<SubDaoStorage.StateStructOutput>;

    registerContracts(
      curVetoken: PromiseOrValue<string>,
      curSwapfactory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateConfig(
      curOwner: PromiseOrValue<string>,
      curQuorum: PromiseOrValue<BigNumberish>,
      curThreshold: PromiseOrValue<BigNumberish>,
      curVotingperiod: PromiseOrValue<BigNumberish>,
      curTimelockperiod: PromiseOrValue<BigNumberish>,
      curExpirationperiod: PromiseOrValue<BigNumberish>,
      curProposaldeposit: PromiseOrValue<BigNumberish>,
      curSnapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    buildDaoTokenMesage(
      curMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    castVote(
      curPollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createPoll(
      curProposer: PromiseOrValue<string>,
      curDepositamount: PromiseOrValue<BigNumberish>,
      curTitle: PromiseOrValue<string>,
      curDescription: PromiseOrValue<string>,
      curLink: PromiseOrValue<string>,
      curExecuteMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    endPoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    expirePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryState(overrides?: CallOverrides): Promise<BigNumber>;

    registerContracts(
      curVetoken: PromiseOrValue<string>,
      curSwapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateConfig(
      curOwner: PromiseOrValue<string>,
      curQuorum: PromiseOrValue<BigNumberish>,
      curThreshold: PromiseOrValue<BigNumberish>,
      curVotingperiod: PromiseOrValue<BigNumberish>,
      curTimelockperiod: PromiseOrValue<BigNumberish>,
      curExpirationperiod: PromiseOrValue<BigNumberish>,
      curProposaldeposit: PromiseOrValue<BigNumberish>,
      curSnapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buildDaoTokenMesage(
      curMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    castVote(
      curPollid: PromiseOrValue<BigNumberish>,
      vote: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createPoll(
      curProposer: PromiseOrValue<string>,
      curDepositamount: PromiseOrValue<BigNumberish>,
      curTitle: PromiseOrValue<string>,
      curDescription: PromiseOrValue<string>,
      curLink: PromiseOrValue<string>,
      curExecuteMsgs: SubDaoStorage.ExecuteDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    endPoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    expirePoll(
      curPollid: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registerContracts(
      curVetoken: PromiseOrValue<string>,
      curSwapfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateConfig(
      curOwner: PromiseOrValue<string>,
      curQuorum: PromiseOrValue<BigNumberish>,
      curThreshold: PromiseOrValue<BigNumberish>,
      curVotingperiod: PromiseOrValue<BigNumberish>,
      curTimelockperiod: PromiseOrValue<BigNumberish>,
      curExpirationperiod: PromiseOrValue<BigNumberish>,
      curProposaldeposit: PromiseOrValue<BigNumberish>,
      curSnapshotperiod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
