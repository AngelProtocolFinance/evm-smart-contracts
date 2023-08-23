import {task} from "hardhat/config";
import {
  EndowmentMultiSigEmitter__factory,
  ITransparentUpgradeableProxy__factory,
} from "typechain-types";
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
  factory?: string;
  skipVerify: boolean;
  yes: boolean;
};

task(
  "upgrade:endowmentMultiSig:emitter",
  "Will upgrade the EndowmentMultiSigEmitter implementation contract"
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Upgrading EndowmentMultiSigEmitter implementation contract...");

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      logger.out("Deploying implementation...");
      const Emitter = new EndowmentMultiSigEmitter__factory(proxyAdmin);
      const emitter = await Emitter.deploy();
      logger.out(`Tx hash: ${emitter.deployTransaction.hash}`);
      await emitter.deployed();
      logger.out(`Address: ${emitter.address}`);

      logger.out("Upgrading proxy...");
      const proxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.endowment.emitter.proxy,
        proxyAdmin
      );
      const tx = await proxy.upgradeTo(emitter.address);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

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
