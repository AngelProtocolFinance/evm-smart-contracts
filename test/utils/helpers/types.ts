export type NetworkInfoStruct = {
  chainId: number;
  router: string;
  axelarGateway: string;
  ibcChannel: string;
  transferChannel: string;
  gasReceiver: string;
  gasLimit: number;
};

export enum StrategyApprovalState {
  NOT_APPROVED,
  APPROVED,
  WITHDRAW_ONLY,
  DEPRECATED,
}

export enum VaultActionStatus {
  UNPROCESSED, // INIT state
  SUCCESS, // Ack
  POSITION_EXITED, // Position fully exited
  FAIL_TOKENS_RETURNED, // Tokens returned to accounts contract
  FAIL_TOKENS_FALLBACK, // Tokens failed to be returned to accounts contract
}
