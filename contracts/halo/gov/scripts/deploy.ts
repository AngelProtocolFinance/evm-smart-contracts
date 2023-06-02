// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners} from "utils";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function deployGov(
  haloTokenAddress: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  // TODO: remove param timelock
  try {
    const {ethers, run, network} = hre;
    const {proxyAdmin, timeLockAdmin} = await getSigners(ethers);
    const TimeLock = await ethers.getContractFactory("TimeLock");
    const TimeLockInstance = await TimeLock.deploy();
    await TimeLockInstance.deployed();

    console.log("TimeLock Address (Implementation):", TimeLockInstance.address);

    const VotingERC20 = await ethers.getContractFactory("VotingERC20");
    const VotingERC20Instance = await VotingERC20.deploy();
    await VotingERC20Instance.deployed();

    console.log("VotingERC20 implementation address:", VotingERC20Instance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const TimeLockData = TimeLockInstance.interface.encodeFunctionData("initTimeLock", [
      3600,
      [],
      [],
      timeLockAdmin.address,
    ]);

    const TimeLockProxy = await ProxyContract.deploy(
      TimeLockInstance.address,
      proxyAdmin.address,
      TimeLockData
    );

    await TimeLockProxy.deployed();

    console.log("TimeLock Address (Proxy):", TimeLockProxy.address);

    const VotingERC20Data = VotingERC20Instance.interface.encodeFunctionData("initialize", [
      haloTokenAddress,
    ]);

    const VotingERC20Proxy = await ProxyContract.deploy(
      VotingERC20Instance.address,
      proxyAdmin.address,
      VotingERC20Data
    );

    await VotingERC20Proxy.deployed();

    console.log("VotingERC20 Address (Proxy):", VotingERC20Proxy.address);

    const Gov = await ethers.getContractFactory("Gov");
    const GovInstance = await Gov.deploy();
    await GovInstance.deployed();

    console.log("Gov implementation address:", GovInstance.address);

    const GovData = GovInstance.interface.encodeFunctionData("initialize", [
      VotingERC20Proxy.address,
      TimeLockProxy.address,
      1,
      50400,
      0,
      4,
    ]);

    const GovProxy = await ProxyContract.deploy(GovInstance.address, proxyAdmin.address, GovData);

    await GovProxy.deployed();

    // Setting up contracts for roles
    const TimeLockImplementation = await ethers.getContractAt("TimeLock", TimeLockProxy.address);
    const GovImplementation = await ethers.getContractAt("Gov", GovProxy.address);
    const proposerRole = await TimeLockImplementation.connect(timeLockAdmin).PROPOSER_ROLE();
    const executorRole = await TimeLockImplementation.connect(timeLockAdmin).EXECUTOR_ROLE();
    const adminRole = await TimeLockImplementation.connect(timeLockAdmin).TIMELOCK_ADMIN_ROLE();
    const proposerTx = await TimeLockImplementation.connect(timeLockAdmin).grantRole(
      proposerRole,
      GovImplementation.address
    );
    const proposerole = await proposerTx.wait();
    const executorTx = await TimeLockImplementation.connect(timeLockAdmin).grantRole(
      executorRole,
      GovImplementation.address
    ); // TODO: give role to gov contract
    const executorole = await executorTx.wait(1);
    const revokeTx = await TimeLockImplementation.connect(timeLockAdmin).revokeRole(
      adminRole,
      timeLockAdmin.address
    );
    const revokerole = await revokeTx.wait(1);

    if (verify) {
      await hre.run("verify:verify", {
        address: TimeLockInstance.address,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: TimeLockProxy.address,
        constructorArguments: [TimeLockInstance.address, proxyAdmin, TimeLockData],
      });

      await hre.run("verify:verify", {
        address: VotingERC20Instance.address,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: VotingERC20Proxy.address,
        constructorArguments: [VotingERC20Instance.address, proxyAdmin, VotingERC20Data],
      });

      await hre.run("verify:verify", {
        address: GovInstance.address,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: GovProxy.address,
        constructorArguments: [GovInstance.address, proxyAdmin, GovData],
      });
    }

    let response = {
      GovProxy: GovProxy.address,
      VotingERC20Proxy: VotingERC20Proxy.address,
      TimeLock: TimeLockProxy.address,
    };

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
