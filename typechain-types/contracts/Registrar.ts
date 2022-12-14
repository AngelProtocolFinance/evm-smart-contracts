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
} from "../common";

export declare namespace IRegistrar {
  export type AngelProtocolParamsStruct = {
    protocolTaxRate: PromiseOrValue<BigNumberish>;
    protocolTaxBasis: PromiseOrValue<BigNumberish>;
    protocolTaxCollector: PromiseOrValue<string>;
    primaryChain: PromiseOrValue<string>;
    primaryChainRouter: PromiseOrValue<string>;
    routerAddr: PromiseOrValue<string>;
  };

  export type AngelProtocolParamsStructOutput = [
    number,
    number,
    string,
    string,
    string,
    string
  ] & {
    protocolTaxRate: number;
    protocolTaxBasis: number;
    protocolTaxCollector: string;
    primaryChain: string;
    primaryChainRouter: string;
    routerAddr: string;
  };

  export type RebalanceParamsStruct = {
    rebalanceLiquidProfits: PromiseOrValue<boolean>;
    lockedRebalanceToLiquid: PromiseOrValue<BigNumberish>;
    interestDistribution: PromiseOrValue<BigNumberish>;
    lockedPrincipleToLiquid: PromiseOrValue<boolean>;
    principleDistribution: PromiseOrValue<BigNumberish>;
  };

  export type RebalanceParamsStructOutput = [
    boolean,
    number,
    number,
    boolean,
    number
  ] & {
    rebalanceLiquidProfits: boolean;
    lockedRebalanceToLiquid: number;
    interestDistribution: number;
    lockedPrincipleToLiquid: boolean;
    principleDistribution: number;
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
    isApproved: PromiseOrValue<boolean>;
    Locked: IRegistrar.VaultParamsStruct;
    Liquid: IRegistrar.VaultParamsStruct;
  };

