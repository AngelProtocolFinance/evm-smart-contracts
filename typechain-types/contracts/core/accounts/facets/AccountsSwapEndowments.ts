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
} from "../../../../common";

export declare namespace AccountStorage {
  export type AllowanceDataStruct = {
    height: PromiseOrValue<BigNumberish>;
    timestamp: PromiseOrValue<BigNumberish>;
    expires: PromiseOrValue<boolean>;
    allowanceAmount: PromiseOrValue<BigNumberish>;
    configured: PromiseOrValue<boolean>;
  };

  export type AllowanceDataStructOutput = [
    BigNumber,
    BigNumber,
    boolean,
    BigNumber,
    boolean
  ] & {
    height: BigNumber;
    timestamp: BigNumber;
    expires: boolean;
    allowanceAmount: BigNumber;
    configured: boolean;
  };

  export type EndowmentStruct = {
    owner: PromiseOrValue<string>;
    name: PromiseOrValue<string>;
    categories: AngelCoreStruct.CategoriesStruct;
    tier: PromiseOrValue<BigNumberish>;
    endow_type: PromiseOrValue<BigNumberish>;
    logo: PromiseOrValue<string>;
    image: PromiseOrValue<string>;
    status: PromiseOrValue<BigNumberish>;
    depositApproved: PromiseOrValue<boolean>;
    withdrawApproved: PromiseOrValue<boolean>;
    maturityTime: PromiseOrValue<BigNumberish>;
    strategies: AngelCoreStruct.AccountStrategiesStruct;
    oneoffVaults: AngelCoreStruct.OneOffVaultsStruct;
    rebalance: AngelCoreStruct.RebalanceDetailsStruct;
    kycDonorsOnly: PromiseOrValue<boolean>;
    pendingRedemptions: PromiseOrValue<BigNumberish>;
    copycatStrategy: PromiseOrValue<BigNumberish>;
    proposalLink: PromiseOrValue<BigNumberish>;
    dao: PromiseOrValue<string>;
    daoToken: PromiseOrValue<string>;
    donationMatchActive: PromiseOrValue<boolean>;
    donationMatchContract: PromiseOrValue<string>;
    whitelistedBeneficiaries: PromiseOrValue<string>[];
    whitelistedContributors: PromiseOrValue<string>[];
    maturityWhitelist: PromiseOrValue<string>[];
    earningsFee: AngelCoreStruct.EndowmentFeeStruct;
    withdrawFee: AngelCoreStruct.EndowmentFeeStruct;
    depositFee: AngelCoreStruct.EndowmentFeeStruct;
    aumFee: AngelCoreStruct.EndowmentFeeStruct;
    settingsController: AngelCoreStruct.SettingsControllerStruct;
    parent: PromiseOrValue<BigNumberish>;
    ignoreUserSplits: PromiseOrValue<boolean>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
  };

