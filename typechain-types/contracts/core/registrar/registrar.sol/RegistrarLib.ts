/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace AngelCoreStruct {
  export type YieldVaultStruct = {
    addr: PromiseOrValue<string>;
    network: PromiseOrValue<BigNumberish>;
    inputDenom: PromiseOrValue<string>;
    yieldToken: PromiseOrValue<string>;
    approved: PromiseOrValue<boolean>;
    restrictedFrom: PromiseOrValue<BigNumberish>[];
    acctType: PromiseOrValue<BigNumberish>;
    vaultType: PromiseOrValue<BigNumberish>;
  };

  export type YieldVaultStructOutput = [
    string,
    BigNumber,
    string,
    string,
    boolean,
    number[],
    number,
    number
  ] & {
    addr: string;
    network: BigNumber;
    inputDenom: string;
    yieldToken: string;
    approved: boolean;
    restrictedFrom: number[];
    acctType: number;
    vaultType: number;
  };
}

export interface RegistrarLibInterface extends utils.Interface {
  functions: {
    "filterVault((string,uint256,address,address,bool,AngelCoreStruct.EndowmentType[],uint8,uint8),uint256,uint8,uint8,uint8,uint8)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "filterVault"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "filterVault",
    values: [
      AngelCoreStruct.YieldVaultStruct,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "filterVault",
    data: BytesLike
  ): Result;

  events: {};
}

export interface RegistrarLib extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RegistrarLibInterface;

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
    filterVault(
      data: AngelCoreStruct.YieldVaultStruct,
      network: PromiseOrValue<BigNumberish>,
      endowmentType: PromiseOrValue<BigNumberish>,
      accountType: PromiseOrValue<BigNumberish>,
      vaultType: PromiseOrValue<BigNumberish>,
      approved: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  filterVault(
    data: AngelCoreStruct.YieldVaultStruct,
    network: PromiseOrValue<BigNumberish>,
    endowmentType: PromiseOrValue<BigNumberish>,
    accountType: PromiseOrValue<BigNumberish>,
    vaultType: PromiseOrValue<BigNumberish>,
    approved: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    filterVault(
      data: AngelCoreStruct.YieldVaultStruct,
      network: PromiseOrValue<BigNumberish>,
      endowmentType: PromiseOrValue<BigNumberish>,
      accountType: PromiseOrValue<BigNumberish>,
      vaultType: PromiseOrValue<BigNumberish>,
      approved: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    filterVault(
      data: AngelCoreStruct.YieldVaultStruct,
      network: PromiseOrValue<BigNumberish>,
      endowmentType: PromiseOrValue<BigNumberish>,
      accountType: PromiseOrValue<BigNumberish>,
      vaultType: PromiseOrValue<BigNumberish>,
      approved: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    filterVault(
      data: AngelCoreStruct.YieldVaultStruct,
      network: PromiseOrValue<BigNumberish>,
      endowmentType: PromiseOrValue<BigNumberish>,
      accountType: PromiseOrValue<BigNumberish>,
      vaultType: PromiseOrValue<BigNumberish>,
      approved: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