  export type StrategyParamsStructOutput = [
    boolean,
    IRegistrar.VaultParamsStructOutput,
    IRegistrar.VaultParamsStructOutput
  ] & {
    isApproved: boolean;
    Locked: IRegistrar.VaultParamsStructOutput;
    Liquid: IRegistrar.VaultParamsStructOutput;
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

export interface RegistrarInterface extends utils.Interface {
  functions: {
    "angelProtocolParams()": FunctionFragment;
    "apGoldfinch()": FunctionFragment;
    "getAPGoldfinchParams()": FunctionFragment;
    "getAngelProtocolParams()": FunctionFragment;
    "getGasByToken(address)": FunctionFragment;
    "getRebalanceParams()": FunctionFragment;
    "getStrategyParamsById(bytes4)": FunctionFragment;
    "initialize()": FunctionFragment;
    "isStrategyApproved(bytes4)": FunctionFragment;
    "isTokenAccepted(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "rebalanceParams()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAPGoldfinchParams(((uint256)))": FunctionFragment;
    "setAngelProtocolParams((uint32,uint32,address,string,string,address))": FunctionFragment;
    "setGasByToken(address,uint256)": FunctionFragment;
    "setRebalanceParams((bool,uint32,uint32,bool,uint32))": FunctionFragment;
    "setStrategyApproved(bytes4,bool)": FunctionFragment;
    "setStrategyParams(bytes4,address,address,bool)": FunctionFragment;
    "setTokenAccepted(address,bool)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "angelProtocolParams"
      | "apGoldfinch"
      | "getAPGoldfinchParams"
      | "getAngelProtocolParams"
      | "getGasByToken"
      | "getRebalanceParams"
      | "getStrategyParamsById"
      | "initialize"
      | "isStrategyApproved"
      | "isTokenAccepted"
      | "owner"
      | "rebalanceParams"
      | "renounceOwnership"
      | "setAPGoldfinchParams"
      | "setAngelProtocolParams"
      | "setGasByToken"
      | "setRebalanceParams"
      | "setStrategyApproved"
      | "setStrategyParams"
      | "setTokenAccepted"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "angelProtocolParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "apGoldfinch",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAPGoldfinchParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAngelProtocolParams",
    values?: undefined
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
    functionFragment: "getStrategyParamsById",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isStrategyApproved",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenAccepted",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rebalanceParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAPGoldfinchParams",
    values: [APGoldfinchConfigLib.APGoldfinchConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setAngelProtocolParams",
    values: [IRegistrar.AngelProtocolParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setGasByToken",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRebalanceParams",
    values: [IRegistrar.RebalanceParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyApproved",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyParams",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenAccepted",
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "angelProtocolParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "apGoldfinch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAPGoldfinchParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAngelProtocolParams",
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
    functionFragment: "getStrategyParamsById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isStrategyApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTokenAccepted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rebalanceParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAPGoldfinchParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAngelProtocolParams",
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
    functionFragment: "setStrategyApproved",
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
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AngelProtocolParamsChanged(tuple)": EventFragment;
    "GasFeeUpdated(address,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RebalanceParamsChanged(tuple)": EventFragment;
    "StrategyApprovalChanged(bytes4,bool)": EventFragment;
    "StrategyParamsChanged(bytes4,address,address,bool)": EventFragment;
    "TokenAcceptanceChanged(address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AngelProtocolParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GasFeeUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RebalanceParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategyApprovalChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategyParamsChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenAcceptanceChanged"): EventFragment;
}

export interface AngelProtocolParamsChangedEventObject {
  newAngelProtocolParams: IRegistrar.AngelProtocolParamsStructOutput;
}
export type AngelProtocolParamsChangedEvent = TypedEvent<
  [IRegistrar.AngelProtocolParamsStructOutput],
  AngelProtocolParamsChangedEventObject
>;

export type AngelProtocolParamsChangedEventFilter =
  TypedEventFilter<AngelProtocolParamsChangedEvent>;

export interface GasFeeUpdatedEventObject {
  _tokenAddr: string;
  _gasFee: BigNumber;
}
export type GasFeeUpdatedEvent = TypedEvent<
  [string, BigNumber],
  GasFeeUpdatedEventObject
>;

export type GasFeeUpdatedEventFilter = TypedEventFilter<GasFeeUpdatedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface RebalanceParamsChangedEventObject {
  newRebalanceParams: IRegistrar.RebalanceParamsStructOutput;
}
export type RebalanceParamsChangedEvent = TypedEvent<
  [IRegistrar.RebalanceParamsStructOutput],
  RebalanceParamsChangedEventObject
>;

export type RebalanceParamsChangedEventFilter =
  TypedEventFilter<RebalanceParamsChangedEvent>;

export interface StrategyApprovalChangedEventObject {
  _strategyId: string;
  _isApproved: boolean;
}
export type StrategyApprovalChangedEvent = TypedEvent<
  [string, boolean],
  StrategyApprovalChangedEventObject
>;

export type StrategyApprovalChangedEventFilter =
  TypedEventFilter<StrategyApprovalChangedEvent>;

export interface StrategyParamsChangedEventObject {
  _strategyId: string;
  _lockAddr: string;
  _liqAddr: string;
  _isApproved: boolean;
}
export type StrategyParamsChangedEvent = TypedEvent<
  [string, string, string, boolean],
  StrategyParamsChangedEventObject
>;

export type StrategyParamsChangedEventFilter =
  TypedEventFilter<StrategyParamsChangedEvent>;

export interface TokenAcceptanceChangedEventObject {
  tokenAddr: string;
  isAccepted: boolean;
}
export type TokenAcceptanceChangedEvent = TypedEvent<
  [string, boolean],
  TokenAcceptanceChangedEventObject
>;

export type TokenAcceptanceChangedEventFilter =
  TypedEventFilter<TokenAcceptanceChangedEvent>;

export interface Registrar extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RegistrarInterface;

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
    angelProtocolParams(
      overrides?: CallOverrides
    ): Promise<
      [number, number, string, string, string, string] & {
        protocolTaxRate: number;
        protocolTaxBasis: number;
        protocolTaxCollector: string;
        primaryChain: string;
        primaryChainRouter: string;
        routerAddr: string;
      }
    >;

    apGoldfinch(
      overrides?: CallOverrides
    ): Promise<
      [APGoldfinchConfigLib.CRVParamsStructOutput] & {
        crvParams: APGoldfinchConfigLib.CRVParamsStructOutput;
      }
    >;

    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<[APGoldfinchConfigLib.APGoldfinchConfigStructOutput]>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<[IRegistrar.AngelProtocolParamsStructOutput]>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<[IRegistrar.RebalanceParamsStructOutput]>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[IRegistrar.StrategyParamsStructOutput]>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rebalanceParams(
      overrides?: CallOverrides
    ): Promise<
      [boolean, number, number, boolean, number] & {
        rebalanceLiquidProfits: boolean;
        lockedRebalanceToLiquid: number;
        interestDistribution: number;
        lockedPrincipleToLiquid: boolean;
        principleDistribution: number;
      }
    >;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAPGoldfinchParams(
      _apGoldfinch: APGoldfinchConfigLib.APGoldfinchConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAngelProtocolParams(
      _angelProtocolParams: IRegistrar.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRebalanceParams(
      _rebalanceParams: IRegistrar.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _lockAddr: PromiseOrValue<string>,
      _liqAddr: PromiseOrValue<string>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  angelProtocolParams(
    overrides?: CallOverrides
  ): Promise<
    [number, number, string, string, string, string] & {
      protocolTaxRate: number;
      protocolTaxBasis: number;
      protocolTaxCollector: string;
      primaryChain: string;
      primaryChainRouter: string;
      routerAddr: string;
    }
  >;

  apGoldfinch(
    overrides?: CallOverrides
  ): Promise<APGoldfinchConfigLib.CRVParamsStructOutput>;

  getAPGoldfinchParams(
    overrides?: CallOverrides
  ): Promise<APGoldfinchConfigLib.APGoldfinchConfigStructOutput>;

  getAngelProtocolParams(
    overrides?: CallOverrides
  ): Promise<IRegistrar.AngelProtocolParamsStructOutput>;

  getGasByToken(
    _tokenAddr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getRebalanceParams(
    overrides?: CallOverrides
  ): Promise<IRegistrar.RebalanceParamsStructOutput>;

  getStrategyParamsById(
    _strategyId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<IRegistrar.StrategyParamsStructOutput>;

  initialize(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isStrategyApproved(
    _strategyId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isTokenAccepted(
    _tokenAddr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  rebalanceParams(
    overrides?: CallOverrides
  ): Promise<
    [boolean, number, number, boolean, number] & {
      rebalanceLiquidProfits: boolean;
      lockedRebalanceToLiquid: number;
      interestDistribution: number;
      lockedPrincipleToLiquid: boolean;
      principleDistribution: number;
    }
  >;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAPGoldfinchParams(
    _apGoldfinch: APGoldfinchConfigLib.APGoldfinchConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAngelProtocolParams(
    _angelProtocolParams: IRegistrar.AngelProtocolParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setGasByToken(
    _tokenAddr: PromiseOrValue<string>,
    _gasFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRebalanceParams(
    _rebalanceParams: IRegistrar.RebalanceParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStrategyApproved(
    _strategyId: PromiseOrValue<BytesLike>,
    _isApproved: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStrategyParams(
    _strategyId: PromiseOrValue<BytesLike>,
    _lockAddr: PromiseOrValue<string>,
    _liqAddr: PromiseOrValue<string>,
    _isApproved: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenAccepted(
    _tokenAddr: PromiseOrValue<string>,
    _isAccepted: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    angelProtocolParams(
      overrides?: CallOverrides
    ): Promise<
      [number, number, string, string, string, string] & {
        protocolTaxRate: number;
        protocolTaxBasis: number;
        protocolTaxCollector: string;
        primaryChain: string;
        primaryChainRouter: string;
        routerAddr: string;
      }
    >;

    apGoldfinch(
      overrides?: CallOverrides
    ): Promise<APGoldfinchConfigLib.CRVParamsStructOutput>;

    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<APGoldfinchConfigLib.APGoldfinchConfigStructOutput>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<IRegistrar.AngelProtocolParamsStructOutput>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<IRegistrar.RebalanceParamsStructOutput>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<IRegistrar.StrategyParamsStructOutput>;

    initialize(overrides?: CallOverrides): Promise<void>;

    isStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    rebalanceParams(
      overrides?: CallOverrides
    ): Promise<
      [boolean, number, number, boolean, number] & {
        rebalanceLiquidProfits: boolean;
        lockedRebalanceToLiquid: number;
        interestDistribution: number;
        lockedPrincipleToLiquid: boolean;
        principleDistribution: number;
      }
    >;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAPGoldfinchParams(
      _apGoldfinch: APGoldfinchConfigLib.APGoldfinchConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setAngelProtocolParams(
      _angelProtocolParams: IRegistrar.AngelProtocolParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRebalanceParams(
      _rebalanceParams: IRegistrar.RebalanceParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _lockAddr: PromiseOrValue<string>,
      _liqAddr: PromiseOrValue<string>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AngelProtocolParamsChanged(tuple)"(
      newAngelProtocolParams?: null
    ): AngelProtocolParamsChangedEventFilter;
    AngelProtocolParamsChanged(
      newAngelProtocolParams?: null
    ): AngelProtocolParamsChangedEventFilter;

    "GasFeeUpdated(address,uint256)"(
      _tokenAddr?: PromiseOrValue<string> | null,
      _gasFee?: null
    ): GasFeeUpdatedEventFilter;
    GasFeeUpdated(
      _tokenAddr?: PromiseOrValue<string> | null,
      _gasFee?: null
    ): GasFeeUpdatedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RebalanceParamsChanged(tuple)"(
      newRebalanceParams?: null
    ): RebalanceParamsChangedEventFilter;
    RebalanceParamsChanged(
      newRebalanceParams?: null
    ): RebalanceParamsChangedEventFilter;

    "StrategyApprovalChanged(bytes4,bool)"(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _isApproved?: null
    ): StrategyApprovalChangedEventFilter;
    StrategyApprovalChanged(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _isApproved?: null
    ): StrategyApprovalChangedEventFilter;

    "StrategyParamsChanged(bytes4,address,address,bool)"(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _lockAddr?: PromiseOrValue<string> | null,
      _liqAddr?: PromiseOrValue<string> | null,
      _isApproved?: null
    ): StrategyParamsChangedEventFilter;
    StrategyParamsChanged(
      _strategyId?: PromiseOrValue<BytesLike> | null,
      _lockAddr?: PromiseOrValue<string> | null,
      _liqAddr?: PromiseOrValue<string> | null,
      _isApproved?: null
    ): StrategyParamsChangedEventFilter;

    "TokenAcceptanceChanged(address,bool)"(
      tokenAddr?: PromiseOrValue<string> | null,
      isAccepted?: null
    ): TokenAcceptanceChangedEventFilter;
    TokenAcceptanceChanged(
      tokenAddr?: PromiseOrValue<string> | null,
      isAccepted?: null
    ): TokenAcceptanceChangedEventFilter;
  };

  estimateGas: {
    angelProtocolParams(overrides?: CallOverrides): Promise<BigNumber>;

    apGoldfinch(overrides?: CallOverrides): Promise<BigNumber>;

    getAPGoldfinchParams(overrides?: CallOverrides): Promise<BigNumber>;

    getAngelProtocolParams(overrides?: CallOverrides): Promise<BigNumber>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRebalanceParams(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rebalanceParams(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAPGoldfinchParams(
      _apGoldfinch: APGoldfinchConfigLib.APGoldfinchConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAngelProtocolParams(
      _angelProtocolParams: IRegistrar.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRebalanceParams(
      _rebalanceParams: IRegistrar.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _lockAddr: PromiseOrValue<string>,
      _liqAddr: PromiseOrValue<string>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    angelProtocolParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    apGoldfinch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAPGoldfinchParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAngelProtocolParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRebalanceParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStrategyParamsById(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rebalanceParams(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAPGoldfinchParams(
      _apGoldfinch: APGoldfinchConfigLib.APGoldfinchConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAngelProtocolParams(
      _angelProtocolParams: IRegistrar.AngelProtocolParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setGasByToken(
      _tokenAddr: PromiseOrValue<string>,
      _gasFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRebalanceParams(
      _rebalanceParams: IRegistrar.RebalanceParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStrategyApproved(
      _strategyId: PromiseOrValue<BytesLike>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStrategyParams(
      _strategyId: PromiseOrValue<BytesLike>,
      _lockAddr: PromiseOrValue<string>,
      _liqAddr: PromiseOrValue<string>,
      _isApproved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenAccepted(
      _tokenAddr: PromiseOrValue<string>,
      _isAccepted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
