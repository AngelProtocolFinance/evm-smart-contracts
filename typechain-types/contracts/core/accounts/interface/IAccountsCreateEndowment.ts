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
  export type CategoriesStruct = {
    sdgs: PromiseOrValue<BigNumberish>[];
    general: PromiseOrValue<BigNumberish>[];
  };

  export type CategoriesStructOutput = [BigNumber[], BigNumber[]] & {
    sdgs: BigNumber[];
    general: BigNumber[];
  };

  export type ThresholdDataStruct = {
    weight: PromiseOrValue<BigNumberish>;
    percentage: PromiseOrValue<BigNumberish>;
    threshold: PromiseOrValue<BigNumberish>;
    quorum: PromiseOrValue<BigNumberish>;
  };

  export type ThresholdDataStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    weight: BigNumber;
    percentage: BigNumber;
    threshold: BigNumber;
    quorum: BigNumber;
  };

  export type ThresholdStruct = {
    enumData: PromiseOrValue<BigNumberish>;
    data: AngelCoreStruct.ThresholdDataStruct;
  };

  export type ThresholdStructOutput = [
    number,
    AngelCoreStruct.ThresholdDataStructOutput
  ] & { enumData: number; data: AngelCoreStruct.ThresholdDataStructOutput };

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

  export type DurationStructOutput = [
    number,
    AngelCoreStruct.DurationDataStructOutput
  ] & { enumData: number; data: AngelCoreStruct.DurationDataStructOutput };

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
    Addr: PromiseOrValue<string>;
    expires: PromiseOrValue<BigNumberish>;
  };

  export type DelegateStructOutput = [string, BigNumber] & {
    Addr: string;
    expires: BigNumber;
  };

  export type SettingsPermissionStruct = {
    modifiableAfterInit: PromiseOrValue<boolean>;
    delegate: AngelCoreStruct.DelegateStruct;
  };

  export type SettingsPermissionStructOutput = [
    boolean,
    AngelCoreStruct.DelegateStructOutput
  ] & {
    modifiableAfterInit: boolean;
    delegate: AngelCoreStruct.DelegateStructOutput;
  };

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

export declare namespace AccountMessages {
  export type CreateEndowmentRequestStruct = {
    owner: PromiseOrValue<string>;
    withdrawBeforeMaturity: PromiseOrValue<boolean>;
    maturityTime: PromiseOrValue<BigNumberish>;
    maturityHeight: PromiseOrValue<BigNumberish>;
    name: PromiseOrValue<string>;
    categories: AngelCoreStruct.CategoriesStruct;
    tier: PromiseOrValue<BigNumberish>;
    endow_type: PromiseOrValue<BigNumberish>;
    logo: PromiseOrValue<string>;
    image: PromiseOrValue<string>;
    cw4_members: PromiseOrValue<string>[];
    cw3Threshold: AngelCoreStruct.ThresholdStruct;
    cw3MaxVotingPeriod: AngelCoreStruct.DurationStruct;
    allowlistedBeneficiaries: PromiseOrValue<string>[];
    allowlistedContributors: PromiseOrValue<string>[];
    splitMax: PromiseOrValue<BigNumberish>;
    splitMin: PromiseOrValue<BigNumberish>;
    splitDefault: PromiseOrValue<BigNumberish>;
    earningsFee: AngelCoreStruct.EndowmentFeeStruct;
    withdrawFee: AngelCoreStruct.EndowmentFeeStruct;
    depositFee: AngelCoreStruct.EndowmentFeeStruct;
    balanceFee: AngelCoreStruct.EndowmentFeeStruct;
    dao: AngelCoreStruct.DaoSetupStruct;
    createDao: PromiseOrValue<boolean>;
    proposalLink: PromiseOrValue<BigNumberish>;
    settingsController: AngelCoreStruct.SettingsControllerStruct;
    parent: PromiseOrValue<BigNumberish>;
    maturityAllowlist: PromiseOrValue<string>[];
    ignoreUserSplits: PromiseOrValue<boolean>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
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
    AngelCoreStruct.ThresholdStructOutput,
    AngelCoreStruct.DurationStructOutput,
    string[],
    string[],
    BigNumber,
    BigNumber,
    BigNumber,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.EndowmentFeeStructOutput,
    AngelCoreStruct.DaoSetupStructOutput,
    boolean,
    BigNumber,
    AngelCoreStruct.SettingsControllerStructOutput,
    BigNumber,
    string[],
    boolean,
    AngelCoreStruct.SplitDetailsStructOutput
  ] & {
    owner: string;
    withdrawBeforeMaturity: boolean;
    maturityTime: BigNumber;
    maturityHeight: BigNumber;
    name: string;
    categories: AngelCoreStruct.CategoriesStructOutput;
    tier: BigNumber;
    endow_type: number;
    logo: string;
    image: string;
    cw4_members: string[];
    cw3Threshold: AngelCoreStruct.ThresholdStructOutput;
    cw3MaxVotingPeriod: AngelCoreStruct.DurationStructOutput;
    allowlistedBeneficiaries: string[];
    allowlistedContributors: string[];
    splitMax: BigNumber;
    splitMin: BigNumber;
    splitDefault: BigNumber;
    earningsFee: AngelCoreStruct.EndowmentFeeStructOutput;
    withdrawFee: AngelCoreStruct.EndowmentFeeStructOutput;
    depositFee: AngelCoreStruct.EndowmentFeeStructOutput;
    balanceFee: AngelCoreStruct.EndowmentFeeStructOutput;
    dao: AngelCoreStruct.DaoSetupStructOutput;
    createDao: boolean;
    proposalLink: BigNumber;
    settingsController: AngelCoreStruct.SettingsControllerStructOutput;
    parent: BigNumber;
    maturityAllowlist: string[];
    ignoreUserSplits: boolean;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
  };
}

export interface IAccountsCreateEndowmentInterface extends utils.Interface {
  functions: {
    "createEndowment((address,bool,uint256,uint256,string,(uint256[],uint256[]),uint256,uint8,string,string,address[],(uint8,(uint256,uint256,uint256,uint256)),(uint8,(uint256,uint256)),address[],address[],uint256,uint256,uint256,(address,uint256,bool),(address,uint256,bool),(address,uint256,bool),(address,uint256,bool),(uint256,uint256,uint256,uint256,uint256,uint128,uint256,(uint8,(address,uint256,string,string,(uint8,(uint128,uint256,uint128,uint128)),string,string,uint256,address,uint256,uint256))),bool,uint256,((bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256)),(bool,(address,uint256))),uint256,address[],bool,(uint256,uint256,uint256)))": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "createEndowment"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createEndowment",
    values: [AccountMessages.CreateEndowmentRequestStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "createEndowment",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IAccountsCreateEndowment extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAccountsCreateEndowmentInterface;

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
    createEndowment(
      curDetails: AccountMessages.CreateEndowmentRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createEndowment(
    curDetails: AccountMessages.CreateEndowmentRequestStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createEndowment(
      curDetails: AccountMessages.CreateEndowmentRequestStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    createEndowment(
      curDetails: AccountMessages.CreateEndowmentRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createEndowment(
      curDetails: AccountMessages.CreateEndowmentRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
