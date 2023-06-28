import {task, types} from "hardhat/config";
import {CharityApplication__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
};

task("upgrade:CharityApplications", "Will upgrade the implementation of CharityApplications")
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction("Upgrading CharityApplications implementation contract..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      // deploy implementation
      logger.out("Deploying CharityApplications...");
      const charityApplicationsFactory = new CharityApplications__factory(proxyAdmin);
      const charityApplications = await charityApplicationsFactory.deploy();
      await charityApplications.deployed();
      logger.out(`Address: ${charityApplications.address}`);

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multisigs.charityApplications.proxy,
        proxyAdmin
      );
      const tx1 = await apTeamProxy.upgradeTo(charityApplications.address);
      logger.out(`Tx hash: ${tx1.hash}`);
      await tx1.wait();

      // update address & verify
      await updateAddresses(
        {
          multisigs: {
            charityApplications: {
              implementation: charityApplications.address,
            },
          },
        },
        hre
      );

      if (!taskArgs.skipVerify && !isLocalNetwork(hre)) {
        await verify(hre, {address: charityApplications.address});
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
