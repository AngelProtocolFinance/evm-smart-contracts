import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {ContractFunctionParams, getSigners, logger, updateAddresses} from "utils";

export async function deployAPTeamMultiSig(verify: boolean, hre: HardhatRuntimeEnvironment) {
  logger.out("Deploying APTeamMultiSig...");

  const {apTeamMultisigOwners, proxyAdmin} = await getSigners(hre.ethers);

  const apTeamMultiSigFactory = new APTeamMultiSig__factory(proxyAdmin);
  const apTeamMultiSig = await apTeamMultiSigFactory.deploy();
  await apTeamMultiSig.deployed();
  logger.out(`APTeamMultiSig deployed at: ${apTeamMultiSig.address}.`);

  const apTeamMultiSigData = apTeamMultiSig.interface.encodeFunctionData("initialize", [
    apTeamMultisigOwners.map((x) => x.address),
    config.AP_TEAM_MULTISIG_DATA.threshold,
    config.AP_TEAM_MULTISIG_DATA.requireExecution,
  ]);
  const constructorArguments: ContractFunctionParams<ProxyContract__factory["deploy"]> = [
    apTeamMultiSig.address,
    proxyAdmin.address,
    apTeamMultiSigData,
  ];
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const apTeamMultiSigProxy = await proxyFactory.deploy(...constructorArguments);
  await apTeamMultiSigProxy.deployed();
  logger.out(`APTeamMultiSig Proxy deployed at: ${apTeamMultiSigProxy.address}.`);

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

  if (verify) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: apTeamMultiSig.address,
      contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig",
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: apTeamMultiSigProxy.address,
      constructorArguments,
    });
  }

  return {implementation: apTeamMultiSig, proxy: apTeamMultiSigProxy};
}
