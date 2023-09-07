import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {
  EndowmentMultiSigEmitter__factory,
  ITransparentUpgradeableProxy__factory,
} from "typechain-types";
import {
  confirmAction,
  deploy,
  getAddresses,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

type TaskArgs = {
  factory?: string;
  skipVerify: boolean;
  yes: boolean;
  proxyAdminPkey?: string;
};

task(
  "upgrade:endowmentMultiSig:emitter",
  "Will upgrade the EndowmentMultiSigEmitter implementation contract"
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Upgrading EndowmentMultiSigEmitter implementation contract...");

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      const addresses = await getAddresses(hre);

      const deployment = await deploy(new EndowmentMultiSigEmitter__factory(deployer));

      logger.out("Upgrading proxy...");
      const proxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.proxyAdmin,
        hre.ethers.provider
      );
      const payload = proxy.interface.encodeFunctionData("upgradeTo", [
        deployment.contract.address,
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        addresses.multiSig.endowment.emitter.proxy,
        payload
      );
      if (!isExecuted) {
        return;
      }
      const newImplAddr = await proxy.implementation();
      if (newImplAddr !== deployment.contract.address) {
        throw new Error(
          `Unexpected: expected value "${deployment.contract.address}", but got "${newImplAddr}"`
        );
      }

      await updateAddresses(
        {
          multiSig: {
            endowment: {
              emitter: {
                implementation: deployment.contract.address,
              },
            },
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment);
      }
    } catch (error) {
      logger.out(`EndowmentMultiSigEmitter upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
