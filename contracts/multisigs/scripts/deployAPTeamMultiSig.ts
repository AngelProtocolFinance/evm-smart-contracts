import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployAPTeamMultiSig(
  admin: string,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying APTeamMultiSig...");

  const {apTeamMultisigOwners, deployer} = await getSigners(hre);

  // deploy implementation
  logger.out("Deploying implementation...");
  const apTeamMultiSigFactory = new APTeamMultiSig__factory(deployer);
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
  const proxyFactory = new ProxyContract__factory(deployer);
  const apTeamMultiSigProxy = await proxyFactory.deploy(
    apTeamMultiSig.address,
    admin,
    apTeamMultiSigData
  );
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
    implementation: {
      address: apTeamMultiSig.address,
      contractName: getContractName(apTeamMultiSigFactory),
    },
    proxy: {
      address: apTeamMultiSigProxy.address,
      contractName: getContractName(proxyFactory),
    },
  };
}
