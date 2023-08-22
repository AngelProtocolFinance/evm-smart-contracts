import {task} from "hardhat/config";
import {Router__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

task("upgrade:router", "Will upgrade the Router")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading Router implementation..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer, proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      logger.out("Deploying a new Router implementation...");
      const Router = new Router__factory(deployer);
      const router = await Router.deploy();
      await router.deployed();
      logger.out(`New impl address: ${router.address}`);

      logger.out("Upgrading Router proxy implementation...");
      const routerProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.router.proxy,
        proxyAdmin
      );
      const tx = await routerProxy.upgradeTo(router.address);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await updateAddresses(
        {
          registrar: {
            implementation: router.address,
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, {
          address: router.address,
          contract: "contracts/core/router/Router.sol:Router",
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });