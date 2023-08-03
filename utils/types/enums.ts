export enum StrategyApprovalState {
  NOT_APPROVED,
  APPROVED,
  WITHDRAW_ONLY,
  DEPRECATED,
}

export type VaultParams = {
  Type: VaultType;
  vaultAddr: string;
};

export enum VaultType {
  LOCKED,
  LIQUID,
}

export enum VaultActionStatus {
  UNPROCESSED, // INIT state
  SUCCESS, // Ack
  POSITION_EXITED, // Position fully exited
  FAIL_TOKENS_RETURNED, // Tokens returned to accounts contract
  FAIL_TOKENS_FALLBACK, // Tokens failed to be returned to accounts contract
}

export enum ControllerSettingOption {
  AcceptedTokens,
  LockedInvestmentManagement,
  LiquidInvestmentManagement,
  AllowlistedBeneficiaries,
  AllowlistedContributors,
  MaturityAllowlist,
  EarlyLockedWithdrawFee,
  MaturityTime,
  WithdrawFee,
  DepositFee,
  BalanceFee,
  Name,
  Image,
  Logo,
  Sdgs,
  SplitToLiquid,
  IgnoreUserSplits,
}

export enum DelegateAction {
  Set,
  Revoke,
}

export enum FeeTypes {
  Default,
  Harvest,
  WithdrawCharity,
  WithdrawNormal,
  EarlyLockedWithdrawCharity,
  EarlyLockedWithdrawNormal,
}

export enum DonationMatchEnum {
  HaloTokenReserve,
  ERC20TokenReserve,
}

export enum EndowmentType {
  Charity,
  Normal,
  Daf,
}

export enum VeTypeEnum {
  Constant,
  Linear,
  SquarRoot,
}

export enum TokenType {
  Existing,
  New,
  VeBonding,
}

export enum NetworkConnectionAction {
  NONE,
  POST,
  DELETE,
}
