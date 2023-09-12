import {task} from "hardhat/config";
import {
  APVault_V1__factory,
  DummyERC20__factory,
  IVault,
  IVaultEmitter__factory,
} from "typechain-types";
import {ChainID} from "types";
import {deploy, getAddresses, getSigners, logger, verify} from "utils";

task("Deploy:genericVault", "Will deploy a generic vault with the provided params")
  .addOptionalParam("yieldtoken", "The address of the yield token")
  .addOptionalParam("admin", "The address of the admin, will default to the deployer's address")
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs, hre) => {
    try {
      logger.out("Deploying a generic Vault...");
      const {deployer} = await getSigners(hre);
      let network = await hre.ethers.provider.getNetwork();
      let addresses = await getAddresses(hre);

      let baseTokenAddress: string;
      let yieldTokenAddress: string;
      // For localhost/hardhat, we deploy 2 dummy tokens so that the ERC20 interface calls dont revert
      if (network.chainId == ChainID.hardhat) {
        let BaseToken = new DummyERC20__factory(deployer);
        let baseToken = await BaseToken.deploy(0);
        baseTokenAddress = baseToken.address;
        let YieldToken = new DummyERC20__factory(deployer);
        let yieldToken = await YieldToken.deploy(0);
        yieldTokenAddress = yieldToken.address;
      } else {
        baseTokenAddress = addresses.tokens.usdc;
        yieldTokenAddress = taskArgs.yieldtoken;
      }

      // data setup
      const APVault_V1 = new APVault_V1__factory(deployer);
      const vaultConfig: IVault.VaultConfigStruct = {
        vaultType: 1,
        strategyId: "0x12345678",
        strategy: hre.ethers.constants.AddressZero,
        registrar: addresses.registrar.proxy,
        baseToken: baseTokenAddress,
        yieldToken: yieldTokenAddress,
        apTokenName: "TestVault",
        apTokenSymbol: "TV",
      };
      // deploy
      const deployment = await deploy(APVault_V1, [
        vaultConfig,
        addresses.vaultEmitter.proxy,
        deployer.address,
      ]);

      logger.out("Emitting `VaultCreated` event...");
      const vaultEmitter = IVaultEmitter__factory.connect(addresses.vaultEmitter.proxy, deployer);
      const tx = await vaultEmitter.vaultCreated(deployment.contract.address, vaultConfig);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await verify(hre, deployment);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
