import {ChainID, StrategyApprovalState, VaultType} from "types";
import {AllStratConfigs, StratConfig, getNetworkNameFromChainId, getVaultAddress} from "utils";

export const dummy: StratConfig = {
  name: "dummy",
  id: "0x12345678",
  chainId: ChainID.goerli,
  tokenName: "TestVault",
  tokenSymbol: "TV",
  baseToken: "",
  yieldToken: "",
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: getNetworkNameFromChainId(ChainID.goerli),
    lockedVaultAddr: getVaultAddress("dummy", VaultType.LOCKED),
    liquidVaultAddr: getVaultAddress("dummy", VaultType.LIQUID),
  },
};

export const flux: StratConfig = {
  name: "flux",
  id: "0x00000001",
  chainId: ChainID.ethereum,
  tokenName: "FluxVaultAP",
  tokenSymbol: "fUSDC_AP",
  baseToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  yieldToken: "0x465a5a630482f3abD6d3b84B39B29b07214d19e5",
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: getNetworkNameFromChainId(ChainID.ethereum),
    lockedVaultAddr: getVaultAddress("flux", VaultType.LOCKED),
    liquidVaultAddr: getVaultAddress("flux", VaultType.LIQUID),
  },
};

export const sommelier: StratConfig = {
  name: "sommelier",
  id: "0x00000002",
  chainId: ChainID.ethereum,
  tokenName: "RealYieldEthAP",
  tokenSymbol: "YieldETH_AP",
  baseToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  yieldToken: "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec",
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: getNetworkNameFromChainId(ChainID.ethereum),
    lockedVaultAddr: getVaultAddress("sommelier", VaultType.LOCKED),
    liquidVaultAddr: getVaultAddress("sommelier", VaultType.LIQUID),
  },
};

export const allStrategyConfigs: AllStratConfigs = {
  dummy: dummy,
  flux: flux,
  sommelier: sommelier,
};
