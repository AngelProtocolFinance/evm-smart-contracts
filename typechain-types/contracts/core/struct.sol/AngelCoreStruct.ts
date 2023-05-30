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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export declare namespace AngelCoreStruct {
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

  export type BeneficiaryDataStruct = {
    endowId: PromiseOrValue<BigNumberish>;
    fundId: PromiseOrValue<BigNumberish>;
    addr: PromiseOrValue<string>;
  };

  export type BeneficiaryDataStructOutput = [number, BigNumber, string] & {
    endowId: number;
    fundId: BigNumber;
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
}

export interface AngelCoreStructInterface extends utils.Interface {
  functions: {
    "accountStrategiesDefaut()": FunctionFragment;
    "beneficiaryDefault()": FunctionFragment;
    "checkSplits((uint256,uint256,uint256),uint256,uint256,bool)": FunctionFragment;
    "deductTokens(uint256,uint256)": FunctionFragment;
    "getTokenAmount(address[],uint256[],address)": FunctionFragment;
    "oneOffVaultsDefault()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "accountStrategiesDefaut"
      | "beneficiaryDefault"
      | "checkSplits"
      | "deductTokens"
      | "getTokenAmount"
      | "oneOffVaultsDefault"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "accountStrategiesDefaut",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "beneficiaryDefault",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkSplits",
    values: [
      AngelCoreStruct.SplitDetailsStruct,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deductTokens",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenAmount",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "oneOffVaultsDefault",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "accountStrategiesDefaut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beneficiaryDefault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkSplits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deductTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "oneOffVaultsDefault",
    data: BytesLike
  ): Result;

  events: {};
}

export interface AngelCoreStruct extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AngelCoreStructInterface;

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
    accountStrategiesDefaut(
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.AccountStrategiesStructOutput]>;

    beneficiaryDefault(
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.BeneficiaryStructOutput]>;

    checkSplits(
      splits: AngelCoreStruct.SplitDetailsStruct,
      userLocked: PromiseOrValue<BigNumberish>,
      userLiquid: PromiseOrValue<BigNumberish>,
      userOverride: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    deductTokens(
      amount: PromiseOrValue<BigNumberish>,
      deductamount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTokenAmount(
      addresses: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    oneOffVaultsDefault(
      overrides?: CallOverrides
    ): Promise<[AngelCoreStruct.OneOffVaultsStructOutput]>;
  };

  accountStrategiesDefaut(
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.AccountStrategiesStructOutput>;

  beneficiaryDefault(
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.BeneficiaryStructOutput>;

  checkSplits(
    splits: AngelCoreStruct.SplitDetailsStruct,
    userLocked: PromiseOrValue<BigNumberish>,
    userLiquid: PromiseOrValue<BigNumberish>,
    userOverride: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  deductTokens(
    amount: PromiseOrValue<BigNumberish>,
    deductamount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTokenAmount(
    addresses: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  oneOffVaultsDefault(
    overrides?: CallOverrides
  ): Promise<AngelCoreStruct.OneOffVaultsStructOutput>;

  callStatic: {
    accountStrategiesDefaut(
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.AccountStrategiesStructOutput>;

    beneficiaryDefault(
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.BeneficiaryStructOutput>;

    checkSplits(
      splits: AngelCoreStruct.SplitDetailsStruct,
      userLocked: PromiseOrValue<BigNumberish>,
      userLiquid: PromiseOrValue<BigNumberish>,
      userOverride: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    deductTokens(
      amount: PromiseOrValue<BigNumberish>,
      deductamount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenAmount(
      addresses: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oneOffVaultsDefault(
      overrides?: CallOverrides
    ): Promise<AngelCoreStruct.OneOffVaultsStructOutput>;
  };

  filters: {};

  estimateGas: {
    accountStrategiesDefaut(overrides?: CallOverrides): Promise<BigNumber>;

    beneficiaryDefault(overrides?: CallOverrides): Promise<BigNumber>;

    checkSplits(
      splits: AngelCoreStruct.SplitDetailsStruct,
      userLocked: PromiseOrValue<BigNumberish>,
      userLiquid: PromiseOrValue<BigNumberish>,
      userOverride: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deductTokens(
      amount: PromiseOrValue<BigNumberish>,
      deductamount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenAmount(
      addresses: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oneOffVaultsDefault(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accountStrategiesDefaut(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    beneficiaryDefault(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    checkSplits(
      splits: AngelCoreStruct.SplitDetailsStruct,
      userLocked: PromiseOrValue<BigNumberish>,
      userLiquid: PromiseOrValue<BigNumberish>,
      userOverride: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deductTokens(
      amount: PromiseOrValue<BigNumberish>,
      deductamount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenAmount(
      addresses: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oneOffVaultsDefault(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
