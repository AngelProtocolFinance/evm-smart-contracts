import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {task} from "hardhat/config";
import {cliTypes} from "tasks/types";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  owner?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:IndexFund", "Will deploy IndexFund contract")
  .addOptionalParam(
    "owner",
    "Address of the owner. By default set to AP team multisig proxy saved in contract-address.json.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying IndexFund..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const owner = taskArgs.owner || addresses.multiSig.apTeam.proxy;

      const deployment = await deployIndexFund(
        registrar,
        owner,
        addresses.multiSig.proxyAdmin,
        deployer,
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        indexFundContract: deployment.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment.implementation);
        await verify(hre, deployment.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
