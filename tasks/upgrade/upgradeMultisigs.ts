import {task, types} from "hardhat/config";
import {
  APTeamMultiSig__factory,
  ApplicationsMultiSig__factory,
  ITransparentUpgradeableProxy__factory,
} from "typechain-types";
import {getAddresses, getSigners, isLocalNetwork, logger, updateAddresses} from "utils";

task(
  "upgrade:Multisig",
  "Will upgrade the implementation of the AP Team and Applications multisigs"
)
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      // Update APTeamMultiSig
      logger.out("Deploying APTeamMultiSig...");
      const apTeamFactory = new APTeamMultiSig__factory(proxyAdmin);
      const apTeamMultiSig = await apTeamFactory.deploy();
      await apTeamMultiSig.deployed();
      logger.out(`Address: ${apTeamMultiSig.address}`);

      logger.out("Upgrading APTeamMultiSig proxy implementation...");
      const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.apTeam.proxy,
        proxyAdmin
      );
      const tx1 = await apTeamProxy.upgradeTo(apTeamMultiSig.address);
      logger.out(`Tx hash: ${tx1.hash}`);
      await tx1.wait();

      // Update ApplicationsMultiSig
      logger.out("Deploying ApplicationsMultiSig...");
      const applicationsFactory = new ApplicationsMultiSig__factory(proxyAdmin);
      const applicationsMultiSig = await applicationsFactory.deploy();
      await applicationsMultiSig.deployed();
      logger.out(`Address: ${applicationsMultiSig.address}`);

      logger.out("Upgrading ApplicationsMultiSig proxy implementation...");
      const applicationsProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.multiSig.applications.proxy,
        proxyAdmin
      );
      const tx2 = await applicationsProxy.upgradeTo(applicationsMultiSig.address);
      logger.out(`Tx hash: ${tx2.hash}`);
      await tx2.wait();

      await updateAddresses(
        {
          multiSig: {
            applications: {
              implementation: applicationsMultiSig.address,
            },
            apTeam: {
              implementation: apTeamMultiSig.address,
            },
          },
        },
        hre
      );

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        logger.out("Verifying APTeamMultiSig...");
        await hre.run("verify:verify", {
          address: apTeamMultiSig.address,
          constructorArguments: [],
          contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig",
        });

        logger.out("\nVerifying ApplicationsMultiSig...");
        await hre.run("verify:verify", {
          address: applicationsMultiSig.address,
          constructorArguments: [],
          contract: "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig",
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
