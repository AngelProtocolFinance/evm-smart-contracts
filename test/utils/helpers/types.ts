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
