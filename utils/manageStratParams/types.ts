import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";

export type StratConfig = {
  name: string;
  id: string;
  chainId: number;
  params: LocalRegistrarLib.StrategyParamsStruct;
};

export type AllStratConfigs = Record<string, StratConfig>;

export type StrategyObject = {
  locked: string;
  liquid: string;
  strategy: string;
};
