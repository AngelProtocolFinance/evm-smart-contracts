import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger, updateAddresses} from "utils";
import deployRouterImplementation from "./deployRouterImplementation";
import deployRouterProxy from "./deployRouterProxy";
import updateRegistrar from "./updateRegistrar";

export async function deployRouter(
  axelarGateway: string,
  gasReceiver: string,
  registrar: string,
  apTeamMultisig: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying Router...");

  const router = await deployRouterImplementation(hre);

  const {routerProxy, constructorArguments} = await deployRouterProxy(
    router,
    axelarGateway,
    gasReceiver,
    registrar,
    hre
  );

  await updateAddresses(
    {router: {implementation: router.address, proxy: routerProxy.address}},
    hre
  );

  // Registrar NetworkInfo's Router address must be updated for the current network
  await updateRegistrar(registrar, routerProxy, axelarGateway, gasReceiver, apTeamMultisig, hre);

  if (verify_contracts) {
    try {
      logger.out("Verifying...");
      await hre.run("verify:verify", {
        address: router.address,
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: routerProxy.address,
        constructorArguments,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }

  return {implementation: router.address, proxy: routerProxy.address};
}
