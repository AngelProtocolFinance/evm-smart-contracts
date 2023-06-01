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
import type {FunctionFragment, Result} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export declare namespace DonationMatchStorage {
  export type ConfigStruct = {
    reserveToken: PromiseOrValue<string>;
    uniswapFactory: PromiseOrValue<string>;
    usdcAddress: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    poolFee: PromiseOrValue<BigNumberish>;
  };

  export type ConfigStructOutput = [string, string, string, string, number] & {
    reserveToken: string;
    uniswapFactory: string;
    usdcAddress: string;
    registrarContract: string;
    poolFee: number;
  };
}

export interface IDonationMatchEmitterInterface extends utils.Interface {
  functions: {
    "burnErC20(uint256,address,uint256)": FunctionFragment;
    "executeDonorMatch(address,uint256,address,uint256,address)": FunctionFragment;
    "giveApprovalErC20(uint256,address,address,uint256)": FunctionFragment;
    "initializeDonationMatch(uint256,address,(address,address,address,address,uint24))": FunctionFragment;
    "transferErC20(uint256,address,address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "burnErC20"
      | "executeDonorMatch"
      | "giveApprovalErC20"
      | "initializeDonationMatch"
      | "transferErC20"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "burnErC20",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeDonorMatch",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "giveApprovalErC20",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeDonationMatch",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      DonationMatchStorage.ConfigStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferErC20",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "burnErC20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "executeDonorMatch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "giveApprovalErC20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initializeDonationMatch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferErC20", data: BytesLike): Result;

  events: {};
}

export interface IDonationMatchEmitter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDonationMatchEmitterInterface;

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
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      accountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;
  };

  burnErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  executeDonorMatch(
    tokenAddress: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    accountsContract: PromiseOrValue<string>,
    endowmentId: PromiseOrValue<BigNumberish>,
    donor: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  giveApprovalErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  initializeDonationMatch(
    endowmentId: PromiseOrValue<BigNumberish>,
    donationMatch: PromiseOrValue<string>,
    config: DonationMatchStorage.ConfigStruct,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  transferErC20(
    endowmentId: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callStatic: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      accountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      accountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    burnErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    executeDonorMatch(
      tokenAddress: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      accountsContract: PromiseOrValue<string>,
      endowmentId: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    giveApprovalErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    initializeDonationMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      donationMatch: PromiseOrValue<string>,
      config: DonationMatchStorage.ConfigStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    transferErC20(
      endowmentId: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
