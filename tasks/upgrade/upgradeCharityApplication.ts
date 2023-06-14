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
  charityApplicationLib?: string;
  verify: boolean;
  yes: boolean;
};

task("upgrade:CharityApplication", "Will upgrade the implementation of CharityApplication")
  .addOptionalParam(
    "charityApplicationLib",
    "CharityApplicationLib contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction("Upgrading CharityApplication implementation contract..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const charityApplicationLib =
        taskArgs.charityApplicationLib || addresses.libraries.charityApplicationLib;

      // deploy implementation
      logger.out("Deploying CharityApplication...");
      const charityApplicationFactory = new CharityApplication__factory(
        {
          "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
            charityApplicationLib,
        },
        proxyAdmin
      );
      const charityApplication = await charityApplicationFactory.deploy();
      await charityApplication.deployed();
      logger.out(`Address: ${charityApplication.address}`);

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.charityApplication.proxy,
        proxyAdmin
      );
      const tx1 = await apTeamProxy.upgradeTo(charityApplication.address);
      logger.out(`Tx hash: ${tx1.hash}`);
      await tx1.wait();

      // update address & verify
      await updateAddresses(
        {
          charityApplication: {
            implementation: charityApplication.address,
          },
        },
        hre
      );

      if (taskArgs.verify && !isLocalNetwork(hre)) {
        await verify(hre, {address: charityApplication.address});
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
