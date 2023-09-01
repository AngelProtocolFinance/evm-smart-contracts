import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, getProxyAdminOwner, isLocalNetwork, logger, updateAddresses, verify} from "utils";

import {CommunityMessage} from "typechain-types/contracts/halo/community/Community";

export async function deployCommunity(
  CommunityDataInput: CommunityMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const proxyAdmin = await getProxyAdminOwner(hre);
    const Community = await ethers.getContractFactory("Community");
    const CommunityInstance = await Community.deploy();
    await CommunityInstance.deployed();
    logger.out(`Community implementation address: ${CommunityInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const CommunityData = CommunityInstance.interface.encodeFunctionData("initialize", [
      CommunityDataInput,
    ]);
    const CommunityProxy = await ProxyContract.deploy(
      CommunityInstance.address,
      proxyAdmin.address,
      CommunityData
    );
    await CommunityProxy.deployed();
    logger.out(`Community Address (Proxy): ${CommunityProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          community: {
            proxy: CommunityProxy.address,
            implementation: CommunityInstance.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, {
        contractName: getContractName(Community),
        address: CommunityInstance.address,
      });
      await verify(hre, {
        contractName: getContractName(ProxyContract),
        address: CommunityProxy.address,
      });
    }

    return Promise.resolve(CommunityProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
