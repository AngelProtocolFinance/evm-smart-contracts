import {task} from "hardhat/config";
import {APVault_V1__factory, DummyERC20__factory, IVaultEmitter__factory} from "typechain-types";
import {getAddresses, getContractName, getSigners, logger, verify} from "utils";

task("Deploy:genericVault", "Will deploy a generic vault with the provided params")
  .addOptionalParam("yieldtoken", "The address of the yield token")
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
      if (network.chainId == 31337) {
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

      let Vault = new APVault_V1__factory(deployer);

      let vaultConfig = {
        vaultType: 1,
        strategyId: "0x12345678",
        strategy: hre.ethers.constants.AddressZero,
        registrar: addresses.registrar.proxy,
        baseToken: baseTokenAddress,
        yieldToken: yieldTokenAddress,
        apTokenName: "TestVault",
        apTokenSymbol: "TV",
        admin: deployer.address,
      };
      const ctorArgs: Parameters<(typeof Vault)["deploy"]> = [
        vaultConfig,
        addresses.vaultEmitter.proxy,
      ];
      let vault = await Vault.deploy(...ctorArgs);
      logger.out(`Tx hash: ${vault.deployTransaction.hash}`);
      await vault.deployed();
      logger.pad(30, "Vault deployed to", vault.address);

      logger.out("Emitting `VaultCreated` event...");
      const vaultEmitter = IVaultEmitter__factory.connect(addresses.vaultEmitter.proxy, deployer);
      const tx = await vaultEmitter.vaultCreated(vault.address, vaultConfig);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await verify(hre, {
        address: vault.address,
        contractName: getContractName(Vault),
        constructorArguments: ctorArgs,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
