import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, updateRegistrarConfig} from "utils";

type TaskArgs = {
  apTeamMultisig?: string;
  owner?: string;
  registrar?: string;
  verify: boolean;
  yes: boolean;
};

task("deploy:IndexFund", "Will deploy IndexFund contract")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "owner",
    "Address of the owner. By default set to AP team multisig proxy saved in contract-address.json."
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
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying IndexFund..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const owner = taskArgs.owner || addresses.multiSig.apTeam.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const indexFund = await deployIndexFund(registrar, owner, verify_contracts, hre);

      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {indexFundContract: indexFund.proxy.address},
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
