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
} from "../../../common";

export type CampaignStruct = {
  creator: PromiseOrValue<string>;
  open: PromiseOrValue<boolean>;
  success: PromiseOrValue<boolean>;
  title: PromiseOrValue<string>;
  description: PromiseOrValue<string>;
  imageUrl: PromiseOrValue<string>;
  endTimeEpoch: PromiseOrValue<BigNumberish>;
  fundingGoal: AngelCoreStruct.GenericBalanceStruct;
  fundingThreshold: AngelCoreStruct.GenericBalanceStruct;
  lockedBalance: AngelCoreStruct.GenericBalanceStruct;
  contributedBalance: AngelCoreStruct.GenericBalanceStruct;
  contributors: PromiseOrValue<string>[];
};

export type CampaignStructOutput = [
  string,
  boolean,
  boolean,
  string,
  string,
  string,
  BigNumber,
  AngelCoreStruct.GenericBalanceStructOutput,
  AngelCoreStruct.GenericBalanceStructOutput,
  AngelCoreStruct.GenericBalanceStructOutput,
  AngelCoreStruct.GenericBalanceStructOutput,
  string[]
] & {
  creator: string;
  open: boolean;
  success: boolean;
  title: string;
  description: string;
  imageUrl: string;
  endTimeEpoch: BigNumber;
  fundingGoal: AngelCoreStruct.GenericBalanceStructOutput;
  fundingThreshold: AngelCoreStruct.GenericBalanceStructOutput;
  lockedBalance: AngelCoreStruct.GenericBalanceStructOutput;
  contributedBalance: AngelCoreStruct.GenericBalanceStructOutput;
  contributors: string[];
};

export type BalanceStruct = {
  coinNativeAmount: PromiseOrValue<BigNumberish>;
  cw20Addr: PromiseOrValue<string>;
  cw20Amount: PromiseOrValue<BigNumberish>;
};

export type BalanceStructOutput = [BigNumber, string, BigNumber] & {
  coinNativeAmount: BigNumber;
  cw20Addr: string;
  cw20Amount: BigNumber;
};

export declare namespace AngelCoreStruct {
  export type GenericBalanceStruct = {
    coinNativeAmount: PromiseOrValue<BigNumberish>;
    Cw20CoinVerified_amount: PromiseOrValue<BigNumberish>[];
    Cw20CoinVerified_addr: PromiseOrValue<string>[];
  };

  export type GenericBalanceStructOutput = [
    BigNumber,
    BigNumber[],
    string[]
  ] & {
    coinNativeAmount: BigNumber;
    Cw20CoinVerified_amount: BigNumber[];
    Cw20CoinVerified_addr: string[];
  };

  export type SplitDetailsStruct = {
    max: PromiseOrValue<BigNumberish>;
    min: PromiseOrValue<BigNumberish>;
    defaultSplit: PromiseOrValue<BigNumberish>;
  };

  export type SplitDetailsStructOutput = [BigNumber, BigNumber, BigNumber] & {
    max: BigNumber;
    min: BigNumber;
    defaultSplit: BigNumber;
  };

  export type AcceptedTokensStruct = { cw20: PromiseOrValue<string>[] };

  export type AcceptedTokensStructOutput = [string[]] & { cw20: string[] };

  export type RebalanceDetailsStruct = {
    rebalanceLiquidInvestedProfits: PromiseOrValue<boolean>;
    lockedInterestsToLiquid: PromiseOrValue<boolean>;
    interest_distribution: PromiseOrValue<BigNumberish>;
    lockedPrincipleToLiquid: PromiseOrValue<boolean>;
    principle_distribution: PromiseOrValue<BigNumberish>;
  };

  export type RebalanceDetailsStructOutput = [
    boolean,
    boolean,
    BigNumber,
    boolean,
    BigNumber
  ] & {
    rebalanceLiquidInvestedProfits: boolean;
    lockedInterestsToLiquid: boolean;
    interest_distribution: BigNumber;
    lockedPrincipleToLiquid: boolean;
    principle_distribution: BigNumber;
  };
}

