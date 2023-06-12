import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task, types} from "hardhat/config";
import {updateNetworkConnections} from "scripts";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  apTeamMultisig?: string;
  router?: string;
  verify: boolean;
};

task(
  "deploy:Registrar",
  "Will deploy Registrar contract. Will redeploy Router contract as well as there's no way to update the Router's `registrar` address field."
)
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "router",
    "Router contract address. Will do a local lookup from contract-address.json if none is provided."
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

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const oldRouterAddress = taskArgs.router || addresses.router.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const registrar = await deployRegistrar(
        oldRouterAddress,
        apTeamMultiSig,
        verify_contracts,
        hre
      );

      const router = await deployRouter(
        config.REGISTRAR_DATA.axelarGateway,
        config.REGISTRAR_DATA.axelarGasRecv,
        registrar.proxy.address,
        verify_contracts,
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      const {deployer} = await getSigners(hre);
      const network = await hre.ethers.provider.getNetwork();
      const registrarContract = Registrar__factory.connect(registrar.proxy.address, deployer);
      logger.out(
        `Fetching current Registrar's network connection data for chain ID:${network.chainId}...`
      );
      const curNetworkConnection = await registrarContract.queryNetworkConnection(network.chainId);
      logger.out(JSON.stringify(curNetworkConnection, undefined, 2));
      await updateNetworkConnections(
        registrar.proxy.address,
        {...curNetworkConnection, router: router.proxy.address},
        apTeamMultiSig,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
