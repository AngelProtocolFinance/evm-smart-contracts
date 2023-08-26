import {task} from "hardhat/config";
import {
  CharityApplications__factory,
  ITransparentUpgradeableProxy__factory,
  ProxyAdmin__factory,
} from "typechain-types";
import {
  confirmAction,
  connectSignerFromPkey,
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
  proxyAdminPkey?: string;
};

task("upgrade:CharityApplications", "Will upgrade the implementation of CharityApplications")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy amdin multisig")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction("Upgrading CharityApplications implementation contract..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      let {deployer, proxyAdminSigner} = await getSigners(hre);
      if (!proxyAdminSigner && taskArgs.proxyAdminPkey) {
        proxyAdminSigner = await connectSignerFromPkey(taskArgs.proxyAdminPkey, hre);
      } else if (!proxyAdminSigner) {
        throw new Error("Must provide a pkey for proxyAdmin signer on this network");
      }

      const addresses = await getAddresses(hre);

      // deploy implementation
      logger.out("Deploying CharityApplications...");
      const charityApplicationsFactory = new CharityApplications__factory(deployer);
      const charityApplications = await charityApplicationsFactory.deploy();
      await charityApplications.deployed();
      logger.out(`Address: ${charityApplications.address}`);

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const charityApplicationsProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.charityApplications.proxy,
        deployer
      );
      const proxyAdminMultisig = ProxyAdmin__factory.connect(
        addresses.multiSig.proxyAdmin,
        proxyAdminSigner
      );
      const payload = charityApplicationsProxy.interface.encodeFunctionData("upgradeTo", [
        charityApplications.address,
      ]);
      const tx = await proxyAdminMultisig.submitTransaction(
        charityApplicationsProxy.address,
        0,
        payload,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

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
