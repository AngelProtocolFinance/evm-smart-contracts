import {
  AllStratConfigs,
  StratConfig,
  StrategyApprovalState,
  VaultType,
  getVaultAddress,
} from "utils";

export const dummy: StratConfig = {
  name: "dummy",
  id: "0x12345678",
  chainId: 5,
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: "ethereum-2",
    Locked: {
      Type: VaultType.LOCKED,
      vaultAddr: getVaultAddress("dummy", VaultType.LOCKED),
    },
    Liquid: {
      Type: VaultType.LIQUID,
      vaultAddr: getVaultAddress("dummy", VaultType.LIQUID),
    },
  },
};

export const allStrategyConfigs: AllStratConfigs = {
  dummy: dummy,
};
