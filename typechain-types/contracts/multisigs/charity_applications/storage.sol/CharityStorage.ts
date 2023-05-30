/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {FunctionFragment, Result} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace AngelCoreStruct {
  export type CategoriesStruct = {
    sdgs: PromiseOrValue<BigNumberish>[];
    general: PromiseOrValue<BigNumberish>[];
  };

  export type CategoriesStructOutput = [BigNumber[], BigNumber[]] & {
    sdgs: BigNumber[];
    general: BigNumber[];
  };

  export type DurationDataStruct = {
    height: PromiseOrValue<BigNumberish>;
    time: PromiseOrValue<BigNumberish>;
  };

  export type DurationDataStructOutput = [BigNumber, BigNumber] & {
    height: BigNumber;
    time: BigNumber;
  };

  export type DurationStruct = {
    enumData: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.DurationDataStruct;
  };

  export type DurationStructOutput = [number, AngelCoreStruct.DurationDataStructOutput] & {
    enumData: number;
    data: AngelCoreStruct.DurationDataStructOutput;
  };

  export type FeeSettingStruct = {
    payoutAddress: PromiseOrValue<string>;
    feeRate: PromiseOrValue<BigNumberish>;
  };

  export type FeeSettingStructOutput = [string, BigNumber] & {
    payoutAddress: string;
    feeRate: BigNumber;
  };

  export type VeTypeDataStruct = {
    value: PromiseOrValue<BigNumberish>;
    scale: PromiseOrValue<BigNumberish>;
    slope: PromiseOrValue<BigNumberish>;
    power: PromiseOrValue<BigNumberish>;
  };

  export type VeTypeDataStructOutput = [BigNumber, BigNumber, BigNumber, BigNumber] & {
    value: BigNumber;
    scale: BigNumber;
    slope: BigNumber;
    power: BigNumber;
  };

  export type VeTypeStruct = {
    ve_type: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.VeTypeDataStruct;
  };

  export type VeTypeStructOutput = [number, AngelCoreStruct.VeTypeDataStructOutput] & {
    ve_type: number;
    data: AngelCoreStruct.VeTypeDataStructOutput;
  };

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

  export type DaoTokenStructOutput = [number, AngelCoreStruct.DaoTokenDataStructOutput] & {
    token: number;
    data: AngelCoreStruct.DaoTokenDataStructOutput;
  };

  export type DaoSetupStruct = {
    quorum: PromiseOrValue<BigNumberish>;
    threshold: PromiseOrValue<BigNumberish>;
    votingPeriod: PromiseOrValue<BigNumberish>;
    timelockPeriod: PromiseOrValue<BigNumberish>;
    expirationPeriod: PromiseOrValue<BigNumberish>;
    proposalDeposit: PromiseOrValue<BigNumberish>;
    snapshotPeriod: PromiseOrValue<BigNumberish>;
    token: AngelCoreStruct.DaoTokenStruct;
  };

  export type DaoSetupStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.DaoTokenStructOutput
  ] & {
    quorum: BigNumber;
    threshold: BigNumber;
    votingPeriod: BigNumber;
    timelockPeriod: BigNumber;
    expirationPeriod: BigNumber;
    proposalDeposit: BigNumber;
    snapshotPeriod: BigNumber;
    token: AngelCoreStruct.DaoTokenStructOutput;
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

  export type SettingsPermissionStructOutput = [boolean, AngelCoreStruct.DelegateStructOutput] & {
    locked: boolean;
    delegate: AngelCoreStruct.DelegateStructOutput;
  };

  export type SettingsControllerStruct = {
    strategies: AngelCoreStruct.SettingsPermissionStruct;
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
    strategies: AngelCoreStruct.SettingsPermissionStructOutput;
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

export declare namespace AccountMessages {
  export type CreateEndowmentRequestStruct = {
    owner: PromiseOrValue<string>;
    withdrawBeforeMaturity: PromiseOrValue<boolean>;
    maturityTime: PromiseOrValue<BigNumberish>;
    maturityHeight: PromiseOrValue<BigNumberish>;
    name: PromiseOrValue<string>;
    categories: AngelCoreStruct.CategoriesStruct;
    tier: PromiseOrValue<BigNumberish>;
    endowType: PromiseOrValue<BigNumberish>;
    logo: PromiseOrValue<string>;
    image: PromiseOrValue<string>;
    members: PromiseOrValue<string>[];
    kycDonorsOnly: PromiseOrValue<boolean>;
    threshold: PromiseOrValue<BigNumberish>;
    maxVotingPeriod: AngelCoreStruct.DurationStruct;
    allowlistedBeneficiaries: PromiseOrValue<string>[];
    allowlistedContributors: PromiseOrValue<string>[];
    splitMax: PromiseOrValue<BigNumberish>;
    splitMin: PromiseOrValue<BigNumberish>;
    splitDefault: PromiseOrValue<BigNumberish>;
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStruct;
    withdrawFee: AngelCoreStruct.FeeSettingStruct;
    depositFee: AngelCoreStruct.FeeSettingStruct;
    balanceFee: AngelCoreStruct.FeeSettingStruct;
    dao: AngelCoreStruct.DaoSetupStruct;
    createDao: PromiseOrValue<boolean>;
    proposalLink: PromiseOrValue<BigNumberish>;
    settingsController: AngelCoreStruct.SettingsControllerStruct;
    parent: PromiseOrValue<BigNumberish>;
    maturityAllowlist: PromiseOrValue<string>[];
    ignoreUserSplits: PromiseOrValue<boolean>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
    referralId: PromiseOrValue<BigNumberish>;
  };

  export type CreateEndowmentRequestStructOutput = [
    string,
    boolean,
    BigNumber,
    BigNumber,
    string,
    AngelCoreStruct.CategoriesStructOutput,
    BigNumber,
    number,
    string,
    string,
    string[],
    boolean,
    BigNumber,
    AngelCoreStruct.DurationStructOutput,
    string[],
    string[],
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.FeeSettingStructOutput,
    AngelCoreStruct.DaoSetupStructOutput,
    boolean,
    BigNumber,
    AngelCoreStruct.SettingsControllerStructOutput,
    number,
    string[],
    boolean,
    AngelCoreStruct.SplitDetailsStructOutput,
    BigNumber
  ] & {
    owner: string;
    withdrawBeforeMaturity: boolean;
    maturityTime: BigNumber;
    maturityHeight: BigNumber;
    name: string;
    categories: AngelCoreStruct.CategoriesStructOutput;
    tier: BigNumber;
    endowType: number;
    logo: string;
    image: string;
    members: string[];
    kycDonorsOnly: boolean;
    threshold: BigNumber;
    maxVotingPeriod: AngelCoreStruct.DurationStructOutput;
    allowlistedBeneficiaries: string[];
    allowlistedContributors: string[];
    splitMax: BigNumber;
    splitMin: BigNumber;
    splitDefault: BigNumber;
    earlyLockedWithdrawFee: AngelCoreStruct.FeeSettingStructOutput;
    withdrawFee: AngelCoreStruct.FeeSettingStructOutput;
    depositFee: AngelCoreStruct.FeeSettingStructOutput;
    balanceFee: AngelCoreStruct.FeeSettingStructOutput;
    dao: AngelCoreStruct.DaoSetupStructOutput;
    createDao: boolean;
    proposalLink: BigNumber;
    settingsController: AngelCoreStruct.SettingsControllerStructOutput;
    parent: number;
    maturityAllowlist: string[];
    ignoreUserSplits: boolean;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
    referralId: BigNumber;
  };
}

export interface CharityStorageInterface extends utils.Interface {
  functions: {
    "config()": FunctionFragment;
    "proposals(uint256)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "config" | "proposals"): FunctionFragment;

  encodeFunctionData(functionFragment: "config", values?: undefined): string;
  encodeFunctionData(functionFragment: "proposals", values: [PromiseOrValue<BigNumberish>]): string;

  decodeFunctionResult(functionFragment: "config", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proposals", data: BytesLike): Result;

  events: {};
}

export interface CharityStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CharityStorageInterface;

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
    config(overrides?: CallOverrides): Promise<
      [BigNumber, string, string, BigNumber, boolean, BigNumber, boolean, string, BigNumber] & {
        proposalExpiry: BigNumber;
        applicationMultisig: string;
        accountsContract: string;
        seedSplitToLiquid: BigNumber;
        newEndowGasMoney: boolean;
        gasAmount: BigNumber;
        fundSeedAsset: boolean;
        seedAsset: string;
        seedAssetAmount: BigNumber;
      }
    >;

    proposals(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        AccountMessages.CreateEndowmentRequestStructOutput,
        string,
        BigNumber,
        number
      ] & {
        proposalId: BigNumber;
        proposer: string;
        charityApplication: AccountMessages.CreateEndowmentRequestStructOutput;
        meta: string;
        expiry: BigNumber;
        status: number;
      }
    >;
  };

  config(overrides?: CallOverrides): Promise<
    [BigNumber, string, string, BigNumber, boolean, BigNumber, boolean, string, BigNumber] & {
      proposalExpiry: BigNumber;
      applicationMultisig: string;
      accountsContract: string;
      seedSplitToLiquid: BigNumber;
      newEndowGasMoney: boolean;
      gasAmount: BigNumber;
      fundSeedAsset: boolean;
      seedAsset: string;
      seedAssetAmount: BigNumber;
    }
  >;

  proposals(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      AccountMessages.CreateEndowmentRequestStructOutput,
      string,
      BigNumber,
      number
    ] & {
      proposalId: BigNumber;
      proposer: string;
      charityApplication: AccountMessages.CreateEndowmentRequestStructOutput;
      meta: string;
      expiry: BigNumber;
      status: number;
    }
  >;

  callStatic: {
    config(overrides?: CallOverrides): Promise<
      [BigNumber, string, string, BigNumber, boolean, BigNumber, boolean, string, BigNumber] & {
        proposalExpiry: BigNumber;
        applicationMultisig: string;
        accountsContract: string;
        seedSplitToLiquid: BigNumber;
        newEndowGasMoney: boolean;
        gasAmount: BigNumber;
        fundSeedAsset: boolean;
        seedAsset: string;
        seedAssetAmount: BigNumber;
      }
    >;

    proposals(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        AccountMessages.CreateEndowmentRequestStructOutput,
        string,
        BigNumber,
        number
      ] & {
        proposalId: BigNumber;
        proposer: string;
        charityApplication: AccountMessages.CreateEndowmentRequestStructOutput;
        meta: string;
        expiry: BigNumber;
        status: number;
      }
    >;
  };

  filters: {};

  estimateGas: {
    config(overrides?: CallOverrides): Promise<BigNumber>;

    proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    config(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposals(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
