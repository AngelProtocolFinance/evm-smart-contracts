import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Gov__factory} from "typechain-types";
import {
  deployBehindProxy,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
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
    const {deployer} = await getSigners(hre);
    const proxyAdmin = await getProxyAdminOwner(hre);

    // data setup
    const initData = Gov__factory.createInterface().encodeFunctionData("initialize", [
      haloToken,
      timelock,
    ]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      new Gov__factory(deployer),
      await proxyAdmin.getAddress(),
      initData
    );

    // update address file
    await updateAddresses(
      {
        halo: {
          gov: {
            proxy: proxy.contract.address,
            implementation: implementation.contract.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, implementation);
      await verify(hre, proxy);
    }

    return Promise.resolve(proxy.contract.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
