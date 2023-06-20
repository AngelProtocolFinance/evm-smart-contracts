import fs from "fs";
import {AbiCoder} from "@ethersproject/abi";
import {task} from "hardhat/config";
import {logger} from "utils";

type Artifact = {abi: AbiCoder[]};

const angelCoreStruct = "./artifacts/contracts/core/struct.sol/AngelCoreStruct.json";
const basePath = "/contracts/core/accounts/facets/";
const diamondABIDir = "./diamondABI";
const diamondAbiPath = `${diamondABIDir}/diamond.json`;

task(
  "manage:accounts:generateDiamondABI",
  "Generates ABI file for diamond, includes all ABIs of facets"
).setAction(async () => {
  const files = fs.readdirSync("." + basePath);
  const abi: AbiCoder[] = [];

  // append facet ABIs
  for (const file of files) {
    const jsonFile = file.replace("sol", "json");
    const json = fs.readFileSync(`./artifacts/${basePath}${file}/${jsonFile}`, "utf-8");
    const obj: Artifact = JSON.parse(json);
    abi.push(...obj.abi);
  }

  // append AngelCoreStruct abi
  const json = fs.readFileSync(angelCoreStruct, "utf-8");
  const obj: Artifact = JSON.parse(json);
  abi.push(...obj.abi);

  // save file
  const finalAbi = JSON.stringify(abi, undefined, 2);
  fs.mkdirSync(diamondABIDir);
  fs.writeFileSync(diamondAbiPath, finalAbi);
  logger.out(`ABI written to ${diamondAbiPath}`);
});
