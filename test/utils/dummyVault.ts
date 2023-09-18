import {Signer} from "ethers";
import {ADDRESS_ZERO} from "utils";
import {DummyVault, DummyVault__factory, IVault} from "typechain-types";

import {DEFAULT_STRATEGY_ID, DEFAULT_VAULT_NAME, DEFAULT_VAULT_SYMBOL} from "./constants";

export async function deployDummyVault(
  deployer: Signer,
  {
    vaultType = 0,
    strategyId = DEFAULT_STRATEGY_ID,
    strategy = ADDRESS_ZERO,
    registrar = ADDRESS_ZERO,
    baseToken,
    yieldToken,
    apTokenName = DEFAULT_VAULT_NAME,
    apTokenSymbol = DEFAULT_VAULT_SYMBOL,
  }: {
    vaultType?: number;
    strategyId?: string;
    strategy?: string;
    registrar?: string;
    baseToken: string;
    yieldToken: string;
    apTokenName?: string;
    apTokenSymbol?: string;
  }
): Promise<DummyVault> {
  let Vault = new DummyVault__factory(deployer);
  let vaultInitConfig: IVault.VaultConfigStruct = {
    vaultType: vaultType,
    strategyId: strategyId,
    strategy: strategy,
    registrar: registrar,
    baseToken: baseToken,
    yieldToken: yieldToken,
    apTokenName: apTokenName,
    apTokenSymbol: apTokenSymbol,
  };
  const vault = await Vault.deploy(vaultInitConfig);
  await vault.deployed();
  return vault;
}
