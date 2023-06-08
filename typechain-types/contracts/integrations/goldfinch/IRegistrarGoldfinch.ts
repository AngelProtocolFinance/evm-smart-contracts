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

export declare namespace LocalRegistrarLib {
  export type AngelProtocolParamsStruct = {
    routerAddr: PromiseOrValue<string>;
    refundAddr: PromiseOrValue<string>;
  };

  export type AngelProtocolParamsStructOutput = [string, string] & {
    routerAddr: string;
    refundAddr: string;
  };

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

  export type VaultParamsStruct = {
    Type: PromiseOrValue<BigNumberish>;
    vaultAddr: PromiseOrValue<string>;
  };

  export type VaultParamsStructOutput = [number, string] & {
    Type: number;
    vaultAddr: string;
  };

  export type StrategyParamsStruct = {
    approvalState: PromiseOrValue<BigNumberish>;
    Locked: LocalRegistrarLib.VaultParamsStruct;
    Liquid: LocalRegistrarLib.VaultParamsStruct;
  };

  export type StrategyParamsStructOutput = [
    number,
    LocalRegistrarLib.VaultParamsStructOutput,
    LocalRegistrarLib.VaultParamsStructOutput
  ] & {
    approvalState: number;
    Locked: LocalRegistrarLib.VaultParamsStructOutput;
    Liquid: LocalRegistrarLib.VaultParamsStructOutput;
  };
}

export declare namespace APGoldfinchConfigLib {
  export type CRVParamsStruct = {
    allowedSlippage: PromiseOrValue<BigNumberish>;
  };

  export type CRVParamsStructOutput = [BigNumber] & {
    allowedSlippage: BigNumber;
  };

  export type APGoldfinchConfigStruct = {
    crvParams: APGoldfinchConfigLib.CRVParamsStruct;
  };

  export type APGoldfinchConfigStructOutput = [
    APGoldfinchConfigLib.CRVParamsStructOutput
  ] & { crvParams: APGoldfinchConfigLib.CRVParamsStructOutput };
}

export declare namespace AngelCoreStruct {
  export type FeeSettingStruct = {
    payoutAddress: PromiseOrValue<string>;
    bps: PromiseOrValue<BigNumberish>;
  };

  export type FeeSettingStructOutput = [string, BigNumber] & {
    payoutAddress: string;
    bps: BigNumber;
  };
}

