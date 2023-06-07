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

export interface IEndowmentMultiSigFactoryInterface extends utils.Interface {
  functions: {
    "create(uint256,address,address[],uint256)": FunctionFragment;
    "endowmentIdToMultisig(uint256)": FunctionFragment;
    "updateImplementation(address)": FunctionFragment;
    "updateProxyAdmin(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "create"
      | "endowmentIdToMultisig"
      | "updateImplementation"
      | "updateProxyAdmin"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "create",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "endowmentIdToMultisig",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateImplementation",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateProxyAdmin",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "endowmentIdToMultisig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateProxyAdmin",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IEndowmentMultiSigFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IEndowmentMultiSigFactoryInterface;

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
    create(
      endowmentId: PromiseOrValue<BigNumberish>,
      emitterAddress: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    endowmentIdToMultisig(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateImplementation(
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateProxyAdmin(
      proxyAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  create(
    endowmentId: PromiseOrValue<BigNumberish>,
    emitterAddress: PromiseOrValue<string>,
    owners: PromiseOrValue<string>[],
    required: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  endowmentIdToMultisig(
    endowmentId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateImplementation(
    implementationAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateProxyAdmin(
    proxyAdminAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    create(
      endowmentId: PromiseOrValue<BigNumberish>,
      emitterAddress: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    endowmentIdToMultisig(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    updateImplementation(
      implementationAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateProxyAdmin(
      proxyAdminAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    create(
      endowmentId: PromiseOrValue<BigNumberish>,
      emitterAddress: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    endowmentIdToMultisig(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateImplementation(
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateProxyAdmin(
      proxyAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    create(
      endowmentId: PromiseOrValue<BigNumberish>,
      emitterAddress: PromiseOrValue<string>,
      owners: PromiseOrValue<string>[],
      required: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    endowmentIdToMultisig(
      endowmentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateImplementation(
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateProxyAdmin(
      proxyAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
