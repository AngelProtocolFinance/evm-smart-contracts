import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Vesting__factory} from "typechain-types";
import {VestingMessages} from "typechain-types/contracts/halo/vesting/Vesting";
import {
  deployBehindProxy,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  updateAddresses,
  verify,
} from "utils";

export async function deployVesting(
  VestingDataInput: VestingMessages.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);
    const proxyAdmin = await getProxyAdminOwner(hre);

    // data setup
    const initData = Vesting__factory.createInterface().encodeFunctionData("initialize", [
      VestingDataInput,
    ]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      new Vesting__factory(deployer),
      await proxyAdmin.getAddress(),
      initData
    );

    // update address file
    await updateAddresses(
      {
        halo: {
          vesting: {
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
