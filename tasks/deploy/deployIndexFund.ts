import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";

type TaskArgs = {owner?: string; registrar?: string; verify: boolean};

task("deploy:IndexFund", "Will deploy IndexFund contract")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    false,
    types.boolean
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "owner",
    "Address of the owner. By default set to AP team multisig proxy saved in contract-address.json."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const owner = taskArgs.owner || addresses.multiSig.apTeam.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      await deployIndexFund(registrar, owner, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
