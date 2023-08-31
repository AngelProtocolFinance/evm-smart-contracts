import {task} from "hardhat/config";
import {
  EndowmentMultiSigEmitter__factory,
  ITransparentUpgradeableProxy__factory,
  ProxyAdminMultiSig__factory,
} from "typechain-types";
import {
  confirmAction,
  connectSignerFromPkey,
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
      const proxyAdminMultisig = ProxyAdminMultiSig__factory.connect(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner
      );
      const emitterProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.endowment.emitter.proxy,
        deployer
      );
      const payload = emitterProxy.interface.encodeFunctionData("upgradeTo", [emitter.address]);
      const tx = await proxyAdminMultisig.submitTransaction(emitterProxy.address, 0, payload, "0x");
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
