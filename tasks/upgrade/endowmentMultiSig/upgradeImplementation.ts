import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {EndowmentMultiSig__factory, EndowmentMultiSigFactory__factory} from "typechain-types";
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
  "upgrade:endowmentMultiSig:implementation",
  "Will upgrade the implementation of the EndowmentMultiSig contract"
)
  .addOptionalParam(
    "factory",
    "MultiSigFactory contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
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
      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      const addresses = await getAddresses(hre);

      const EndowmentMultiSigFactoryAddress =
        taskArgs.factory || addresses.multiSig.endowment.factory;

      logger.out("Deploying a new EndowmentMultiSig contract...");
      const factory = new EndowmentMultiSig__factory(deployer);
      const contract = await factory.deploy();
      await contract.deployed();
      logger.out(`Address: ${contract.address}`);

      logger.out("Upgrading EndowmentMultiSigFactory's implementation address...");
      const endowmentMultiSigFactory = EndowmentMultiSigFactory__factory.connect(
        EndowmentMultiSigFactoryAddress,
        proxyAdminOwner
      );
      const payload = endowmentMultiSigFactory.interface.encodeFunctionData(
        "updateImplementation",
        [contract.address]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        endowmentMultiSigFactory.address,
        payload
      );
      if (!isExecuted) {
        return;
      }

      const newImplAddr = await endowmentMultiSigFactory.implementationAddress();
      if (newImplAddr !== contract.address) {
        throw new Error(
          `Unexpected: expected EndowmentMultiSigFactory.implementationAddress value "${contract.address}", but got "${newImplAddr}"`
        );
      }

      await updateAddresses({multiSig: {endowment: {implementation: contract.address}}}, hre);

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, {address: contract.address, contractName: getContractName(factory)});
      }
    } catch (error) {
      logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
