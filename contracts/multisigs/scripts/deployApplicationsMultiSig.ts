import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ApplicationsMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {ContractFunctionParams, getSigners, logger, updateAddresses} from "utils";

export async function deployApplicationsMultiSig(verify: boolean, hre: HardhatRuntimeEnvironment) {
  logger.out("Deploying ApplicationsMultiSig...");

  const {applicationsMultisigOwners, proxyAdmin} = await getSigners(hre.ethers);

  const applicationsMultiSigFactory = new ApplicationsMultiSig__factory(proxyAdmin);
  const applicationsMultiSig = await applicationsMultiSigFactory.deploy();
  await applicationsMultiSig.deployed();
  logger.out(`ApplicationsMultiSig deployed at: ${applicationsMultiSig.address}.`);

  const applicationsMultiSigData = applicationsMultiSig.interface.encodeFunctionData("initialize", [
    applicationsMultisigOwners.map((x) => x.address),
    config.APPLICATION_MULTISIG_DATA.threshold,
    config.APPLICATION_MULTISIG_DATA.requireExecution,
  ]);
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

  if (verify) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: applicationsMultiSig.address,
      contract: "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig",
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: applicationsMultiSigProxy.address,
      constructorArguments,
    });
  }

  return {implementation: applicationsMultiSig, proxy: applicationsMultiSigProxy};
}
