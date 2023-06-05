import {task, types} from "hardhat/config";
import {CharityApplication__factory} from "typechain-types";
import {logger, updateAddresses, shouldVerify, getSigners} from "utils";

task(
  "upgrade:CharityApplication",
  "Will upgrade the implementation of the Charity Application multisig"
)
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      logger.out("Upgrading CharityApplication...");

      const {proxyAdmin} = await getSigners(hre.ethers);

      const CharityApplicationLib = await hre.ethers.getContractFactory(
        "CharityApplicationLib",
        proxyAdmin
      );
      const CharityApplicationLibInstance = await CharityApplicationLib.deploy();
      await CharityApplicationLibInstance.deployed();
      logger.out(`Deployed CharityApplicationLib at: ${CharityApplicationLibInstance.address}`);

      const CharityApplication = new CharityApplication__factory(
        {
          "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
            CharityApplicationLibInstance.address,
        },
        proxyAdmin
      );

      const charityApplicationImpl = await CharityApplication.deploy();
      await charityApplicationImpl.deployed();

      logger.out(`Deployed CharityApplication at: ${charityApplicationImpl.address}`);

      logger.out("Saving the new implementation address to JSON file...");
      await updateAddresses(
        {charityApplication: {implementation: charityApplicationImpl.address}},
        hre
      );

      if (shouldVerify(hre.network) && taskArgs.verify) {
        logger.out("Verifying CharityApplication implementation...");

        await hre.run("verify:verify", {
          address: charityApplicationImpl.address,
          constructorArguments: [],
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
