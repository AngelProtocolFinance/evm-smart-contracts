import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CONFIG} from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyAdminMultiSig__factory} from "typechain-types";
import {Deployment, deploy, updateAddresses} from "utils";

export async function deployProxyAdminMultisig(
  owners: string[],
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<ProxyAdminMultiSig__factory>> {
  const proxyAdmin = await deploy(new ProxyAdminMultiSig__factory(deployer), [
    owners,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.threshold,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.requireExecution,
    CONFIG.PROXY_ADMIN_MULTISIG_DATA.transactionExpiry,
  ]);

  // update address file
  await updateAddresses({multiSig: {proxyAdmin: proxyAdmin.contract.address}}, hre);

  return proxyAdmin;
}
