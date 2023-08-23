import {task, types} from "hardhat/config";
import {CharityApplications__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getContractName,
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
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

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
        addresses.multiSig.charityApplications.proxy,
        proxyAdmin
      );
      const tx1 = await apTeamProxy.upgradeTo(charityApplications.address);
      logger.out(`Tx hash: ${tx1.hash}`);
      await tx1.wait();

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