  export type EndowmentStructOutput = [
    string,
    string,
    AngelCoreStruct.CategoriesStructOutput,
    BigNumber,
    number,
    string,
    string,
    number,
    boolean,
    boolean,
    BigNumber,
    AngelCoreStruct.AccountStrategiesStructOutput,
    AngelCoreStruct.OneOffVaultsStructOutput,
    AngelCoreStruct.RebalanceDetailsStructOutput,
    boolean,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string,
    boolean,
    string,
    string[],
    string[],
    string[],
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.SettingsControllerStructOutput,
    BigNumber,
    boolean,
    AngelCoreStruct.SplitDetailsStructOutput
  ] & {
    owner: string;
    name: string;
    categories: AngelCoreStruct.CategoriesStructOutput;
    tier: BigNumber;
    endow_type: number;
    logo: string;
    image: string;
    status: number;
    depositApproved: boolean;
    withdrawApproved: boolean;
    maturityTime: BigNumber;
    strategies: AngelCoreStruct.AccountStrategiesStructOutput;
    oneoffVaults: AngelCoreStruct.OneOffVaultsStructOutput;
    rebalance: AngelCoreStruct.RebalanceDetailsStructOutput;
    kycDonorsOnly: boolean;
    pendingRedemptions: BigNumber;
    copycatStrategy: BigNumber;
    proposalLink: BigNumber;
    dao: string;
    daoToken: string;
    donationMatchActive: boolean;
    donationMatchContract: string;
    whitelistedBeneficiaries: string[];
    whitelistedContributors: string[];
    maturityWhitelist: string[];
    earningsFee: AngelCoreStruct.EndowmentFeeStructOutput;
    withdrawFee: AngelCoreStruct.EndowmentFeeStructOutput;
    depositFee: AngelCoreStruct.EndowmentFeeStructOutput;
    aumFee: AngelCoreStruct.EndowmentFeeStructOutput;
    settingsController: AngelCoreStruct.SettingsControllerStructOutput;
    parent: BigNumber;
    ignoreUserSplits: boolean;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
  };

  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    nextAccountId: PromiseOrValue<BigNumberish>;
    maxGeneralCategoryId: PromiseOrValue<BigNumberish>;
  };

  export type ConfigStructOutput = [string, string, BigNumber, BigNumber] & {
    owner: string;
    registrarContract: string;
    nextAccountId: BigNumber;
    maxGeneralCategoryId: BigNumber;
  };

  export type EndowmentStateStruct = {
    donationsReceived: AngelCoreStruct.DonationsReceivedStruct;
    balances: AngelCoreStruct.BalanceInfoStruct;
    closingEndowment: PromiseOrValue<boolean>;
    closingBeneficiary: AngelCoreStruct.BeneficiaryStruct;
  };

  export type EndowmentStateStructOutput = [
    AngelCoreStruct.DonationsReceivedStructOutput,
    AngelCoreStruct.BalanceInfoStructOutput,
    boolean,
    AngelCoreStruct.BeneficiaryStructOutput
  ] & {
    donationsReceived: AngelCoreStruct.DonationsReceivedStructOutput;
    balances: AngelCoreStruct.BalanceInfoStructOutput;
    closingEndowment: boolean;
    closingBeneficiary: AngelCoreStruct.BeneficiaryStructOutput;
  };
}

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

  export type CategoriesStruct = {
    sdgs: PromiseOrValue<BigNumberish>[];
    general: PromiseOrValue<BigNumberish>[];
  };

  export type CategoriesStructOutput = [BigNumber[], BigNumber[]] & {
    sdgs: BigNumber[];
    general: BigNumber[];
  };

  export type AccountStrategiesStruct = {
    locked_vault: PromiseOrValue<string>[];
    lockedPercentage: PromiseOrValue<BigNumberish>[];
    liquid_vault: PromiseOrValue<string>[];
    liquidPercentage: PromiseOrValue<BigNumberish>[];
  };

  export type AccountStrategiesStructOutput = [
    string[],
    BigNumber[],
    string[],
    BigNumber[]
  ] & {
    locked_vault: string[];
    lockedPercentage: BigNumber[];
    liquid_vault: string[];
    liquidPercentage: BigNumber[];
  };

  export type OneOffVaultsStruct = {
    locked: PromiseOrValue<string>[];
    lockedAmount: PromiseOrValue<BigNumberish>[];
    liquid: PromiseOrValue<string>[];
    liquidAmount: PromiseOrValue<BigNumberish>[];
  };

  export type OneOffVaultsStructOutput = [
    string[],
    BigNumber[],
    string[],
    BigNumber[]
  ] & {
    locked: string[];
    lockedAmount: BigNumber[];
    liquid: string[];
    liquidAmount: BigNumber[];
  };

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

  export type EndowmentFeeStruct = {
    payoutAddress: PromiseOrValue<string>;
    feePercentage: PromiseOrValue<BigNumberish>;
    active: PromiseOrValue<boolean>;
  };

  export type EndowmentFeeStructOutput = [string, BigNumber, boolean] & {
    payoutAddress: string;
    feePercentage: BigNumber;
    active: boolean;
  };

  export type DelegateStruct = {
    Addr: PromiseOrValue<string>;
    expires: PromiseOrValue<BigNumberish>;
  };

  export type DelegateStructOutput = [string, BigNumber] & {
    Addr: string;
    expires: BigNumber;
  };

  export type SettingsPermissionStruct = {
    ownerControlled: PromiseOrValue<boolean>;
    govControlled: PromiseOrValue<boolean>;
    modifiableAfterInit: PromiseOrValue<boolean>;
    delegate: AngelCoreStruct.DelegateStruct;
  };

  export type SettingsPermissionStructOutput = [
    boolean,
    boolean,
    boolean,
    AngelCoreStruct.DelegateStructOutput
  ] & {
    ownerControlled: boolean;
    govControlled: boolean;
    modifiableAfterInit: boolean;
    delegate: AngelCoreStruct.DelegateStructOutput;
  };

  export type SettingsControllerStruct = {
    endowmentController: AngelCoreStruct.SettingsPermissionStruct;
    strategies: AngelCoreStruct.SettingsPermissionStruct;
    whitelistedBeneficiaries: AngelCoreStruct.SettingsPermissionStruct;
    whitelistedContributors: AngelCoreStruct.SettingsPermissionStruct;
    maturityWhitelist: AngelCoreStruct.SettingsPermissionStruct;
    maturityTime: AngelCoreStruct.SettingsPermissionStruct;
    profile: AngelCoreStruct.SettingsPermissionStruct;
    earningsFee: AngelCoreStruct.SettingsPermissionStruct;
    withdrawFee: AngelCoreStruct.SettingsPermissionStruct;
    depositFee: AngelCoreStruct.SettingsPermissionStruct;
    aumFee: AngelCoreStruct.SettingsPermissionStruct;
    kycDonorsOnly: AngelCoreStruct.SettingsPermissionStruct;
    name: AngelCoreStruct.SettingsPermissionStruct;
    image: AngelCoreStruct.SettingsPermissionStruct;
    logo: AngelCoreStruct.SettingsPermissionStruct;
    categories: AngelCoreStruct.SettingsPermissionStruct;
    splitToLiquid: AngelCoreStruct.SettingsPermissionStruct;
    ignoreUserSplits: AngelCoreStruct.SettingsPermissionStruct;
  };

  export type SettingsControllerStructOutput = [
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput,
    AngelCoreStruct.SettingsPermissionStructOutput
  ] & {
    endowmentController: AngelCoreStruct.SettingsPermissionStructOutput;
    strategies: AngelCoreStruct.SettingsPermissionStructOutput;
    whitelistedBeneficiaries: AngelCoreStruct.SettingsPermissionStructOutput;
    whitelistedContributors: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityWhitelist: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityTime: AngelCoreStruct.SettingsPermissionStructOutput;
    profile: AngelCoreStruct.SettingsPermissionStructOutput;
    earningsFee: AngelCoreStruct.SettingsPermissionStructOutput;
    withdrawFee: AngelCoreStruct.SettingsPermissionStructOutput;
    depositFee: AngelCoreStruct.SettingsPermissionStructOutput;
    aumFee: AngelCoreStruct.SettingsPermissionStructOutput;
    kycDonorsOnly: AngelCoreStruct.SettingsPermissionStructOutput;
    name: AngelCoreStruct.SettingsPermissionStructOutput;
    image: AngelCoreStruct.SettingsPermissionStructOutput;
    logo: AngelCoreStruct.SettingsPermissionStructOutput;
    categories: AngelCoreStruct.SettingsPermissionStructOutput;
    splitToLiquid: AngelCoreStruct.SettingsPermissionStructOutput;
    ignoreUserSplits: AngelCoreStruct.SettingsPermissionStructOutput;
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

  export type DonationsReceivedStruct = {
    locked: PromiseOrValue<BigNumberish>;
    liquid: PromiseOrValue<BigNumberish>;
  };

  export type DonationsReceivedStructOutput = [BigNumber, BigNumber] & {
    locked: BigNumber;
    liquid: BigNumber;
  };

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

  export type BalanceInfoStruct = {
    locked: AngelCoreStruct.GenericBalanceStruct;
    liquid: AngelCoreStruct.GenericBalanceStruct;
  };

  export type BalanceInfoStructOutput = [
    AngelCoreStruct.GenericBalanceStructOutput,
    AngelCoreStruct.GenericBalanceStructOutput
  ] & {
    locked: AngelCoreStruct.GenericBalanceStructOutput;
    liquid: AngelCoreStruct.GenericBalanceStructOutput;
  };

  export type BeneficiaryDataStruct = {
    id: PromiseOrValue<BigNumberish>;
    addr: PromiseOrValue<string>;
  };

  export type BeneficiaryDataStructOutput = [BigNumber, string] & {
    id: BigNumber;
    addr: string;
  };

  export type BeneficiaryStruct = {
    data: AngelCoreStruct.BeneficiaryDataStruct;
    enumData: PromiseOrValue<BigNumberish>;
  };

  export type BeneficiaryStructOutput = [
    AngelCoreStruct.BeneficiaryDataStructOutput,
    number
  ] & { data: AngelCoreStruct.BeneficiaryDataStructOutput; enumData: number };
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
}

