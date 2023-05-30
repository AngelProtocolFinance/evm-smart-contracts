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
import type {FunctionFragment, Result, EventFragment} from "@ethersproject/abi";
import type {Listener, Provider} from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export declare namespace AirdropMessage {
  export type InstantiateMsgStruct = {
    owner: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
  };

  export type InstantiateMsgStructOutput = [string, string] & {
    owner: string;
    haloToken: string;
  };

  export type ConfigResponseStruct = {
    owner: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
  };

  export type ConfigResponseStructOutput = [string, string] & {
    owner: string;
    haloToken: string;
  };

  export type MerkleRootResponseStruct = {
    stage: PromiseOrValue<BigNumberish>;
    merkleRoot: PromiseOrValue<BytesLike>;
  };

  export type MerkleRootResponseStructOutput = [BigNumber, string] & {
    stage: BigNumber;
    merkleRoot: string;
  };
}

export interface AirdropInterface extends utils.Interface {
  functions: {
    "claim(uint256,bytes32[])": FunctionFragment;
    "initialize((address,address))": FunctionFragment;
    "queryConfig()": FunctionFragment;
    "queryIsClaimed(uint256,address)": FunctionFragment;
    "queryLatestStage()": FunctionFragment;
    "queryMerkleRoot(uint256)": FunctionFragment;
    "registerMerkleRoot(bytes32)": FunctionFragment;
    "updateConfig(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "claim"
      | "initialize"
      | "queryConfig"
      | "queryIsClaimed"
      | "queryLatestStage"
      | "queryMerkleRoot"
      | "registerMerkleRoot"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "claim",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AirdropMessage.InstantiateMsgStruct]
  ): string;
  encodeFunctionData(functionFragment: "queryConfig", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "queryIsClaimed",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "queryLatestStage", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "queryMerkleRoot",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerMerkleRoot",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "updateConfig", values: [PromiseOrValue<string>]): string;

  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryIsClaimed", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryLatestStage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queryMerkleRoot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registerMerkleRoot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "updateConfig", data: BytesLike): Result;

  events: {
    "AirdropClaim(uint256,address,uint256)": EventFragment;
    "AirdropInitialized(address,address)": EventFragment;
    "AirdropRegisterMerkleRoot(uint256,bytes32)": EventFragment;
    "AirdropUpdateConfig(address)": EventFragment;
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AirdropClaim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AirdropInitialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AirdropRegisterMerkleRoot"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AirdropUpdateConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface AirdropClaimEventObject {
  stage: BigNumber;
  sender: string;
  amount: BigNumber;
}
export type AirdropClaimEvent = TypedEvent<[BigNumber, string, BigNumber], AirdropClaimEventObject>;

export type AirdropClaimEventFilter = TypedEventFilter<AirdropClaimEvent>;

export interface AirdropInitializedEventObject {
  owner: string;
  haloToken: string;
}
export type AirdropInitializedEvent = TypedEvent<[string, string], AirdropInitializedEventObject>;

export type AirdropInitializedEventFilter = TypedEventFilter<AirdropInitializedEvent>;

export interface AirdropRegisterMerkleRootEventObject {
  stage: BigNumber;
  merkleRoot: string;
}
export type AirdropRegisterMerkleRootEvent = TypedEvent<
  [BigNumber, string],
  AirdropRegisterMerkleRootEventObject
>;

export type AirdropRegisterMerkleRootEventFilter = TypedEventFilter<AirdropRegisterMerkleRootEvent>;

export interface AirdropUpdateConfigEventObject {
  owner: string;
}
export type AirdropUpdateConfigEvent = TypedEvent<[string], AirdropUpdateConfigEventObject>;

export type AirdropUpdateConfigEventFilter = TypedEventFilter<AirdropUpdateConfigEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface Airdrop extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AirdropInterface;

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
    claim(
      amount: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    initialize(
      details: AirdropMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<[AirdropMessage.ConfigResponseStructOutput]>;

    queryIsClaimed(
      stage: PromiseOrValue<BigNumberish>,
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    queryLatestStage(overrides?: CallOverrides): Promise<[BigNumber]>;

    queryMerkleRoot(
      stage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[AirdropMessage.MerkleRootResponseStructOutput]>;

    registerMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<ContractTransaction>;
  };

  claim(
    amount: PromiseOrValue<BigNumberish>,
    merkleProof: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  initialize(
    details: AirdropMessage.InstantiateMsgStruct,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  queryConfig(overrides?: CallOverrides): Promise<AirdropMessage.ConfigResponseStructOutput>;

  queryIsClaimed(
    stage: PromiseOrValue<BigNumberish>,
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  queryLatestStage(overrides?: CallOverrides): Promise<BigNumber>;

  queryMerkleRoot(
    stage: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<AirdropMessage.MerkleRootResponseStructOutput>;

  registerMerkleRoot(
    merkleRoot: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  updateConfig(
    owner: PromiseOrValue<string>,
    overrides?: Overrides & {from?: PromiseOrValue<string>}
  ): Promise<ContractTransaction>;

  callStatic: {
    claim(
      amount: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      details: AirdropMessage.InstantiateMsgStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    queryConfig(overrides?: CallOverrides): Promise<AirdropMessage.ConfigResponseStructOutput>;

    queryIsClaimed(
      stage: PromiseOrValue<BigNumberish>,
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    queryLatestStage(overrides?: CallOverrides): Promise<BigNumber>;

    queryMerkleRoot(
      stage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<AirdropMessage.MerkleRootResponseStructOutput>;

    registerMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateConfig(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "AirdropClaim(uint256,address,uint256)"(
      stage?: null,
      sender?: null,
      amount?: null
    ): AirdropClaimEventFilter;
    AirdropClaim(stage?: null, sender?: null, amount?: null): AirdropClaimEventFilter;

    "AirdropInitialized(address,address)"(
      owner?: null,
      haloToken?: null
    ): AirdropInitializedEventFilter;
    AirdropInitialized(owner?: null, haloToken?: null): AirdropInitializedEventFilter;

    "AirdropRegisterMerkleRoot(uint256,bytes32)"(
      stage?: null,
      merkleRoot?: null
    ): AirdropRegisterMerkleRootEventFilter;
    AirdropRegisterMerkleRoot(
      stage?: null,
      merkleRoot?: null
    ): AirdropRegisterMerkleRootEventFilter;

    "AirdropUpdateConfig(address)"(owner?: null): AirdropUpdateConfigEventFilter;
    AirdropUpdateConfig(owner?: null): AirdropUpdateConfigEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    claim(
      amount: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    initialize(
      details: AirdropMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    queryConfig(overrides?: CallOverrides): Promise<BigNumber>;

    queryIsClaimed(
      stage: PromiseOrValue<BigNumberish>,
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryLatestStage(overrides?: CallOverrides): Promise<BigNumber>;

    queryMerkleRoot(
      stage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;

    updateConfig(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    claim(
      amount: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    initialize(
      details: AirdropMessage.InstantiateMsgStruct,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    queryConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryIsClaimed(
      stage: PromiseOrValue<BigNumberish>,
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryLatestStage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryMerkleRoot(
      stage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;

    updateConfig(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & {from?: PromiseOrValue<string>}
    ): Promise<PopulatedTransaction>;
  };
}
