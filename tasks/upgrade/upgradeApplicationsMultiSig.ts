import {task, types} from "hardhat/config";
import {
  ApplicationsMultiSig__factory,
  ITransparentUpgradeableProxy__factory,
} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

task("upgrade:ApplicationsMultiSig", "Will upgrade the ApplicationsMultiSig")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading ApplicationsMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      logger.out("Deploying ApplicationsMultiSig...");
      const applicationsFactory = new ApplicationsMultiSig__factory(proxyAdmin);
      const applicationsMultiSig = await applicationsFactory.deploy();
      await applicationsMultiSig.deployed();
      logger.out(`Address: ${applicationsMultiSig.address}`);

      logger.out("Upgrading ApplicationsMultiSig proxy implementation...");
      const applicationsProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.applications.proxy,
        proxyAdmin
      );
      const tx = await applicationsProxy.upgradeTo(applicationsMultiSig.address);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await updateAddresses(
        {
          multiSig: {
            applications: {
              implementation: applicationsMultiSig.address,
            },
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        await verify(hre, {
          address: applicationsMultiSig.address,
          contract: "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig",
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
