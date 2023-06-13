import {deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {task, types} from "hardhat/config";
import {updateRegistrarConfig} from "scripts";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  apTeamMultisig?: string;
  registrar?: string;
  verify: boolean;
};

task("deploy:ApplicationsMultiSig", "Will deploy ApplicationsMultiSig contract")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const applicationsMultisig = await deployApplicationsMultiSig(verify_contracts, hre);

      await hre.run("manage:CharityApplication:updateConfig", {
        applicationsMultisig: applicationsMultisig.proxy.address,
      });
      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {applicationsReview: applicationsMultisig.proxy.address},
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
