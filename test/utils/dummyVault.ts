import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ADDRESS_ZERO} from "utils";
import {DummyVault, DummyVault__factory, IVault} from "typechain-types";

import {DEFAULT_STRATEGY_SELECTOR, DEFAULT_VAULT_NAME, DEFAULT_VAULT_SYMBOL} from "./constants";

export async function deployDummyVault(
  deployer: SignerWithAddress,
  {
    vaultType = 0,
    strategySelector = DEFAULT_STRATEGY_SELECTOR,
    strategy = ADDRESS_ZERO,
    registrar = ADDRESS_ZERO,
    baseToken,
    yieldToken,
    apTokenName = DEFAULT_VAULT_NAME,
    apTokenSymbol = DEFAULT_VAULT_SYMBOL,
  }: {
    vaultType?: number;
    strategySelector?: string;
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
    strategySelector: strategySelector,
    strategy: strategy,
    registrar: registrar,
    baseToken: baseToken,
    yieldToken: yieldToken,
    apTokenName: apTokenName,
    apTokenSymbol: apTokenSymbol,
    admin: deployer.address,
  };
  const vault = await Vault.deploy(vaultInitConfig);
  await vault.deployed();
  return vault;
}
