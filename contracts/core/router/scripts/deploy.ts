import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Router__factory} from "typechain-types";
import {ProxyDeployment, deployBehindProxy, updateAddresses} from "utils";

export async function deployRouter(
  registrar: string,
  proxyAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<Router__factory>> {
  const initData = Router__factory.createInterface().encodeFunctionData("initialize", [registrar]);

  const {implementation, proxy} = await deployBehindProxy(
    new Router__factory(deployer),
    proxyAdmin,
    initData
  );

  // update address file
  await updateAddresses(
    {router: {implementation: implementation.contract.address, proxy: proxy.contract.address}},
    hre
  );

  return {implementation, proxy};
}