export interface AccountsSwapEndowmentsInterface extends utils.Interface {
  functions: {
    "swapToken(uint256,uint8,uint256,address,address)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "swapToken"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "swapToken",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "swapToken", data: BytesLike): Result;

  events: {
    "AllowanceStateUpdatedTo(address,address,address,tuple)": EventFragment;
    "DaoContractCreated(tuple,address)": EventFragment;
    "DonationDeposited(uint256,uint256)": EventFragment;
    "DonationMatchSetup(uint256,address)": EventFragment;
    "DonationWithdrawn(uint256,address,uint256)": EventFragment;
    "EndowmentCreated(uint256,tuple)": EventFragment;
    "EndowmentSettingUpdated(uint256,string)": EventFragment;
    "RemoveAllowance(address,address,address)": EventFragment;
    "SwapToken(uint256,uint8,uint256,address,address,uint256)": EventFragment;
    "UpdateConfig(tuple)": EventFragment;
    "UpdateEndowment(uint256,tuple)": EventFragment;
    "UpdateEndowmentState(uint256,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AllowanceStateUpdatedTo"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DaoContractCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationDeposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationMatchSetup"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationWithdrawn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EndowmentSettingUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveAllowance"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SwapToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateEndowment"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateEndowmentState"): EventFragment;
}

export interface AllowanceStateUpdatedToEventObject {
  sender: string;
  spender: string;
  tokenAddress: string;
  allowance: AccountStorage.AllowanceDataStructOutput;
}
export type AllowanceStateUpdatedToEvent = TypedEvent<
  [string, string, string, AccountStorage.AllowanceDataStructOutput],
  AllowanceStateUpdatedToEventObject
>;

export type AllowanceStateUpdatedToEventFilter =
  TypedEventFilter<AllowanceStateUpdatedToEvent>;

export interface DaoContractCreatedEventObject {
  curCreatedaomessage: SubDaoMessage.InstantiateMsgStructOutput;
  daoAddress: string;
}
export type DaoContractCreatedEvent = TypedEvent<
  [SubDaoMessage.InstantiateMsgStructOutput, string],
  DaoContractCreatedEventObject
>;

export type DaoContractCreatedEventFilter =
  TypedEventFilter<DaoContractCreatedEvent>;

export interface DonationDepositedEventObject {
  curId: BigNumber;
  curAmount: BigNumber;
}
export type DonationDepositedEvent = TypedEvent<
  [BigNumber, BigNumber],
  DonationDepositedEventObject
>;

export type DonationDepositedEventFilter =
  TypedEventFilter<DonationDepositedEvent>;

export interface DonationMatchSetupEventObject {
  id: BigNumber;
  donationMatchContract: string;
}
export type DonationMatchSetupEvent = TypedEvent<
  [BigNumber, string],
  DonationMatchSetupEventObject
>;

export type DonationMatchSetupEventFilter =
  TypedEventFilter<DonationMatchSetupEvent>;

export interface DonationWithdrawnEventObject {
  id: BigNumber;
  recipient: string;
  amount: BigNumber;
}
export type DonationWithdrawnEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  DonationWithdrawnEventObject
>;

export type DonationWithdrawnEventFilter =
  TypedEventFilter<DonationWithdrawnEvent>;

export interface EndowmentCreatedEventObject {
  id: BigNumber;
  endowment: AccountStorage.EndowmentStructOutput;
}
export type EndowmentCreatedEvent = TypedEvent<
  [BigNumber, AccountStorage.EndowmentStructOutput],
  EndowmentCreatedEventObject
>;

export type EndowmentCreatedEventFilter =
  TypedEventFilter<EndowmentCreatedEvent>;

export interface EndowmentSettingUpdatedEventObject {
  id: BigNumber;
  setting: string;
}
export type EndowmentSettingUpdatedEvent = TypedEvent<
  [BigNumber, string],
  EndowmentSettingUpdatedEventObject
>;

export type EndowmentSettingUpdatedEventFilter =
  TypedEventFilter<EndowmentSettingUpdatedEvent>;

export interface RemoveAllowanceEventObject {
  sender: string;
  spender: string;
  tokenAddress: string;
}
export type RemoveAllowanceEvent = TypedEvent<
  [string, string, string],
  RemoveAllowanceEventObject
>;

export type RemoveAllowanceEventFilter = TypedEventFilter<RemoveAllowanceEvent>;

export interface SwapTokenEventObject {
  curId: BigNumber;
  curAccountType: number;
  curAmount: BigNumber;
  curTokenin: string;
  curTokenout: string;
  curAmountout: BigNumber;
}
export type SwapTokenEvent = TypedEvent<
  [BigNumber, number, BigNumber, string, string, BigNumber],
  SwapTokenEventObject
>;

export type SwapTokenEventFilter = TypedEventFilter<SwapTokenEvent>;

export interface UpdateConfigEventObject {
  config: AccountStorage.ConfigStructOutput;
}
export type UpdateConfigEvent = TypedEvent<
  [AccountStorage.ConfigStructOutput],
  UpdateConfigEventObject
>;

export type UpdateConfigEventFilter = TypedEventFilter<UpdateConfigEvent>;

export interface UpdateEndowmentEventObject {
  id: BigNumber;
  endowment: AccountStorage.EndowmentStructOutput;
}
export type UpdateEndowmentEvent = TypedEvent<
  [BigNumber, AccountStorage.EndowmentStructOutput],
  UpdateEndowmentEventObject
>;

export type UpdateEndowmentEventFilter = TypedEventFilter<UpdateEndowmentEvent>;

export interface UpdateEndowmentStateEventObject {
  id: BigNumber;
  state: AccountStorage.EndowmentStateStructOutput;
}
export type UpdateEndowmentStateEvent = TypedEvent<
  [BigNumber, AccountStorage.EndowmentStateStructOutput],
  UpdateEndowmentStateEventObject
>;

export type UpdateEndowmentStateEventFilter =
  TypedEventFilter<UpdateEndowmentStateEvent>;

export interface AccountsSwapEndowments extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AccountsSwapEndowmentsInterface;

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
    swapToken(
      curId: PromiseOrValue<BigNumberish>,
      curAccountType: PromiseOrValue<BigNumberish>,
      curAmount: PromiseOrValue<BigNumberish>,
      curTokenin: PromiseOrValue<string>,
      curTokenout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  swapToken(
    curId: PromiseOrValue<BigNumberish>,
    curAccountType: PromiseOrValue<BigNumberish>,
    curAmount: PromiseOrValue<BigNumberish>,
    curTokenin: PromiseOrValue<string>,
    curTokenout: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    swapToken(
      curId: PromiseOrValue<BigNumberish>,
      curAccountType: PromiseOrValue<BigNumberish>,
      curAmount: PromiseOrValue<BigNumberish>,
      curTokenin: PromiseOrValue<string>,
      curTokenout: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AllowanceStateUpdatedTo(address,address,address,tuple)"(
      sender?: null,
      spender?: null,
      tokenAddress?: null,
      allowance?: null
    ): AllowanceStateUpdatedToEventFilter;
    AllowanceStateUpdatedTo(
      sender?: null,
      spender?: null,
      tokenAddress?: null,
      allowance?: null
    ): AllowanceStateUpdatedToEventFilter;

    "DaoContractCreated(tuple,address)"(
      curCreatedaomessage?: null,
      daoAddress?: null
    ): DaoContractCreatedEventFilter;
    DaoContractCreated(
      curCreatedaomessage?: null,
      daoAddress?: null
    ): DaoContractCreatedEventFilter;

    "DonationDeposited(uint256,uint256)"(
      curId?: null,
      curAmount?: null
    ): DonationDepositedEventFilter;
    DonationDeposited(
      curId?: null,
      curAmount?: null
    ): DonationDepositedEventFilter;

    "DonationMatchSetup(uint256,address)"(
      id?: null,
      donationMatchContract?: null
    ): DonationMatchSetupEventFilter;
    DonationMatchSetup(
      id?: null,
      donationMatchContract?: null
    ): DonationMatchSetupEventFilter;

    "DonationWithdrawn(uint256,address,uint256)"(
      id?: null,
      recipient?: null,
      amount?: null
    ): DonationWithdrawnEventFilter;
    DonationWithdrawn(
      id?: null,
      recipient?: null,
      amount?: null
    ): DonationWithdrawnEventFilter;

    "EndowmentCreated(uint256,tuple)"(
      id?: null,
      endowment?: null
    ): EndowmentCreatedEventFilter;
    EndowmentCreated(id?: null, endowment?: null): EndowmentCreatedEventFilter;

    "EndowmentSettingUpdated(uint256,string)"(
      id?: null,
      setting?: null
    ): EndowmentSettingUpdatedEventFilter;
    EndowmentSettingUpdated(
      id?: null,
      setting?: null
    ): EndowmentSettingUpdatedEventFilter;

    "RemoveAllowance(address,address,address)"(
      sender?: null,
      spender?: null,
      tokenAddress?: null
    ): RemoveAllowanceEventFilter;
    RemoveAllowance(
      sender?: null,
      spender?: null,
      tokenAddress?: null
    ): RemoveAllowanceEventFilter;

    "SwapToken(uint256,uint8,uint256,address,address,uint256)"(
      curId?: null,
      curAccountType?: null,
      curAmount?: null,
      curTokenin?: null,
      curTokenout?: null,
      curAmountout?: null
    ): SwapTokenEventFilter;
    SwapToken(
      curId?: null,
      curAccountType?: null,
      curAmount?: null,
      curTokenin?: null,
      curTokenout?: null,
      curAmountout?: null
    ): SwapTokenEventFilter;

    "UpdateConfig(tuple)"(config?: null): UpdateConfigEventFilter;
    UpdateConfig(config?: null): UpdateConfigEventFilter;

    "UpdateEndowment(uint256,tuple)"(
      id?: null,
      endowment?: null
    ): UpdateEndowmentEventFilter;
    UpdateEndowment(id?: null, endowment?: null): UpdateEndowmentEventFilter;

    "UpdateEndowmentState(uint256,tuple)"(
      id?: null,
      state?: null
    ): UpdateEndowmentStateEventFilter;
    UpdateEndowmentState(
      id?: null,
      state?: null
    ): UpdateEndowmentStateEventFilter;
  };

  estimateGas: {
    swapToken(
      curId: PromiseOrValue<BigNumberish>,
      curAccountType: PromiseOrValue<BigNumberish>,
      curAmount: PromiseOrValue<BigNumberish>,
      curTokenin: PromiseOrValue<string>,
      curTokenout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    swapToken(
      curId: PromiseOrValue<BigNumberish>,
      curAccountType: PromiseOrValue<BigNumberish>,
      curAmount: PromiseOrValue<BigNumberish>,
      curTokenin: PromiseOrValue<string>,
      curTokenout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
