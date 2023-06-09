import config from "config";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task, types} from "hardhat/config";
import {updateRegistrarNetworkConnection} from "scripts";
import {Registrar__factory} from "typechain-types";
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
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const {proxyAdmin} = await getSigners(hre);

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
      const network = await hre.ethers.provider.getNetwork();
      const registrarContract = Registrar__factory.connect(registrar, proxyAdmin);
      logger.out(
        `Fetching current Registrar's network connection data for chain ID:${network.chainId}...`
      );
      const curNetworkConnection = await registrarContract.queryNetworkConnection(network.chainId);
      logger.out(JSON.stringify(curNetworkConnection, undefined, 2));
      await updateRegistrarNetworkConnection(
        registrar,
        {...curNetworkConnection, router: router.proxy.address},
        apTeamMultiSig,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
