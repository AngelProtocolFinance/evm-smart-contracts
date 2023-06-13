import {task, types} from "hardhat/config";
import {CharityApplication__factory, ITransparentUpgradeableProxy__factory} from "typechain-types";
import {getAddresses, getSigners, isLocalNetwork, logger, updateAddresses, verify} from "utils";

type TaskArgs = {charityApplicationLib?: string; verify: boolean};

task("upgrade:CharityApplications", "Will upgrade the implementation of CharityApplications")
  .addOptionalParam(
    "charityApplicationLib",
    "CharityApplicationLib contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Upgrading CharityApplications implementation contract...");

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const charityApplicationLib =
        taskArgs.charityApplicationLib || addresses.libraries.charityApplicationLib;

      // deploy implementation
      logger.out("Deploying implementation...");
      const charityApplicationFactory = new CharityApplication__factory(
        {
          "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
            charityApplicationLib,
        },
        proxyAdmin
      );
      const charityApplication = await charityApplicationFactory.deploy();
      await charityApplication.deployed();
      logger.out(`Address: ${charityApplication.address}`);

      // upgrade proxy
      logger.out("Upgrading proxy...");
      const apTeamProxy = ITransparentUpgradeableProxy__factory.connect(
        addresses.charityApplication.proxy,
        proxyAdmin
      );
      const tx1 = await apTeamProxy.upgradeTo(charityApplication.address);
      logger.out(`Tx hash: ${tx1.hash}`);
      await tx1.wait();

      // update address & verify
      await updateAddresses(
        {
          multiSig: {
            endowment: {
              implementation: charityApplication.address,
            },
          },
        },
        hre
      );

      if (taskArgs.verify && !isLocalNetwork(hre)) {
        await verify(hre, {address: charityApplication.address});
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
