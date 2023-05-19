/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  Signer,
  utils,
} from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace AngelCoreStruct {
  export type NetworkInfoStruct = {
    name: PromiseOrValue<string>;
    chainId: PromiseOrValue<BigNumberish>;
    router: PromiseOrValue<string>;
    axelarGateway: PromiseOrValue<string>;
    ibcChannel: PromiseOrValue<string>;
    transferChannel: PromiseOrValue<string>;
    gasReceiver: PromiseOrValue<string>;
    gasLimit: PromiseOrValue<BigNumberish>;
  };

  export type NetworkInfoStructOutput = [
    string,
    BigNumber,
    string,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    name: string;
    chainId: BigNumber;
    router: string;
    axelarGateway: string;
    ibcChannel: string;
    transferChannel: string;
    gasReceiver: string;
    gasLimit: BigNumber;
  };

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
}

export declare namespace RegistrarStorage {
  export type ConfigStruct = {
    applicationsReview: PromiseOrValue<string>;
    indexFundContract: PromiseOrValue<string>;
    accountsContract: PromiseOrValue<string>;
    treasury: PromiseOrValue<string>;
    subdaoGovContract: PromiseOrValue<string>;
    subdaoCw20TokenContract: PromiseOrValue<string>;
    subdaoBondingTokenContract: PromiseOrValue<string>;
    subdaoCw900Contract: PromiseOrValue<string>;
    subdaoDistributorContract: PromiseOrValue<string>;
    subdaoEmitter: PromiseOrValue<string>;
    donationMatchContract: PromiseOrValue<string>;
    donationMatchCharitesContract: PromiseOrValue<string>;
    donationMatchEmitter: PromiseOrValue<string>;
    splitToLiquid: AngelCoreStruct.SplitDetailsStruct;
    haloToken: PromiseOrValue<string>;
    haloTokenLpContract: PromiseOrValue<string>;
    govContract: PromiseOrValue<string>;
    collectorShare: PromiseOrValue<BigNumberish>;
    charitySharesContract: PromiseOrValue<string>;
    fundraisingContract: PromiseOrValue<string>;
    swapsRouter: PromiseOrValue<string>;
    multisigFactory: PromiseOrValue<string>;
    multisigEmitter: PromiseOrValue<string>;
    charityProposal: PromiseOrValue<string>;
    lockedWithdrawal: PromiseOrValue<string>;
    proxyAdmin: PromiseOrValue<string>;
    usdcAddress: PromiseOrValue<string>;
    wethAddress: PromiseOrValue<string>;
    cw900lvAddress: PromiseOrValue<string>;
  };

  export type ConfigStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    AngelCoreStruct.SplitDetailsStructOutput,
    string,
    string,
    string,
    BigNumber,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ] & {
    applicationsReview: string;
    indexFundContract: string;
    accountsContract: string;
    treasury: string;
    subdaoGovContract: string;
    subdaoCw20TokenContract: string;
    subdaoBondingTokenContract: string;
    subdaoCw900Contract: string;
    subdaoDistributorContract: string;
    subdaoEmitter: string;
    donationMatchContract: string;
    donationMatchCharitesContract: string;
    donationMatchEmitter: string;
    splitToLiquid: AngelCoreStruct.SplitDetailsStructOutput;
    haloToken: string;
    haloTokenLpContract: string;
    govContract: string;
    collectorShare: BigNumber;
    charitySharesContract: string;
    fundraisingContract: string;
    swapsRouter: string;
    multisigFactory: string;
    multisigEmitter: string;
    charityProposal: string;
    lockedWithdrawal: string;
    proxyAdmin: string;
    usdcAddress: string;
    wethAddress: string;
    cw900lvAddress: string;
  };
}

export declare namespace RegistrarMessages {
  export type UpdateFeeRequestStruct = {
    keys: PromiseOrValue<string>[];
    values: PromiseOrValue<BigNumberish>[];
  };

