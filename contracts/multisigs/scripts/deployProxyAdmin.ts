import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyAdmin__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployProxyAdminMultisig(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) : Promise<Deployment> {
  logger.out("Deploying ProxyAdmin multisig...");

  const {deployer} = await getSigners(hre);

  const constructorArguments: Parameters<ProxyAdmin__factory["deploy"]> = [
    [admin.address],
    config.PROXY_ADMIN_MULTISIG_DATA.threshold,
    config.PROXY_ADMIN_MULTISIG_DATA.requireExecution,
    config.PROXY_ADMIN_MULTISIG_DATA.transactionExpiry,
  ];

  // deploy implementation
  logger.out("Deploying implementation...");
  const proxyAdminFactory = new ProxyAdmin__factory(deployer);
  const proxyAdmin = await proxyAdminFactory.deploy(...constructorArguments);
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
