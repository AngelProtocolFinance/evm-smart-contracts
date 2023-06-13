import {task} from "hardhat/config";
import {updateRegistrarConfig} from "scripts";
import {getAddresses, logger} from "utils";

type TaskArgs = {
  apTeamMultisig?: string;
  charityProposal?: string;
  registrar?: string;
};

task("manage:registrar:updateConfig")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "charityProposal",
    "CharityAplications contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const charityProposal = taskArgs.charityProposal || addresses.charityApplication.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      await updateRegistrarConfig(apTeamMultiSig, registrar, {charityProposal}, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
