import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APVault_V1__factory, IVault, VaultEmitter__factory} from "typechain-types";
import {Deployment, VaultType} from "types";
import {deploy, getAddresses, logger} from "utils";

export type VaultDeploymentPair = {
  Locked: Deployment<APVault_V1__factory>;
  Liquid: Deployment<APVault_V1__factory>;
};

export async function deployVaultPair(
  deployer: Signer,
  admin: string,
  config: IVault.VaultConfigStruct,
  hre: HardhatRuntimeEnvironment
): Promise<VaultDeploymentPair> {
  // setup
  const APVault_V1 = new APVault_V1__factory(deployer);
  const addresses = await getAddresses(hre);

  // deploy
  const LockedDeployment = await deployVault(
    {
      ...config,
      vaultType: VaultType.LOCKED,
      apTokenName: config.apTokenName + "Lock",
      apTokenSymbol: config.apTokenSymbol + "Lock",
    },
    APVault_V1,
    admin,
    addresses.vaultEmitter.proxy,
    hre
  );

  const LiquidDeployment = await deployVault(
    {
      ...config,
      vaultType: VaultType.LIQUID,
      apTokenName: config.apTokenName + "Liq",
      apTokenSymbol: config.apTokenSymbol + "Liq",
    },
    APVault_V1,
    admin,
    addresses.vaultEmitter.proxy,
    hre
  );

  return {
    Locked: LockedDeployment,
    Liquid: LiquidDeployment,
  };
}

async function deployVault(
  config: IVault.VaultConfigStruct,
  factory: APVault_V1__factory,
  admin: string,
  emitter: string,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<APVault_V1__factory>> {
  const Deployment = await deploy(factory, [config, emitter, admin]);

  await registerVaultWithEmitter(factory.signer, Deployment.contract.address, config, hre);

  return Deployment;
}

async function registerVaultWithEmitter(
  deployer: Signer,
  address: string,
  config: IVault.VaultConfigStruct,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Registering vault and emitting `VaultCreated` event...");
  const addresses = await getAddresses(hre);
  const vaultEmitter = VaultEmitter__factory.connect(addresses.vaultEmitter.proxy, deployer);
  const tx = await vaultEmitter.vaultCreated(address, config);
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
}
