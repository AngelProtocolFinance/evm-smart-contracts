/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";
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

export interface DummyCRVLPInterface extends utils.Interface {
  functions: {
    "add_liquidity(uint256[2],uint256,bool,address)": FunctionFragment;
    "balances(uint256)": FunctionFragment;
    "calc_token_amount(uint256[2])": FunctionFragment;
    "coins(uint256)": FunctionFragment;
    "exchange(uint256,uint256,uint256,uint256)": FunctionFragment;
    "get_dy(uint256,uint256,uint256)": FunctionFragment;
    "lp_price()": FunctionFragment;
    "remove_liquidity(uint256,uint256[2])": FunctionFragment;
    "remove_liquidity_one_coin(uint256,uint256,uint256)": FunctionFragment;
    "setDys(uint256,uint256)": FunctionFragment;
    "token()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "add_liquidity"
      | "balances"
      | "calc_token_amount"
      | "coins"
      | "exchange"
      | "get_dy"
      | "lp_price"
      | "remove_liquidity"
      | "remove_liquidity_one_coin"
      | "setDys"
      | "token"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "add_liquidity",
    values: [
      [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "calc_token_amount",
    values: [[PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]]
  ): string;
  encodeFunctionData(
    functionFragment: "coins",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "exchange",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "get_dy",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "lp_price", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "remove_liquidity",
    values: [
      PromiseOrValue<BigNumberish>,
      [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "remove_liquidity_one_coin",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDys",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "add_liquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calc_token_amount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exchange", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get_dy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lp_price", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "remove_liquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remove_liquidity_one_coin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setDys", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;

  events: {};
}

export interface DummyCRVLP extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DummyCRVLPInterface;

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
    add_liquidity(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      min_mint_amount: PromiseOrValue<BigNumberish>,
      use_eth: PromiseOrValue<boolean>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calc_token_amount(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    coins(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    exchange(
      i: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      dx: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    get_dy(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lp_price(overrides?: CallOverrides): Promise<[BigNumber]>;

    remove_liquidity(
      _amount: PromiseOrValue<BigNumberish>,
      min_amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    remove_liquidity_one_coin(
      token_amount: PromiseOrValue<BigNumberish>,
      i: PromiseOrValue<BigNumberish>,
      min_amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDys(
      _dy_for_get_dy: PromiseOrValue<BigNumberish>,
      _dy_for_exchange: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;
  };

  add_liquidity(
    amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
    min_mint_amount: PromiseOrValue<BigNumberish>,
    use_eth: PromiseOrValue<boolean>,
    receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  balances(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calc_token_amount(
    amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  coins(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  exchange(
    i: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<BigNumberish>,
    dx: PromiseOrValue<BigNumberish>,
    arg3: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  get_dy(
    arg0: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<BigNumberish>,
    arg2: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  lp_price(overrides?: CallOverrides): Promise<BigNumber>;

  remove_liquidity(
    _amount: PromiseOrValue<BigNumberish>,
    min_amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  remove_liquidity_one_coin(
    token_amount: PromiseOrValue<BigNumberish>,
    i: PromiseOrValue<BigNumberish>,
    min_amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDys(
    _dy_for_get_dy: PromiseOrValue<BigNumberish>,
    _dy_for_exchange: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    add_liquidity(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      min_mint_amount: PromiseOrValue<BigNumberish>,
      use_eth: PromiseOrValue<boolean>,
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calc_token_amount(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    coins(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    exchange(
      i: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      dx: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    get_dy(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lp_price(overrides?: CallOverrides): Promise<BigNumber>;

    remove_liquidity(
      _amount: PromiseOrValue<BigNumberish>,
      min_amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    remove_liquidity_one_coin(
      token_amount: PromiseOrValue<BigNumberish>,
      i: PromiseOrValue<BigNumberish>,
      min_amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDys(
      _dy_for_get_dy: PromiseOrValue<BigNumberish>,
      _dy_for_exchange: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    add_liquidity(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      min_mint_amount: PromiseOrValue<BigNumberish>,
      use_eth: PromiseOrValue<boolean>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    balances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calc_token_amount(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    coins(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exchange(
      i: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      dx: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    get_dy(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lp_price(overrides?: CallOverrides): Promise<BigNumber>;

    remove_liquidity(
      _amount: PromiseOrValue<BigNumberish>,
      min_amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    remove_liquidity_one_coin(
      token_amount: PromiseOrValue<BigNumberish>,
      i: PromiseOrValue<BigNumberish>,
      min_amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDys(
      _dy_for_get_dy: PromiseOrValue<BigNumberish>,
      _dy_for_exchange: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    add_liquidity(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      min_mint_amount: PromiseOrValue<BigNumberish>,
      use_eth: PromiseOrValue<boolean>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calc_token_amount(
      amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    coins(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exchange(
      i: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      dx: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    get_dy(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lp_price(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remove_liquidity(
      _amount: PromiseOrValue<BigNumberish>,
      min_amounts: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    remove_liquidity_one_coin(
      token_amount: PromiseOrValue<BigNumberish>,
      i: PromiseOrValue<BigNumberish>,
      min_amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDys(
      _dy_for_get_dy: PromiseOrValue<BigNumberish>,
      _dy_for_exchange: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