export declare namespace FundraisingStorage {
  export type ConfigStruct = {
    registrarContract: PromiseOrValue<string>;
    nextId: PromiseOrValue<BigNumberish>;
    campaignPeriodSeconds: PromiseOrValue<BigNumberish>;
    taxRate: PromiseOrValue<BigNumberish>;
    acceptedTokens: AngelCoreStruct.GenericBalanceStruct;
  };

  export type ConfigStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.GenericBalanceStructOutput
  ] & {
    registrarContract: string;
    nextId: BigNumber;
    campaignPeriodSeconds: BigNumber;
    taxRate: BigNumber;
    acceptedTokens: AngelCoreStruct.GenericBalanceStructOutput;
  };

  export type ContributorInfoStruct = {
    campaign: PromiseOrValue<BigNumberish>;
    balance: AngelCoreStruct.GenericBalanceStruct;
    rewardsClaimed: PromiseOrValue<boolean>;
    contributionRefunded: PromiseOrValue<boolean>;
    exists: PromiseOrValue<boolean>;
  };

  export type ContributorInfoStructOutput = [
    BigNumber,
    AngelCoreStruct.GenericBalanceStructOutput,
    boolean,
    boolean,
    boolean
  ] & {
    campaign: BigNumber;
    balance: AngelCoreStruct.GenericBalanceStructOutput;
    rewardsClaimed: boolean;
    contributionRefunded: boolean;
    exists: boolean;
  };
}

export declare namespace FundraisingMessage {
  export type CreateMsgStruct = {
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    imageUrl: PromiseOrValue<string>;
    endTimeEpoch: PromiseOrValue<BigNumberish>;
    fundingGoal: AngelCoreStruct.GenericBalanceStruct;
    rewardThreshold: PromiseOrValue<BigNumberish>;
  };

  export type CreateMsgStructOutput = [
    string,
    string,
    string,
    BigNumber,
    AngelCoreStruct.GenericBalanceStructOutput,
    BigNumber
  ] & {
    title: string;
    description: string;
    imageUrl: string;
    endTimeEpoch: BigNumber;
    fundingGoal: AngelCoreStruct.GenericBalanceStructOutput;
    rewardThreshold: BigNumber;
  };

  export type InstantiateMsgStruct = {
    registrarContract: PromiseOrValue<string>;
    nextId: PromiseOrValue<BigNumberish>;
    campaignPeriodSeconds: PromiseOrValue<BigNumberish>;
    taxRate: PromiseOrValue<BigNumberish>;
    acceptedTokens: AngelCoreStruct.GenericBalanceStruct;
  };

  export type InstantiateMsgStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.GenericBalanceStructOutput
  ] & {
    registrarContract: string;
    nextId: BigNumber;
    campaignPeriodSeconds: BigNumber;
    taxRate: BigNumber;
    acceptedTokens: AngelCoreStruct.GenericBalanceStructOutput;
  };

  export type DetailsResponseStruct = {
    id: PromiseOrValue<BigNumberish>;
    creator: PromiseOrValue<string>;
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    imageUrl: PromiseOrValue<string>;
    endTimeEpoch: PromiseOrValue<BigNumberish>;
    fundingGoal: AngelCoreStruct.GenericBalanceStruct;
    fundingThreshold: AngelCoreStruct.GenericBalanceStruct;
    lockedBalance: AngelCoreStruct.GenericBalanceStruct;
    contributedBalance: AngelCoreStruct.GenericBalanceStruct;
    contributorCount: PromiseOrValue<BigNumberish>;
    success: PromiseOrValue<boolean>;
    open: PromiseOrValue<boolean>;
  };

  export type DetailsResponseStructOutput = [
    BigNumber,
    string,
    string,
    string,
    string,
    BigNumber,
    AngelCoreStruct.GenericBalanceStructOutput,
    AngelCoreStruct.GenericBalanceStructOutput,
    AngelCoreStruct.GenericBalanceStructOutput,
    AngelCoreStruct.GenericBalanceStructOutput,
    BigNumber,
    boolean,
    boolean
  ] & {
    id: BigNumber;
    creator: string;
    title: string;
    description: string;
    imageUrl: string;
    endTimeEpoch: BigNumber;
    fundingGoal: AngelCoreStruct.GenericBalanceStructOutput;
    fundingThreshold: AngelCoreStruct.GenericBalanceStructOutput;
    lockedBalance: AngelCoreStruct.GenericBalanceStructOutput;
    contributedBalance: AngelCoreStruct.GenericBalanceStructOutput;
    contributorCount: BigNumber;
    success: boolean;
    open: boolean;
  };
}

