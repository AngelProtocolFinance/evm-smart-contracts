export enum ChainID {
  none = 0,
  ethereum = 1,
  goerli = 5,
  polygon = 137,
  hardhat = 31337,
  mumbai = 80001,
}

export enum StrategyApprovalState {
  NOT_APPROVED,
  APPROVED,
  WITHDRAW_ONLY,
  DEPRECATED,
}

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

export enum FeeTypes {
  Default,
  Harvest,
  Deposit,
  DepositCharity,
  Withdraw,
  WithdrawCharity,
  EarlyLockedWithdraw,
  EarlyLockedWithdrawCharity,
  Balance,
  BalanceCharity,
}

export enum BeneficiaryEnum {
  EndowmentId,
  Wallet,
  None,
}

export enum DonationMatchEnum {
  HaloTokenReserve,
  ERC20TokenReserve,
}

export enum EndowmentType {
  Charity,
  Ast,
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
