import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Collector__factory} from "typechain-types";
import {CollectorMessage} from "typechain-types/contracts/halo/collector/Collector";
import {
  deployBehindProxy,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  updateAddresses,
  verify,
} from "utils";

export async function deployCollector(
  CollectorDataInput: CollectorMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);
    const proxyAdmin = await getProxyAdminOwner(hre);

    // data setup
    const Collector = new Collector__factory(deployer);
    const initData = Collector.interface.encodeFunctionData("initialize", [CollectorDataInput]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      Collector,
      await proxyAdmin.getAddress(),
      initData
    );

    // update address file
    await updateAddresses(
      {
        halo: {
          collector: {
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
