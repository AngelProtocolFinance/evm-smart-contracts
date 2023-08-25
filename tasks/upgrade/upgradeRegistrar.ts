import {task} from "hardhat/config";
import {
  Registrar__factory,
  ITransparentUpgradeableProxy__factory,
  ProxyAdmin__factory,
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

task("upgrade:registrar", "Will upgrade the Registrar (use only on the primary chain)")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading Registrar implementation..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer, proxyAdminSigner} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      logger.out("Deploying a new Registrar implementation...");
      const Registrar = new Registrar__factory(deployer);
      const registrar = await Registrar.deploy();
      await registrar.deployed();
      logger.out(`New impl address: ${registrar.address}`);

      logger.out("Upgrading Registrar proxy implementation...");
      const registrarProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.registrar.proxy,
        deployer
      );
      const proxyAdminMultisig = ProxyAdmin__factory.connect(
        addresses.proxyAdmin,
        proxyAdminSigner
      );
      const payload = registrarProxy.interface.encodeFunctionData("upgradeTo", [registrar.address]);
      const tx = await proxyAdminMultisig.submitTransaction(
        registrarProxy.address,
        0,
        payload,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

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
  });
