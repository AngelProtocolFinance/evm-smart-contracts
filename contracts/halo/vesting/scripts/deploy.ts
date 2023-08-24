import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses, verify} from "utils";

import {VestingMessage} from "typechain-types/contracts/halo/vesting/Vesting";

export async function deployVesting(
  VestingDataInput: VestingMessage.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const {proxyAdmin} = await getSigners(hre);
    const Vesting = await ethers.getContractFactory("Vesting");
    const VestingInstance = await Vesting.deploy();
    await VestingInstance.deployed();
    logger.out(`Vesting implementation address: ${VestingInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const VestingData = VestingInstance.interface.encodeFunctionData("initialize", [
      VestingDataInput,
    ]);
    const VestingProxy = await ProxyContract.deploy(
      VestingInstance.address,
      proxyAdmin.address,
      VestingData
    );
    await VestingProxy.deployed();
    logger.out(`Vesting Address (Proxy): ${VestingProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          vesting: {
            proxy: VestingProxy.address,
            implementation: VestingInstance.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {address: VestingInstance.address});
      await verify(hre, {
        address: VestingProxy.address,
        constructorArguments: [VestingInstance.address, proxyAdmin.address, VestingData],
      });
    }

    return Promise.resolve(VestingProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
