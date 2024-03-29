import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {ChainID} from "types";

export type StratConfig = {
  name: string;
  id: string;
  chainId: ChainID;
  tokenName: string;
  tokenSymbol: string;
  baseToken: string;
  yieldToken: string;
  params: LocalRegistrarLib.StrategyParamsStruct;
};

export type AllStratConfigs = Record<string, StratConfig>;

export type StrategyObject = {
  locked: string;
  liquid: string;
  strategy: string;
};
