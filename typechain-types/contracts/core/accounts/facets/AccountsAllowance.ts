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

  export type FeeSettingStruct = {
    payoutAddress: PromiseOrValue<string>;
    bps: PromiseOrValue<BigNumberish>;
  };

  export type FeeSettingStructOutput = [string, BigNumber] & {
    payoutAddress: string;
    bps: BigNumber;
  };

  export type DelegateStruct = {
    addr: PromiseOrValue<string>;
    expires: PromiseOrValue<BigNumberish>;
  };

  export type DelegateStructOutput = [string, BigNumber] & {
    addr: string;
    expires: BigNumber;
  };

  export type SettingsPermissionStruct = {
    locked: PromiseOrValue<boolean>;
    delegate: AngelCoreStruct.DelegateStruct;
  };

  export type SettingsPermissionStructOutput = [
    boolean,
    AngelCoreStruct.DelegateStructOutput
  ] & { locked: boolean; delegate: AngelCoreStruct.DelegateStructOutput };

  export type SettingsControllerStruct = {
    acceptedTokens: AngelCoreStruct.SettingsPermissionStruct;
    lockedInvestmentManagement: AngelCoreStruct.SettingsPermissionStruct;
    liquidInvestmentManagement: AngelCoreStruct.SettingsPermissionStruct;
    allowlistedBeneficiaries: AngelCoreStruct.SettingsPermissionStruct;
    allowlistedContributors: AngelCoreStruct.SettingsPermissionStruct;
    maturityAllowlist: AngelCoreStruct.SettingsPermissionStruct;
    maturityTime: AngelCoreStruct.SettingsPermissionStruct;
    earlyLockedWithdrawFee: AngelCoreStruct.SettingsPermissionStruct;
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
    acceptedTokens: AngelCoreStruct.SettingsPermissionStructOutput;
    lockedInvestmentManagement: AngelCoreStruct.SettingsPermissionStructOutput;
    liquidInvestmentManagement: AngelCoreStruct.SettingsPermissionStructOutput;
    allowlistedBeneficiaries: AngelCoreStruct.SettingsPermissionStructOutput;
    allowlistedContributors: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityAllowlist: AngelCoreStruct.SettingsPermissionStructOutput;
    maturityTime: AngelCoreStruct.SettingsPermissionStructOutput;
    earlyLockedWithdrawFee: AngelCoreStruct.SettingsPermissionStructOutput;
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

export declare namespace AccountStorage {
  export type EndowmentStruct = {
    owner: PromiseOrValue<string>;
    name: PromiseOrValue<string>;
    categories: AngelCoreStruct.CategoriesStruct;
    tier: PromiseOrValue<BigNumberish>;
    endowType: PromiseOrValue<BigNumberish>;
    logo: PromiseOrValue<string>;
    image: PromiseOrValue<string>;
    maturityTime: PromiseOrValue<BigNumberish>;
    strategies: AngelCoreStruct.AccountStrategiesStruct;
    oneoffVaults: AngelCoreStruct.OneOffVaultsStruct;
    rebalance: LocalRegistrarLib.RebalanceParamsStruct;
    kycDonorsOnly: PromiseOrValue<boolean>;
    pendingRedemptions: PromiseOrValue<BigNumberish>;
    proposalLink: PromiseOrValue<BigNumberish>;
    multisig: PromiseOrValue<string>;
    dao: PromiseOrValue<string>;
    daoToken: PromiseOrValue<string>;
    donationMatchActive: PromiseOrValue<boolean>;
    donationMatchContract: PromiseOrValue<string>;
    allowlistedBeneficiaries: PromiseOrValue<string>[];
    allowlistedContributors: PromiseOrValue<string>[];
    maturityAllowlist: PromiseOrValue<string>[];
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStruct;
    withdrawFee: AngelCoreStruct.FeeSettingStruct;
    depositFee: AngelCoreStruct.FeeSettingStruct;
    balanceFee: AngelCoreStruct.FeeSettingStruct;
    settingsController: AngelCoreStruct.SettingsControllerStruct;
    parent: PromiseOrValue<BigNumberish>;
    ignoreUserSplits: PromiseOrValue<boolean>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
    referralId: PromiseOrValue<BigNumberish>;
  };

  export type EndowmentStructOutput = [
    string,
    string,
    AngelCoreStruct.CategoriesStructOutput,
    BigNumber,
    number,
    string,
    string,
    BigNumber,
    AngelCoreStruct.AccountStrategiesStructOutput,
    AngelCoreStruct.OneOffVaultsStructOutput,
    LocalRegistrarLib.RebalanceParamsStructOutput,
    boolean,
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
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.SettingsControllerStructOutput,
    number,
    boolean,
    AngelCoreStruct.SplitDetailsStructOutput,
    BigNumber
  ] & {
    owner: string;
    name: string;
    categories: AngelCoreStruct.CategoriesStructOutput;
    tier: BigNumber;
    endowType: number;
    logo: string;
    image: string;
    maturityTime: BigNumber;
    strategies: AngelCoreStruct.AccountStrategiesStructOutput;
    oneoffVaults: AngelCoreStruct.OneOffVaultsStructOutput;
    rebalance: LocalRegistrarLib.RebalanceParamsStructOutput;
    kycDonorsOnly: boolean;
    pendingRedemptions: BigNumber;
    proposalLink: BigNumber;
    multisig: string;
    dao: string;
    daoToken: string;
    donationMatchActive: boolean;
    donationMatchContract: string;
    allowlistedBeneficiaries: string[];
    allowlistedContributors: string[];
    maturityAllowlist: string[];
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStructOutput;
    withdrawFee: AngelCoreStruct.FeeSettingStructOutput;
    depositFee: AngelCoreStruct.FeeSettingStructOutput;
    balanceFee: AngelCoreStruct.FeeSettingStructOutput;
    settingsController: AngelCoreStruct.SettingsControllerStructOutput;
    parent: number;
    ignoreUserSplits: boolean;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
    referralId: BigNumber;
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
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStruct;
  };

  export type ConfigStructOutput = [
    string,
    string,
    string,
    number,
    BigNumber,
    string,
    string,
    string,
    boolean,
    AngelCoreStruct.FeeSettingStructOutput
  ] & {
    owner: string;
    version: string;
    registrarContract: string;
    nextAccountId: number;
    maxGeneralCategoryId: BigNumber;
    subDao: string;
    gateway: string;
    gasReceiver: string;
    reentrancyGuardLocked: boolean;
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStructOutput;
  };
}

export interface AccountsAllowanceInterface extends utils.Interface {
  functions: {
    "manageAllowances(uint32,uint8,address,address,uint256)": FunctionFragment;
    "spendAllowance(uint32,address,uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "manageAllowances" | "spendAllowance"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "manageAllowances",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "spendAllowance",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "manageAllowances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "spendAllowance",
    data: BytesLike
  ): Result;

  events: {
    "AllowanceStateUpdatedTo(address,address,address,uint256)": EventFragment;
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
  allowance: BigNumber;
}
export type AllowanceStateUpdatedToEvent = TypedEvent<
  [string, string, string, BigNumber],
  AllowanceStateUpdatedToEventObject
>;

export type AllowanceStateUpdatedToEventFilter =
  TypedEventFilter<AllowanceStateUpdatedToEvent>;

export interface DaoContractCreatedEventObject {
  createdaomessage: SubDaoMessage.InstantiateMsgStructOutput;
  daoAddress: string;
}
export type DaoContractCreatedEvent = TypedEvent<
  [SubDaoMessage.InstantiateMsgStructOutput, string],
  DaoContractCreatedEventObject
>;

export type DaoContractCreatedEventFilter =
  TypedEventFilter<DaoContractCreatedEvent>;

export interface DonationDepositedEventObject {
  id: BigNumber;
  amount: BigNumber;
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
  id: BigNumber;
  accountType: number;
  amount: BigNumber;
  tokenin: string;
  tokenout: string;
  amountout: BigNumber;
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

export interface AccountsAllowance extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AccountsAllowanceInterface;

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
    manageAllowances(
      endowId: PromiseOrValue<BigNumberish>,
      action: PromiseOrValue<BigNumberish>,
      spender: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    spendAllowance(
      endowId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  manageAllowances(
    endowId: PromiseOrValue<BigNumberish>,
    action: PromiseOrValue<BigNumberish>,
    spender: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  spendAllowance(
    endowId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    manageAllowances(
      endowId: PromiseOrValue<BigNumberish>,
      action: PromiseOrValue<BigNumberish>,
      spender: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    spendAllowance(
      endowId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AllowanceStateUpdatedTo(address,address,address,uint256)"(
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
      createdaomessage?: null,
      daoAddress?: null
    ): DaoContractCreatedEventFilter;
    DaoContractCreated(
      createdaomessage?: null,
      daoAddress?: null
    ): DaoContractCreatedEventFilter;

    "DonationDeposited(uint256,uint256)"(
      id?: null,
      amount?: null
    ): DonationDepositedEventFilter;
    DonationDeposited(id?: null, amount?: null): DonationDepositedEventFilter;

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
      id?: null,
      accountType?: null,
      amount?: null,
      tokenin?: null,
      tokenout?: null,
      amountout?: null
    ): SwapTokenEventFilter;
    SwapToken(
      id?: null,
      accountType?: null,
      amount?: null,
      tokenin?: null,
      tokenout?: null,
      amountout?: null
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
    manageAllowances(
      endowId: PromiseOrValue<BigNumberish>,
      action: PromiseOrValue<BigNumberish>,
      spender: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    spendAllowance(
      endowId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    manageAllowances(
      endowId: PromiseOrValue<BigNumberish>,
      action: PromiseOrValue<BigNumberish>,
      spender: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    spendAllowance(
      endowId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
