import {task} from "hardhat/config";
import {
  APTeamMultiSig__factory,
  ITransparentUpgradeableProxy__factory,
  ProxyAdminMultiSig__factory,
} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getContractName,
  getProxyAdmin,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

task("upgrade:APTeamMultiSig", "Will upgrade the APTeamMultiSig")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(
    async (taskArgs: {skipVerify: boolean; yes: boolean; proxyAdminPkey?: string}, hre) => {
      try {
        logger.divider();

        const isConfirmed = taskArgs.yes || (await confirmAction("Upgrading APTeamMultiSig..."));
        if (!isConfirmed) {
          return logger.out("Confirmation denied.", logger.Level.Warn);
        }

        const {deployer} = await getSigners(hre);
        const proxyAdminSigner = await getProxyAdmin(hre, taskArgs.proxyAdminPkey);

        const addresses = await getAddresses(hre);

        // Update APTeamMultiSig
        logger.out("Deploying APTeamMultiSig...");
        const apTeamFactory = new APTeamMultiSig__factory(deployer);
        const apTeamMultiSig = await apTeamFactory.deploy();
        await apTeamMultiSig.deployed();
        logger.out(`Address: ${apTeamMultiSig.address}`);

        logger.out("Upgrading APTeamMultiSig proxy implementation...");
        const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
          addresses.multiSig.apTeam.proxy,
          deployer
        );
        const proxyAdminMultisig = ProxyAdminMultiSig__factory.connect(
          addresses.multiSig.proxyAdmin,
          proxyAdminSigner
        );
        const payload = apTeamProxy.interface.encodeFunctionData("upgradeTo", [
          apTeamMultiSig.address,
        ]);
        const tx = await proxyAdminMultisig.submitTransaction(
          apTeamProxy.address,
          0,
          payload,
          "0x"
        );
        logger.out(`Tx hash: ${tx.hash}`);
        await tx.wait();

        await updateAddresses(
          {
            multiSig: {
              apTeam: {
                implementation: apTeamMultiSig.address,
              },
            },
          },
          hre
        );

        if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
          await verify(hre, {
            address: apTeamMultiSig.address,
            contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig",
            contractName: getContractName(apTeamFactory),
          });
        }
      } catch (error) {
        logger.out(error, logger.Level.Error);
      }
    }
  );
