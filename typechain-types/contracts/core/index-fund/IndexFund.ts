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

export declare namespace IndexFundStorage {
  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    fundRotation: PromiseOrValue<BigNumberish>;
    fundMemberLimit: PromiseOrValue<BigNumberish>;
    fundingGoal: PromiseOrValue<BigNumberish>;
    alliance_members: PromiseOrValue<string>[];
  };

  export type ConfigStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    string[]
  ] & {
    owner: string;
    registrarContract: string;
    fundRotation: BigNumber;
    fundMemberLimit: BigNumber;
    fundingGoal: BigNumber;
    alliance_members: string[];
  };

  export type DonationMessagesStruct = {
    member_ids: PromiseOrValue<BigNumberish>[];
    locked_donation_amount: PromiseOrValue<BigNumberish>[];
    liquid_donation_amount: PromiseOrValue<BigNumberish>[];
    lockedSplit: PromiseOrValue<BigNumberish>[];
    liquidSplit: PromiseOrValue<BigNumberish>[];
  };

  export type DonationMessagesStructOutput = [
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ] & {
    member_ids: BigNumber[];
    locked_donation_amount: BigNumber[];
    liquid_donation_amount: BigNumber[];
    lockedSplit: BigNumber[];
    liquidSplit: BigNumber[];
  };

  export type _StateStruct = {
    totalFunds: PromiseOrValue<BigNumberish>;
    activeFund: PromiseOrValue<BigNumberish>;
    round_donations: PromiseOrValue<BigNumberish>;
    nextRotationBlock: PromiseOrValue<BigNumberish>;
    nextFundId: PromiseOrValue<BigNumberish>;
  };

  export type _StateStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    totalFunds: BigNumber;
    activeFund: BigNumber;
    round_donations: BigNumber;
    nextRotationBlock: BigNumber;
    nextFundId: BigNumber;
  };
}

export declare namespace AngelCoreStruct {
  export type IndexFundStruct = {
    id: PromiseOrValue<BigNumberish>;
    name: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    members: PromiseOrValue<BigNumberish>[];
    rotatingFund: PromiseOrValue<boolean>;
    splitToLiquid: PromiseOrValue<BigNumberish>;
    expiryTime: PromiseOrValue<BigNumberish>;
    expiryHeight: PromiseOrValue<BigNumberish>;
  };

  export type IndexFundStructOutput = [
    BigNumber,
    string,
    string,
    BigNumber[],
    boolean,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    id: BigNumber;
    name: string;
    description: string;
    members: BigNumber[];
    rotatingFund: boolean;
    splitToLiquid: BigNumber;
    expiryTime: BigNumber;
    expiryHeight: BigNumber;
  };

  export type AssetBaseStruct = {
    info: PromiseOrValue<BigNumberish>;
    amount: PromiseOrValue<BigNumberish>;
    addr: PromiseOrValue<string>;
    name: PromiseOrValue<string>;
  };

  export type AssetBaseStructOutput = [number, BigNumber, string, string] & {
    info: number;
    amount: BigNumber;
    addr: string;
    name: string;
  };
}

export declare namespace IndexFundMessage {
  export type DepositMsgStruct = {
    fundId: PromiseOrValue<BigNumberish>;
    split: PromiseOrValue<BigNumberish>;
  };

  export type DepositMsgStructOutput = [BigNumber, BigNumber] & {
    fundId: BigNumber;
    split: BigNumber;
  };

  export type InstantiateMessageStruct = {
    registrarContract: PromiseOrValue<string>;
    fundRotation: PromiseOrValue<BigNumberish>;
    fundMemberLimit: PromiseOrValue<BigNumberish>;
    fundingGoal: PromiseOrValue<BigNumberish>;
  };

  export type InstantiateMessageStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    registrarContract: string;
    fundRotation: BigNumber;
    fundMemberLimit: BigNumber;
    fundingGoal: BigNumber;
  };

  export type StateResponseMessageStruct = {
    totalFunds: PromiseOrValue<BigNumberish>;
    activeFund: PromiseOrValue<BigNumberish>;
    round_donations: PromiseOrValue<BigNumberish>;
    nextRotationBlock: PromiseOrValue<BigNumberish>;
  };

  export type StateResponseMessageStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    totalFunds: BigNumber;
    activeFund: BigNumber;
    round_donations: BigNumber;
    nextRotationBlock: BigNumber;
  };

  export type UpdateConfigMessageStruct = {
    fundRotation: PromiseOrValue<BigNumberish>;
    fundMemberLimit: PromiseOrValue<BigNumberish>;
    fundingGoal: PromiseOrValue<BigNumberish>;
  };

  export type UpdateConfigMessageStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    fundRotation: BigNumber;
    fundMemberLimit: BigNumber;
    fundingGoal: BigNumber;
  };
}