export interface IRegistrarGoldfinchInterface extends utils.Interface {
  functions: {
    "getAPGoldfinchParams()": FunctionFragment;
    "getAccountsContractAddressByChain(string)": FunctionFragment;
    "getAngelProtocolParams()": FunctionFragment;
    "getFeeSettingsByFeeType(uint8)": FunctionFragment;
    "getGasByToken(address)": FunctionFragment;
    "getRebalanceParams()": FunctionFragment;
    "getStrategyApprovalState(bytes4)": FunctionFragment;
    "getStrategyParamsById(bytes4)": FunctionFragment;
    "isTokenAccepted(address)": FunctionFragment;
    "setAccountsContractAddressByChain(string,string)": FunctionFragment;
    "setAngelProtocolParams((address,address))": FunctionFragment;
    "setFeeSettingsByFeesType(uint8,uint256,address)": FunctionFragment;
    "setGasByToken(address,uint256)": FunctionFragment;
    "setRebalanceParams((bool,uint32,uint32,bool,uint32,uint32))": FunctionFragment;
    "setStrategyApprovalState(bytes4,uint8)": FunctionFragment;
    "setStrategyParams(bytes4,address,address,uint8)": FunctionFragment;
    "setTokenAccepted(address,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getAPGoldfinchParams"
      | "getAccountsContractAddressByChain"
      | "getAngelProtocolParams"
      | "getFeeSettingsByFeeType"
      | "getGasByToken"
      | "getRebalanceParams"
      | "getStrategyApprovalState"
      | "getStrategyParamsById"
      | "isTokenAccepted"
      | "setAccountsContractAddressByChain"
      | "setAngelProtocolParams"
      | "setFeeSettingsByFeesType"
      | "setGasByToken"
      | "setRebalanceParams"
      | "setStrategyApprovalState"
      | "setStrategyParams"
      | "setTokenAccepted"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAPGoldfinchParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountsContractAddressByChain",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAngelProtocolParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFeeSettingsByFeeType",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getGasByToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getRebalanceParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategyApprovalState",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategyParamsById",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenAccepted",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAccountsContractAddressByChain",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAngelProtocolParams",
    values: [LocalRegistrarLib.AngelProtocolParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeSettingsByFeesType",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setGasByToken",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRebalanceParams",
    values: [LocalRegistrarLib.RebalanceParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyApprovalState",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyParams",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenAccepted",
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getAPGoldfinchParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountsContractAddressByChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAngelProtocolParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFeeSettingsByFeeType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getGasByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRebalanceParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategyApprovalState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategyParamsById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTokenAccepted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAccountsContractAddressByChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAngelProtocolParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeSettingsByFeesType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setGasByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRebalanceParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategyApprovalState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategyParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenAccepted",
    data: BytesLike
  ): Result;

  events: {
    "AccountsContractStorageChanged(string,string)": EventFragment;
    "AngelProtocolParamsChanged(tuple)": EventFragment;
    "FeeUpdated(uint8,uint256,address)": EventFragment;
    "GasFeeUpdated(address,uint256)": EventFragment;
    "RebalanceParamsChanged(tuple)": EventFragment;
    "StrategyApprovalChanged(bytes4,uint8)": EventFragment;
    "StrategyParamsChanged(bytes4,address,address,uint8)": EventFragment;
    "TokenAcceptanceChanged(address,bool)": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "AccountsContractStorageChanged"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AngelProtocolParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeeUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GasFeeUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RebalanceParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategyApprovalChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategyParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenAcceptanceChanged"): EventFragment;
}

export interface AccountsContractStorageChangedEventObject {
  _chainName: string;
  _accountsContractAddress: string;
}
export type AccountsContractStorageChangedEvent = TypedEvent<
  [string, string],
  AccountsContractStorageChangedEventObject
>;

export type AccountsContractStorageChangedEventFilter =
  TypedEventFilter<AccountsContractStorageChangedEvent>;

export interface AngelProtocolParamsChangedEventObject {
  _newAngelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStructOutput;
}
export type AngelProtocolParamsChangedEvent = TypedEvent<
  [LocalRegistrarLib.AngelProtocolParamsStructOutput],
  AngelProtocolParamsChangedEventObject
>;

export type AngelProtocolParamsChangedEventFilter =
  TypedEventFilter<AngelProtocolParamsChangedEvent>;

export interface FeeUpdatedEventObject {
  _fee: number;
  _rate: BigNumber;
  _payout: string;
}
export type FeeUpdatedEvent = TypedEvent<
  [number, BigNumber, string],
  FeeUpdatedEventObject
>;

export type FeeUpdatedEventFilter = TypedEventFilter<FeeUpdatedEvent>;

export interface GasFeeUpdatedEventObject {
  _tokenAddr: string;
  _gasFee: BigNumber;
}
export type GasFeeUpdatedEvent = TypedEvent<
  [string, BigNumber],
  GasFeeUpdatedEventObject
>;

export type GasFeeUpdatedEventFilter = TypedEventFilter<GasFeeUpdatedEvent>;

export interface RebalanceParamsChangedEventObject {
  _newRebalanceParams: LocalRegistrarLib.RebalanceParamsStructOutput;
}
export type RebalanceParamsChangedEvent = TypedEvent<
  [LocalRegistrarLib.RebalanceParamsStructOutput],
  RebalanceParamsChangedEventObject
>;

export type RebalanceParamsChangedEventFilter =
  TypedEventFilter<RebalanceParamsChangedEvent>;

export interface StrategyApprovalChangedEventObject {
  _strategyId: string;
  _approvalState: number;
}
export type StrategyApprovalChangedEvent = TypedEvent<
  [string, number],
  StrategyApprovalChangedEventObject
>;

export type StrategyApprovalChangedEventFilter =
  TypedEventFilter<StrategyApprovalChangedEvent>;

export interface StrategyParamsChangedEventObject {
  _strategyId: string;
  _lockAddr: string;
  _liqAddr: string;
  _approvalState: number;
}
export type StrategyParamsChangedEvent = TypedEvent<
  [string, string, string, number],
  StrategyParamsChangedEventObject
>;

export type StrategyParamsChangedEventFilter =
  TypedEventFilter<StrategyParamsChangedEvent>;

export interface TokenAcceptanceChangedEventObject {
  _tokenAddr: string;
  _isAccepted: boolean;
}
export type TokenAcceptanceChangedEvent = TypedEvent<
  [string, boolean],
  TokenAcceptanceChangedEventObject
>;

export type TokenAcceptanceChangedEventFilter =
  TypedEventFilter<TokenAcceptanceChangedEvent>;

export interface IRegistrarGoldfinch extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRegistrarGoldfinchInterface;

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
    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<[APGoldfinchConfigLib.APGoldfinchConfigStructOutput]>;

    getAccountsContractAddressByChain(
      _targetChain: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<[LocalRegistrarLib.AngelProtocolParamsStructOutput]>;

    getFeeSettingsByFeeType(
      _feeType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.FeeSettingStructOutput]>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<[LocalRegistrarLib.RebalanceParamsStructOutput]>;

    getStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[LocalRegistrarLib.StrategyParamsStructOutput]>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    setAccountsContractAddressByChain(
      _chainName: PromiseOrValue<string>,
      _accountsContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAngelProtocolParams(
      _angelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFeeSettingsByFeesType(
      _feeType: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      _payout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRebalanceParams(
      _rebalanceParams: LocalRegistrarLib.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _liqAddr: PromiseOrValue<string>,
      _lockAddr: PromiseOrValue<string>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getAPGoldfinchParams(
    overrides?: CallOverrides
  ): Promise<APGoldfinchConfigLib.APGoldfinchConfigStructOutput>;

  getAccountsContractAddressByChain(
    _targetChain: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getAngelProtocolParams(
    overrides?: CallOverrides
  ): Promise<LocalRegistrarLib.AngelProtocolParamsStructOutput>;

  getFeeSettingsByFeeType(
    _feeType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.FeeSettingStructOutput>;

  getGasByToken(
    _tokenAddr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getRebalanceParams(
    overrides?: CallOverrides
  ): Promise<LocalRegistrarLib.RebalanceParamsStructOutput>;

  getStrategyApprovalState(
    _strategyId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<number>;

  getStrategyParamsById(
    _strategyId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<LocalRegistrarLib.StrategyParamsStructOutput>;

  isTokenAccepted(
    _tokenAddr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  setAccountsContractAddressByChain(
    _chainName: PromiseOrValue<string>,
    _accountsContractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAngelProtocolParams(
    _angelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFeeSettingsByFeesType(
    _feeType: PromiseOrValue<BigNumberish>,
    _rate: PromiseOrValue<BigNumberish>,
    _payout: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setGasByToken(
    _tokenAddr: PromiseOrValue<string>,
    _gasFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRebalanceParams(
    _rebalanceParams: LocalRegistrarLib.RebalanceParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStrategyApprovalState(
    _strategyId: PromiseOrValue<BytesLike>,
    _approvalState: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStrategyParams(
    _strategyId: PromiseOrValue<BytesLike>,
    _liqAddr: PromiseOrValue<string>,
    _lockAddr: PromiseOrValue<string>,
    _approvalState: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenAccepted(
    _tokenAddr: PromiseOrValue<string>,
    _isAccepted: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<APGoldfinchConfigLib.APGoldfinchConfigStructOutput>;

    getAccountsContractAddressByChain(
      _targetChain: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<LocalRegistrarLib.AngelProtocolParamsStructOutput>;

    getFeeSettingsByFeeType(
      _feeType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.FeeSettingStructOutput>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<LocalRegistrarLib.RebalanceParamsStructOutput>;

    getStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<number>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<LocalRegistrarLib.StrategyParamsStructOutput>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    setAccountsContractAddressByChain(
      _chainName: PromiseOrValue<string>,
      _accountsContractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAngelProtocolParams(
      _angelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeeSettingsByFeesType(
      _feeType: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      _payout: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRebalanceParams(
      _rebalanceParams: LocalRegistrarLib.RebalanceParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _liqAddr: PromiseOrValue<string>,
      _lockAddr: PromiseOrValue<string>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AccountsContractStorageChanged(string,string)"(
      _chainName?: PromiseOrValue<string> | null,
      _accountsContractAddress?: PromiseOrValue<string> | null
    ): AccountsContractStorageChangedEventFilter;
    AccountsContractStorageChanged(
      _chainName?: PromiseOrValue<string> | null,
      _accountsContractAddress?: PromiseOrValue<string> | null
    ): AccountsContractStorageChangedEventFilter;

    "AngelProtocolParamsChanged(tuple)"(
      _newAngelProtocolParams?: null
    ): AngelProtocolParamsChangedEventFilter;
    AngelProtocolParamsChanged(
      _newAngelProtocolParams?: null
    ): AngelProtocolParamsChangedEventFilter;

    "FeeUpdated(uint8,uint256,address)"(
      _fee?: null,
      _rate?: null,
      _payout?: null
    ): FeeUpdatedEventFilter;
    FeeUpdated(
      _fee?: null,
      _rate?: null,
      _payout?: null
    ): FeeUpdatedEventFilter;

    "GasFeeUpdated(address,uint256)"(
      _tokenAddr?: PromiseOrValue<string> | null,
      _gasFee?: null
    ): GasFeeUpdatedEventFilter;
    GasFeeUpdated(
      _tokenAddr?: PromiseOrValue<string> | null,
      _gasFee?: null
    ): GasFeeUpdatedEventFilter;

    "RebalanceParamsChanged(tuple)"(
      _newRebalanceParams?: null
    ): RebalanceParamsChangedEventFilter;
    RebalanceParamsChanged(
      _newRebalanceParams?: null
    ): RebalanceParamsChangedEventFilter;

    "StrategyApprovalChanged(bytes4,uint8)"(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _approvalState?: null
    ): StrategyApprovalChangedEventFilter;
    StrategyApprovalChanged(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _approvalState?: null
    ): StrategyApprovalChangedEventFilter;

    "StrategyParamsChanged(bytes4,address,address,uint8)"(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _lockAddr?: PromiseOrValue<string> | null,
      _liqAddr?: PromiseOrValue<string> | null,
      _approvalState?: null
    ): StrategyParamsChangedEventFilter;
    StrategyParamsChanged(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _lockAddr?: PromiseOrValue<string> | null,
      _liqAddr?: PromiseOrValue<string> | null,
      _approvalState?: null
    ): StrategyParamsChangedEventFilter;

    "TokenAcceptanceChanged(address,bool)"(
      _tokenAddr?: PromiseOrValue<string> | null,
      _isAccepted?: null
    ): TokenAcceptanceChangedEventFilter;
    TokenAcceptanceChanged(
      _tokenAddr?: PromiseOrValue<string> | null,
      _isAccepted?: null
    ): TokenAcceptanceChangedEventFilter;
  };

  estimateGas: {
    getAPGoldfinchParams(overrides?: CallOverrides): Promise<BigNumber>;

    getAccountsContractAddressByChain(
      _targetChain: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAngelProtocolParams(overrides?: CallOverrides): Promise<BigNumber>;

    getFeeSettingsByFeeType(
      _feeType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRebalanceParams(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAccountsContractAddressByChain(
      _chainName: PromiseOrValue<string>,
      _accountsContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAngelProtocolParams(
      _angelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFeeSettingsByFeesType(
      _feeType: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      _payout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRebalanceParams(
      _rebalanceParams: LocalRegistrarLib.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _liqAddr: PromiseOrValue<string>,
      _lockAddr: PromiseOrValue<string>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAccountsContractAddressByChain(
      _targetChain: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFeeSettingsByFeeType(
      _feeType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAccountsContractAddressByChain(
      _chainName: PromiseOrValue<string>,
      _accountsContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAngelProtocolParams(
      _angelProtocolParams: LocalRegistrarLib.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFeeSettingsByFeesType(
      _feeType: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      _payout: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRebalanceParams(
      _rebalanceParams: LocalRegistrarLib.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStrategyApprovalState(
      _strategyId: PromiseOrValue<BytesLike>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _liqAddr: PromiseOrValue<string>,
      _lockAddr: PromiseOrValue<string>,
      _approvalState: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
