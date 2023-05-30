import {task} from "hardhat/config";
import deployAngelProtocol from "scripts/deployAngelProtocol";

task("Deploy:deployAngelProtocol", "Will deploy CompleteAngel protocol").setAction(
  async (_, hre) => {
    await deployAngelProtocol(hre);
  }
);
