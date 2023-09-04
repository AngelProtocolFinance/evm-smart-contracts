import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {
  EndowmentMultiSigEmitter__factory,
  ITransparentUpgradeableProxy__factory,
} from "typechain-types";
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

      logger.out("Deploying implementation...");
      const Emitter = new EndowmentMultiSigEmitter__factory(deployer);
      const emitter = await Emitter.deploy();
      logger.out(`Tx hash: ${emitter.deployTransaction.hash}`);
      await emitter.deployed();
      logger.out(`Address: ${emitter.address}`);

      logger.out("Upgrading proxy...");
      const payload = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "upgradeTo",
        [emitter.address]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        addresses.multiSig.endowment.emitter.proxy,
        payload
      );
      if (!isExecuted) {
        return;
      }

      await updateAddresses(
        {
          multiSig: {
            endowment: {
              emitter: {
                implementation: emitter.address,
              },
            },
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, {address: emitter.address, contractName: getContractName(Emitter)});
      }
    } catch (error) {
      logger.out(`EndowmentMultiSigEmitter upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
