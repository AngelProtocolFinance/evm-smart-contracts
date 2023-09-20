import {ChainID, StrategyApprovalState, VaultType} from "types";
import {AllStratConfigs, StratConfig, getNetworkNameFromChainId, getVaultAddress} from "utils";
import {
  FluxStrategy__factory
} from "typechain-types"

export const dummy: StratConfig = {
  name: "dummy",
  id: "0x12345678",
  chainId: ChainID.goerli,
  tokenName: "TestVault",
  tokenSymbol: "TV",
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
  contract: FluxStrategy__factory,
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: getNetworkNameFromChainId(ChainID.ethereum),
    lockedVaultAddr: getVaultAddress("flux", VaultType.LOCKED),
    liquidVaultAddr: getVaultAddress("flux", VaultType.LIQUID),
  },
};

export const allStrategyConfigs: AllStratConfigs = {
  dummy: dummy,
  flux: flux,
};
