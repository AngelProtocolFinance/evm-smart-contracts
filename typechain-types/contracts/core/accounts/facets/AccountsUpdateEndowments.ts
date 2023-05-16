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
    rebalance: LocalRegistrarLib.RebalanceParamsStruct;
    kycDonorsOnly: PromiseOrValue<boolean>;
    pendingRedemptions: PromiseOrValue<BigNumberish>;
    copycatStrategy: PromiseOrValue<BigNumberish>;
    proposalLink: PromiseOrValue<BigNumberish>;
    multisig: PromiseOrValue<string>;
    dao: PromiseOrValue<string>;
    daoToken: PromiseOrValue<string>;
    donationMatchActive: PromiseOrValue<boolean>;
    donationMatchContract: PromiseOrValue<string>;
    allowlistedBeneficiaries: PromiseOrValue<string>[];
    allowlistedContributors: PromiseOrValue<string>[];
    maturityAllowlist: PromiseOrValue<string>[];
    earningsFee: AngelCoreStruct.EndowmentFeeStruct;
    withdrawFee: AngelCoreStruct.EndowmentFeeStruct;
    depositFee: AngelCoreStruct.EndowmentFeeStruct;
    balanceFee: AngelCoreStruct.EndowmentFeeStruct;
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
    LocalRegistrarLib.RebalanceParamsStructOutput,
    boolean,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
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
    rebalance: LocalRegistrarLib.RebalanceParamsStructOutput;
    kycDonorsOnly: boolean;
    pendingRedemptions: BigNumber;
    copycatStrategy: BigNumber;
    proposalLink: BigNumber;
    multisig: string;
    dao: string;
    daoToken: string;
    donationMatchActive: boolean;
    donationMatchContract: string;
    allowlistedBeneficiaries: string[];
    allowlistedContributors: string[];
    maturityAllowlist: string[];
    earningsFee: AngelCoreStruct.EndowmentFeeStructOutput;
    withdrawFee: AngelCoreStruct.EndowmentFeeStructOutput;
    depositFee: AngelCoreStruct.EndowmentFeeStructOutput;
    balanceFee: AngelCoreStruct.EndowmentFeeStructOutput;
    settingsController: AngelCoreStruct.SettingsControllerStructOutput;
    parent: BigNumber;
    ignoreUserSplits: boolean;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
  };

  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    version: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    nextAccountId: PromiseOrValue<BigNumberish>;
    maxGeneralCategoryId: PromiseOrValue<BigNumberish>;
    subDao: PromiseOrValue<string>;
    gateway: PromiseOrValue<string>;
    gasReceiver: PromiseOrValue<string>;
    reentrancyGuardLocked: PromiseOrValue<boolean>;
  };

  export type ConfigStructOutput = [
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    boolean
  ] & {
    owner: string;
    version: string;
    registrarContract: string;
    nextAccountId: BigNumber;
    maxGeneralCategoryId: BigNumber;
    subDao: string;
    gateway: string;
    gasReceiver: string;
    reentrancyGuardLocked: boolean;
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
    delegate: AngelCoreStruct.DelegateStruct;
  };

  export type SettingsPermissionStructOutput = [
    AngelCoreStruct.DelegateStructOutput
  ] & { delegate: AngelCoreStruct.DelegateStructOutput };

  export type SettingsControllerStruct = {
    endowmentController: AngelCoreStruct.SettingsPermissionStruct;
    strategies: AngelCoreStruct.SettingsPermissionStruct;
    allowlistedBeneficiaries: AngelCoreStruct.SettingsPermissionStruct;
    allowlistedContributors: AngelCoreStruct.SettingsPermissionStruct;
    maturityAllowlist: AngelCoreStruct.SettingsPermissionStruct;
    maturityTime: AngelCoreStruct.SettingsPermissionStruct;
    profile: AngelCoreStruct.SettingsPermissionStruct;
    earningsFee: AngelCoreStruct.SettingsPermissionStruct;
    withdrawFee: AngelCoreStruct.SettingsPermissionStruct;
    depositFee: AngelCoreStruct.SettingsPermissionStruct;
    balanceFee: AngelCoreStruct.SettingsPermissionStruct;
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
    AngelCoreStruct.SettingsPermissionStructOutput
  ] & {
    endowmentController: AngelCoreStruct.SettingsPermissionStructOutput;
    strategies: AngelCoreStruct.SettingsPermissionStructOutput;
    allowlistedBeneficiaries: AngelCoreStruct.SettingsPermissionStructOutput;
    allowlistedContributors: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityAllowlist: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityTime: AngelCoreStruct.SettingsPermissionStructOutput;
    profile: AngelCoreStruct.SettingsPermissionStructOutput;
    earningsFee: AngelCoreStruct.SettingsPermissionStructOutput;
    withdrawFee: AngelCoreStruct.SettingsPermissionStructOutput;
    depositFee: AngelCoreStruct.SettingsPermissionStructOutput;
    balanceFee: AngelCoreStruct.SettingsPermissionStructOutput;
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

export declare namespace LocalRegistrarLib {
  export type RebalanceParamsStruct = {
    rebalanceLiquidProfits: PromiseOrValue<boolean>;
    lockedRebalanceToLiquid: PromiseOrValue<BigNumberish>;
    interestDistribution: PromiseOrValue<BigNumberish>;
    lockedPrincipleToLiquid: PromiseOrValue<boolean>;
    principleDistribution: PromiseOrValue<BigNumberish>;
    basis: PromiseOrValue<BigNumberish>;
  };

  export type RebalanceParamsStructOutput = [
    boolean,
    number,
    number,
    boolean,
    number,
    number
  ] & {
    rebalanceLiquidProfits: boolean;
    lockedRebalanceToLiquid: number;
    interestDistribution: number;
    lockedPrincipleToLiquid: boolean;
    principleDistribution: number;
    basis: number;
  };
}

export declare namespace AccountMessages {
  export type UpdateEndowmentDetailsRequestStruct = {
    id: PromiseOrValue<BigNumberish>;
    owner: PromiseOrValue<string>;
    name: PromiseOrValue<string>;
    categories: AngelCoreStruct.CategoriesStruct;
    logo: PromiseOrValue<string>;
    image: PromiseOrValue<string>;
    rebalance: LocalRegistrarLib.RebalanceParamsStruct;
  };

  export type UpdateEndowmentDetailsRequestStructOutput = [
    BigNumber,
    string,
    string,
    AngelCoreStruct.CategoriesStructOutput,
    string,
    string,
    LocalRegistrarLib.RebalanceParamsStructOutput
  ] & {
    id: BigNumber;
    owner: string;
    name: string;
    categories: AngelCoreStruct.CategoriesStructOutput;
    logo: string;
    image: string;
    rebalance: LocalRegistrarLib.RebalanceParamsStructOutput;
  };
}

export interface AccountsUpdateEndowmentsInterface extends utils.Interface {
  functions: {
    "updateDelegate(uint256,string,string,address,uint256)": FunctionFragment;
    "updateEndowmentDetails((uint256,address,string,(uint256[],uint256[]),string,string,(bool,uint32,uint32,bool,uint32,uint32)))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "updateDelegate" | "updateEndowmentDetails"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "updateDelegate",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateEndowmentDetails",
    values: [AccountMessages.UpdateEndowmentDetailsRequestStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "updateDelegate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateEndowmentDetails",
    data: BytesLike
  ): Result;

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

export interface AccountsUpdateEndowments extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AccountsUpdateEndowmentsInterface;

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
    updateDelegate(
      id: PromiseOrValue<BigNumberish>,
      setting: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      delegateAddress: PromiseOrValue<string>,
      delegateExpiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateEndowmentDetails(
      curDetails: AccountMessages.UpdateEndowmentDetailsRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  updateDelegate(
    id: PromiseOrValue<BigNumberish>,
    setting: PromiseOrValue<string>,
    action: PromiseOrValue<string>,
    delegateAddress: PromiseOrValue<string>,
    delegateExpiry: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateEndowmentDetails(
    curDetails: AccountMessages.UpdateEndowmentDetailsRequestStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    updateDelegate(
      id: PromiseOrValue<BigNumberish>,
      setting: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      delegateAddress: PromiseOrValue<string>,
      delegateExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateEndowmentDetails(
      curDetails: AccountMessages.UpdateEndowmentDetailsRequestStruct,
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
  };

  estimateGas: {
    updateDelegate(
      id: PromiseOrValue<BigNumberish>,
      setting: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      delegateAddress: PromiseOrValue<string>,
      delegateExpiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateEndowmentDetails(
      curDetails: AccountMessages.UpdateEndowmentDetailsRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    updateDelegate(
      id: PromiseOrValue<BigNumberish>,
      setting: PromiseOrValue<string>,
      action: PromiseOrValue<string>,
      delegateAddress: PromiseOrValue<string>,
      delegateExpiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateEndowmentDetails(
      curDetails: AccountMessages.UpdateEndowmentDetailsRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
