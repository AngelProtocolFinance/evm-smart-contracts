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
  PayableOverrides,
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

export interface GoldfinchLiquidVaultInterface extends utils.Interface {
  functions: {
    "FIDU()": FunctionFragment;
    "GFI()": FunctionFragment;
    "USDC()": FunctionFragment;
    "WETH9()": FunctionFragment;
    "deposit(uint32,address,uint256)": FunctionFragment;
    "getVaultType()": FunctionFragment;
    "harvest(uint32)": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "poolFee()": FunctionFragment;
    "redeem(uint32,address,uint256)": FunctionFragment;
    "reinvestToLocked(uint32,address,uint256)": FunctionFragment;
    "swapExactInputMultihop(uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "FIDU"
      | "GFI"
      | "USDC"
      | "WETH9"
      | "deposit"
      | "getVaultType"
      | "harvest"
      | "onERC721Received"
      | "poolFee"
      | "redeem"
      | "reinvestToLocked"
      | "swapExactInputMultihop"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "FIDU", values?: undefined): string;
  encodeFunctionData(functionFragment: "GFI", values?: undefined): string;
  encodeFunctionData(functionFragment: "USDC", values?: undefined): string;
  encodeFunctionData(functionFragment: "WETH9", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getVaultType",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "harvest",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "poolFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "reinvestToLocked",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactInputMultihop",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "FIDU", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "GFI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "USDC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "WETH9", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getVaultType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "harvest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "reinvestToLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactInputMultihop",
    data: BytesLike
  ): Result;

  events: {
    "DepositMade(uint32,uint8,address,uint256,address)": EventFragment;
    "Harvest(uint32[])": EventFragment;
    "Redemption(uint32,uint8,address,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DepositMade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Harvest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redemption"): EventFragment;
}

export interface DepositMadeEventObject {
  accountId: number;
  vaultType: number;
  tokenDeposited: string;
  amtDeposited: BigNumber;
  stakingContract: string;
}
export type DepositMadeEvent = TypedEvent<
  [number, number, string, BigNumber, string],
  DepositMadeEventObject
>;

export type DepositMadeEventFilter = TypedEventFilter<DepositMadeEvent>;

export interface HarvestEventObject {
  accountIds: number[];
}
export type HarvestEvent = TypedEvent<[number[]], HarvestEventObject>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface RedemptionEventObject {
  accountId: number;
  vaultType: number;
  tokenRedeemed: string;
  amtRedeemed: BigNumber;
  stakingContract: string;
}
export type RedemptionEvent = TypedEvent<
  [number, number, string, BigNumber, string],
  RedemptionEventObject
>;

export type RedemptionEventFilter = TypedEventFilter<RedemptionEvent>;

export interface GoldfinchLiquidVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GoldfinchLiquidVaultInterface;

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
    FIDU(overrides?: CallOverrides): Promise<[string]>;

    GFI(overrides?: CallOverrides): Promise<[string]>;

    USDC(overrides?: CallOverrides): Promise<[string]>;

    WETH9(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getVaultType(overrides?: CallOverrides): Promise<[number]>;

    harvest(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    onERC721Received(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    poolFee(overrides?: CallOverrides): Promise<[number]>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    reinvestToLocked(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapExactInputMultihop(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  FIDU(overrides?: CallOverrides): Promise<string>;

  GFI(overrides?: CallOverrides): Promise<string>;

  USDC(overrides?: CallOverrides): Promise<string>;

  WETH9(overrides?: CallOverrides): Promise<string>;

  deposit(
    accountId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amt: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getVaultType(overrides?: CallOverrides): Promise<number>;

  harvest(
    accountId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  onERC721Received(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<BigNumberish>,
    arg3: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  poolFee(overrides?: CallOverrides): Promise<number>;

  redeem(
    accountId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amt: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  reinvestToLocked(
    accountId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amt: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapExactInputMultihop(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    FIDU(overrides?: CallOverrides): Promise<string>;

    GFI(overrides?: CallOverrides): Promise<string>;

    USDC(overrides?: CallOverrides): Promise<string>;

    WETH9(overrides?: CallOverrides): Promise<string>;

    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getVaultType(overrides?: CallOverrides): Promise<number>;

    harvest(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    onERC721Received(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    poolFee(overrides?: CallOverrides): Promise<number>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    reinvestToLocked(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    swapExactInputMultihop(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "DepositMade(uint32,uint8,address,uint256,address)"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenDeposited?: null,
      amtDeposited?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): DepositMadeEventFilter;
    DepositMade(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenDeposited?: null,
      amtDeposited?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): DepositMadeEventFilter;

    "Harvest(uint32[])"(
      accountIds?: PromiseOrValue<BigNumberish>[] | null
    ): HarvestEventFilter;
    Harvest(
      accountIds?: PromiseOrValue<BigNumberish>[] | null
    ): HarvestEventFilter;

    "Redemption(uint32,uint8,address,uint256,address)"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenRedeemed?: null,
      amtRedeemed?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): RedemptionEventFilter;
    Redemption(
      accountId?: PromiseOrValue<BigNumberish> | null,
      vaultType?: null,
      tokenRedeemed?: null,
      amtRedeemed?: null,
      stakingContract?: PromiseOrValue<string> | null
    ): RedemptionEventFilter;
  };

  estimateGas: {
    FIDU(overrides?: CallOverrides): Promise<BigNumber>;

    GFI(overrides?: CallOverrides): Promise<BigNumber>;

    USDC(overrides?: CallOverrides): Promise<BigNumber>;

    WETH9(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getVaultType(overrides?: CallOverrides): Promise<BigNumber>;

    harvest(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    onERC721Received(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolFee(overrides?: CallOverrides): Promise<BigNumber>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    reinvestToLocked(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapExactInputMultihop(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    FIDU(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    GFI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    USDC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WETH9(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getVaultType(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    harvest(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeem(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    reinvestToLocked(
      accountId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amt: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapExactInputMultihop(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
