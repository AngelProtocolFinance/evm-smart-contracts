// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import path from "path";

import {CommunityMessage} from "typechain-types/contracts/halo/community/Community";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function Community(
  proxyAdmin = ADDRESS_ZERO,
  CommunityDataInput: CommunityMessage.InstantiateMsgStruct,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const Community = await ethers.getContractFactory("Community");
    const CommunityInstance = await Community.deploy();
    await CommunityInstance.deployed();

    console.log("Community implementation address:", CommunityInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const CommunityData = CommunityInstance.interface.encodeFunctionData("initialize", [
      CommunityDataInput,
    ]);

    const CommunityProxy = await ProxyContract.deploy(
      CommunityInstance.address,
      proxyAdmin,
      CommunityData
    );

    await CommunityProxy.deployed();

    console.log("Community Address (Proxy):", CommunityProxy.address);

    return Promise.resolve(CommunityProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