  export type UpdateFeeRequestStructOutput = [string[], BigNumber[]] & {
    keys: string[];
    values: BigNumber[];
  };
}

export interface RegistrarEventsLibInterface extends utils.Interface {
  functions: {};

  events: {
    "DeleteNetworkConnection(uint256)": EventFragment;
    "PostNetworkConnection(uint256,tuple)": EventFragment;
    "UpdateRegistrarConfig(tuple)": EventFragment;
    "UpdateRegistrarFees(tuple)": EventFragment;
    "UpdateRegistrarOwner(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DeleteNetworkConnection"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PostNetworkConnection"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateRegistrarConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateRegistrarFees"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateRegistrarOwner"): EventFragment;
}

export interface DeleteNetworkConnectionEventObject {
  chainId: BigNumber;
}
export type DeleteNetworkConnectionEvent = TypedEvent<
  [BigNumber],
  DeleteNetworkConnectionEventObject
>;

export type DeleteNetworkConnectionEventFilter =
  TypedEventFilter<DeleteNetworkConnectionEvent>;

export interface PostNetworkConnectionEventObject {
  chainId: BigNumber;
  networkInfo: AngelCoreStruct.NetworkInfoStructOutput;
}
export type PostNetworkConnectionEvent = TypedEvent<
  [BigNumber, AngelCoreStruct.NetworkInfoStructOutput],
  PostNetworkConnectionEventObject
>;

export type PostNetworkConnectionEventFilter =
  TypedEventFilter<PostNetworkConnectionEvent>;

export interface UpdateRegistrarConfigEventObject {
  details: RegistrarStorage.ConfigStructOutput;
}
export type UpdateRegistrarConfigEvent = TypedEvent<
  [RegistrarStorage.ConfigStructOutput],
  UpdateRegistrarConfigEventObject
>;

export type UpdateRegistrarConfigEventFilter =
  TypedEventFilter<UpdateRegistrarConfigEvent>;

export interface UpdateRegistrarFeesEventObject {
  details: RegistrarMessages.UpdateFeeRequestStructOutput;
}
export type UpdateRegistrarFeesEvent = TypedEvent<
  [RegistrarMessages.UpdateFeeRequestStructOutput],
  UpdateRegistrarFeesEventObject
>;

export type UpdateRegistrarFeesEventFilter =
  TypedEventFilter<UpdateRegistrarFeesEvent>;

export interface UpdateRegistrarOwnerEventObject {
  newOwner: string;
}
export type UpdateRegistrarOwnerEvent = TypedEvent<
  [string],
  UpdateRegistrarOwnerEventObject
>;

export type UpdateRegistrarOwnerEventFilter =
  TypedEventFilter<UpdateRegistrarOwnerEvent>;

export interface RegistrarEventsLib extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RegistrarEventsLibInterface;

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

  functions: {};

  callStatic: {};

  filters: {
    "DeleteNetworkConnection(uint256)"(
      chainId?: null
    ): DeleteNetworkConnectionEventFilter;
    DeleteNetworkConnection(chainId?: null): DeleteNetworkConnectionEventFilter;

    "PostNetworkConnection(uint256,tuple)"(
      chainId?: null,
      networkInfo?: null
    ): PostNetworkConnectionEventFilter;
    PostNetworkConnection(
      chainId?: null,
      networkInfo?: null
    ): PostNetworkConnectionEventFilter;

    "UpdateRegistrarConfig(tuple)"(
      details?: null
    ): UpdateRegistrarConfigEventFilter;
    UpdateRegistrarConfig(details?: null): UpdateRegistrarConfigEventFilter;

    "UpdateRegistrarFees(tuple)"(
      details?: null
    ): UpdateRegistrarFeesEventFilter;
    UpdateRegistrarFees(details?: null): UpdateRegistrarFeesEventFilter;

    "UpdateRegistrarOwner(address)"(
      newOwner?: null
    ): UpdateRegistrarOwnerEventFilter;
    UpdateRegistrarOwner(newOwner?: null): UpdateRegistrarOwnerEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
