import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  getContractName,
  getProxyAdminOwner,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

import {CollectorMessage} from "typechain-types/contracts/halo/collector/Collector";

export async function deployCollector(
  CollectorDataInput: CollectorMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const proxyAdmin = await getProxyAdminOwner(hre);
    const Collector = await ethers.getContractFactory("Collector");
    const CollectorInstance = await Collector.deploy();
    await CollectorInstance.deployed();
    logger.out(`Collector implementation address: ${CollectorInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const CollectorData = CollectorInstance.interface.encodeFunctionData("initialize", [
      CollectorDataInput,
    ]);
    const CollectorProxy = await ProxyContract.deploy(
      CollectorInstance.address,
      proxyAdmin.address,
      CollectorData
    );
    await CollectorProxy.deployed();
    logger.out(`Collector Address (Proxy): ${CollectorProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          collector: {
            proxy: CollectorProxy.address,
            implementation: CollectorInstance.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, {
        contractName: getContractName(Collector),
        address: CollectorInstance.address,
      });
      await verify(hre, {
        contractName: getContractName(ProxyContract),
        address: CollectorProxy.address,
      });
    }

    return Promise.resolve(CollectorProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