export interface IndexFundInterface extends utils.Interface {
  functions: {
    "createIndexFund(string,string,uint256[],bool,uint256,uint256,uint256)": FunctionFragment;
    "depositERC20(address,(uint256,uint256),(uint8,uint256,address,string))": FunctionFragment;
    "initIndexFund((address,uint256,uint256,uint256))": FunctionFragment;
    "queryActiveFundDetails()": FunctionFragment;
    "queryAllianceMembers(uint256,uint256)": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "queryFundDetails(uint256)": FunctionFragment;
    "queryFundsList(uint256,uint256)": FunctionFragment;
    "queryInvolvedFunds(uint256)": FunctionFragment;
    "queryState()": FunctionFragment;
    "removeIndexFund(uint256)": FunctionFragment;
    "removeMember(uint256)": FunctionFragment;
    "updateAllianceMemberList(address,string)": FunctionFragment;
    "updateConfig((uint256,uint256,uint256))": FunctionFragment;
    "updateFundMembers(uint256,uint256[],uint256[])": FunctionFragment;
    "updateOwner(address)": FunctionFragment;
    "updateRegistrar(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createIndexFund"
      | "depositERC20"
      | "initIndexFund"
      | "queryActiveFundDetails"
      | "queryAllianceMembers"
      | "queryConfig"
      | "queryFundDetails"
      | "queryFundsList"
      | "queryInvolvedFunds"
      | "queryState"
      | "removeIndexFund"
      | "removeMember"
      | "updateAllianceMemberList"
      | "updateConfig"
      | "updateFundMembers"
      | "updateOwner"
      | "updateRegistrar"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createIndexFund",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "depositERC20",
    values: [
      PromiseOrValue<string>,
      IndexFundMessage.DepositMsgStruct,
      AngelCoreStruct.AssetBaseStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initIndexFund",
    values: [IndexFundMessage.InstantiateMessageStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "queryActiveFundDetails",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queryAllianceMembers",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "queryConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queryFundDetails",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "queryFundsList",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "queryInvolvedFunds",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "queryState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeIndexFund",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMember",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateAllianceMemberList",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [IndexFundMessage.UpdateConfigMessageStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "updateFundMembers",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRegistrar",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "createIndexFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initIndexFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryActiveFundDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryAllianceMembers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryFundDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryFundsList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryInvolvedFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "queryState", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeIndexFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeMember",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateAllianceMemberList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateFundMembers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRegistrar",
    data: BytesLike
  ): Result;

  events: {
    "AllianceMemberAdded(address)": EventFragment;
    "AllianceMemberRemoved(address)": EventFragment;
    "ConfigUpdated(tuple)": EventFragment;
    "DonationMessagesUpdated(tuple)": EventFragment;
    "IndexFundCreated(uint256,tuple)": EventFragment;
    "IndexFundRemoved(uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "MemberAdded(uint256,uint256)": EventFragment;
    "MemberRemoved(uint256,uint256)": EventFragment;
    "OwnerUpdated(address)": EventFragment;
    "RegistrarUpdated(address)": EventFragment;
    "UpdateActiveFund(uint256)": EventFragment;
    "UpdateIndexFundState(tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AllianceMemberAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AllianceMemberRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ConfigUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationMessagesUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IndexFundCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IndexFundRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MemberAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MemberRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RegistrarUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateActiveFund"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateIndexFundState"): EventFragment;
}

export interface AllianceMemberAddedEventObject {
  member: string;
}
export type AllianceMemberAddedEvent = TypedEvent<
  [string],
  AllianceMemberAddedEventObject
>;

export type AllianceMemberAddedEventFilter =
  TypedEventFilter<AllianceMemberAddedEvent>;

export interface AllianceMemberRemovedEventObject {
  member: string;
}
export type AllianceMemberRemovedEvent = TypedEvent<
  [string],
  AllianceMemberRemovedEventObject
>;

export type AllianceMemberRemovedEventFilter =
  TypedEventFilter<AllianceMemberRemovedEvent>;

export interface ConfigUpdatedEventObject {
  config: IndexFundStorage.ConfigStructOutput;
}
export type ConfigUpdatedEvent = TypedEvent<
  [IndexFundStorage.ConfigStructOutput],
  ConfigUpdatedEventObject
>;

export type ConfigUpdatedEventFilter = TypedEventFilter<ConfigUpdatedEvent>;

export interface DonationMessagesUpdatedEventObject {
  messages: IndexFundStorage.DonationMessagesStructOutput;
}
export type DonationMessagesUpdatedEvent = TypedEvent<
  [IndexFundStorage.DonationMessagesStructOutput],
  DonationMessagesUpdatedEventObject
>;

export type DonationMessagesUpdatedEventFilter =
  TypedEventFilter<DonationMessagesUpdatedEvent>;

export interface IndexFundCreatedEventObject {
  id: BigNumber;
  fund: AngelCoreStruct.IndexFundStructOutput;
}
export type IndexFundCreatedEvent = TypedEvent<
  [BigNumber, AngelCoreStruct.IndexFundStructOutput],
  IndexFundCreatedEventObject
>;

export type IndexFundCreatedEventFilter =
  TypedEventFilter<IndexFundCreatedEvent>;

export interface IndexFundRemovedEventObject {
  id: BigNumber;
}
export type IndexFundRemovedEvent = TypedEvent<
  [BigNumber],
  IndexFundRemovedEventObject
>;

export type IndexFundRemovedEventFilter =
  TypedEventFilter<IndexFundRemovedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface MemberAddedEventObject {
  fundId: BigNumber;
  memberId: BigNumber;
}
export type MemberAddedEvent = TypedEvent<
  [BigNumber, BigNumber],
  MemberAddedEventObject
>;

export type MemberAddedEventFilter = TypedEventFilter<MemberAddedEvent>;

export interface MemberRemovedEventObject {
  fundId: BigNumber;
  memberId: BigNumber;
}
export type MemberRemovedEvent = TypedEvent<
  [BigNumber, BigNumber],
  MemberRemovedEventObject
>;

export type MemberRemovedEventFilter = TypedEventFilter<MemberRemovedEvent>;

export interface OwnerUpdatedEventObject {
  newOwner: string;
}
export type OwnerUpdatedEvent = TypedEvent<[string], OwnerUpdatedEventObject>;

export type OwnerUpdatedEventFilter = TypedEventFilter<OwnerUpdatedEvent>;

export interface RegistrarUpdatedEventObject {
  newRegistrar: string;
}
export type RegistrarUpdatedEvent = TypedEvent<
  [string],
  RegistrarUpdatedEventObject
>;

export type RegistrarUpdatedEventFilter =
  TypedEventFilter<RegistrarUpdatedEvent>;

export interface UpdateActiveFundEventObject {
  fundId: BigNumber;
}
export type UpdateActiveFundEvent = TypedEvent<
  [BigNumber],
  UpdateActiveFundEventObject
>;

export type UpdateActiveFundEventFilter =
  TypedEventFilter<UpdateActiveFundEvent>;

export interface UpdateIndexFundStateEventObject {
  state: IndexFundStorage._StateStructOutput;
}
export type UpdateIndexFundStateEvent = TypedEvent<
  [IndexFundStorage._StateStructOutput],
  UpdateIndexFundStateEventObject
>;

export type UpdateIndexFundStateEventFilter =
  TypedEventFilter<UpdateIndexFundStateEvent>;

export interface IndexFund extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IndexFundInterface;

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
    createIndexFund(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      members: PromiseOrValue<BigNumberish>[],
      rotatingFund: PromiseOrValue<boolean>,
      splitToLiquid: PromiseOrValue<BigNumberish>,
      expiryTime: PromiseOrValue<BigNumberish>,
      expiryHeight: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    depositERC20(
      senderAddr: PromiseOrValue<string>,
      curDetails: IndexFundMessage.DepositMsgStruct,
      fund: AngelCoreStruct.AssetBaseStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initIndexFund(
      curDetails: IndexFundMessage.InstantiateMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryActiveFundDetails(
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.IndexFundStructOutput]>;

    queryAllianceMembers(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[IndexFundStorage.ConfigStructOutput]>;

    queryFundDetails(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.IndexFundStructOutput]>;

    queryFundsList(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.IndexFundStructOutput[]]>;

    queryInvolvedFunds(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.IndexFundStructOutput[]]>;

    queryState(
      overrides?: CallOverrides
    ): Promise<[IndexFundMessage.StateResponseMessageStructOutput]>;

    removeIndexFund(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeMember(
      member: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateAllianceMemberList(
      addr: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateConfig(
      curDetails: IndexFundMessage.UpdateConfigMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateFundMembers(
      fundId: PromiseOrValue<BigNumberish>,
      add: PromiseOrValue<BigNumberish>[],
      remove: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateRegistrar(
      newRegistrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createIndexFund(
    name: PromiseOrValue<string>,
    description: PromiseOrValue<string>,
    members: PromiseOrValue<BigNumberish>[],
    rotatingFund: PromiseOrValue<boolean>,
    splitToLiquid: PromiseOrValue<BigNumberish>,
    expiryTime: PromiseOrValue<BigNumberish>,
    expiryHeight: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  depositERC20(
    senderAddr: PromiseOrValue<string>,
    curDetails: IndexFundMessage.DepositMsgStruct,
    fund: AngelCoreStruct.AssetBaseStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initIndexFund(
    curDetails: IndexFundMessage.InstantiateMessageStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryActiveFundDetails(
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.IndexFundStructOutput>;

  queryAllianceMembers(
    startAfter: PromiseOrValue<BigNumberish>,
    limit: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<IndexFundStorage.ConfigStructOutput>;

  queryFundDetails(
    fundId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.IndexFundStructOutput>;

  queryFundsList(
    startAfter: PromiseOrValue<BigNumberish>,
    limit: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.IndexFundStructOutput[]>;

  queryInvolvedFunds(
    endowmentId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.IndexFundStructOutput[]>;

  queryState(
    overrides?: CallOverrides
  ): Promise<IndexFundMessage.StateResponseMessageStructOutput>;

  removeIndexFund(
    fundId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeMember(
    member: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateAllianceMemberList(
    addr: PromiseOrValue<string>,
    action: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateConfig(
    curDetails: IndexFundMessage.UpdateConfigMessageStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateFundMembers(
    fundId: PromiseOrValue<BigNumberish>,
    add: PromiseOrValue<BigNumberish>[],
    remove: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateOwner(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateRegistrar(
    newRegistrar: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createIndexFund(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      members: PromiseOrValue<BigNumberish>[],
      rotatingFund: PromiseOrValue<boolean>,
      splitToLiquid: PromiseOrValue<BigNumberish>,
      expiryTime: PromiseOrValue<BigNumberish>,
      expiryHeight: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    depositERC20(
      senderAddr: PromiseOrValue<string>,
      curDetails: IndexFundMessage.DepositMsgStruct,
      fund: AngelCoreStruct.AssetBaseStruct,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initIndexFund(
      curDetails: IndexFundMessage.InstantiateMessageStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    queryActiveFundDetails(
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.IndexFundStructOutput>;

    queryAllianceMembers(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<IndexFundStorage.ConfigStructOutput>;

    queryFundDetails(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.IndexFundStructOutput>;

    queryFundsList(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.IndexFundStructOutput[]>;

    queryInvolvedFunds(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.IndexFundStructOutput[]>;

    queryState(
      overrides?: CallOverrides
    ): Promise<IndexFundMessage.StateResponseMessageStructOutput>;

    removeIndexFund(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    removeMember(
      member: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateAllianceMemberList(
      addr: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateConfig(
      curDetails: IndexFundMessage.UpdateConfigMessageStruct,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateFundMembers(
      fundId: PromiseOrValue<BigNumberish>,
      add: PromiseOrValue<BigNumberish>[],
      remove: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateRegistrar(
      newRegistrar: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "AllianceMemberAdded(address)"(
      member?: null
    ): AllianceMemberAddedEventFilter;
    AllianceMemberAdded(member?: null): AllianceMemberAddedEventFilter;

    "AllianceMemberRemoved(address)"(
      member?: null
    ): AllianceMemberRemovedEventFilter;
    AllianceMemberRemoved(member?: null): AllianceMemberRemovedEventFilter;

    "ConfigUpdated(tuple)"(config?: null): ConfigUpdatedEventFilter;
    ConfigUpdated(config?: null): ConfigUpdatedEventFilter;

    "DonationMessagesUpdated(tuple)"(
      messages?: null
    ): DonationMessagesUpdatedEventFilter;
    DonationMessagesUpdated(
      messages?: null
    ): DonationMessagesUpdatedEventFilter;

    "IndexFundCreated(uint256,tuple)"(
      id?: null,
      fund?: null
    ): IndexFundCreatedEventFilter;
    IndexFundCreated(id?: null, fund?: null): IndexFundCreatedEventFilter;

    "IndexFundRemoved(uint256)"(id?: null): IndexFundRemovedEventFilter;
    IndexFundRemoved(id?: null): IndexFundRemovedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "MemberAdded(uint256,uint256)"(
      fundId?: null,
      memberId?: null
    ): MemberAddedEventFilter;
    MemberAdded(fundId?: null, memberId?: null): MemberAddedEventFilter;

    "MemberRemoved(uint256,uint256)"(
      fundId?: null,
      memberId?: null
    ): MemberRemovedEventFilter;
    MemberRemoved(fundId?: null, memberId?: null): MemberRemovedEventFilter;

    "OwnerUpdated(address)"(newOwner?: null): OwnerUpdatedEventFilter;
    OwnerUpdated(newOwner?: null): OwnerUpdatedEventFilter;

    "RegistrarUpdated(address)"(
      newRegistrar?: null
    ): RegistrarUpdatedEventFilter;
    RegistrarUpdated(newRegistrar?: null): RegistrarUpdatedEventFilter;

    "UpdateActiveFund(uint256)"(fundId?: null): UpdateActiveFundEventFilter;
    UpdateActiveFund(fundId?: null): UpdateActiveFundEventFilter;

    "UpdateIndexFundState(tuple)"(
      state?: null
    ): UpdateIndexFundStateEventFilter;
    UpdateIndexFundState(state?: null): UpdateIndexFundStateEventFilter;
  };

  estimateGas: {
    createIndexFund(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      members: PromiseOrValue<BigNumberish>[],
      rotatingFund: PromiseOrValue<boolean>,
      splitToLiquid: PromiseOrValue<BigNumberish>,
      expiryTime: PromiseOrValue<BigNumberish>,
      expiryHeight: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    depositERC20(
      senderAddr: PromiseOrValue<string>,
      curDetails: IndexFundMessage.DepositMsgStruct,
      fund: AngelCoreStruct.AssetBaseStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initIndexFund(
      curDetails: IndexFundMessage.InstantiateMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryActiveFundDetails(overrides?: CallOverrides): Promise<BigNumber>;

    queryAllianceMembers(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryFundDetails(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryFundsList(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryInvolvedFunds(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryState(overrides?: CallOverrides): Promise<BigNumber>;

    removeIndexFund(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeMember(
      member: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateAllianceMemberList(
      addr: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateConfig(
      curDetails: IndexFundMessage.UpdateConfigMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateFundMembers(
      fundId: PromiseOrValue<BigNumberish>,
      add: PromiseOrValue<BigNumberish>[],
      remove: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateRegistrar(
      newRegistrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createIndexFund(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      members: PromiseOrValue<BigNumberish>[],
      rotatingFund: PromiseOrValue<boolean>,
      splitToLiquid: PromiseOrValue<BigNumberish>,
      expiryTime: PromiseOrValue<BigNumberish>,
      expiryHeight: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    depositERC20(
      senderAddr: PromiseOrValue<string>,
      curDetails: IndexFundMessage.DepositMsgStruct,
      fund: AngelCoreStruct.AssetBaseStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initIndexFund(
      curDetails: IndexFundMessage.InstantiateMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryActiveFundDetails(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryAllianceMembers(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryFundDetails(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryFundsList(
      startAfter: PromiseOrValue<BigNumberish>,
      limit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryInvolvedFunds(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeIndexFund(
      fundId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeMember(
      member: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateAllianceMemberList(
      addr: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateConfig(
      curDetails: IndexFundMessage.UpdateConfigMessageStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateFundMembers(
      fundId: PromiseOrValue<BigNumberish>,
      add: PromiseOrValue<BigNumberish>[],
      remove: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateRegistrar(
      newRegistrar: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
