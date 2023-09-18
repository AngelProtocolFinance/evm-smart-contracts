import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  deployBehindProxy,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  updateAddresses,
  verify,
} from "utils";

import {Community__factory} from "typechain-types";
import {CommunityMessage} from "typechain-types/contracts/halo/community/Community";

export async function deployCommunity(
  CommunityDataInput: CommunityMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);
    const proxyAdmin = await getProxyAdminOwner(hre);

    // data setup
    const Community = new Community__factory(deployer);
    const initData = Community.interface.encodeFunctionData("initialize", [CommunityDataInput]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      Community,
      await proxyAdmin.getAddress(),
      initData
    );

    // update address file
    await updateAddresses(
      {
        halo: {
          community: {
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
