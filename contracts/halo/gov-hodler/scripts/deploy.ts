// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import path from "path";
import {GovHodlerMessage} from "typechain-types/contracts/halo/gov-hodler/GovHodler";
// const hre = require("hardhat");
// const ethers = hre.ethers;

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function GovHodler(
  proxyAdmin = ADDRESS_ZERO,
  GovHodlerDataInput: GovHodlerMessage.InstantiateMsgStruct,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const GovHodler = await ethers.getContractFactory("GovHodler");
    const GovHodlerInstance = await GovHodler.deploy();
    await GovHodlerInstance.deployed();

    console.log("GovHodler implementation address:", GovHodlerInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const GovHodlerData = GovHodlerInstance.interface.encodeFunctionData("initialiaze", [
      GovHodlerDataInput,
    ]);

    const GovHodlerProxy = await ProxyContract.deploy(
      GovHodlerInstance.address,
      proxyAdmin,
      GovHodlerData
    );

    await GovHodlerProxy.deployed();

    console.log("GovHodler Address (Proxy):", GovHodlerProxy.address);

    return Promise.resolve(GovHodlerProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
