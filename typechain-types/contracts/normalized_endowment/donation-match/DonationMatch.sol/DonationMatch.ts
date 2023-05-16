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

export declare namespace DonationMatchMessages {
  export type InstantiateMessageStruct = {
    reserveToken: PromiseOrValue<string>;
    uniswapFactory: PromiseOrValue<string>;
    registrarContract: PromiseOrValue<string>;
    poolFee: PromiseOrValue<BigNumberish>;
    usdcAddress: PromiseOrValue<string>;
  };

  export type InstantiateMessageStructOutput = [
    string,
    string,
    string,
    number,
    string
  ] & {
    reserveToken: string;
    uniswapFactory: string;
    registrarContract: string;
    poolFee: number;
    usdcAddress: string;
  };
}

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

export interface DonationMatchInterface extends utils.Interface {
  functions: {
    "executeDonorMatch(uint32,uint256,address,address)": FunctionFragment;
    "initialize((address,address,address,uint24,address),address)": FunctionFragment;
    "queryConfig()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "executeDonorMatch" | "initialize" | "queryConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeDonorMatch",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      DonationMatchMessages.InstantiateMessageStruct,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "queryConfig",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "executeDonorMatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface DonationMatch extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DonationMatchInterface;

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
    executeDonorMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      curDetails: DonationMatchMessages.InstantiateMessageStruct,
      curEmitteraddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<[DonationMatchStorage.ConfigStructOutput]>;
  };

  executeDonorMatch(
    endowmentId: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    donor: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    curDetails: DonationMatchMessages.InstantiateMessageStruct,
    curEmitteraddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  queryConfig(
    overrides?: CallOverrides
  ): Promise<DonationMatchStorage.ConfigStructOutput>;

  callStatic: {
    executeDonorMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      curDetails: DonationMatchMessages.InstantiateMessageStruct,
      curEmitteraddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(
      overrides?: CallOverrides
    ): Promise<DonationMatchStorage.ConfigStructOutput>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    executeDonorMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      curDetails: DonationMatchMessages.InstantiateMessageStruct,
      curEmitteraddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    executeDonorMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      curDetails: DonationMatchMessages.InstantiateMessageStruct,
      curEmitteraddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
