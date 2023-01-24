import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"

import { Router, Router__factory } from "../../typechain-types"
import { Registrar, Registrar__factory } from "../../typechain-types"


task("deploy:RouterAndRegistrar")
  .addParam("gateway", "Axelar GMP gateway address")
  .addParam("gas", "Axelar GMP gas rcvr address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const Registrar = await hre.ethers.getContractFactory("Registrar") as Registrar__factory
    const Router = await hre.ethers.getContractFactory("Router") as Router__factory

    const registrar = await hre.upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed()

    const router = await hre.upgrades.deployProxy(
        Router,
        [taskArguments.gateway,
          taskArguments.gas,
          registrar.address]) as Router
    await router.deployed()

    console.log("Registrar deployed to: ", registrar.address)
    console.log("Router deployed to: ", router.address)
  });