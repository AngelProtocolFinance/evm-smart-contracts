import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CONFIG} from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyAdminMultiSig__factory} from "typechain-types";
import {Deployment, getContractName, logger, updateAddresses} from "utils";

export async function deployProxyAdminMultisig(
  owners: string[],
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment> {
  logger.out("Deploying ProxyAdmin multisig...");

  const constructorArguments: Parameters<ProxyAdminMultiSig__factory["deploy"]> = [
    owners,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.threshold,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.requireExecution,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.transactionExpiry,
  ];

  const proxyAdminFactory = new ProxyAdminMultiSig__factory(deployer);
  const proxyAdmin = await proxyAdminFactory.deploy(...constructorArguments);
  logger.out(`Tx hash: ${proxyAdmin.deployTransaction.hash}`);
  await proxyAdmin.deployed();
  logger.out(`Address: ${proxyAdmin.address}.`);

  // update address file & verify contracts
  await updateAddresses({multiSig: {proxyAdmin: proxyAdmin.address}}, hre);

  return {
    address: proxyAdmin.address,
    contractName: getContractName(proxyAdminFactory),
    constructorArguments: constructorArguments,
  };
}
