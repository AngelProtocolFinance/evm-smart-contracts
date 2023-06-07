/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
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

export interface IDonationMatchingInterface extends utils.Interface {
  functions: {
    "executeDonorMatch(uint256,uint256,address,address)": FunctionFragment;
    "queryConfig()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "executeDonorMatch" | "queryConfig"
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
    functionFragment: "queryConfig",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "executeDonorMatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryConfig",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IDonationMatching extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDonationMatchingInterface;

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

    queryConfig(
      overrides?: CallOverrides
    ): Promise<DonationMatchStorage.ConfigStructOutput>;
  };

  filters: {};

  estimateGas: {
    executeDonorMatch(
      endowmentId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
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

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
