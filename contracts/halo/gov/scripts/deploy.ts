import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  getContractName,
  getProxyAdminOwner,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

export async function deployGov(
  haloToken: string,
  timelock: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const proxyAdmin = await getProxyAdminOwner(hre);
    const Gov = await ethers.getContractFactory("Gov");
    const GovInstance = await Gov.deploy();
    await GovInstance.deployed();
    logger.out(`Gov implementation address: ${GovInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const GovData = GovInstance.interface.encodeFunctionData("initialize", [haloToken, timelock]);
    const GovProxy = await ProxyContract.deploy(GovInstance.address, proxyAdmin.address, GovData);
    await GovProxy.deployed();
    logger.out(`Gov Address (Proxy): ${GovProxy.address}"`);

    // update address file
    await updateAddresses(
      {
        halo: {
          gov: {
            proxy: GovProxy.address,
            implementation: GovInstance.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, {contractName: getContractName(Gov), address: GovInstance.address});
      await verify(hre, {contractName: getContractName(ProxyContract), address: GovProxy.address});
    }

    return Promise.resolve(GovProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
