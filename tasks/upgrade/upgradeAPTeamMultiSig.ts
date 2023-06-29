import {task} from "hardhat/config";
import {APTeamMultiSig__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

task("upgrade:APTeamMultiSig", "Will upgrade the APTeamMultiSig")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Upgrading APTeamMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      // Update APTeamMultiSig
      logger.out("Deploying APTeamMultiSig...");
      const apTeamFactory = new APTeamMultiSig__factory(proxyAdmin);
      const apTeamMultiSig = await apTeamFactory.deploy();
      await apTeamMultiSig.deployed();
      logger.out(`Address: ${apTeamMultiSig.address}`);

      logger.out("Upgrading APTeamMultiSig proxy implementation...");
      const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.apTeam.proxy,
        proxyAdmin
      );
      const tx = await apTeamProxy.upgradeTo(apTeamMultiSig.address);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await updateAddresses(
        {
          multiSig: {
            apTeam: {
              implementation: apTeamMultiSig.address,
            },
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, {
          address: apTeamMultiSig.address,
          contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig",
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
