import {task} from "hardhat/config";
import {
  ITransparentUpgradeableProxy__factory,
  ProxyAdminMultiSig__factory,
  Router__factory,
} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getContractName,
  getProxyAdmin,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

task("upgrade:router", "Will upgrade the Router")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(
    async (taskArgs: {skipVerify: boolean; yes: boolean; proxyAdminPkey?: string}, hre) => {
      try {
        const isConfirmed =
          taskArgs.yes || (await confirmAction("Upgrading Router implementation..."));
        if (!isConfirmed) {
          return logger.out("Confirmation denied.", logger.Level.Warn);
        }

        const {deployer} = await getSigners(hre);
        const proxyAdminSigner = await getProxyAdmin(hre, taskArgs.proxyAdminPkey);

        const addresses = await getAddresses(hre);

        logger.out("Deploying a new Router implementation...");
        const Router = new Router__factory(deployer);
        const router = await Router.deploy();
        await router.deployed();
        logger.out(`New impl address: ${router.address}`);

        logger.out("Upgrading Router proxy implementation...");
        const routerProxy = ITransparentUpgradeableProxy__factory.connect(
          addresses.router.proxy,
          deployer
        );
        const proxyAdminMultisig = ProxyAdminMultiSig__factory.connect(
          addresses.multiSig.proxyAdmin,
          proxyAdminSigner
        );
        const payload = routerProxy.interface.encodeFunctionData("upgradeTo", [router.address]);
        const tx = await proxyAdminMultisig.submitTransaction(
          routerProxy.address,
          0,
          payload,
          "0x"
        );
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
            contractName: getContractName(Router),
          });
        }
      } catch (error) {
        logger.out(error, logger.Level.Error);
      }
    }
  );
