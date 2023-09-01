import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, getProxyAdminOwner, isLocalNetwork, logger, updateAddresses, verify} from "utils";

import {AirdropMessage} from "typechain-types/contracts/halo/airdrop/Airdrop";

export async function deployAirdrop(
  AirdropDataInput: AirdropMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const proxyAdmin = await getProxyAdminOwner(hre);
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const AirdropInstance = await Airdrop.deploy();
    await AirdropInstance.deployed();
    logger.out(`Airdrop implementation address: ${AirdropInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const AirdropData = AirdropInstance.interface.encodeFunctionData("initialize", [
      AirdropDataInput,
    ]);
    const AirdropProxy = await ProxyContract.deploy(
      AirdropInstance.address,
      proxyAdmin.address,
      AirdropData
    );
    await AirdropProxy.deployed();
    logger.out(`Airdrop Address (Proxy): ${AirdropProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          airdrop: {
            proxy: AirdropProxy.address,
            implementation: AirdropInstance.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, {contractName: getContractName(Airdrop), address: AirdropInstance.address});
      await verify(hre, {
        contractName: getContractName(ProxyContract),
        address: AirdropProxy.address,
      });
    }

    return Promise.resolve(AirdropProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
