import config from "config";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task, types} from "hardhat/config";
import {updateRegistrarNetworkConnections} from "scripts";
import {getAddresses, getSigners, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  apTeamMultisig?: string;
  registrar?: string;
  verify: boolean;
};

task("deploy:Router", "Will deploy Router contract")
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

      const router = await deployRouter(
        config.REGISTRAR_DATA.axelarGateway,
        config.REGISTRAR_DATA.axelarGasRecv,
        registrar,
        verify_contracts,
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      await updateRegistrarNetworkConnections(
        registrar,
        apTeamMultiSig,
        {router: router.proxy.address},
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
