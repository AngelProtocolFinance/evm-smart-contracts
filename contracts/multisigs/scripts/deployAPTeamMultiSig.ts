import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {
  ContractFunctionParams,
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
} from "utils";

export async function deployAPTeamMultiSig(
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying APTeamMultiSig...");

  const {apTeamMultisigOwners, proxyAdmin} = await getSigners(hre);

  try {
    // deploy implementation
    logger.out("Deploying implementation...");
    const apTeamMultiSigFactory = new APTeamMultiSig__factory(proxyAdmin);
    const apTeamMultiSig = await apTeamMultiSigFactory.deploy();
    await apTeamMultiSig.deployed();
    logger.out(`Address: ${apTeamMultiSig.address}.`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const apTeamMultiSigData = apTeamMultiSig.interface.encodeFunctionData("initializeAPTeam", [
      apTeamMultisigOwners.map((x) => x.address),
      config.AP_TEAM_MULTISIG_DATA.threshold,
      config.AP_TEAM_MULTISIG_DATA.requireExecution,
      config.AP_TEAM_MULTISIG_DATA.transactionExpiry,
    ]);
    const constructorArguments: ContractFunctionParams<ProxyContract__factory["deploy"]> = [
      apTeamMultiSig.address,
      proxyAdmin.address,
      apTeamMultiSigData,
    ];
    const proxyFactory = new ProxyContract__factory(proxyAdmin);
    const apTeamMultiSigProxy = await proxyFactory.deploy(...constructorArguments);
    await apTeamMultiSigProxy.deployed();
    logger.out(`Address: ${apTeamMultiSigProxy.address}.`);

    // update address file & verify contracts
    await updateAddresses(
      {
        multiSig: {
          apTeam: {
            implementation: apTeamMultiSig.address,
            proxy: apTeamMultiSigProxy.address,
          },
        },
      },
      hre
    );

    return {
      address: apTeamMultiSigProxy.address,
      contractName: getContractName(apTeamMultiSigFactory),
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