export declare namespace RegistrarStorage {
  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    applicationsReview: PromiseOrValue<string>;
    indexFundContract: PromiseOrValue<string>;
    accountsContract: PromiseOrValue<string>;
    treasury: PromiseOrValue<string>;
    subdaoGovCode: PromiseOrValue<string>;
    subdaoCw20TokenCode: PromiseOrValue<string>;
    subdaoBondingTokenCode: PromiseOrValue<string>;
    subdaoCw900Code: PromiseOrValue<string>;
    subdaoDistributorCode: PromiseOrValue<string>;
    subdaoEmitter: PromiseOrValue<string>;
    donationMatchCode: PromiseOrValue<string>;
    donationMatchCharitesContract: PromiseOrValue<string>;
    donationMatchEmitter: PromiseOrValue<string>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
    haloToken: PromiseOrValue<string>;
    haloTokenLpContract: PromiseOrValue<string>;
    govContract: PromiseOrValue<string>;
    collectorAddr: PromiseOrValue<string>;
    collectorShare: PromiseOrValue<BigNumberish>;
    charitySharesContract: PromiseOrValue<string>;
    acceptedTokens: AngelCoreStruct.AcceptedTokensStruct;
    fundraisingContract: PromiseOrValue<string>;
    rebalance: AngelCoreStruct.RebalanceDetailsStruct;
    swapsRouter: PromiseOrValue<string>;
    multisigFactory: PromiseOrValue<string>;
    multisigEmitter: PromiseOrValue<string>;
    charityProposal: PromiseOrValue<string>;
    lockedWithdrawal: PromiseOrValue<string>;
    proxyAdmin: PromiseOrValue<string>;
    usdcAddress: PromiseOrValue<string>;
    wethAddress: PromiseOrValue<string>;
    cw900lvAddress: PromiseOrValue<string>;
  };

  export type ConfigStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    AngelCoreStruct.SplitDetailsStructOutput,
    string,
    string,
    string,
    string,
    BigNumber,
    string,
    AngelCoreStruct.AcceptedTokensStructOutput,
    string,
    AngelCoreStruct.RebalanceDetailsStructOutput,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ] & {
    owner: string;
    applicationsReview: string;
    indexFundContract: string;
    accountsContract: string;
    treasury: string;
    subdaoGovCode: string;
    subdaoCw20TokenCode: string;
    subdaoBondingTokenCode: string;
    subdaoCw900Code: string;
    subdaoDistributorCode: string;
    subdaoEmitter: string;
    donationMatchCode: string;
    donationMatchCharitesContract: string;
    donationMatchEmitter: string;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
    haloToken: string;
    haloTokenLpContract: string;
    govContract: string;
    collectorAddr: string;
    collectorShare: BigNumber;
    charitySharesContract: string;
    acceptedTokens: AngelCoreStruct.AcceptedTokensStructOutput;
    fundraisingContract: string;
    rebalance: AngelCoreStruct.RebalanceDetailsStructOutput;
    swapsRouter: string;
    multisigFactory: string;
    multisigEmitter: string;
    charityProposal: string;
    lockedWithdrawal: string;
    proxyAdmin: string;
    usdcAddress: string;
    wethAddress: string;
    cw900lvAddress: string;
  };
}

