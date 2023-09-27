import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {EndowmentMultiSig__factory, EndowmentMultiSigFactory__factory} from "typechain-types";
import {
  confirmAction,
  deploy,
  getAddresses,
  getAPTeamOwner,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
  apTeamSignerPkey?: string;
};

task(
  "upgrade:EndowmentMultiSig",
  "Will upgrade the implementation of the EndowmentMultiSig contract"
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction("Upgrading EndowmentMultiSig implementation contract..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const addresses = await getAddresses(hre);

      const deployment = await deploy(new EndowmentMultiSig__factory(deployer));

      logger.out("Upgrading EndowmentMultiSigFactory's implementation address...");
      const endowmentMultiSigFactory = EndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory.proxy,
        apTeamOwner
      );
      const payload = endowmentMultiSigFactory.interface.encodeFunctionData(
        "updateImplementation",
        [deployment.contract.address]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        endowmentMultiSigFactory.address,
        payload
      );
      if (!isExecuted) {
        return;
      }
      const newImplAddr = await endowmentMultiSigFactory.implementationAddress();
      if (newImplAddr !== deployment.contract.address) {
        throw new Error(
          `Unexpected: expected EndowmentMultiSigFactory.implementationAddress value "${deployment.contract.address}", but got "${newImplAddr}"`
        );
      }

      await updateAddresses(
        {multiSig: {endowment: {implementation: deployment.contract.address}}},
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment);
      }
    } catch (error) {
      logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
