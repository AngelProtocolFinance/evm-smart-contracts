import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyContract__factory} from "typechain-types";
import {
  ADDRESS_ZERO,
  ContractFunctionParams,
  getSigners,
  logger,
  updateAddresses,
  verify,
} from "utils";

export async function deployAPTeamMultiSig(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
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

    if (verify_contracts) {
      await verify(hre, {
        address: apTeamMultiSig.address,
        contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig",
      });
      await verify(hre, {
        address: apTeamMultiSigProxy.address,
        constructorArguments,
      });
    }

    return {implementation: apTeamMultiSig, proxy: apTeamMultiSigProxy};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      implementation: APTeamMultiSig__factory.connect(ADDRESS_ZERO, proxyAdmin),
      proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
