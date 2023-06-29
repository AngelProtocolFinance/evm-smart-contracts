import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APVault_V1__factory, DummyERC20__factory} from "typechain-types";
import {logger, getSigners, getAddresses} from "utils";

task("Deploy:genericVault", "Will deploy a generic vault with the provided params")
  .addOptionalParam("yieldtoken", "The address of the yield token")
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs, hre) => {
    try {
      const {deployer} = await getSigners(hre);
      let network = await hre.ethers.provider.getNetwork();
      let addresses = await getAddresses(hre);

      let baseTokenAddress: string;
      let yieldTokenAddress: string;
      // For localhost/hardhat, we deploy 2 dummy tokens so that the ERC20 interface calls dont revert
      if (network.chainId == 31337) {
        let BaseToken = new DummyERC20__factory(deployer);
        let baseToken = await BaseToken.deploy();
        baseTokenAddress = baseToken.address;
        let YieldToken = new DummyERC20__factory(deployer);
        let yieldToken = await YieldToken.deploy();
        yieldTokenAddress = yieldToken.address;
      } else {
        baseTokenAddress = addresses.tokens.usdc;
        yieldTokenAddress = taskArgs.yieldtoken;
      }

      let Vault = new APVault_V1__factory(deployer);

      let vaultConfig = {
        vaultType: 1,
        strategySelector: "0x12345678",
        strategy: hre.ethers.constants.AddressZero,
        registrar: hre.ethers.constants.AddressZero,
        baseToken: baseTokenAddress,
        yieldToken: yieldTokenAddress,
        apTokenName: "TestVault",
        apTokenSymbol: "TV",
        admin: deployer.address,
      };
      let vault = await Vault.deploy(vaultConfig);
      logger.pad(30, "Vault deployed to", vault.address);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
