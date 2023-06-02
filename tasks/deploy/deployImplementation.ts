import {task, types} from "hardhat/config";
import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";
import {isLocalNetwork, logger} from "utils";

task("deploy:Implementation", "Will deploy Implementation")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployImplementation(taskArgs.angelcorestruct, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
