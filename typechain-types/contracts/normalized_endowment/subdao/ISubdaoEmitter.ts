/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
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
    existingData: PromiseOrValue<string>;
    newInitialSupply: PromiseOrValue<BigNumberish>;
    newName: PromiseOrValue<string>;
    newSymbol: PromiseOrValue<string>;
    veBondingType: AngelCoreStruct.VeTypeStruct;
    veBondingName: PromiseOrValue<string>;
    veBondingSymbol: PromiseOrValue<string>;
    veBondingDecimals: PromiseOrValue<BigNumberish>;
    veBondingReserveDenom: PromiseOrValue<string>;
    veBondingReserveDecimals: PromiseOrValue<BigNumberish>;
    veBondingPeriod: PromiseOrValue<BigNumberish>;
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
    existingData: string;
    newInitialSupply: BigNumber;
    newName: string;
    newSymbol: string;
    veBondingType: AngelCoreStruct.VeTypeStructOutput;
    veBondingName: string;
    veBondingSymbol: string;
    veBondingDecimals: BigNumber;
    veBondingReserveDenom: string;
    veBondingReserveDecimals: BigNumber;
    veBondingPeriod: BigNumber;
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
}

export declare namespace SubDaoStorage {
  export type ConfigStruct = {
    registrarContract: PromiseOrValue<string>;
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

  export type ConfigStructOutput = [
    string,
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
    registrarContract: string;
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

  export type PollStruct = {
    id: PromiseOrValue<BigNumberish>;
    creator: PromiseOrValue<string>;
    status: PromiseOrValue<BigNumberish>;
    yesVotes: PromiseOrValue<BigNumberish>;
    noVotes: PromiseOrValue<BigNumberish>;
    startBlock: PromiseOrValue<BigNumberish>;
    startTime: PromiseOrValue<BigNumberish>;
    endHeight: PromiseOrValue<BigNumberish>;
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    link: PromiseOrValue<string>;
    executeData: SubDaoStorage.ExecuteDataStruct;
    depositAmount: PromiseOrValue<BigNumberish>;
    totalBalanceAtEndPoll: PromiseOrValue<BigNumberish>;
    stakedAmount: PromiseOrValue<BigNumberish>;
  };

  export type PollStructOutput = [
    BigNumber,
    string,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    SubDaoStorage.ExecuteDataStructOutput,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    id: BigNumber;
    creator: string;
    status: number;
    yesVotes: BigNumber;
    noVotes: BigNumber;
    startBlock: BigNumber;
    startTime: BigNumber;
    endHeight: BigNumber;
    title: string;
    description: string;
    link: string;
    executeData: SubDaoStorage.ExecuteDataStructOutput;
    depositAmount: BigNumber;
    totalBalanceAtEndPoll: BigNumber;
    stakedAmount: BigNumber;
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

  export type VoterInfoStruct = {
    vote: PromiseOrValue<BigNumberish>;
    balance: PromiseOrValue<BigNumberish>;
    voted: PromiseOrValue<boolean>;
  };

  export type VoterInfoStructOutput = [number, BigNumber, boolean] & {
    vote: number;
    balance: BigNumber;
    voted: boolean;
  };
}

export interface ISubdaoEmitterInterface extends utils.Interface {
  functions: {
    "initializeSubdao(address,(uint32,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,(uint8,(address,uint256,string,string,(uint8,(uint128,uint256,uint128,uint128)),string,string,uint256,address,uint256,uint256)),uint8,address,address))": FunctionFragment;
    "transferFromSubdao(address,address,address,uint256)": FunctionFragment;
    "transferSubdao(address,address,uint256)": FunctionFragment;
    "updateSubdaoConfig((address,address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256))": FunctionFragment;
    "updateSubdaoPoll(uint256,(uint256,address,uint8,uint256,uint256,uint256,uint256,uint256,string,string,string,(uint256[],address[],bytes[]),uint256,uint256,uint256))": FunctionFragment;
    "updateSubdaoPollAndStatus(uint256,(uint256,address,uint8,uint256,uint256,uint256,uint256,uint256,string,string,string,(uint256[],address[],bytes[]),uint256,uint256,uint256),uint8)": FunctionFragment;
    "updateSubdaoState((uint256,uint256,uint256))": FunctionFragment;
    "updateVotingStatus(uint256,address,(uint8,uint256,bool))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "initializeSubdao"
      | "transferFromSubdao"
      | "transferSubdao"
      | "updateSubdaoConfig"
      | "updateSubdaoPoll"
      | "updateSubdaoPollAndStatus"
      | "updateSubdaoState"
      | "updateVotingStatus"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "initializeSubdao",
    values: [PromiseOrValue<string>, SubDaoMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFromSubdao",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferSubdao",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSubdaoConfig",
    values: [SubDaoStorage.ConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSubdaoPoll",
    values: [PromiseOrValue<BigNumberish>, SubDaoStorage.PollStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSubdaoPollAndStatus",
    values: [
      PromiseOrValue<BigNumberish>,
      SubDaoStorage.PollStruct,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSubdaoState",
    values: [SubDaoStorage.StateStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVotingStatus",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      SubDaoStorage.VoterInfoStruct
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "initializeSubdao",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFromSubdao",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferSubdao",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSubdaoConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSubdaoPoll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSubdaoPollAndStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSubdaoState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVotingStatus",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ISubdaoEmitter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISubdaoEmitterInterface;

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
    initializeSubdao(
      subdao: PromiseOrValue<string>,
      instantiateMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferFromSubdao(
      tokenAddress: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferSubdao(
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSubdaoConfig(
      config: SubDaoStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSubdaoPoll(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSubdaoPollAndStatus(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      pollStatus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSubdaoState(
      state: SubDaoStorage.StateStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateVotingStatus(
      pollId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      voterInfo: SubDaoStorage.VoterInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  initializeSubdao(
    subdao: PromiseOrValue<string>,
    instantiateMsg: SubDaoMessage.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferFromSubdao(
    tokenAddress: PromiseOrValue<string>,
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferSubdao(
    tokenAddress: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSubdaoConfig(
    config: SubDaoStorage.ConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSubdaoPoll(
    id: PromiseOrValue<BigNumberish>,
    poll: SubDaoStorage.PollStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSubdaoPollAndStatus(
    id: PromiseOrValue<BigNumberish>,
    poll: SubDaoStorage.PollStruct,
    pollStatus: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSubdaoState(
    state: SubDaoStorage.StateStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateVotingStatus(
    pollId: PromiseOrValue<BigNumberish>,
    voter: PromiseOrValue<string>,
    voterInfo: SubDaoStorage.VoterInfoStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    initializeSubdao(
      subdao: PromiseOrValue<string>,
      instantiateMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    transferFromSubdao(
      tokenAddress: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferSubdao(
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSubdaoConfig(
      config: SubDaoStorage.ConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSubdaoPoll(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSubdaoPollAndStatus(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      pollStatus: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSubdaoState(
      state: SubDaoStorage.StateStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    updateVotingStatus(
      pollId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      voterInfo: SubDaoStorage.VoterInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    initializeSubdao(
      subdao: PromiseOrValue<string>,
      instantiateMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferFromSubdao(
      tokenAddress: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferSubdao(
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSubdaoConfig(
      config: SubDaoStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSubdaoPoll(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSubdaoPollAndStatus(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      pollStatus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSubdaoState(
      state: SubDaoStorage.StateStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateVotingStatus(
      pollId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      voterInfo: SubDaoStorage.VoterInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    initializeSubdao(
      subdao: PromiseOrValue<string>,
      instantiateMsg: SubDaoMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferFromSubdao(
      tokenAddress: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferSubdao(
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSubdaoConfig(
      config: SubDaoStorage.ConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSubdaoPoll(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSubdaoPollAndStatus(
      id: PromiseOrValue<BigNumberish>,
      poll: SubDaoStorage.PollStruct,
      pollStatus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSubdaoState(
      state: SubDaoStorage.StateStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateVotingStatus(
      pollId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      voterInfo: SubDaoStorage.VoterInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
