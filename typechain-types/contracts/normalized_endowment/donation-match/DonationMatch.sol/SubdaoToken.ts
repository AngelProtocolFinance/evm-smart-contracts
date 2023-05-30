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
} from "../../../../common";

export interface SubdaoTokenInterface extends utils.Interface {
  functions: {
    "executeDonorMatch(uint256,address,uint32,address)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "executeDonorMatch"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeDonorMatch",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "executeDonorMatch", data: BytesLike): Result;

  events: {};
}

export interface SubdaoToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SubdaoTokenInterface;

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
    executeDonorMatch(
      amount: PromiseOrValue<BigNumberish>,
      accountscontract: PromiseOrValue<string>,
      endowmentid: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;
  };

  executeDonorMatch(
    amount: PromiseOrValue<BigNumberish>,
    accountscontract: PromiseOrValue<string>,
    endowmentid: PromiseOrValue<BigNumberish>,
    donor: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callStatic: {
    executeDonorMatch(
      amount: PromiseOrValue<BigNumberish>,
      accountscontract: PromiseOrValue<string>,
      endowmentid: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    executeDonorMatch(
      amount: PromiseOrValue<BigNumberish>,
      accountscontract: PromiseOrValue<string>,
      endowmentid: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeDonorMatch(
      amount: PromiseOrValue<BigNumberish>,
      accountscontract: PromiseOrValue<string>,
      endowmentid: PromiseOrValue<BigNumberish>,
      donor: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
