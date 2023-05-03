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

export interface ILockedWithdrawInterface extends utils.Interface {
  functions: {
    "approve(uint256)": FunctionFragment;
    "propose(uint256,address,address[],uint256[])": FunctionFragment;
    "reject(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "updateConfig(address,address,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "approve"
      | "propose"
      | "reject"
      | "supportsInterface"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "approve",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "propose",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "reject",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "propose", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "reject", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateConfig",
    data: BytesLike
  ): Result;

  events: {
    "LockedWithdrawAPTeam(uint256,address)": EventFragment;
    "LockedWithdrawApproved(uint256,address,address[],uint256[])": EventFragment;
    "LockedWithdrawEndowment(uint256,address)": EventFragment;
    "LockedWithdrawInitiated(uint256,address,address,address[],uint256[])": EventFragment;
    "LockedWithdrawRejected(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LockedWithdrawAPTeam"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockedWithdrawApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockedWithdrawEndowment"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockedWithdrawInitiated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockedWithdrawRejected"): EventFragment;
}

export interface LockedWithdrawAPTeamEventObject {
  accountId: BigNumber;
  sender: string;
}
export type LockedWithdrawAPTeamEvent = TypedEvent<
  [BigNumber, string],
  LockedWithdrawAPTeamEventObject
>;

export type LockedWithdrawAPTeamEventFilter =
  TypedEventFilter<LockedWithdrawAPTeamEvent>;

export interface LockedWithdrawApprovedEventObject {
  accountId: BigNumber;
  curBeneficiary: string;
  curTokenaddress: string[];
  curAmount: BigNumber[];
}
export type LockedWithdrawApprovedEvent = TypedEvent<
  [BigNumber, string, string[], BigNumber[]],
  LockedWithdrawApprovedEventObject
>;

export type LockedWithdrawApprovedEventFilter =
  TypedEventFilter<LockedWithdrawApprovedEvent>;

export interface LockedWithdrawEndowmentEventObject {
  accountId: BigNumber;
  sender: string;
}
export type LockedWithdrawEndowmentEvent = TypedEvent<
  [BigNumber, string],
  LockedWithdrawEndowmentEventObject
>;

export type LockedWithdrawEndowmentEventFilter =
  TypedEventFilter<LockedWithdrawEndowmentEvent>;

export interface LockedWithdrawInitiatedEventObject {
  accountId: BigNumber;
  initiator: string;
  curBeneficiary: string;
  curTokenaddress: string[];
  curAmount: BigNumber[];
}
export type LockedWithdrawInitiatedEvent = TypedEvent<
  [BigNumber, string, string, string[], BigNumber[]],
  LockedWithdrawInitiatedEventObject
>;

export type LockedWithdrawInitiatedEventFilter =
  TypedEventFilter<LockedWithdrawInitiatedEvent>;

export interface LockedWithdrawRejectedEventObject {
  accountId: BigNumber;
}
export type LockedWithdrawRejectedEvent = TypedEvent<
  [BigNumber],
  LockedWithdrawRejectedEventObject
>;

export type LockedWithdrawRejectedEventFilter =
  TypedEventFilter<LockedWithdrawRejectedEvent>;

export interface ILockedWithdraw extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILockedWithdrawInterface;

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
    approve(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    propose(
      accountId: PromiseOrValue<BigNumberish>,
      curBeneficiary: PromiseOrValue<string>,
      curTokenaddress: PromiseOrValue<string>[],
      curAmount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    reject(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    updateConfig(
      curRegistrar: PromiseOrValue<string>,
      curAccounts: PromiseOrValue<string>,
      curApteammultisig: PromiseOrValue<string>,
      curEndowfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  approve(
    accountId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  propose(
    accountId: PromiseOrValue<BigNumberish>,
    curBeneficiary: PromiseOrValue<string>,
    curTokenaddress: PromiseOrValue<string>[],
    curAmount: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  reject(
    accountId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  updateConfig(
    curRegistrar: PromiseOrValue<string>,
    curAccounts: PromiseOrValue<string>,
    curApteammultisig: PromiseOrValue<string>,
    curEndowfactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approve(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    propose(
      accountId: PromiseOrValue<BigNumberish>,
      curBeneficiary: PromiseOrValue<string>,
      curTokenaddress: PromiseOrValue<string>[],
      curAmount: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    reject(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateConfig(
      curRegistrar: PromiseOrValue<string>,
      curAccounts: PromiseOrValue<string>,
      curApteammultisig: PromiseOrValue<string>,
      curEndowfactory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "LockedWithdrawAPTeam(uint256,address)"(
      accountId?: null,
      sender?: null
    ): LockedWithdrawAPTeamEventFilter;
    LockedWithdrawAPTeam(
      accountId?: null,
      sender?: null
    ): LockedWithdrawAPTeamEventFilter;

    "LockedWithdrawApproved(uint256,address,address[],uint256[])"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      curBeneficiary?: PromiseOrValue<string> | null,
      curTokenaddress?: null,
      curAmount?: null
    ): LockedWithdrawApprovedEventFilter;
    LockedWithdrawApproved(
      accountId?: PromiseOrValue<BigNumberish> | null,
      curBeneficiary?: PromiseOrValue<string> | null,
      curTokenaddress?: null,
      curAmount?: null
    ): LockedWithdrawApprovedEventFilter;

    "LockedWithdrawEndowment(uint256,address)"(
      accountId?: null,
      sender?: null
    ): LockedWithdrawEndowmentEventFilter;
    LockedWithdrawEndowment(
      accountId?: null,
      sender?: null
    ): LockedWithdrawEndowmentEventFilter;

    "LockedWithdrawInitiated(uint256,address,address,address[],uint256[])"(
      accountId?: PromiseOrValue<BigNumberish> | null,
      initiator?: PromiseOrValue<string> | null,
      curBeneficiary?: PromiseOrValue<string> | null,
      curTokenaddress?: null,
      curAmount?: null
    ): LockedWithdrawInitiatedEventFilter;
    LockedWithdrawInitiated(
      accountId?: PromiseOrValue<BigNumberish> | null,
      initiator?: PromiseOrValue<string> | null,
      curBeneficiary?: PromiseOrValue<string> | null,
      curTokenaddress?: null,
      curAmount?: null
    ): LockedWithdrawInitiatedEventFilter;

    "LockedWithdrawRejected(uint256)"(
      accountId?: PromiseOrValue<BigNumberish> | null
    ): LockedWithdrawRejectedEventFilter;
    LockedWithdrawRejected(
      accountId?: PromiseOrValue<BigNumberish> | null
    ): LockedWithdrawRejectedEventFilter;
  };

  estimateGas: {
    approve(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    propose(
      accountId: PromiseOrValue<BigNumberish>,
      curBeneficiary: PromiseOrValue<string>,
      curTokenaddress: PromiseOrValue<string>[],
      curAmount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    reject(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    updateConfig(
      curRegistrar: PromiseOrValue<string>,
      curAccounts: PromiseOrValue<string>,
      curApteammultisig: PromiseOrValue<string>,
      curEndowfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approve(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    propose(
      accountId: PromiseOrValue<BigNumberish>,
      curBeneficiary: PromiseOrValue<string>,
      curTokenaddress: PromiseOrValue<string>[],
      curAmount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    reject(
      accountId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateConfig(
      curRegistrar: PromiseOrValue<string>,
      curAccounts: PromiseOrValue<string>,
      curApteammultisig: PromiseOrValue<string>,
      curEndowfactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
