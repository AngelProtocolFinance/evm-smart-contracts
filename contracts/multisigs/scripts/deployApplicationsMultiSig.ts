import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ApplicationsMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {
  ADDRESS_ZERO,
  ContractFunctionParams,
  getSigners,
  logger,
  updateAddresses,
  verify,
} from "utils";

export async function deployApplicationsMultiSig(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {applicationsMultisigOwners, proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying ApplicationsMultiSig...");

    const applicationsMultiSigFactory = new ApplicationsMultiSig__factory(proxyAdmin);
    const applicationsMultiSig = await applicationsMultiSigFactory.deploy();
    await applicationsMultiSig.deployed();
    logger.out(`ApplicationsMultiSig deployed at: ${applicationsMultiSig.address}.`);

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
    logger.out(`ApplicationsMultiSig Proxy deployed at: ${applicationsMultiSigProxy.address}.`);

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

    if (verify_contracts) {
      await verify(hre, {
        address: applicationsMultiSig.address,
        contract: "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig",
      });
      await verify(hre, {
        address: applicationsMultiSigProxy.address,
        constructorArguments,
      });
    }

    return {implementation: applicationsMultiSig, proxy: applicationsMultiSigProxy};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      implementation: ApplicationsMultiSig__factory.connect(ADDRESS_ZERO, proxyAdmin),
      proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
