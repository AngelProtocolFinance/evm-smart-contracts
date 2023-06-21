import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ApplicationsMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {
  ContractFunctionParams,
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
} from "utils";

export async function deployApplicationsMultiSig(
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying ApplicationsMultiSig...");

  const {applicationsMultisigOwners, proxyAdmin} = await getSigners(hre);

  try {
    // deploy implementation
    logger.out("Deploying implementation...");
    const applicationsMultiSigFactory = new ApplicationsMultiSig__factory(proxyAdmin);
    const applicationsMultiSig = await applicationsMultiSigFactory.deploy();
    await applicationsMultiSig.deployed();
    logger.out(`Address: ${applicationsMultiSig.address}.`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const applicationsMultiSigData = applicationsMultiSig.interface.encodeFunctionData(
      "initialize",
      [
        applicationsMultisigOwners.map((x) => x.address),
        config.APPLICATION_MULTISIG_DATA.threshold,
        config.APPLICATION_MULTISIG_DATA.requireExecution,
      ]
    );
    const constructorArguments: ContractFunctionParams<ProxyContract__factory["deploy"]> = [
      applicationsMultiSig.address,
      proxyAdmin.address,
      applicationsMultiSigData,
    ];
    const proxyFactory = new ProxyContract__factory(proxyAdmin);
    const applicationsMultiSigProxy = await proxyFactory.deploy(...constructorArguments);
    await applicationsMultiSigProxy.deployed();
    logger.out(`Address: ${applicationsMultiSigProxy.address}.`);

    // update address file & verify contracts
    await updateAddresses(
      {
        multiSig: {
          applications: {
            implementation: applicationsMultiSig.address,
            proxy: applicationsMultiSigProxy.address,
          },
        },
      },
      hre
    );

    return {
      address: applicationsMultiSigProxy.address,
      contractName: getContractName(applicationsMultiSigFactory),
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