export interface FundraisingInterface extends utils.Interface {
  functions: {
    "executeClaimRewards(uint256)": FunctionFragment;
    "executeCloseCampaign(uint256)": FunctionFragment;
    "executeContribute(uint256,(uint256,address,uint256))": FunctionFragment;
    "executeCreate(uint256,(string,string,string,uint256,(uint256,uint256[],address[]),uint256),(uint256,address,uint256),address)": FunctionFragment;
    "executeRefundContributions(uint256)": FunctionFragment;
    "executeTopUp(uint256,(uint256,address,uint256))": FunctionFragment;
    "executeUpdateConfig(uint256,uint256,(uint256,uint256[],address[]))": FunctionFragment;
    "getRegistrarConfig()": FunctionFragment;
    "initFundraising((address,uint256,uint256,uint256,(uint256,uint256[],address[])))": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "queryDetails(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "executeClaimRewards"
      | "executeCloseCampaign"
      | "executeContribute"
      | "executeCreate"
      | "executeRefundContributions"
      | "executeTopUp"
      | "executeUpdateConfig"
      | "getRegistrarConfig"
      | "initFundraising"
      | "queryConfig"
      | "queryDetails"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeClaimRewards",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeCloseCampaign",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeContribute",
    values: [PromiseOrValue<BigNumberish>, BalanceStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "executeCreate",
    values: [
      PromiseOrValue<BigNumberish>,
      FundraisingMessage.CreateMsgStruct,
      BalanceStruct,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeRefundContributions",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeTopUp",
    values: [PromiseOrValue<BigNumberish>, BalanceStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "executeUpdateConfig",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      AngelCoreStruct.GenericBalanceStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistrarConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initFundraising",
    values: [FundraisingMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "queryConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queryDetails",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "executeClaimRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeCloseCampaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeContribute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeCreate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeRefundContributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeTopUp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeUpdateConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistrarConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initFundraising",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryDetails",
    data: BytesLike
  ): Result;

  events: {
    "FundraisingCampaignCreated(uint256,tuple)": EventFragment;
    "FundraisingCampaignUpdated(uint256,tuple)": EventFragment;
    "FundraisingConfigUpdated(tuple)": EventFragment;
    "FundraisingContributionRefunded(uint256,address,tuple)": EventFragment;
    "FundraisingContributorUpdated(uint256,address,tuple)": EventFragment;
    "FundraisingRewardsClaimed(uint256,address,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FundraisingCampaignCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FundraisingCampaignUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FundraisingConfigUpdated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "FundraisingContributionRefunded"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "FundraisingContributorUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FundraisingRewardsClaimed"): EventFragment;
}

export interface FundraisingCampaignCreatedEventObject {
  campaignId: BigNumber;
  campaign: CampaignStructOutput;
}
export type FundraisingCampaignCreatedEvent = TypedEvent<
  [BigNumber, CampaignStructOutput],
  FundraisingCampaignCreatedEventObject
>;

export type FundraisingCampaignCreatedEventFilter =
  TypedEventFilter<FundraisingCampaignCreatedEvent>;

export interface FundraisingCampaignUpdatedEventObject {
  campaignId: BigNumber;
  campaign: CampaignStructOutput;
}
export type FundraisingCampaignUpdatedEvent = TypedEvent<
  [BigNumber, CampaignStructOutput],
  FundraisingCampaignUpdatedEventObject
>;

export type FundraisingCampaignUpdatedEventFilter =
  TypedEventFilter<FundraisingCampaignUpdatedEvent>;

export interface FundraisingConfigUpdatedEventObject {
  config: FundraisingStorage.ConfigStructOutput;
}
export type FundraisingConfigUpdatedEvent = TypedEvent<
  [FundraisingStorage.ConfigStructOutput],
  FundraisingConfigUpdatedEventObject
>;

export type FundraisingConfigUpdatedEventFilter =
  TypedEventFilter<FundraisingConfigUpdatedEvent>;

export interface FundraisingContributionRefundedEventObject {
  campaignId: BigNumber;
  sender: string;
  balance: AngelCoreStruct.GenericBalanceStructOutput;
}
export type FundraisingContributionRefundedEvent = TypedEvent<
  [BigNumber, string, AngelCoreStruct.GenericBalanceStructOutput],
  FundraisingContributionRefundedEventObject
>;

export type FundraisingContributionRefundedEventFilter =
  TypedEventFilter<FundraisingContributionRefundedEvent>;

export interface FundraisingContributorUpdatedEventObject {
  campaignId: BigNumber;
  sender: string;
  contributorInfo: FundraisingStorage.ContributorInfoStructOutput;
}
export type FundraisingContributorUpdatedEvent = TypedEvent<
  [BigNumber, string, FundraisingStorage.ContributorInfoStructOutput],
  FundraisingContributorUpdatedEventObject
>;

export type FundraisingContributorUpdatedEventFilter =
  TypedEventFilter<FundraisingContributorUpdatedEvent>;

export interface FundraisingRewardsClaimedEventObject {
  campaignId: BigNumber;
  sender: string;
  balance: AngelCoreStruct.GenericBalanceStructOutput;
}
export type FundraisingRewardsClaimedEvent = TypedEvent<
  [BigNumber, string, AngelCoreStruct.GenericBalanceStructOutput],
  FundraisingRewardsClaimedEventObject
>;

export type FundraisingRewardsClaimedEventFilter =
  TypedEventFilter<FundraisingRewardsClaimedEvent>;

export interface Fundraising extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FundraisingInterface;

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
    executeClaimRewards(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeCloseCampaign(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeContribute(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeCreate(
      endowmentId: PromiseOrValue<BigNumberish>,
      message: FundraisingMessage.CreateMsgStruct,
      balance: BalanceStruct,
      sender: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeRefundContributions(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeTopUp(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeUpdateConfig(
      campaignPeriodSeconds: PromiseOrValue<BigNumberish>,
      taxRate: PromiseOrValue<BigNumberish>,
      acceptedTokens: AngelCoreStruct.GenericBalanceStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getRegistrarConfig(
      overrides?: CallOverrides
    ): Promise<[RegistrarStorage.ConfigStructOutput]>;

    initFundraising(
      curDetails: FundraisingMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[FundraisingStorage.ConfigStructOutput]>;

    queryDetails(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[FundraisingMessage.DetailsResponseStructOutput]>;
  };

  executeClaimRewards(
    id: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeCloseCampaign(
    id: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeContribute(
    id: PromiseOrValue<BigNumberish>,
    balance: BalanceStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeCreate(
    endowmentId: PromiseOrValue<BigNumberish>,
    message: FundraisingMessage.CreateMsgStruct,
    balance: BalanceStruct,
    sender: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeRefundContributions(
    id: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeTopUp(
    id: PromiseOrValue<BigNumberish>,
    balance: BalanceStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeUpdateConfig(
    campaignPeriodSeconds: PromiseOrValue<BigNumberish>,
    taxRate: PromiseOrValue<BigNumberish>,
    acceptedTokens: AngelCoreStruct.GenericBalanceStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getRegistrarConfig(
    overrides?: CallOverrides
  ): Promise<RegistrarStorage.ConfigStructOutput>;

  initFundraising(
    curDetails: FundraisingMessage.InstantiateMsgStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<FundraisingStorage.ConfigStructOutput>;

  queryDetails(
    id: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<FundraisingMessage.DetailsResponseStructOutput>;

  callStatic: {
    executeClaimRewards(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeCloseCampaign(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeContribute(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    executeCreate(
      endowmentId: PromiseOrValue<BigNumberish>,
      message: FundraisingMessage.CreateMsgStruct,
      balance: BalanceStruct,
      sender: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeRefundContributions(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeTopUp(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    executeUpdateConfig(
      campaignPeriodSeconds: PromiseOrValue<BigNumberish>,
      taxRate: PromiseOrValue<BigNumberish>,
      acceptedTokens: AngelCoreStruct.GenericBalanceStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getRegistrarConfig(
      overrides?: CallOverrides
    ): Promise<RegistrarStorage.ConfigStructOutput>;

    initFundraising(
      curDetails: FundraisingMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<FundraisingStorage.ConfigStructOutput>;

    queryDetails(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<FundraisingMessage.DetailsResponseStructOutput>;
  };

  filters: {
    "FundraisingCampaignCreated(uint256,tuple)"(
      campaignId?: null,
      campaign?: null
    ): FundraisingCampaignCreatedEventFilter;
    FundraisingCampaignCreated(
      campaignId?: null,
      campaign?: null
    ): FundraisingCampaignCreatedEventFilter;

    "FundraisingCampaignUpdated(uint256,tuple)"(
      campaignId?: null,
      campaign?: null
    ): FundraisingCampaignUpdatedEventFilter;
    FundraisingCampaignUpdated(
      campaignId?: null,
      campaign?: null
    ): FundraisingCampaignUpdatedEventFilter;

    "FundraisingConfigUpdated(tuple)"(
      config?: null
    ): FundraisingConfigUpdatedEventFilter;
    FundraisingConfigUpdated(
      config?: null
    ): FundraisingConfigUpdatedEventFilter;

    "FundraisingContributionRefunded(uint256,address,tuple)"(
      campaignId?: null,
      sender?: null,
      balance?: null
    ): FundraisingContributionRefundedEventFilter;
    FundraisingContributionRefunded(
      campaignId?: null,
      sender?: null,
      balance?: null
    ): FundraisingContributionRefundedEventFilter;

    "FundraisingContributorUpdated(uint256,address,tuple)"(
      campaignId?: null,
      sender?: null,
      contributorInfo?: null
    ): FundraisingContributorUpdatedEventFilter;
    FundraisingContributorUpdated(
      campaignId?: null,
      sender?: null,
      contributorInfo?: null
    ): FundraisingContributorUpdatedEventFilter;

    "FundraisingRewardsClaimed(uint256,address,tuple)"(
      campaignId?: null,
      sender?: null,
      balance?: null
    ): FundraisingRewardsClaimedEventFilter;
    FundraisingRewardsClaimed(
      campaignId?: null,
      sender?: null,
      balance?: null
    ): FundraisingRewardsClaimedEventFilter;
  };

  estimateGas: {
    executeClaimRewards(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeCloseCampaign(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeContribute(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeCreate(
      endowmentId: PromiseOrValue<BigNumberish>,
      message: FundraisingMessage.CreateMsgStruct,
      balance: BalanceStruct,
      sender: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeRefundContributions(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeTopUp(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeUpdateConfig(
      campaignPeriodSeconds: PromiseOrValue<BigNumberish>,
      taxRate: PromiseOrValue<BigNumberish>,
      acceptedTokens: AngelCoreStruct.GenericBalanceStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getRegistrarConfig(overrides?: CallOverrides): Promise<BigNumber>;

    initFundraising(
      curDetails: FundraisingMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryDetails(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeClaimRewards(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeCloseCampaign(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeContribute(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeCreate(
      endowmentId: PromiseOrValue<BigNumberish>,
      message: FundraisingMessage.CreateMsgStruct,
      balance: BalanceStruct,
      sender: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeRefundContributions(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeTopUp(
      id: PromiseOrValue<BigNumberish>,
      balance: BalanceStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeUpdateConfig(
      campaignPeriodSeconds: PromiseOrValue<BigNumberish>,
      taxRate: PromiseOrValue<BigNumberish>,
      acceptedTokens: AngelCoreStruct.GenericBalanceStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getRegistrarConfig(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initFundraising(
      curDetails: FundraisingMessage.InstantiateMsgStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryDetails(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
