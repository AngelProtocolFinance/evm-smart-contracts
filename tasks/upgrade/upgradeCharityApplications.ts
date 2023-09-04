import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {CharityApplications__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getContractName,
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
      logger.out("Deploying CharityApplications...");
      const charityApplicationsFactory = new CharityApplications__factory(deployer);
      const charityApplications = await charityApplicationsFactory.deploy();
      await charityApplications.deployed();
      logger.out(`Address: ${charityApplications.address}`);

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const payload = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "upgradeTo",
        [charityApplications.address]
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
              implementation: charityApplications.address,
            },
          },
        },
        hre
      );

      if (!taskArgs.skipVerify && !isLocalNetwork(hre)) {
        await verify(hre, {
          address: charityApplications.address,
          contractName: getContractName(charityApplicationsFactory),
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
