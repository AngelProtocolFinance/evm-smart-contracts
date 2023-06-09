import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AngelCoreStruct__factory, StringArray__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deployLibraries(verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
  const {proxyAdmin} = await getSigners(hre.ethers);

  logger.out("Deploying AngelCoreStruct library...");
  const angelCoreStructFactory = new AngelCoreStruct__factory(proxyAdmin);
  const angelCoreStruct = await angelCoreStructFactory.deploy();
  await angelCoreStruct.deployed();
  logger.out(`Address: ${angelCoreStruct.address}`);

  logger.out("Deploying StringArray library...");
  const stringLibFactory = new StringArray__factory(proxyAdmin);
  const stringLib = await stringLibFactory.deploy();
  await stringLib.deployed();
  logger.out(`Address: ${angelCoreStruct.address}`);

  await updateAddresses(
    {
      libraries: {
        STRING_LIBRARY: stringLib.address,
        ANGEL_CORE_STRUCT_LIBRARY: angelCoreStruct.address,
      },
    },
    hre
  );

  if (verify_contracts) {
    await hre.run(`verify:verify`, {
      address: angelCoreStruct.address,
      constructorArguments: [],
    });
    await hre.run(`verify:verify`, {
      address: stringLib.address,
      constructorArguments: [],
    });
  }

  return {angelCoreStruct, stringLib};
}
