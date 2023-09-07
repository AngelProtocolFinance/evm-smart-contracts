import {StrategyApprovalState, VaultType} from "types";
import {AllStratConfigs, StratConfig, getVaultAddress} from "utils";

export const dummy: StratConfig = {
  name: "dummy",
  id: "0x12345678",
  chainId: 5,
  params: {
    approvalState: StrategyApprovalState.APPROVED,
    network: "ethereum-2",
    lockedVaultAddr: getVaultAddress("dummy", VaultType.LOCKED),
    liquidVaultAddr: getVaultAddress("dummy", VaultType.LIQUID),
  },
};

export const allStrategyConfigs: AllStratConfigs = {
  dummy: dummy,
};
