import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {ITransparentUpgradeableProxy__factory, Registrar__factory} from "typechain-types";
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

task("upgrade:registrar", "Will upgrade the Registrar (use only on the primary chain)")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(
    async (taskArgs: {skipVerify: boolean; yes: boolean; proxyAdminPkey?: string}, hre) => {
      try {
        const isConfirmed =
          taskArgs.yes || (await confirmAction("Upgrading Registrar implementation..."));
        if (!isConfirmed) {
          return logger.out("Confirmation denied.", logger.Level.Warn);
        }

        const {deployer} = await getSigners(hre);
        const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

        const addresses = await getAddresses(hre);

        logger.out("Deploying a new Registrar implementation...");
        const Registrar = new Registrar__factory(deployer);
        const registrar = await Registrar.deploy();
        await registrar.deployed();
        logger.out(`New impl address: ${registrar.address}`);

        logger.out("Upgrading Registrar proxy implementation...");
        const payload = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
          "upgradeTo",
          [registrar.address]
        );
        const isExecuted = await submitMultiSigTx(
          addresses.multiSig.proxyAdmin,
          proxyAdminOwner,
          addresses.registrar.proxy,
          payload
        );
        if (!isExecuted) {
          return;
        }

        await updateAddresses(
          {
            registrar: {
              implementation: registrar.address,
            },
          },
          hre
        );

        if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
          await verify(hre, {
            address: registrar.address,
            contract: "contracts/core/registrar/Registrar.sol:Registrar",
            contractName: getContractName(Registrar),
          });
        }
      } catch (error) {
        logger.out(error, logger.Level.Error);
      }
    }
  );
