import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Airdrop__factory} from "typechain-types";
import {AirdropMessage} from "typechain-types/contracts/halo/airdrop/Airdrop";
import {
  deployBehindProxy,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  updateAddresses,
  verify,
} from "utils";

export async function deployAirdrop(
  AirdropDataInput: AirdropMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);
    const proxyAdmin = await getProxyAdminOwner(hre);

    // data setup
    const Airdrop = new Airdrop__factory(deployer);
    const initData = Airdrop.interface.encodeFunctionData("initialize", [AirdropDataInput]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      Airdrop,
      await proxyAdmin.getAddress(),
      initData
    );

    // update address file
    await updateAddresses(
      {
        halo: {
          airdrop: {
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
