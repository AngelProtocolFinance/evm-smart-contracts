// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import path from "path";

import {VestingMessage} from "typechain-types/contracts/halo/vesting/Vesting";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function Vesting(
  proxyAdmin = ADDRESS_ZERO,
  VestingDataInput: VestingMessage.InstantiateMsgStruct,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const Vesting = await ethers.getContractFactory("Vesting");
    const VestingInstance = await Vesting.deploy();
    await VestingInstance.deployed();

    console.log("Vesting implementation address:", VestingInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const VestingData = VestingInstance.interface.encodeFunctionData("initialize", [
      VestingDataInput,
    ]);

    const VestingProxy = await ProxyContract.deploy(
      VestingInstance.address,
      proxyAdmin,
      VestingData
    );

    await VestingProxy.deployed();

    console.log("Vesting Address (Proxy):", VestingProxy.address);

    return Promise.resolve(VestingProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
