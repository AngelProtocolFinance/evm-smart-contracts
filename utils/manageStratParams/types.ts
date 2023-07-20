export type StrategyParams = {
  approvalState: StrategyApprovalState;
  network: string;
  Locked: VaultParams;
  Liquid: VaultParams;
}

export type StratConfig = {
  name: string;
  id: string;
  chainId: number;
  params: StrategyParams;
}

export enum StrategyApprovalState {
  NOT_APPROVED,
  APPROVED,
  WITHDRAW_ONLY,
  DEPRECATED
}

export type VaultParams = {
  Type: VaultType;
  vaultAddr: string;
}

export enum VaultType {
  LOCKED, 
  LIQUID
}

export type AllStratConfigs = Record<string, StratConfig>

export type StrategyObject = {
  locked: string;
  liquid: string;
  strategy: string;
}