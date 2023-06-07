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
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { BaseContract, BigNumber, Signer, utils } from "ethers";

export declare namespace GovHodlerStorage {
  export type ConfigStruct = {
    owner: PromiseOrValue<string>;
    haloToken: PromiseOrValue<string>;
    timelockContract: PromiseOrValue<string>;
  };

  export type ConfigStructOutput = [string, string, string] & {
    owner: string;
    haloToken: string;
    timelockContract: string;
  };
}

export interface GovHodlerEventsInterface extends utils.Interface {
  functions: {};

  events: {
    "claimHalo(address,uint256)": EventFragment;
    "updateConfig(tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "claimHalo"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "updateConfig"): EventFragment;
}

export interface claimHaloEventObject {
  recipient: string;
  amount: BigNumber;
}
export type claimHaloEvent = TypedEvent<
  [string, BigNumber],
  claimHaloEventObject
>;

export type claimHaloEventFilter = TypedEventFilter<claimHaloEvent>;

export interface updateConfigEventObject {
  config: GovHodlerStorage.ConfigStructOutput;
}
export type updateConfigEvent = TypedEvent<
  [GovHodlerStorage.ConfigStructOutput],
  updateConfigEventObject
>;

export type updateConfigEventFilter = TypedEventFilter<updateConfigEvent>;

export interface GovHodlerEvents extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GovHodlerEventsInterface;

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
    "claimHalo(address,uint256)"(
      recipient?: null,
      amount?: null
    ): claimHaloEventFilter;
    claimHalo(recipient?: null, amount?: null): claimHaloEventFilter;

    "updateConfig(tuple)"(config?: null): updateConfigEventFilter;
    updateConfig(config?: null): updateConfigEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
