import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {CharityApplications__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
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
  skipVerify: boolean;
  yes: boolean;
  proxyAdminPkey?: string;
};

task("upgrade:CharityApplications", "Will upgrade the implementation of CharityApplications")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction("Upgrading CharityApplications implementation contract..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      const addresses = await getAddresses(hre);

      // deploy implementation
      const deployment = await deploy(new CharityApplications__factory(deployer));

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const payload = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "upgradeTo",
        [deployment.contract.address]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        addresses.multiSig.charityApplications.proxy,
        payload
      );
      if (!isExecuted) {
        return;
      }

      // update address & verify
      await updateAddresses(
        {
          multiSig: {
            charityApplications: {
              implementation: deployment.contract.address,
            },
          },
        },
        hre
      );

      if (!taskArgs.skipVerify && !isLocalNetwork(hre)) {
        await verify(hre, deployment);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
