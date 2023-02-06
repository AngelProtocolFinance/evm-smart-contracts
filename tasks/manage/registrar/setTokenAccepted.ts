import { task } from "hardhat/config"
import { Registrar, Registrar__factory } from "../../../typechain-types"
import { TaskArguments } from "hardhat/types"

task("manage:registrar:setTokenAccepted")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    
  })