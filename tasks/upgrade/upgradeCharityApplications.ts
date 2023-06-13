import {task, types} from "hardhat/config";
import {EndowmentMultiSig__factory, MultiSigWalletFactory__factory} from "typechain-types";
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

      // deploy implementation
      logger.out("Deploying implementation...");
      const charityApplicationFactory = new CharityApplication__factory(
        {
          "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
            charityApplicationLib.address,
        },
        proxyAdmin
      );
      const charityApplication = await charityApplicationFactory.deploy();
      await charityApplication.deployed();
      logger.out(`Address: ${charityApplication.address}`);

      await updateAddresses({multiSig: {endowment: {implementation: contract.address}}}, hre);

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        await verify(hre, {address: contract.address});
      }
    } catch (error) {
      logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
